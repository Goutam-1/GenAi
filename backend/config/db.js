
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Do not call process.exit(1) so the express server remains running on port 8080.
  }
};

mongoose.connection.once("open", () => {
  console.log("Connected DB Name:", mongoose.connection.db.databaseName);
});

export default connectDB;
