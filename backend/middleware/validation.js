const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['Pure 4 Suta', 'Refined 5 Suta', 'Reserved 6 Suta', 'Elite 6 Suta'])
    .withMessage('Invalid category'),
  body('size')
    .isIn(['12-16mm', '16-18mm', '18-22mm'])
    .withMessage('Invalid size'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('inventory')
    .isInt({ min: 0 })
    .withMessage('Inventory must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3 and 20 characters'),
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('shippingAddress.fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name is required'),
  body('shippingAddress.phone')
    .isMobilePhone('en-IN')
    .withMessage('Valid phone number is required'),
  body('shippingAddress.addressLine1')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address line 1 is required'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State is required'),
  body('shippingAddress.pincode')
    .isPostalCode('IN')
    .withMessage('Valid pincode is required'),
  body('paymentMethod')
    .isIn(['razorpay', 'stripe', 'cod', 'bank_transfer'])
    .withMessage('Invalid payment method'),
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  handleValidationErrors
];

// Contact form validation
const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  handleValidationErrors
];

// Blog validation
const validateBlog = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('excerpt')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Excerpt must be between 10 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
  body('category')
    .isIn(['health', 'recipes', 'farming', 'nutrition', 'lifestyle', 'news'])
    .withMessage('Invalid category'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateContact,
  validateBlog,
  handleValidationErrors
};
