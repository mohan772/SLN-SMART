const Coupon = require('../models/Coupon');

// @desc    Apply coupon
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true, expireDate: { $gt: Date.now() } });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discount: coupon.discount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (err) {
    next(err);
  }
};
