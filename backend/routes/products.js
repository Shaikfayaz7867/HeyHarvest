const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getCategories
} = require('../controllers/productController');
const { optionalAuth } = require('../middleware/auth');

// Public product routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

module.exports = router;
