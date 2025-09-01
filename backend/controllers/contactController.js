const Contact = require('../models/Contact');
const { sendBulkInquiryNotification } = require('../services/smsService');

// Create new contact inquiry
const createContact = async (req, res) => {
  try {
    const contactData = req.body;
    
    // If user is authenticated, link the contact to user
    if (req.user) {
      contactData.userId = req.user._id;
    }

    const contact = new Contact(contactData);
    await contact.save();

    // Send SMS notification for bulk inquiries
    if (contactData.type === 'bulk_inquiry') {
      await sendBulkInquiryNotification(
        contactData.phone, 
        contactData.name, 
        contactData.quantity || 'bulk'
      );
    }

    res.status(201).json({ 
      message: 'Your inquiry has been submitted successfully. We will contact you soon.', 
      contactId: contact._id 
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
  }
};

// Admin: Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalContacts: total
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

// Admin: Update contact status
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response, priority, assignedTo } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (response) {
      updateData.response = response;
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.user._id;
    }
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    
    updateData.isRead = true;

    const contact = await Contact.findByIdAndUpdate(id, updateData, { 
      new: true 
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact updated successfully', contact });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Failed to update contact', error: error.message });
  }
};

// Admin: Delete contact
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await Contact.findByIdAndDelete(id);

    res.json({ message: 'Contact deleted successfully' });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
};
