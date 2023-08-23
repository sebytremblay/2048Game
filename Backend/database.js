const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@2048game.qs2ehlb.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;