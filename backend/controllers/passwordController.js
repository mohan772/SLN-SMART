const crypto = require('crypto')
const PasswordReset = require('../models/PasswordReset')
const User = require('../models/User')

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' })
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await PasswordReset.create({ email: user.email, otp, expiresAt, used: false })

    // NOTE: In production, send OTP by email / SMS.
    res.status(200).json({ success: true, data: { email: user.email, otp } })
  } catch (err) {
    next(err)
  }
}

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const record = await PasswordReset.findOne({ email: email.toLowerCase(), otp, expiresAt: { $gt: new Date() }, used: false }).sort({ createdAt: -1 })
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' })
    }
    record.used = true
    await record.save()
    res.status(200).json({ success: true, message: 'OTP verified' })
  } catch (err) {
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' })
    }
    user.password = password
    await user.save()
    res.status(200).json({ success: true, message: 'Password reset successful' })
  } catch (err) {
    next(err)
  }
}
