const Product = require('../models/Product');
const Order = require('../models/Order');
const InventoryLog = require('../models/InventoryLog');

// @desc    Get inventory analytics
// @route   GET /api/inventory/analytics
// @access  Private/Admin
exports.getInventoryAnalytics = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: { $ne: true } });
    const lowStockProducts = await Product.find({ stock: { $lt: 20 }, isDeleted: { $ne: true } }).select('name stock price demandLevel unit images');
    
    // Very simple revenue calculation
    const orders = await Order.find({ status: { $nin: ['Cancelled', 'Refunded'] } });
    let totalRevenue = 0;
    orders.forEach(order => {
        totalRevenue += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders: orders.length,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        totalRevenue
      }
    });
  } catch(err) {
      next(err);
  }
};

// @desc    Get auto price suggestion for a product
// @route   GET /api/inventory/price-suggestion/:id
// @access  Private/Admin
exports.getAutoPriceSuggestion = async (req, res, next) => {
  try {
      const product = await Product.findById(req.params.id);
      if(!product) return res.status(404).json({ message: 'Product not found' });
      
      // Simple Mocked Logic for Auto Suggestion
      let suggestion = '';
      let suggestedPrice = product.price;

      if (product.demandLevel === 'High') {
          suggestion = `${product.name} sales increased recently. Consider increasing the price by 15% to maximize profit.`;
          suggestedPrice = +(product.price * 1.15).toFixed(2);
      } else if (product.stock > 50 && product.demandLevel === 'Low') {
          suggestion = `Excess stock of ${product.name} with low demand. Add a discount to clear inventory.`;
          suggestedPrice = +(product.price * 0.85).toFixed(2);
      } else {
          suggestion = `${product.name} sales are stable. Current price is optimal.`;
      }

      res.status(200).json({
          success: true,
          data: {
              productId: product._id,
              currentPrice: product.price,
              suggestedPrice,
              suggestion
          }
      });
  } catch(err) {
      next(err);
  }
};

// @desc    Restock a product
// @route   POST /api/inventory/restock/:id
// @access  Private/Admin
exports.restockProduct = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousStock = product.stock;
    product.stock += Number(quantity);
    
    // Auto-show product if stock becomes > 0
    if (product.stock > 0 && !product.visibility) {
      product.visibility = true;
    }

    await product.save();

    // Log the change
    const log = await InventoryLog.create({
      product: product._id,
      user: req.user._id,
      changeType: 'Restock',
      previousStock,
      newStock: product.stock,
      quantityChanged: Number(quantity),
      reason: reason || 'Manual restock'
    });

    res.status(200).json({
      success: true,
      data: product,
      log
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get inventory logs
// @route   GET /api/inventory/logs
// @access  Private/Admin
exports.getInventoryLogs = async (req, res, next) => {
  try {
    const logs = await InventoryLog.find()
      .populate('product', 'name images')
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

