const mongoose = require('mongoose');

/**
 * MongoDB Database Connection
 * Minimal configuration for maximum compatibility with serverless
 */

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing connection');
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        console.log('Connecting to DB...');
        const db = await mongoose.connect(process.env.MONGODB_URI);

        isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('DB Connection Error:', error.message);
        throw error;
    }
};

module.exports = connectDB;
