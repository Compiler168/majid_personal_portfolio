const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// Enable CORS for frontend
const corsOptions = {
    origin: function (origin, callback) {
        // Allow all origins in development and production
        // For production, you can restrict to specific domains
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5500',
            'http://localhost:8080',
            process.env.FRONTEND_URL,
            // Allow Vercel deployments
            /\.vercel\.app$/,
            /\.vercel\.com$/
        ].filter(Boolean);

        // Allow requests with no origin (file://, mobile apps, curl, postman)
        if (!origin) {
            return callback(null, true);
        }

        // Check if origin matches any allowed origin
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            // In development, allow all origins
            if (process.env.NODE_ENV !== 'production') {
                callback(null, true);
            } else {
                callback(null, true); // Allow all for now, can be restricted later
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter rate limiting for contact form to prevent spam
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 contact submissions per hour
    message: {
        success: false,
        message: 'Too many contact submissions from this IP. Please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiters
app.use('/api', apiLimiter);
app.use('/api/contact', contactLimiter);

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ==============
// Custom Middleware
// ==============

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
    });
}

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
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==============
// Start Server (for local development)
// ==============

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
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
        console.log(`   GET    http://localhost:${PORT}/api/contact/:id - Get single contact`);
        console.log(`   PUT    http://localhost:${PORT}/api/contact/:id/status - Update status`);
        console.log(`   DELETE http://localhost:${PORT}/api/contact/:id - Delete contact`);
        console.log(`   GET    http://localhost:${PORT}/api/health      - Health check`);
        console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('👋 SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('🛑 HTTP server closed');
            process.exit(0);
        });
    });

    process.on('unhandledRejection', (err) => {
        console.error('❌ Unhandled Promise Rejection:', err);
        server.close(() => process.exit(1));
    });
}

// Export for Vercel serverless
module.exports = app;
