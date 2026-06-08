const supabase = require('../config/supabase');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, user:user_id(name)')
      .eq('product_id', req.params.productId);

    if (error) throw error;

    res.status(200).json({ success: true, count: reviews.length, data: reviews })
  } catch (err) {
    next(err)
  }
}

// @desc    Add a review for a product
// @route   POST /api/reviews/product/:productId
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('id')
      .eq('id', req.params.productId)
      .single();

    if (findError || !product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const { rating, comment, title } = req.body
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: req.user.id,
        rating: Number(rating),
        text: comment || req.body.text, // Supporting both comment and text
        title: title || 'Product Review',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Update product rating and count
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product.id);

    if (!fetchError) {
      const numReviews = reviews.length;
      const avgRating = reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews;

      await supabase
        .from('products')
        .update({ num_reviews: numReviews, rating: avgRating })
        .eq('id', product.id);
    }

    res.status(201).json({ success: true, data: review })
  } catch (err) {
    next(err)
  }
}

// @desc    Get current user reviews
// @route   GET /api/reviews/myreviews
// @access  Private
exports.getMyReviews = async (req, res, next) => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, product:product_id(name, images)')
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, count: reviews.length, data: reviews })
  } catch (err) {
    next(err)
  }
}

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const { data: review, error: findError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Make sure review belongs to user or user is admin
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this review' })
    }

    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) throw deleteError;

    // Update product rating
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', review.product_id);

    if (!fetchError) {
      const numReviews = reviews.length;
      const avgRating = numReviews > 0 ? reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews : 0;

      await supabase
        .from('products')
        .update({ num_reviews: numReviews, rating: avgRating })
        .eq('id', review.product_id);
    }

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    next(err)
  }
}
