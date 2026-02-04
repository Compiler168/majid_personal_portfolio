const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

/**
 * Contact Form Validation Rules
 * These ensure data integrity before saving to database
 */
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 }).withMessage('Email cannot exceed 255 characters'),

    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
];

/**
 * @route   POST /api/contact
 * @desc    Submit a new contact form
 * @access  Public
 */
router.post('/', contactValidation, contactController.submitContact);

/**
 * @route   GET /api/contact/stats
 * @desc    Get contact statistics
 * @access  Private/Admin (no auth for now)
 */
router.get('/stats', contactController.getContactStats);

/**
 * @route   GET /api/contact
 * @desc    Get all contact submissions
 * @access  Private/Admin (no auth for now)
 */
router.get('/', contactController.getAllContacts);

/**
 * @route   GET /api/contact/:id
 * @desc    Get single contact by ID
 * @access  Private/Admin (no auth for now)
 */
router.get('/:id', contactController.getContactById);

/**
 * @route   PUT /api/contact/:id/status
 * @desc    Update contact status
 * @access  Private/Admin (no auth for now)
 */
router.put('/:id/status', contactController.updateContactStatus);

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete a contact submission
 * @access  Private/Admin (no auth for now)
 */
router.delete('/:id', contactController.deleteContact);

module.exports = router;
