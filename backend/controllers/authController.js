const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
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
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Check if user exists
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phoneNumber)
      .single();

    if (findError && findError.code !== 'PGRST116') {
       throw findError;
    }

    if (!user) {
      // Create a temporary user if not exists
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          phone: phoneNumber,
          otp: otp,
          otp_expire: otpExpire,
          is_verified: false,
          username: `user_${phoneNumber}` // Placeholder username
        });
      if (insertError) throw insertError;
    } else {
      // Update existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({ otp, otp_expire: otpExpire })
        .eq('id', user.id);
      if (updateError) throw updateError;
    }

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

    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phoneNumber)
      .eq('otp', otp)
      .gt('otp_expire', new Date().toISOString())
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
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
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    if (email) {
      const { data: existingEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        name,
        email,
        password: hashedPassword,
        phone,
        is_verified: true,
      })
      .select()
      .single();

    if (error) throw error;

    sendTokenResponse(newUser, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user with username, name, or email and password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const identifier = (req.body.identifier || req.body.username || req.body.email || '').trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/Name/Email and password are required' });
    }

    let user = null;
    const normalizedPhone = identifier.replace(/\D/g, '');

    // Try exact identifier matches first
    const searchFields = [
      { field: 'username', value: identifier },
      { field: 'email', value: identifier },
      { field: 'phone', value: normalizedPhone }
    ];

    for (const { field, value } of searchFields) {
      if (!value) continue;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq(field, value)
        .maybeSingle();

      if (!error && data) {
        user = data;
        break;
      }
    }

    if (!user) {
      const { data: nameMatch, error } = await supabase
        .from('users')
        .select('*')
        .ilike('name', `%${identifier}%`)
        .maybeSingle();

      if (!error && nameMatch) {
        user = nameMatch;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

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
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

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
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('blocked')
      .eq('id', req.params.id)
      .single();

    if (findError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ blocked: !user.blocked })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: `User ${updatedUser.blocked ? 'blocked' : 'unblocked'} successfully`
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
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

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

    const { data: user, error } = await supabase
      .from('users')
      .update(fieldsToUpdate)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

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

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phoneNumber)
      .eq('otp', otp)
      .gt('otp_expire', new Date().toISOString())
      .single();

    if (findError || !user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        otp: null,
        otp_expire: null
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

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
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
      avatar: user.avatar,
      phone: user.phone
    },
  });
};

