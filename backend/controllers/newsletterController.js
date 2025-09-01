const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, preferences, source = 'website' } = req.body;

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ message: 'Email already subscribed to newsletter' });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.unsubscribedAt = undefined;
        existingSubscription.unsubscribeReason = undefined;
        if (preferences) existingSubscription.preferences = preferences;
        await existingSubscription.save();
        
        return res.json({ message: 'Newsletter subscription reactivated successfully' });
      }
    }

    const subscription = new Newsletter({
      email,
      firstName,
      lastName,
      phone,
      preferences,
      source
    });

    await subscription.save();

    res.status(201).json({ 
      message: 'Successfully subscribed to newsletter' 
    });

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ message: 'Failed to subscribe to newsletter', error: error.message });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email, reason } = req.body;

    const subscription = await Newsletter.findOne({ email, isActive: true });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    subscription.unsubscribeReason = reason;
    await subscription.save();

    res.json({ message: 'Successfully unsubscribed from newsletter' });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to unsubscribe', error: error.message });
  }
};

// Update newsletter preferences
const updatePreferences = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    const subscription = await Newsletter.findOne({ email, isActive: true });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.preferences = { ...subscription.preferences, ...preferences };
    await subscription.save();

    res.json({ 
      message: 'Newsletter preferences updated successfully',
      preferences: subscription.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Failed to update preferences', error: error.message });
  }
};

// Admin: Get all subscribers
const getAllSubscribers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      isActive,
      source,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (source) filter.source = source;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscribers = await Newsletter.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments(filter);

    // Get subscription stats
    const stats = await Newsletter.aggregate([
      {
        $group: {
          _id: '$isActive',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      subscribers,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalSubscribers: total
      }
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ message: 'Failed to fetch subscribers', error: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  updatePreferences,
  getAllSubscribers
};
