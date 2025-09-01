// Generate unique SKU
const generateSKU = (category, size) => {
  const categoryMap = {
    'Pure 4 Suta': 'P4S',
    'Refined 5 Suta': 'R5S',
    'Reserved 6 Suta': 'RV6S',
    'Elite 6 Suta': 'E6S'
  };
  
  const sizeMap = {
    '12-16mm': '1216',
    '16-18mm': '1618',
    '18-22mm': '1822'
  };
  
  const categoryCode = categoryMap[category] || 'HH';
  const sizeCode = sizeMap[size] || '200G';
  const timestamp = Date.now().toString().slice(-4);
  
  return `${categoryCode}-${sizeCode}-${timestamp}`;
};

// Calculate shipping charges
const calculateShipping = (totalAmount, weight, pincode) => {
  // Free shipping for orders above ₹500
  if (totalAmount >= 500) return 0;
  
  // Basic shipping calculation
  const baseCharge = 50;
  const weightCharge = Math.ceil(weight / 500) * 10; // ₹10 per 500g
  
  return baseCharge + weightCharge;
};

// Calculate tax (GST)
const calculateTax = (amount, taxRate = 0.05) => {
  return Math.round(amount * taxRate * 100) / 100;
};

// Format currency
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Generate order tracking number
const generateTrackingNumber = () => {
  const prefix = 'HH';
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp.slice(-8)}${random}`;
};

// Validate Indian pincode
const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Validate Indian mobile number
const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Sanitize filename
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Calculate estimated delivery date
const calculateEstimatedDelivery = (pincode, shippingMethod = 'standard') => {
  const baseDeliveryDays = shippingMethod === 'express' ? 2 : 5;
  
  // Add extra days for remote areas (basic logic)
  const remotePincodes = ['79', '80', '81', '82', '83', '84', '85', '86', '87', '88'];
  const isRemote = remotePincodes.some(prefix => pincode.startsWith(prefix));
  
  const deliveryDays = baseDeliveryDays + (isRemote ? 2 : 0);
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  
  return estimatedDate;
};

// Paginate results
const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  
  return { page: pageNum, limit: limitNum, skip };
};

module.exports = {
  generateSKU,
  calculateShipping,
  calculateTax,
  formatCurrency,
  generateTrackingNumber,
  validatePincode,
  validateMobileNumber,
  generateRandomString,
  sanitizeFilename,
  calculateEstimatedDelivery,
  paginate
};
