const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken, generateEmailVerificationToken } = require('../utils/jwt');
const { generateOTPWithExpiry, verifyOTP } = require('../utils/otp');
const { sendWelcomeEmail, sendEmailVerification } = require('../services/emailService');
const { sendOTP } = require('../services/smsService');

// Register new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const digitsOnlyPhone = String(phone || '').replace(/\D/g, '');
    const defaultCode = process.env.DEFAULT_COUNTRY_CODE || '+91';
    const normalizedPhone = String(phone || '').startsWith('+')
      ? String(phone).trim()
      : `${defaultCode}${digitsOnlyPhone.slice(-10)}`; // assume last 10 digits for IN

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or phone number'
      });
    }

    // Generate OTP for phone verification
    const { otp, expiry } = generateOTPWithExpiry();

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
      phoneVerificationOTP: otp,
      otpExpiry: expiry
    });

    await user.save();

    // Send OTP via SMS (best-effort)
    try {
      await sendOTP(normalizedPhone, otp);
    } catch (smsErr) {
      console.warn('Registration: SMS OTP send failed (continuing):', smsErr?.message || smsErr);
    }

    // Email verification disabled for now (mobile OTP only)
    // If needed later, generate token and send email here.

    res.status(201).json({
      message: 'User registered successfully. OTP sent to your phone. Please verify to complete registration.',
      userId: user._id,
      requiresVerification: true,
      method: 'phone'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Verify phone OTP
const verifyPhoneOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Debug OTP verification
    console.log('OTP Verification Debug:', {
      providedOTP: otp,
      storedOTP: user.phoneVerificationOTP,
      expiry: user.otpExpiry,
      currentTime: new Date(),
      isExpired: new Date() > user.otpExpiry
    });

    const otpVerification = verifyOTP(otp, user.phoneVerificationOTP, user.otpExpiry);
    
    if (!otpVerification.valid) {
      console.log('OTP verification failed:', otpVerification.message);
      return res.status(400).json({ message: otpVerification.message });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.phoneVerificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Send welcome email (best-effort)
    try {
      await sendWelcomeEmail(user.email, user.firstName);
    } catch (mailErr) {
      console.warn('Welcome email send failed (continuing):', mailErr?.message || mailErr);
    }

    // Issue JWT so user can proceed immediately
    const token = generateToken(user._id, user.role);
    res.json({
      message: 'Phone number verified successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone number already verified' });
    }

    // Generate new OTP
    const { otp, expiry } = generateOTPWithExpiry();
    user.phoneVerificationOTP = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send OTP via SMS
    try {
      await sendOTP(user.phone, otp);
      res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Resend OTP Twilio error:', err?.message || err);
      return res.status(500).json({ message: 'Failed to send OTP', error: err?.message || String(err) });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, preferences } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({ message: 'Profile updated successfully', user });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Add address
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is the first address or marked as default, make it default
    if (req.body.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => addr.isDefault = false);
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Failed to add address', error: error.message });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, remove default from others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({ message: 'Address updated successfully', addresses: user.addresses });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Failed to update address', error: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses.pull(addressId);
    await user.save();

    res.json({ message: 'Address deleted successfully', addresses: user.addresses });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Failed to delete address', error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password (let User pre-save hook hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};

module.exports = {
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
};
