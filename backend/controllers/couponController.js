const supabase = require('../config/supabase');

// @desc    Apply coupon
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('code, discount')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gt('expire_date', new Date().toISOString())
      .single();

    if (error || !coupon) {
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
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

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
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        ...req.body,
        code: req.body.code.toUpperCase()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (err) {
    next(err);
  }
};
