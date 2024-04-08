const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const deviceRoutes = require('./routes/deviceRoutes'); // Ensure this path matches your project structure

const app = express();

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use cors middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/smart_home_dashboard')
.then(() => console.log('IoT Hub connected to MongoDB.'))
.catch((err) => console.error('IoT Hub could not connect to MongoDB:', err));

// Use device routes for handling device-related requests
app.use('/api/devices', deviceRoutes);

// A simple route for root to test if the IoT Hub is running
app.get('/', (req, res) => {
  res.send('IoT Hub is up and running.');
});

// Define the port for the IoT Hub to listen on
const PORT = process.env.PORT || 3001; // Make sure this is different from your main server
app.listen(PORT, () => {
  console.log(`IoT Hub listening on port ${PORT}`);
});
