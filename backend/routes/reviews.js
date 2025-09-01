const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  moderateReview,
  getAllReviewsAdmin
} = require('../controllers/reviewController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');
const { uploadReviewImages, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected user routes
router.post('/create', authenticateToken, uploadReviewImages, handleUploadError, validateReview, createReview);
router.get('/user', authenticateToken, getUserReviews);
router.put('/:reviewId', authenticateToken, validateReview, updateReview);
router.delete('/:reviewId', authenticateToken, deleteReview);
router.post('/:reviewId/helpful', markReviewHelpful);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, getAllReviewsAdmin);
router.put('/admin/:reviewId/moderate', authenticateToken, requireAdmin, moderateReview);

module.exports = router;
