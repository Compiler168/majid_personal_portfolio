const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

/**
 * Contact Controller
 * Handles all contact form related operations
 */

/**
 * @desc    Submit a new contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }

        const { name, email, subject, message } = req.body;

        // Get client IP and user agent for security logging
        const ipAddress = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            'Unknown';
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Create new contact submission
        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
            ipAddress,
            userAgent
        });

        console.log(`📧 New contact submission from: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully! I will get back to you soon.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                submittedAt: contact.createdAt
            }
        });

    } catch (error) {
        console.error('Contact submission error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        // Handle duplicate entry (if needed)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry detected'
            });
        }

        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message. Please try again later.'
        });
    }
};

/**
 * @desc    Get all contact submissions (Admin only - for future use)
 * @route   GET /api/contact
 * @access  Private/Admin
 */
exports.getAllContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Query with optional status filter
        const query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            count: contacts.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            data: contacts
        });

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact submissions'
        });
    }
};

/**
 * @desc    Get single contact by ID
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Error fetching contact:', error);

        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching contact submission'
        });
    }
};

/**
 * @desc    Update contact status
 * @route   PUT /api/contact/:id/status
 * @access  Private/Admin
 */
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['unread', 'read', 'replied', 'archived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Status updated to '${status}'`,
            data: contact
        });

    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact status'
        });
    }
};

/**
 * @desc    Delete a contact submission
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact submission deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact submission'
        });
    }
};

/**
 * @desc    Get contact statistics
 * @route   GET /api/contact/stats
 * @access  Private/Admin
 */
exports.getContactStats = async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Contact.countDocuments();
        const today = await Contact.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                today,
                byStatus: stats.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        console.error('Error fetching contact stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
};
