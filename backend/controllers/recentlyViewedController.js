const supabase = require('../config/supabase');

// @desc    Add product to recently viewed
// @route   POST /api/recently-viewed
// @access  Private
exports.addRecentlyViewed = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Upsert the record
    const { error: upsertError } = await supabase
      .from('recently_viewed')
      .upsert({ 
        user_id: req.user.id, 
        product_id: productId, 
        viewed_at: new Date().toISOString() 
      }, { onConflict: 'user_id, product_id' });

    if (upsertError) throw upsertError;

    // Keep only the 10 most recent per user
    const { data: recentItems, error: fetchError } = await supabase
      .from('recently_viewed')
      .select('id')
      .eq('user_id', req.user.id)
      .order('viewed_at', { ascending: false });

    if (fetchError) throw fetchError;
    
    if (recentItems.length > 10) {
      const idsToDelete = recentItems.slice(10).map(item => item.id);
      await supabase
        .from('recently_viewed')
        .delete()
        .in('id', idsToDelete);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recently viewed products
// @route   GET /api/recently-viewed
// @access  Private
exports.getRecentlyViewed = async (req, res, next) => {
  try {
    const { data: recent, error } = await supabase
      .from('recently_viewed')
      .select('product:product_id(*)')
      .eq('user_id', req.user.id)
      .order('viewed_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Filter out items where the product might have been deleted or soft deleted
    const validRecent = recent
      .filter(item => item.product != null && !item.product.is_deleted)
      .map(item => item.product);

    res.status(200).json({
      success: true,
      data: validRecent,
    });
  } catch (err) {
    next(err);
  }
};
