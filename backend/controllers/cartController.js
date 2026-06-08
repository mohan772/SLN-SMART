const supabase = require('../config/supabase');

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: { items: items || [] },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const { data: existingItem, error: findError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + (quantity || 1) })
        .eq('id', existingItem.id);
      if (updateError) throw updateError;
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({ user_id: req.user.id, product_id: productId, quantity: quantity || 1 });
      if (insertError) throw insertError;
    }

    const { data: items, error: fetchError } = await supabase
      .from('cart_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (fetchError) throw fetchError;

    res.status(200).json({
      success: true,
      data: { items: items || [] },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    if (quantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', req.user.id)
        .eq('product_id', req.params.productId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', req.user.id)
        .eq('product_id', req.params.productId);
      if (error) throw error;
    }

    const { data: items, error: fetchError } = await supabase
      .from('cart_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (fetchError) throw fetchError;

    res.status(200).json({
      success: true,
      data: { items: items || [] },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', req.params.productId);

    if (error) throw error;

    const { data: items, error: fetchError } = await supabase
      .from('cart_items')
      .select('*, product:product_id(*)')
      .eq('user_id', req.user.id);

    if (fetchError) throw fetchError;

    res.status(200).json({
      success: true,
      data: { items: items || [] },
    });
  } catch (err) {
    next(err);
  }
};
