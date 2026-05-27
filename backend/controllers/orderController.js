const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const InventoryLog = require('../models/InventoryLog');
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

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Update Product Stock and Log
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const previousStock = product.stock;
        product.stock = Math.max(0, product.stock - item.quantity);
        
        // Auto-hide product if stock reaches 0
        if (product.stock === 0) {
          product.visibility = false;
        }
        
        await product.save();

        // Create Inventory Log
        await InventoryLog.create({
          product: product._id,
          changeType: 'Order Placed',
          previousStock,
          newStock: product.stock,
          quantityChanged: -item.quantity,
          orderId: createdOrder._id,
          reason: `Order #${createdOrder._id.toString().slice(-6).toUpperCase()}`
        });
      }
    }

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    // Send Confirmation Email
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmation - #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
        message: `Your order has been placed successfully. Order ID: ${createdOrder._id}`,
        html: `<h1>Thank you for your order!</h1><p>Your order for ${formatINR(totalPrice)} has been placed and is being processed.</p><p>Order ID: <b>${createdOrder._id}</b></p>`
      });
    } catch (err) {
      console.error('Email could not be sent');
    }

    res.status(201).json({
      success: true,
      data: createdOrder,
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
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
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
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
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
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = req.body.status;

    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else if ((req.body.status === 'Cancelled' || req.body.status === 'Refunded') && (previousStatus !== 'Cancelled' && previousStatus !== 'Refunded')) {
      // Restore stock for cancelled or refunded orders if they weren't already cancelled/refunded
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          const previousStock = product.stock;
          product.stock = product.stock + item.quantity;
          if (product.stock > 0 && !product.visibility) {
             product.visibility = true;
          }
          await product.save();

          // Create Inventory Log
          await InventoryLog.create({
            product: product._id,
            user: req.user._id,
            changeType: req.body.status === 'Cancelled' ? 'Order Cancelled' : 'Order Refunded',
            previousStock,
            newStock: product.stock,
            quantityChanged: item.quantity,
            orderId: order._id,
            reason: `${req.body.status} - Order #${order._id.toString().slice(-6).toUpperCase()}`
          });
        }
      }
    }

    const updatedOrder = await order.save();

    // Send Status Update Email
    try {
      await sendEmail({
        email: order.user.email,
        subject: `Order Update - #${order._id.toString().slice(-6).toUpperCase()}`,
        message: `Your order status has been updated to: ${order.status}`,
        html: `<h1>Order Update</h1><p>Your order <b>#${order._id.toString().slice(-6).toUpperCase()}</b> is now <b>${order.status}</b>.</p>`
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
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const revenueData = await Order.aggregate([
      { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const salesByMonth = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          sales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalProducts,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
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
    const orders = await Order.find({}).populate('user', 'id name').sort('-createdAt');
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
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');

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
      const items = order.orderItems.map(item => `${item.name} (${item.quantity})`).join('; ');
      const address = `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`;
      
      return [
        order._id,
        new Date(order.createdAt).toLocaleDateString(),
        order.user?.name || 'N/A',
        order.user?.email || 'N/A',
        `"${items}"`,
        order.totalPrice,
        order.status,
        `"${address}"`,
        order.paymentMethod,
        order.isPaid,
        order.isDelivered
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
