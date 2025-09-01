const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  adminResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, isApproved: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Update product rating when review is approved
reviewSchema.post('save', async function() {
  if (this.isApproved) {
    const Product = mongoose.model('Product');
    const reviews = await mongoose.model('Review').find({
      productId: this.productId,
      isApproved: true
    });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(this.productId, {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      });
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
