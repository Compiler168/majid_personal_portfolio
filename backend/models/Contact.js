const mongoose = require('mongoose');

/**
 * Contact Schema
 * Stores contact form submissions with validation
 */
const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ],
        maxlength: [255, 'Email cannot exceed 255 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        minlength: [3, 'Subject must be at least 3 characters'],
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [5000, 'Message cannot exceed 5000 characters']
    },
    ipAddress: {
        type: String,
        default: 'Unknown'
    },
    userAgent: {
        type: String,
        default: 'Unknown'
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied', 'archived'],
        default: 'unread'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for faster queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
ContactSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for formatted date
ContactSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

module.exports = mongoose.model('Contact', ContactSchema);
