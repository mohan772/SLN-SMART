const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: [true, 'Please add a discount percentage'],
    min: 1,
    max: 100,
  },
  expireDate: {
    type: Date,
    required: [true, 'Please add an expiration date'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Coupon', couponSchema);
