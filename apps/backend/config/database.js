import mongoose from 'mongoose';

// Establish a single MongoDB connection for the API server.
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected successfully to ${connection.connection.host}`);
    } catch (error) {
        // Exit immediately so the server does not run without a DB.
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
