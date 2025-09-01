const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  couponCode: String,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  
  this.totalAmount = this.items.reduce((total, item) => {
    const itemPrice = item.discountPrice || item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  this.lastModified = new Date();
  next();
});

// Methods
cartSchema.methods.addItem = function(productId, quantity, price, discountPrice) {
  const existingItem = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      productId,
      quantity,
      price,
      discountPrice
    });
  }
  
  return this.save();
};

cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  return this.save();
};

cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    item.quantity = quantity;
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
