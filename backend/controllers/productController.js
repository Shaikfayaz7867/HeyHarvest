const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (size) filter.size = size;
    if (featured === 'true') filter.isFeatured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ _id: id, isActive: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({ products });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products', error: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const filter = { isActive: true, category };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

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
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const searchQuery = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(searchQuery)
      .sort({ totalSales: -1, averageRating: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(searchQuery);

    res.json({
      products,
      searchQuery: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getCategories
};
