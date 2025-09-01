const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin
} = require('../controllers/blogController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateBlog } = require('../middleware/validation');
const { uploadBlogImage, handleUploadError } = require('../middleware/upload');

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, getAllBlogsAdmin);
router.post('/admin/create', authenticateToken, requireAdmin, uploadBlogImage, handleUploadError, validateBlog, createBlog);
router.put('/admin/:id', authenticateToken, requireAdmin, uploadBlogImage, handleUploadError, validateBlog, updateBlog);
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteBlog);

module.exports = router;
