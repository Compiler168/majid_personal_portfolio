const mongoose = require('mongoose');

/**
 * MongoDB Database Connection Configuration
 * Optimized for Serverless Environments (Vercel)
 * Caches the connection to prevent multiple connections across invocations
 */

let cachedConnection = null;

const connectDB = async () => {
    // If we have a cached connection and it's still connected, use it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('🔄 Using cached MongoDB connection');
        return cachedConnection;
    }

    try {
        console.log('📡 Connecting to MongoDB Atlas...');

        // Mongoose options for stable connection in serverless
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false, // Disable buffering to fail fast if connection drops
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        cachedConnection = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // In serverless, we don't want to process.exit(1) as it kills the function container
        // Instead, we throw the error so the request handler can catch it
        throw error;
    }
};

module.exports = connectDB;
