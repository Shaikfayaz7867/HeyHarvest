const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed', 'free_shipping']
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  maximumDiscountAmount: Number,
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1 // how many times one user can use this coupon
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [String],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }]
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Methods
couponSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         this.validFrom <= now && 
         this.validUntil >= now &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
};

couponSchema.methods.canBeUsedBy = function(userId) {
  if (!this.isValid()) return false;
  
  const userUsage = this.usedBy.filter(usage => 
    usage.userId.toString() === userId.toString()
  ).length;
  
  return userUsage < this.userUsageLimit;
};

couponSchema.methods.calculateDiscount = function(orderAmount, products = []) {
  if (!this.isValid()) return 0;
  
  // Check minimum order amount
  if (orderAmount < this.minimumOrderAmount) return 0;
  
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderAmount * this.value) / 100;
      if (this.maximumDiscountAmount) {
        discount = Math.min(discount, this.maximumDiscountAmount);
      }
      break;
    case 'fixed':
      discount = Math.min(this.value, orderAmount);
      break;
    case 'free_shipping':
      // This would be handled in shipping calculation
      discount = 0;
      break;
  }
  
  return Math.round(discount * 100) / 100;
};

module.exports = mongoose.model('Coupon', couponSchema);
