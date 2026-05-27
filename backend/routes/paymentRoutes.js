const express = require('express');
const { 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  getOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// ==========================================
// PROTECTED USER ROUTES
// ==========================================

// Create Razorpay order
router.post('/create-order', protect, createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-payment', protect, verifyRazorpayPayment);

// Get single order
router.get('/:id', protect, getOrder);

// Get user orders
router.get('/my/orders', protect, getUserOrders);

// Cancel order
router.put('/:id/cancel', protect, cancelOrder);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all orders (admin)
router.get('/', protect, getAllOrders);

// Update order status (admin)
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
