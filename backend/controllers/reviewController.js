const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Create new review
const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment } = req.body;

    // Verify user has purchased this product
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
      'items.productId': productId,
      orderStatus: 'delivered'
    });

    if (!order) {
      return res.status(400).json({ 
        message: 'You can only review products you have purchased and received' 
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      userId: req.user._id,
      productId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this product' 
      });
    }

    // Handle uploaded images
    let reviewImages = [];
    if (req.files && req.files.length > 0) {
      reviewImages = req.files.map(file => `/uploads/reviews/${file.filename}`);
    }

    const review = new Review({
      userId: req.user._id,
      productId,
      orderId,
      rating,
      title,
      comment,
      images: reviewImages,
      isVerified: true, // Since user purchased the product
      isApproved: true  // Auto-approve verified purchase reviews
    });

    await review.save();

    res.status(201).json({ 
      message: 'Review submitted and published successfully.', 
      review 
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = { 
      productId, 
      isApproved: true 
    };

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('userId', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const mongoose = require('mongoose');
    const ratingDistribution = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      reviews,
      ratingDistribution,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ userId: req.user._id })
      .populate('productId', 'name images sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ userId: req.user._id });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update review
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    
    // Reset approval status for moderation
    review.isApproved = false;

    await review.save();

    res.json({ message: 'Review updated successfully', review });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review marked as helpful', helpfulCount: review.helpfulCount });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Failed to mark review as helpful', error: error.message });
  }
};

// Admin: Moderate review
const moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved, adminResponse } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isApproved = isApproved;
    
    if (adminResponse) {
      review.adminResponse = {
        message: adminResponse,
        respondedAt: new Date(),
        respondedBy: req.user._id
      };
    }

    await review.save();

    res.json({ message: 'Review moderated successfully', review });

  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({ message: 'Failed to moderate review', error: error.message });
  }
};

// Admin: Get all reviews for moderation
const getAllReviewsAdmin = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      isApproved,
      productId,
      rating 
    } = req.query;

    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (productId) filter.productId = productId;
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('productId', 'name sku images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total
      }
    });

  } catch (error) {
    console.error('Get admin reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  moderateReview,
  getAllReviewsAdmin
};
