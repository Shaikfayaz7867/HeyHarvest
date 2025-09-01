const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, role = 'USER') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Verify token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate email verification token
const generateEmailVerificationToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'email_verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Generate password reset token
const generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateEmailVerificationToken,
  generatePasswordResetToken
};
