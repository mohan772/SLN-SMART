const axios = require('axios');

const MSG91_AUTH_KEY = process.env.MSG91_API_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

/**
 * Send OTP via MSG91
 * @param {string} phone - Phone number with country code (e.g., 919876543210)
 * @param {string} otp - 6 digit OTP
 */
exports.sendOTP = async (phone, otp) => {
  try {
    // Remove '+' if present
    const formattedPhone = phone.replace('+', '');
    
    const response = await axios.get(`https://api.msg91.com/api/v5/otp`, {
      params: {
        template_id: MSG91_TEMPLATE_ID,
        mobile: formattedPhone,
        authkey: MSG91_AUTH_KEY,
        otp: otp
      }
    });

    return response.data;
  } catch (error) {
    console.error('MSG91 Send OTP Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to send OTP via MSG91');
  }
};

/**
 * Verify OTP via MSG91 (Optional if we verify in our DB)
 * The user requested real OTP verification. 
 * MSG91 has its own verification API, but since we are generating OTP ourselves 
 * and storing it, we can verify it in our DB too.
 * However, the user specifically asked for MSG91 Send and Verify.
 */
exports.verifyOTP = async (phone, otp) => {
  try {
    const formattedPhone = phone.replace('+', '');
    const response = await axios.get(`https://api.msg91.com/api/v5/otp/verify`, {
      params: {
        mobile: formattedPhone,
        otp: otp,
        authkey: MSG91_AUTH_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('MSG91 Verify OTP Error:', error.response ? error.response.data : error.message);
    return { type: 'error', message: 'Invalid OTP or expired' };
  }
};
