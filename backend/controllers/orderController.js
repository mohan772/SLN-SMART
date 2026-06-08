const supabase = require('../config/supabase');
const sendEmail = require('../utils/mailer');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        items_price: itemsPrice,
        tax_price: taxPrice,
        shipping_price: shippingPrice,
        total_price: totalPrice,
        status: 'Ordered',
        is_paid: paymentMethod === 'cod' ? false : true, // Logic might vary
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
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

    // 3. Update Product Stock and Log
    for (const item of orderItems) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product)
        .single();

      if (product) {
        const previousStock = product.stock;
        const newStock = Math.max(0, product.stock - item.quantity);
        
        await supabase
          .from('products')
          .update({ 
            stock: newStock,
            visibility: newStock > 0
          })
          .eq('id', item.product);

        // Create Inventory Log
        await supabase
          .from('inventory_logs')
          .insert({
            product_id: item.product,
            change_type: 'Order Placed',
            previous_stock: previousStock,
            new_stock: newStock,
            quantity_changed: -item.quantity,
            order_id: order.id,
            reason: `Order #${order.id.toString().slice(-6).toUpperCase()}`
          });
      }
    }

    // 4. Clear cart after order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    // Send Confirmation Email
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmation - #${order.id.toString().slice(-6).toUpperCase()}`,
        message: `Your order has been placed successfully. Order ID: ${order.id}`,
        html: `<h1>Thank you for your order!</h1><p>Your order for ${formatINR(totalPrice)} has been placed and is being processed.</p><p>Order ID: <b>${order.id}</b></p>`
      });
    } catch (err) {
      console.error('Email could not be sent');
    }

    res.status(201).json({
      success: true,
      data: { ...order, orderItems },
    });
  } catch (err) {
    next(err);
  }
};

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, user:user_id(name, email), order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*, user:user_id(name, email), order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (findError || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    const newStatus = req.body.status;

    const updateData = { status: newStatus };
    if (newStatus === 'Delivered') {
      updateData.is_delivered = true;
      updateData.delivered_at = new Date().toISOString();
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    if ((newStatus === 'Cancelled' || newStatus === 'Refunded') && (previousStatus !== 'Cancelled' && previousStatus !== 'Refunded')) {
      // Restore stock
      for (const item of order.order_items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product) {
          const previousStock = product.stock;
          const newStock = product.stock + item.quantity;
          
          await supabase
            .from('products')
            .update({ 
              stock: newStock,
              visibility: true
            })
            .eq('id', item.product_id);

          // Create Inventory Log
          await supabase
            .from('inventory_logs')
            .insert({
              product_id: item.product_id,
              user_id: req.user.id,
              change_type: newStatus === 'Cancelled' ? 'Order Cancelled' : 'Order Refunded',
              previous_stock: previousStock,
              new_stock: newStock,
              quantity_changed: item.quantity,
              order_id: order.id,
              reason: `${newStatus} - Order #${order.id.toString().slice(-6).toUpperCase()}`
            });
        }
      }
    }

    // Send Status Update Email
    try {
      await sendEmail({
        email: order.user.email,
        subject: `Order Update - #${order.id.toString().slice(-6).toUpperCase()}`,
        message: `Your order status has been updated to: ${newStatus}`,
        html: `<h1>Order Update</h1><p>Your order <b>#${order.id.toString().slice(-6).toUpperCase()}</b> is now <b>${newStatus}</b>.</p>`
      });
    } catch (err) {
      console.error('Status update email could not be sent');
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    const { data: revenueData, error: revError } = await supabase
      .from('orders')
      .select('total_price')
      .not('status', 'in', '("Cancelled","Refunded")');

    const totalRevenue = revenueData ? revenueData.reduce((sum, o) => sum + Number(o.total_price), 0) : 0;

    // Sales by month (JS side for simplicity)
    const { data: allOrders } = await supabase
      .from('orders')
      .select('total_price, created_at');
    
    const salesMap = {};
    if (allOrders) {
      allOrders.forEach(o => {
        const month = new Date(o.created_at).getMonth() + 1;
        if (!salesMap[month]) salesMap[month] = { _id: month, sales: 0, count: 0 };
        salesMap[month].sales += Number(o.total_price);
        salesMap[month].count += 1;
      });
    }
    const salesByMonth = Object.values(salesMap).sort((a,b) => a._id - b._id);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalRevenue,
        salesByMonth,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:user_id(id, name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export orders to CSV
// @route   GET /api/orders/export
// @access  Private/Admin
exports.exportOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:user_id(name, email), order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Define CSV header
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Customer Email',
      'Items',
      'Total Amount',
      'Status',
      'Shipping Address',
      'Payment Method',
      'Is Paid',
      'Is Delivered'
    ];

    // Build CSV rows
    const rows = orders.map(order => {
      const items = order.order_items.map(item => `${item.name} (${item.quantity})`).join('; ');
      const addr = order.shipping_address;
      const addressStr = `${addr.address}, ${addr.city}, ${addr.postalCode}`;
      
      return [
        order.id,
        new Date(order.created_at).toLocaleDateString(),
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        `"${items}"`,
        order.total_price,
        order.status,
        `"${addressStr}"`,
        order.payment_method,
        order.is_paid,
        order.is_delivered
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=orders-${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
