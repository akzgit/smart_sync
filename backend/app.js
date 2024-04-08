// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // If using MongoDB to store sessions
require('dotenv').config();

// Import middleware and routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

// Initialize the Express application
const app = express();

// Configure CORS to allow credentials
const corsOptions = {
  origin: 'http://localhost:4200', // Adjust as per your frontend app's URL
  credentials: true, // Important for sessions to work across different origins
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Session configuration
app.use(session({
  secret: '1234', // Use a real secret in production
  resave: false,
  saveUninitialized: false, // Changed to false for better security with uninitialized sessions
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Store sessions in MongoDB
  cookie: {
    secure: false, // Set to true if you're using https
    httpOnly: true, // Recommended to prevent client-side JS from accessing the cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
