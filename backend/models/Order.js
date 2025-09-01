const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number,
  totalPrice: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['razorpay', 'stripe', 'cod', 'bank_transfer']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentId: String,
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  courierService: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  subtotal: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingCharges: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  couponCode: String,
  couponDiscount: {
    type: Number,
    default: 0
  },
  notes: String,
  adminNotes: String,
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  cancellationReason: String,
  returnReason: String,
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'processed'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ userId: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order ID before validation so required validator passes
orderSchema.pre('validate', function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderId = `HH${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus') && !this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date()
    });
  }
  next();
});

// Methods
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  return this.save();
};

orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.orderStatus);
};

orderSchema.methods.canBeReturned = function() {
  return this.orderStatus === 'delivered' && 
         this.deliveredAt && 
         (Date.now() - this.deliveredAt.getTime()) <= (7 * 24 * 60 * 60 * 1000); // 7 days
};

module.exports = mongoose.model('Order', orderSchema);
