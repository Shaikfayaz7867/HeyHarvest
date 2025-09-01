const Order = require('../models/Order');
const { createRazorpayOrder, verifyRazorpayPayment, processRefund } = require('../services/paymentService');

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ 
      orderId,
      userId: req.user._id,
      paymentStatus: 'pending'
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already paid' });
    }

    // Create Razorpay order
    const paymentOrder = await createRazorpayOrder(
      order.totalAmount,
      'INR',
      order.orderId
    );

    if (!paymentOrder.success) {
      return res.status(500).json({ 
        message: 'Failed to create payment order',
        error: paymentOrder.error
      });
    }

    res.json({
      message: 'Payment order created successfully',
      razorpayOrderId: paymentOrder.order.id,
      amount: order.totalAmount,
      currency: 'INR',
      orderId: order.orderId
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature, 
      orderId 
    } = req.body;

    // Verify payment signature
    const isValidSignature = verifyRazorpayPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order payment status
    const order = await Order.findOne({ orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    order.orderStatus = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Payment verified and order confirmed'
    });

    await order.save();

    res.json({ 
      message: 'Payment verified successfully',
      order: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};

// Handle payment failure
const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findOne({ orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'failed';
    order.statusHistory.push({
      status: 'payment_failed',
      timestamp: new Date(),
      note: `Payment failed: ${reason}`
    });

    await order.save();

    res.json({ message: 'Payment failure recorded' });

  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({ message: 'Failed to handle payment failure', error: error.message });
  }
};

// Admin: Process refund
const processOrderRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Order payment is not in paid status' });
    }

    // Process refund through Razorpay
    const refundResult = await processRefund(order.paymentId, amount, reason);
    
    if (!refundResult.success) {
      return res.status(500).json({ 
        message: 'Failed to process refund',
        error: refundResult.error
      });
    }

    // Update order
    order.refundAmount = amount;
    order.refundStatus = 'processed';
    order.paymentStatus = amount >= order.totalAmount ? 'refunded' : 'partially_refunded';
    order.statusHistory.push({
      status: 'refunded',
      timestamp: new Date(),
      note: `Refund processed: ₹${amount}. Reason: ${reason}`,
      updatedBy: req.user._id
    });

    await order.save();

    res.json({ 
      message: 'Refund processed successfully',
      refund: refundResult.refund
    });

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Failed to process refund', error: error.message });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  processOrderRefund
};
