const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP SMS
const sendOTP = async (phone, otp) => {
  const payload = {
    body: `Your Hey Harvest Foods verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
    to: phone
  };
  // Prefer Messaging Service SID if configured
  if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
    payload.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  } else {
    payload.from = process.env.TWILIO_PHONE_NUMBER;
  }

  try {
    const message = await client.messages.create(payload);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS sending error:', error?.message || error);
    throw new Error(error?.message || 'Failed to send OTP via SMS');
  }
};

// Send order status update SMS
const sendOrderStatusSMS = async (phone, firstName, orderId, status) => {
  try {
    let message = '';
    
    switch (status) {
      case 'confirmed':
        message = `Hi ${firstName}! Your Hey Harvest order #${orderId} has been confirmed. We're preparing it for shipment.`;
        break;
      case 'shipped':
        message = `Hi ${firstName}! Your Hey Harvest order #${orderId} has been shipped. Track your order on our website.`;
        break;
      case 'delivered':
        message = `Hi ${firstName}! Your Hey Harvest order #${orderId} has been delivered. Enjoy your premium makhana!`;
        break;
      default:
        message = `Hi ${firstName}! Your Hey Harvest order #${orderId} status has been updated to: ${status}`;
    }
    
    const smsPayload = { body: message, to: phone };
    if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
      smsPayload.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    } else {
      smsPayload.from = process.env.TWILIO_PHONE_NUMBER;
    }
    const sms = await client.messages.create(smsPayload);
    
    return { success: true, messageId: sms.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk inquiry notification SMS
const sendBulkInquiryNotification = async (phone, name, quantity) => {
  try {
    const message = `Thank you ${name} for your bulk inquiry! We've received your request for ${quantity} units. Our team will contact you within 24 hours. - Hey Harvest Foods`;
    
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    
    return { success: true, messageId: sms.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTP,
  sendOrderStatusSMS,
  sendBulkInquiryNotification
};
