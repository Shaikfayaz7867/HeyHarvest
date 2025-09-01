// Product categories
const PRODUCT_CATEGORIES = [
  'Pure 4 Suta',
  'Refined 5 Suta', 
  'Reserved 6 Suta',
  'Elite 6 Suta'
];

// Product sizes
const PRODUCT_SIZES = [
  '12-16mm',
  '16-18mm', 
  '18-22mm'
];

// Order statuses
const ORDER_STATUSES = [
  'pending',
  'confirmed', 
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
];

// Payment statuses
const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed', 
  'refunded',
  'partially_refunded'
];

// User roles
const USER_ROLES = [
  'USER',
  'ADMIN'
];

// Contact types
const CONTACT_TYPES = [
  'general',
  'bulk_inquiry',
  'support',
  'partnership',
  'complaint'
];

// Blog categories
const BLOG_CATEGORIES = [
  'health',
  'recipes',
  'farming',
  'nutrition',
  'lifestyle',
  'news'
];

// Brand colors
const BRAND_COLORS = {
  primary: '#2D5016',
  secondary: '#4A7C59',
  accent: '#F4C430',
  background: '#F5F5DC',
  text: '#333333'
};

// API response messages
const MESSAGES = {
  SUCCESS: {
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    FETCHED: 'Fetched successfully'
  },
  ERROR: {
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_FAILED: 'Validation failed',
    SERVER_ERROR: 'Internal server error'
  }
};

module.exports = {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  USER_ROLES,
  CONTACT_TYPES,
  BLOG_CATEGORIES,
  BRAND_COLORS,
  MESSAGES
};
