const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !user) {
      return res.status(404).json({ message: 'No user found with that email address' })
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const { error: insertError } = await supabase
      .from('password_resets')
      .insert({ email: user.email, otp, expires_at: expiresAt, used: false });

    if (insertError) throw insertError;

    // NOTE: In production, send OTP by email / SMS.
    res.status(200).json({ success: true, data: { email: user.email, otp } })
  } catch (err) {
    next(err)
  }
}

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const { data: record, error } = await supabase
      .from('password_resets')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp', otp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !record) {
      return res.status(400).json({ message: 'Invalid or expired code' })
    }

    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('id', record.id);

    res.status(200).json({ success: true, message: 'OTP verified' })
  } catch (err) {
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (findError || !user) {
      return res.status(404).json({ message: 'No user found with that email address' })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);

    if (updateError) throw updateError;

    res.status(200).json({ success: true, message: 'Password reset successful' })
  } catch (err) {
    next(err)
  }
}
