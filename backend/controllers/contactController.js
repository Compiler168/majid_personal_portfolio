const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const connectDB = require('../config/db');

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
        // Ensure DB is connected before proceeding (critical for serverless)
        await connectDB();

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
        const ipAddress = req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
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

        // --- EMAIL FUNCTIONALITY ---
        // Only attempt to send email if credentials are setup
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // 1. Admin Notification Options
            const mailOptionsAdmin = {
                from: `"${name}" <${email}>`, // Note: Gmail often overrides 'from' to the auth user, but 'reply-to' works
                replyTo: email,
                to: process.env.EMAIL_USER,
                subject: `New Portfolio Message: ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
                        <h2 style="color: #6366f1;">New Contact Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
                        <p style="font-size: 16px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                        <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888;">Received from: ${ipAddress}</p>
                    </div>
                `
            };

            // 2. Auto-Reply Options
            const mailOptionsUser = {
                from: `"Majid Iqbal" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `Thank you for contacting me! - ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h1 style="color: #6366f1; margin: 0;">Majid Iqbal</h1>
                            <p style="color: #6b7280; font-size: 14px;">UI/UX Designer & Full-Stack Developer</p>
                        </div>
                        <h2 style="color: #1f2937;">Hello ${name},</h2>
                        <p style="color: #374151; line-height: 1.6;">Thank you for reaching out! I successfully received your message regarding "<strong>${subject}</strong>".</p>
                        <p style="color: #374151; line-height: 1.6;">I appreciate your interest in my work. I will review your message and get back to you as soon as possible, usually within 24 hours.</p>
                        <br>
                        <p style="color: #374151;">Best Regards,</p>
                        <strong style="color: #6366f1;">Majid Iqbal</strong>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated response. Please do not reply to this email directly.</p>
                    </div>
                `
            };

            // Send Emails in background
            Promise.all([
                transporter.sendMail(mailOptionsAdmin),
                transporter.sendMail(mailOptionsUser)
            ]).then(() => {
                console.log('✅ Emails sent successfully');
            }).catch(err => {
                console.error('❌ Error sending emails:', err);
            });

        } else {
            console.warn('⚠️ Email credentials not found. Skipping email sending.');
        }

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
        if (error.name === 'ValidationError' && error.errors) {
            const messages = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message || 'Validation error'
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
            message: 'Server error: ' + error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
