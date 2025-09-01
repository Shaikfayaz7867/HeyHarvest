const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public route (with optional auth)
router.post('/', optionalAuth, validateContact, createContact);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, getAllContacts);
router.put('/admin/:id', authenticateToken, requireAdmin, updateContactStatus);
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteContact);

module.exports = router;
