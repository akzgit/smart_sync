const axios = require('axios');

// URL of the IoT Hub
const IoT_HUB_URL = 'http://localhost:3001/api/devices';

// Function to register a device with the IoT Hub
const registerDevice = async (deviceId, userId) => {
  try {
    // Include userId in the request body
    const response = await axios.post(`${IoT_HUB_URL}/register`, { deviceId, userId });
    console.log('Registration response:', response.data);
    return response.data; // Contains the registered device details
  } catch (error) {
    console.error('Error registering device with IoT Hub:', error.response?.data || error.message);
    throw error;
  }
};

// Updated function to toggle a device's status via the IoT Hub, now expects and sends userId
const toggleDeviceStatus = async (registeredDeviceId, userId) => {
  try {
    // Include userId in the request body
    const response = await axios.post(`${IoT_HUB_URL}/toggle`, { registeredDeviceId, userId });
    console.log('Toggle status response:', response.data);
    return response.data; // Contains the updated device status
  } catch (error) {
    console.error('Error toggling device status:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { registerDevice, toggleDeviceStatus };