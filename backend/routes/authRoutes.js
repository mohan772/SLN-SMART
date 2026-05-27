const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  resetPassword,
  sendOTP,
  verifyOTP,
  getUsers,
  toggleBlockUser
} = require('../controllers/authController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

// Admin routes
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/block', protect, authorize('admin'), toggleBlockUser);

module.exports = router;


