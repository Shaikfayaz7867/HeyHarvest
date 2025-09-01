const express = require('express');
const router = express.Router();
const {
  register,
  verifyPhoneOTP,
  resendOTP,
  login,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  changePassword
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin
} = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/verify-otp', verifyPhoneOTP);
router.post('/resend-otp', resendOTP);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/addresses', authenticateToken, addAddress);
router.put('/addresses/:addressId', authenticateToken, updateAddress);
router.delete('/addresses/:addressId', authenticateToken, deleteAddress);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
