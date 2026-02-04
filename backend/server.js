const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// ===================
// Security Middleware
// ===================

// Set security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Disabled for API
}));

// Enable CORS for frontend - Allow all origins for Vercel deployment
app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Body parser - MUST come before routes
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ==============
// Custom Middleware
// ==============

// Request logging
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// ==============
// API Routes
// ==============

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Majid Iqbal Portfolio API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            contact: '/api/contact'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Contact form routes
app.use('/api/contact', contactRoutes);

// ==============
// Error Handling
// ==============

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);

    // Handle CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS: Origin not allowed'
        });
    }

    // Handle JSON parse errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON in request body'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ==============
// Start Server (for local development only)
// ==============

// Only start server if running locally (not on Vercel)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log('');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║   🚀 Portfolio Backend API Server          ║');
        console.log('╠════════════════════════════════════════════╣');
        console.log(`║   📍 Port: ${PORT}                            ║`);
        console.log(`║   🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(16)}    ║`);
        console.log('║   ✅ Status: Running                       ║');
        console.log('╚════════════════════════════════════════════╝');
        console.log('');
        console.log('📝 Available Endpoints:');
        console.log(`   POST   http://localhost:${PORT}/api/contact     - Submit contact form`);
        console.log(`   GET    http://localhost:${PORT}/api/contact     - List all contacts`);
        console.log(`   GET    http://localhost:${PORT}/api/health      - Health check`);
        console.log('');
    });
}

// Export for Vercel serverless
module.exports = app;
