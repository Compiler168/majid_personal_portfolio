const mongoose = require('mongoose');
const uri = "mongodb+srv://designagency68_db_user:AlaSknnOpxaE8Fu3@cluster0.majiw94.mongodb.net/majid_personal_portfolio?retryWrites=true&w=majority";

async function testConnection() {
    try {
        console.log("Testing connection with 5s timeout...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        await mongoose.disconnect();
    } catch (err) {
        console.error("FAILURE: Could not connect to MongoDB Atlas");
        console.error(err.name + ": " + err.message);
    }
}

testConnection();
