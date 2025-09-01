const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Hey Harvest Foods" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Hey Harvest Foods! 🌱',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2D5016, #4A7C59); padding: 30px; text-align: center;">
          <h1 style="color: #F4C430; margin: 0;">Welcome to Hey Harvest Foods!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #2D5016;">Hello ${firstName}! 👋</h2>
          <p style="color: #333; line-height: 1.6;">
            Thank you for joining the Hey Harvest Foods family! We're excited to share our premium 
            makhana (fox nuts) from the pristine ponds of Mithilanchal, Bihar.
          </p>
          <p style="color: #333; line-height: 1.6;">
            Our makhana is carefully harvested, processed, and packed to bring you the finest quality 
            lotus seeds that are rich in protein, antioxidants, and natural goodness.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/products" 
               style="background: #2D5016; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Explore Our Products
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Stay tuned for health tips, recipes, and exclusive offers!
          </p>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// Send email verification
const sendEmailVerification = async (email, firstName, verificationToken) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: `"Hey Harvest Foods" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - Hey Harvest Foods',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2D5016; padding: 20px; text-align: center;">
          <h1 style="color: #F4C430; margin: 0;">Email Verification</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2D5016;">Hello ${firstName}!</h2>
          <p style="color: #333; line-height: 1.6;">
            Please verify your email address to complete your registration.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #4A7C59; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// Send order confirmation
const sendOrderConfirmation = async (email, firstName, order) => {
  const transporter = createTransporter();
  
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.totalPrice}</td>
    </tr>
  `).join('');
  
  const mailOptions = {
    from: `"Hey Harvest Foods" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation - ${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2D5016; padding: 20px; text-align: center;">
          <h1 style="color: #F4C430; margin: 0;">Order Confirmed! 🎉</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2D5016;">Thank you ${firstName}!</h2>
          <p style="color: #333; line-height: 1.6;">
            Your order <strong>#${order.orderId}</strong> has been confirmed and is being processed.
          </p>
          
          <h3 style="color: #2D5016;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f5f5f5; font-weight: bold;">
                <td colspan="2" style="padding: 10px;">Total Amount</td>
                <td style="padding: 10px; text-align: right;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #2D5016;">Shipping Address:</h3>
          <p style="color: #333; line-height: 1.6;">
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.addressLine1}<br>
            ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order.orderId}" 
               style="background: #4A7C59; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// Send shipping notification
const sendShippingNotification = async (email, firstName, order) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Hey Harvest Foods" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Order is Shipped! - ${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4A7C59; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Your Order is on the Way! 🚚</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2D5016;">Hi ${firstName}!</h2>
          <p style="color: #333; line-height: 1.6;">
            Great news! Your order <strong>#${order.orderId}</strong> has been shipped and is on its way to you.
          </p>
          
          ${order.trackingNumber ? `
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2D5016; margin-top: 0;">Tracking Information:</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              ${order.courierService ? `<p><strong>Courier:</strong> ${order.courierService}</p>` : ''}
              ${order.estimatedDelivery ? `<p><strong>Expected Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ''}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order.orderId}" 
               style="background: #2D5016; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

// Send abandoned cart email
const sendAbandonedCartEmail = async (email, firstName, cartItems) => {
  const transporter = createTransporter();
  
  const itemsHtml = cartItems.map(item => `
    <div style="border: 1px solid #eee; border-radius: 5px; padding: 15px; margin: 10px 0;">
      <h4 style="margin: 0; color: #2D5016;">${item.productId.name}</h4>
      <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity}</p>
      <p style="margin: 5px 0; color: #4A7C59; font-weight: bold;">₹${item.discountPrice || item.price}</p>
    </div>
  `).join('');
  
  const mailOptions = {
    from: `"Hey Harvest Foods" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Complete Your Purchase - Your Cart is Waiting! 🛒',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #F4C430; padding: 20px; text-align: center;">
          <h1 style="color: #2D5016; margin: 0;">Don't Miss Out!</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #2D5016;">Hi ${firstName}!</h2>
          <p style="color: #333; line-height: 1.6;">
            You left some amazing makhana products in your cart. Complete your purchase now 
            and enjoy the goodness of premium lotus seeds!
          </p>
          
          <h3 style="color: #2D5016;">Items in Your Cart:</h3>
          ${itemsHtml}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/cart" 
               style="background: #2D5016; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Complete Your Purchase
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This is a friendly reminder. You can unsubscribe from these emails anytime.
          </p>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendEmailVerification,
  sendOrderConfirmation,
  sendShippingNotification,
  sendAbandonedCartEmail
};
