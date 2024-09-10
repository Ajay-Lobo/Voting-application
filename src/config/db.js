import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {logger} from './index.js'; // Correct import for the logger

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`); // Use logger for info
  } catch (error) {
    logger.error(`Error: ${error.message}`); // Use logger for errors
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
