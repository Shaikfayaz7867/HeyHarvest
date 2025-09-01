const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  processOrderRefund
} = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// User payment routes
router.post('/create-order', authenticateToken, createPaymentOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.post('/failure', authenticateToken, handlePaymentFailure);

// Admin refund routes
router.post('/admin/refund/:orderId', authenticateToken, requireAdmin, processOrderRefund);

module.exports = router;
