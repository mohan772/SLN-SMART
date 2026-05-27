const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find a user's recently viewed, sorted by date
recentlyViewedSchema.index({ user: 1, viewedAt: -1 });

module.exports = mongoose.model('RecentlyViewed', recentlyViewedSchema);
