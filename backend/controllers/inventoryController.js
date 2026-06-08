const supabase = require('../config/supabase');

// @desc    Get inventory analytics
// @route   GET /api/inventory/analytics
// @access  Private/Admin
exports.getInventoryAnalytics = async (req, res, next) => {
  try {
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('id, name, stock, price, demand_level, unit, images')
      .eq('is_deleted', false)
      .lt('stock', 20);
    
    const { data: orders } = await supabase
      .from('orders')
      .select('total_price')
      .not('status', 'in', '("Cancelled","Refunded")');

    const totalRevenue = orders ? orders.reduce((sum, order) => sum + Number(order.total_price), 0) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts: totalProducts || 0,
        totalOrders: orders ? orders.length : 0,
        lowStockCount: lowStockProducts ? lowStockProducts.length : 0,
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
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if(error || !product) return res.status(404).json({ message: 'Product not found' });
      
      let suggestion = '';
      let suggestedPrice = Number(product.price);

      if (product.demand_level === 'High') {
          suggestion = `${product.name} sales increased recently. Consider increasing the price by 15% to maximize profit.`;
          suggestedPrice = +(Number(product.price) * 1.15).toFixed(2);
      } else if (product.stock > 50 && product.demand_level === 'Low') {
          suggestion = `Excess stock of ${product.name} with low demand. Add a discount to clear inventory.`;
          suggestedPrice = +(Number(product.price) * 0.85).toFixed(2);
      } else {
          suggestion = `${product.name} sales are stable. Current price is optimal.`;
      }

      res.status(200).json({
          success: true,
          data: {
              productId: product.id,
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
    
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('stock, visibility')
      .eq('id', req.params.id)
      .single();

    if (findError || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousStock = product.stock;
    const newStock = product.stock + Number(quantity);
    
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        visibility: newStock > 0 ? true : product.visibility
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log the change
    const { data: log, error: logError } = await supabase
      .from('inventory_logs')
      .insert({
        product_id: req.params.id,
        user_id: req.user.id,
        change_type: 'Restock',
        previous_stock: previousStock,
        new_stock: newStock,
        quantity_changed: Number(quantity),
        reason: reason || 'Manual restock'
      })
      .select()
      .single();

    res.status(200).json({
      success: true,
      data: updatedProduct,
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
    const { data: logs, error } = await supabase
      .from('inventory_logs')
      .select('*, product:product_id(name, images), user:user_id(name)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

