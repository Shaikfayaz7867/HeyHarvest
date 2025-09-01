const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const path = require('path');
const fs = require('fs');

// Product Management

// Create new product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Handle uploaded images (store as base64 data URLs)
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => {
        const base64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${base64}`;
      });
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ 
      message: 'Product created successfully', 
      product 
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle new uploaded images (store as base64 data URLs)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => {
        const base64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${base64}`;
      });
      
      // If keeping existing images, merge them
      if (updateData.keepExistingImages === 'true') {
        const existingProduct = await Product.findById(id);
        updateData.images = [...(existingProduct.images || []), ...newImages];
      } else {
        updateData.images = newImages;
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images (only legacy disk images)
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        if (typeof imagePath === 'string' && imagePath.startsWith('/uploads/')) {
          const fullPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

// Get all products for admin (including inactive)
const getAllProductsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Order Management

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .populate('items.productId', 'name sku images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, courierService, estimatedDelivery, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order details
    if (status) order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierService) order.courierService = courierService;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    if (notes) order.adminNotes = notes;

    // Add to status history
    order.statusHistory.push({
      status: status || order.orderStatus,
      timestamp: new Date(),
      note: notes,
      updatedBy: req.user._id
    });

    // Set delivered date if status is delivered
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // TODO: Send notification email/SMS to customer

    res.json({ message: 'Order updated successfully', order });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

// Customer Management

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const filter = { role: 'USER' };
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const customers = await User.find(filter)
      .select('-password -emailVerificationToken -phoneVerificationOTP -resetPasswordToken')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCustomers: total
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
};

// Analytics Dashboard

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // Total counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'USER' });
    const totalOrders = await Order.countDocuments();
    
    // Recent orders
    const recentOrders = await Order.countDocuments({ 
      createdAt: { $gte: startDate } 
    });
    
    // Revenue calculation
    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Order status distribution
    const orderStatusData = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      isActive: true,
      inventory: { $lte: 10 }
    }).select('name sku inventory').limit(10);

    res.json({
      summary: {
        totalProducts,
        totalCustomers,
        totalOrders,
        recentOrders,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        averageOrderValue: revenueData[0]?.averageOrderValue || 0
      },
      orderStatusDistribution: orderStatusData,
      topSellingProducts: topProducts,
      lowStockProducts
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

// Category Management

// Create category
const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({ 
      message: 'Category created successfully', 
      category 
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully', category });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products' 
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getDashboardAnalytics,
  createCategory,
  updateCategory,
  deleteCategory
};
