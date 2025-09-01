const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return { success: false, error: error.message };
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return { success: true, payment };
  } catch (error) {
    console.error('Get payment details error:', error);
    return { success: false, error: error.message };
  }
};

// Process refund
const processRefund = async (paymentId, amount, reason) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // amount in paise
      notes: {
        reason: reason
      }
    });
    return { success: true, refund };
  } catch (error) {
    console.error('Refund processing error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentDetails,
  processRefund
};
