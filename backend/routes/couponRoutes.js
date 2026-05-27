const express = require('express');
const {
  applyCoupon,
  getCoupons,
  createCoupon,
} = require('../controllers/couponController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyCoupon);

// Admin only
router.get('/', protect, authorize('admin'), getCoupons);
router.post('/', protect, authorize('admin'), createCoupon);

module.exports = router;
