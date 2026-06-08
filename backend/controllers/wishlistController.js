const supabase = require('../config/supabase');

exports.getWishlist = async (req, res, next) => {
  try {
    const { data: items, error } = await supabase
      .from('wishlist_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, data: { items: items || [] } })
  } catch (err) {
    next(err)
  }
}

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body
    
    // Check if exists
    const { data: existing, error: findError } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (!existing) {
      const { error: insertError } = await supabase
        .from('wishlist_items')
        .insert({ user_id: req.user.id, product_id: productId });
      
      if (insertError) throw insertError;
    }

    const { data: items, error: fetchError } = await supabase
      .from('wishlist_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (fetchError) throw fetchError;

    res.status(200).json({ success: true, data: { items: items || [] } })
  } catch (err) {
    next(err)
  }
}

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', req.params.productId);

    if (error) throw error;

    const { data: items, error: fetchError } = await supabase
      .from('wishlist_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (fetchError) throw fetchError;

    res.status(200).json({ success: true, data: { items: items || [] } })
  } catch (err) {
    next(err)
  }
}
