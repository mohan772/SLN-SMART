const Review = require('../models/Review')
const Product = require('../models/Product')

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name')
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
    const product = await Product.findById(req.params.productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const { rating, comment } = req.body
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      rating: Number(rating),
      comment,
    })

    const reviews = await Review.find({ product: product._id })
    product.reviewCount = reviews.length
    product.rating = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    await product.save()

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
    const reviews = await Review.find({ user: req.user._id }).populate('product', 'name images')
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
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this review' })
    }

    await review.deleteOne()

    // Update product rating
    const product = await Product.findById(review.product)
    if (product) {
      const reviews = await Review.find({ product: product._id })
      product.reviewCount = reviews.length
      product.rating = reviews.length > 0 ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length : 0
      await product.save()
    }

    res.status(200).json({ success: true, data: {} })
  } catch (err) {
    next(err)
  }
}
