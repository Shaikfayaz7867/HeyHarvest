const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'name images price discountPrice inventory isActive');

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => item.productId && item.productId.isActive);
    
    res.json({ cart });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check inventory
    if (product.inventory < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient inventory',
        availableQuantity: product.inventory
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.inventory < newQuantity) {
        return res.status(400).json({ 
          message: 'Cannot add more items. Insufficient inventory',
          availableQuantity: product.inventory,
          currentInCart: cart.items[existingItemIndex].quantity
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        discountPrice: product.discountPrice
      });
    }

    await cart.save();
    
    // Populate and return updated cart
    await cart.populate('items.productId', 'name images price discountPrice inventory isActive');

    res.json({ 
      message: 'Item added to cart successfully', 
      cart 
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
    } else {
      // Validate product and inventory
      const product = await Product.findOne({ _id: productId, isActive: true });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.inventory < quantity) {
        return res.status(400).json({ 
          message: 'Insufficient inventory',
          availableQuantity: product.inventory
        });
      }

      // Update quantity
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price;
        cart.items[itemIndex].discountPrice = product.discountPrice;
      } else {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
    }

    await cart.save();
    await cart.populate('items.productId', 'name images price discountPrice inventory isActive');

    res.json({ 
      message: 'Cart updated successfully', 
      cart 
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.productId', 'name images price discountPrice inventory isActive');

    res.json({ 
      message: 'Item removed from cart successfully', 
      cart 
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ 
      message: 'Cart cleared successfully', 
      cart 
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
