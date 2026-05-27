const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

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
// CREATE RAZORPAY ORDER
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

    // Check product availability and prices
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.name} not found` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.name}` 
        });
      }
    }

    // Razorpay expects amount in paise (multiply by 100)
    const razorpayAmount = Math.round(totalPrice * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: razorpayAmount,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: userId,
        orderItems: JSON.stringify(orderItems),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    // Create database order document (payment pending)
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountPrice,
      totalPrice,
      deliverySlot,
      specialInstructions,
      razorpay: {
        orderId: razorpayOrder.id,
      },
      isPaid: false,
      status: 'Pending',
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: totalPrice,
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
    const order = await Order.findById(orderId);
    if (!order) {
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
    order.razorpay.paymentId = razorpayPaymentId;
    order.razorpay.signature = razorpaySignature;
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'Ordered';

    // Update product stock
    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      orderId: order._id,
      order: order,
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
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
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
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name image price')
      .sort({ createdAt: -1 });

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
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
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
    if (order.isPaid) {
      order.status = 'Refunded';
    } else {
      order.status = 'Cancelled';
    }

    // Restore product stock
    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
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
// GET ALL ORDERS (ADMIN)
// ==========================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name image price')
      .sort({ createdAt: -1 });

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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone')
     .populate('orderItems.product', 'name image');

    if (!order) {
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
