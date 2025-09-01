const Blog = require('../models/Blog');

// Get all published blogs
const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(filter)
      .populate('author', 'firstName lastName')
      .populate('relatedProducts', 'name images price discountPrice')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBlogs: total
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

// Get single blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    )
    .populate('author', 'firstName lastName')
    .populate('relatedProducts', 'name images price discountPrice sku');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ blog });

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
  }
};

// Get featured blogs
const getFeaturedBlogs = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'firstName lastName')
      .sort({ views: -1, publishedAt: -1 })
      .limit(parseInt(limit))
      .select('title slug excerpt featuredImage category readTime publishedAt');

    res.json({ blogs });

  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({ message: 'Failed to fetch featured blogs', error: error.message });
  }
};

// Admin: Create blog
const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id
    };

    // Handle featured image upload
    if (req.file) {
      blogData.featuredImage = `/uploads/blogs/${req.file.filename}`;
    }

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({ 
      message: 'Blog created successfully', 
      blog 
    });

  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
};

// Admin: Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle new featured image
    if (req.file) {
      updateData.featuredImage = `/uploads/blogs/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog updated successfully', blog });

  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Failed to update blog', error: error.message });
  }
};

// Admin: Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    await Blog.findByIdAndDelete(id);

    res.json({ message: 'Blog deleted successfully' });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
};

// Admin: Get all blogs (including unpublished)
const getAllBlogsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isPublished,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(filter)
      .populate('author', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBlogs: total
      }
    });

  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin
};
