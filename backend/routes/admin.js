const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getDashboardAnalytics,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { uploadProductImages, handleUploadError } = require('../middleware/upload');

// Apply admin authentication to all routes
router.use(authenticateToken, requireAdmin);

// Product Management Routes
router.get('/products', getAllProductsAdmin);
router.post('/products', uploadProductImages, handleUploadError, validateProduct, createProduct);
router.put('/products/:id', uploadProductImages, handleUploadError, validateProduct, updateProduct);
router.delete('/products/:id', deleteProduct);

// Order Management Routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Customer Management Routes
router.get('/customers', getAllCustomers);

// Analytics Routes
router.get('/analytics', getDashboardAnalytics);

// Category Management Routes
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
