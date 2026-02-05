const mongoose = require('mongoose');

/**
 * MongoDB Database Connection
 */

let isConnected = false;

const connectDB = async () => {
    // If already connected, don't reconnect
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is missing in environment variables');
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        console.log('📡 Attempting to connect to MongoDB...');

        // Settings for better stability
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        };

        const db = await mongoose.connect(process.env.MONGODB_URI, options);

        isConnected = db.connections[0].readyState === 1;
        console.log('✅ Connected to MongoDB Atlas');

        // Listen for connection errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('❌ MongoDB Connection Error:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB Disconnected');
            isConnected = false;
        });

    } catch (error) {
        console.error('❌ DB Connection Failed:', error.message);
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;
