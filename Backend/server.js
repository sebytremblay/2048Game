const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const gamesRoutes = require('./routes/games');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Use the modularized routes
app.use('/games', gamesRoutes);

app.listen(3000, () => console.log('Server is running on port 3000'));