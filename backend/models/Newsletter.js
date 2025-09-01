const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: String,
  lastName: String,
  phone: String,
  preferences: {
    productUpdates: {
      type: Boolean,
      default: true
    },
    healthTips: {
      type: Boolean,
      default: true
    },
    recipes: {
      type: Boolean,
      default: true
    },
    offers: {
      type: Boolean,
      default: true
    }
  },
  source: {
    type: String,
    enum: ['website', 'checkout', 'popup', 'manual'],
    default: 'website'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unsubscribedAt: Date,
  unsubscribeReason: String
}, {
  timestamps: true
});

// Indexes
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);
