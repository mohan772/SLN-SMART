const RecentlyViewed = require('../models/RecentlyViewed');

// @desc    Add product to recently viewed
// @route   POST /api/recently-viewed
// @access  Private
exports.addRecentlyViewed = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Upsert the record (update viewedAt if it exists, create if not)
    await RecentlyViewed.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { viewedAt: Date.now() },
      { upsert: true, new: true }
    );

    // Keep only the 10 most recent per user
    const recentItems = await RecentlyViewed.find({ user: req.user._id }).sort({ viewedAt: -1 });
    
    if (recentItems.length > 10) {
      const idsToDelete = recentItems.slice(10).map(item => item._id);
      await RecentlyViewed.deleteMany({ _id: { $in: idsToDelete } });
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
    const recent = await RecentlyViewed.find({ user: req.user._id })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate('product');

    // Filter out items where the product might have been deleted
    const validRecent = recent.filter(item => item.product != null);

    res.status(200).json({
      success: true,
      data: validRecent.map(item => item.product),
    });
  } catch (err) {
    next(err);
  }
};
