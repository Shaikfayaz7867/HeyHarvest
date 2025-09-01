// Generate random OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

// Generate OTP with expiry (5 minutes default)
const generateOTPWithExpiry = (length = 6, expiryMinutes = 5) => {
  const otp = generateOTP(length);
  const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  return { otp, expiry };
};

// Verify OTP
const verifyOTP = (providedOTP, storedOTP, expiry) => {
  if (!providedOTP || !storedOTP || !expiry) {
    return { valid: false, message: 'Invalid OTP data' };
  }
  
  if (new Date() > expiry) {
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (providedOTP !== storedOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  return { valid: true, message: 'OTP verified successfully' };
};

module.exports = {
  generateOTP,
  generateOTPWithExpiry,
  verifyOTP
};
