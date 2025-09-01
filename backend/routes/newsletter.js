const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  updatePreferences,
  getAllSubscribers
} = require('../controllers/newsletterController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

// Public routes
router.post('/subscribe', optionalAuth, subscribe);
router.post('/unsubscribe', unsubscribe);
router.put('/preferences', updatePreferences);

// Admin routes
router.get('/admin/subscribers', authenticateToken, requireAdmin, getAllSubscribers);

module.exports = router;
