const express = require('express');
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getOrders,
  getAnalytics,
  exportOrders,
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/export', protect, authorize('admin'), exportOrders);
router.get('/:id', protect, getOrderById);

// Admin only
router.get('/', protect, authorize('admin'), getOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
