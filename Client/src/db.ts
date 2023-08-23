import mongoose from 'mongoose';
require('dotenv').config();

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@2048game.qs2ehlb.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:');
  }
};

export default connectDB;
