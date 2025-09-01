const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { sendOrderConfirmation } = require('../services/emailService');
const { sendOrderStatusSMS } = require('../services/smsService');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, couponCode, items: bodyItems } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    let orderItems = [];
    let subtotal = 0;

    if (cart && cart.items.length > 0) {
      // Build from cart
      orderItems = cart.items.map(item => {
        const itemPrice = item.discountPrice || item.price;
        const totalPrice = itemPrice * item.quantity;
        subtotal += totalPrice;

        return {
          productId: item.productId._id,
          name: item.productId.name,
          sku: item.productId.sku,
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.discountPrice,
          totalPrice
        };
      });
    } else if (Array.isArray(bodyItems) && bodyItems.length > 0) {
      // Fallback: build from request body items (validate products and inventory)
      const ids = bodyItems.map(i => i.productId);
      const products = await Product.find({ _id: { $in: ids }, isActive: true });
      const productMap = new Map(products.map(p => [p._id.toString(), p]));

      for (const it of bodyItems) {
        const prod = productMap.get(String(it.productId));
        if (!prod) {
          return res.status(404).json({ message: 'Product not found or inactive', productId: it.productId });
        }
        const qty = Math.max(1, parseInt(it.quantity || 1, 10));
        if (prod.inventory < qty) {
          return res.status(400).json({ message: `Insufficient inventory for ${prod.name}`, availableQuantity: prod.inventory });
        }
        const itemPrice = prod.discountPrice || prod.price;
        const totalPrice = itemPrice * qty;
        subtotal += totalPrice;
        orderItems.push({
          productId: prod._id,
          name: prod.name,
          sku: prod.sku,
          quantity: qty,
          price: prod.price,
          discountPrice: prod.discountPrice,
          totalPrice
        });
      }
    } else {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    // Validate inventory for all items (cart path)
    if (cart && cart.items.length > 0) {
      for (const item of cart.items) {
        if (!item.productId.isAvailable(item.quantity)) {
          return res.status(400).json({
            message: `Insufficient inventory for ${item.productId.name}`,
            availableQuantity: item.productId.inventory
          });
        }
      }
    }

    // Apply coupon if provided
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.canBeUsedBy(req.user._id)) {
        couponDiscount = coupon.calculateDiscount(subtotal);
      }
    }

    // Calculate shipping (free for orders above ₹500)
    const shippingCharges = subtotal >= 500 ? 0 : 50;
    
    // Calculate tax (5% GST)
    const taxAmount = Math.round((subtotal - couponDiscount) * 0.05 * 100) / 100;
    
    const totalAmount = subtotal - couponDiscount + shippingCharges + taxAmount;

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      discountAmount: couponDiscount,
      shippingCharges,
      taxAmount,
      totalAmount,
      couponCode,
      couponDiscount
    });

    await order.save();

    // Update product inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { 
          inventory: -item.quantity,
          totalSales: item.quantity
        }
      });
    }

    // Update coupon usage if applied
    if (couponCode && couponDiscount > 0) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        {
          $inc: { usedCount: 1 },
          $push: {
            usedBy: {
              userId: req.user._id,
              orderId: order._id,
              usedAt: new Date()
            }
          }
        }
      );
    }

    // Clear cart in DB (if exists)
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalItems: 0, totalAmount: 0 }
    );

    // Send confirmation email (non-blocking)
    try {
      await sendOrderConfirmation(req.user.email, req.user.firstName, order);
    } catch (e) {
      console.warn('Order created, but failed to send confirmation email:', e.message);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
      orderId: order.orderId
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name images sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ userId: req.user._id });

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get single order details
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      orderId,
      userId: req.user._id 
    }).populate('items.productId', 'name images sku');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ 
      orderId,
      userId: req.user._id 
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: `Cancelled by customer. Reason: ${reason}`
    });

    await order.save();

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { 
          inventory: item.quantity,
          totalSales: -item.quantity
        }
      });
    }

    res.json({ message: 'Order cancelled successfully', order });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId })
      .select('orderId orderStatus trackingNumber courierService estimatedDelivery deliveredAt statusHistory')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ 
      tracking: {
        orderId: order.orderId,
        status: order.orderStatus,
        trackingNumber: order.trackingNumber,
        courierService: order.courierService,
        estimatedDelivery: order.estimatedDelivery,
        deliveredAt: order.deliveredAt,
        statusHistory: order.statusHistory
      }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ message: 'Failed to track order', error: error.message });
  }
};

// Validate coupon
const validateCoupon = async (req, res) => {
  try {
    const { couponCode, orderAmount } = req.body;

    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({ message: 'Coupon has expired or reached usage limit' });
    }

    if (!coupon.canBeUsedBy(req.user._id)) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    if (orderAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon` 
      });
    }

    const discountAmount = coupon.calculateDiscount(orderAmount);

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discountAmount
      }
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Failed to validate coupon', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
  validateCoupon
};
