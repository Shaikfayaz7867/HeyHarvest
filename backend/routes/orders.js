const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
  validateCoupon
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// All order routes require authentication
router.use(authenticateToken);

router.post('/create', validateOrder, createOrder);
router.get('/', getUserOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/cancel', cancelOrder);
router.post('/validate-coupon', validateCoupon);

// Public tracking route (no auth required)
router.get('/track/:orderId', (req, res, next) => {
  // Remove auth requirement for this specific route
  req.user = null;
  next();
}, trackOrder);

module.exports = router;
