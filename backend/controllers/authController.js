const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP: sendMsg91OTP, verifyOTP: verifyMsg91OTP } = require('../utils/msg91');

// @desc    Send OTP via MSG91
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Format phone: remove + and ensure country code (default 91 for India as per requirements)
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in user record or a temporary place
    // For simplicity, we can store it in the user record if exists, or create a temporary record
    let user = await User.findOne({ phone: phoneNumber });
    
    if (!user) {
      // Create a temporary user if not exists (or just store OTP in a separate collection)
      // We'll just use the User model with isVerified: false
      user = new User({
        phone: phoneNumber,
        isVerified: false
      });
    }

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    // Send OTP via MSG91
    await sendMsg91OTP(formattedPhone, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const user = await User.findOne({
      phone: phoneNumber,
      otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid. We don't mark as verified yet if it's during registration.
    // For login, we can mark as verified.
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, name, email, password, phone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create user
    user = await User.create({
      username,
      name,
      email,
      password,
      phone,
      isVerified: true, // Auto-verify for now as per user request for username/pass
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user with username or email and password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body; // 'username' field on frontend can be email or username

    if (!username || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    // Find User by username OR email (case-insensitive) and include password
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    const q = {
      $or: [
        { username: new RegExp('^' + escapeRegex(username) + '$', 'i') },
        { email: new RegExp('^' + escapeRegex(username) + '$', 'i') }
      ]
    };

    const user = await User.findOne(q).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.blocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Toggle block/unblock user
// @route   PUT /api/auth/users/:id/block
// @access  Private/Admin
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Reset password after MSG91 OTP Verification
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { phoneNumber, password, otp } = req.body;

    if (!phoneNumber || !password || !otp) {
      return res.status(400).json({ message: 'Phone number, new password and OTP are required' });
    }

    const user = await User.findOne({
      phone: phoneNumber,
      otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      phone: user.phone
    },
  });
};

