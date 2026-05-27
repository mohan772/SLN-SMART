const express = require('express')
const { forgotPassword, verifyOtp, resetPassword } = require('../controllers/passwordController')

const router = express.Router()

router.post('/forgot', forgotPassword)
router.post('/verify', verifyOtp)
router.post('/reset', resetPassword)

module.exports = router
