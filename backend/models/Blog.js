const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['health', 'recipes', 'farming', 'nutrition', 'lifestyle', 'news']
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ title: 'text', content: 'text' });

// Generate slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Set published date when publishing
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
