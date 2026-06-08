const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../config/supabase');

// Initialize Razorpay instance safely
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn('RAZORPAY_KEY_ID is missing or using placeholder. Payment features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

// ==========================================
// CREATE ORDER (Supports Razorpay and COD)
// ==========================================
exports.createRazorpayOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discountPrice = 0,
      deliverySlot,
      specialInstructions,
    } = req.body;

    const userId = req.user.id;

    // Validate cart items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check product availability
    for (let item of orderItems) {
      const { data: product } = await supabase
        .from('products')
        .select('stock, name')
        .eq('id', item.product)
        .single();

      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product "${item.name}" (ID: ${item.product}) not found in database` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }
    }

    let razorpayOrderId = null;
    let razorpayAmount = 0;

    if (paymentMethod === 'razorpay') {
      if (!razorpay) {
        return res.status(500).json({
          success: false,
          message: 'Razorpay is not configured on the server. Please choose Cash on Delivery.',
        });
      }

      // Razorpay expects amount in paise (multiply by 100)
      razorpayAmount = Math.round(totalPrice * 100);

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: razorpayAmount,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        payment_capture: 1, // Auto-capture payment
        notes: {
          userId: userId,
        },
      });
      razorpayOrderId = razorpayOrder.id;
    }

    // Create database order document
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        items_price: itemsPrice,
        tax_price: taxPrice,
        shipping_price: shippingPrice,
        discount_price: discountPrice,
        total_price: totalPrice,
        delivery_slot: deliverySlot,
        special_instructions: specialInstructions,
        razorpay: razorpayOrderId ? {
          orderId: razorpayOrderId,
        } : null,
        is_paid: false,
        status: paymentMethod === 'cod' ? 'Ordered' : 'Pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert Order Items
    const itemsToInsert = orderItems.map(item => ({
      order_id: order.id,
      product_id: item.product,
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // If COD, update stock immediately as payment is not awaited
    if (paymentMethod === 'cod') {
      for (let item of orderItems) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq('id', item.product);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
      razorpayOrderId: razorpayOrderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: totalPrice,
      amountInPaise: razorpayAmount,
    });
  } catch (error) {
    console.error('Payment Order Creation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment order',
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data',
      });
    }

    // Find the order
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (findError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify signature
    const body = order.razorpay.orderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValidSignature = expectedSignature === razorpaySignature;

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed!',
      });
    }

    // Update order with payment details
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay: {
           ...order.razorpay,
           paymentId: razorpayPaymentId,
           signature: razorpaySignature
        },
        is_paid: true,
        paid_at: new Date().toISOString(),
        status: 'Ordered'
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update product stock
    for (let item of order.order_items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq('id', item.product_id);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      orderId: updatedOrder.id,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment',
    });
  }
};

// ==========================================
// GET ORDER DETAILS
// ==========================================
exports.getOrder = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, user:user_id(name, email, phone), order_items(*, product:product_id(name, image, price))')
      .eq('id', req.params.id)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET USER ORDERS
// ==========================================
exports.getUserOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:product_id(name, image, price))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// CANCEL ORDER
// ==========================================
exports.cancelOrder = async (req, res) => {
  try {
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (findError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Can only cancel orders that haven't been shipped
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // If paid, mark as refunded
    const newStatus = order.is_paid ? 'Refunded' : 'Cancelled';

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Restore product stock
    for (let item of order.order_items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock + item.quantity })
          .eq('id', item.product_id);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ORDERS (ADMIN)
// ==========================================
exports.getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:user_id(name, email, phone), order_items(*, product:product_id(name, image, price))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS (ADMIN)
// ==========================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select('*, user:user_id(name, email, phone), order_items(*)')
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
