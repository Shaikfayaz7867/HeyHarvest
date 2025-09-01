const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pure 4 Suta', 'Refined 5 Suta', 'Reserved 6 Suta', 'Elite 6 Suta']
  },
  size: {
    type: String,
    required: true,
    enum: ['12-16mm', '16-18mm', '18-22mm']
  },
  packSize: {
    type: String,
    required: true,
    default: '200g'
  },
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than original price'
    }
  },
  inventory: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  material: {
    type: String,
    default: 'Premium Makhana'
  },
  colors: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  nutritionInfo: {
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
    calories: String
  },
  benefits: [{
    type: String
  }],
  weight: {
    type: Number, // in grams
    default: 200
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ size: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
  return this.discountPrice || this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.inventory === 0) return 'out_of_stock';
  if (this.inventory <= 10) return 'low_stock';
  return 'in_stock';
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

// Update average rating when reviews change
productSchema.methods.updateRating = async function(newRating, reviewCount) {
  this.averageRating = newRating;
  this.totalReviews = reviewCount;
  await this.save();
};

// Check if product is available for purchase
productSchema.methods.isAvailable = function(quantity = 1) {
  return this.isActive && this.inventory >= quantity;
};

module.exports = mongoose.model('Product', productSchema);
