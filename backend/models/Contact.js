const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['general', 'bulk_inquiry', 'support', 'partnership', 'complaint'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: String,
  respondedAt: Date,
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String],
  attachments: [String],
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
contactSchema.index({ status: 1 });
contactSchema.index({ type: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
