const express = require('express');
const router = express.Router();
const axios = require('axios');

const Device = require('../models/Device');
const RegisteredDevice = require('../models/RegisteredDevice');

// Assuming the main server URL is defined in your environment or config
const MAIN_SERVER_URL = process.env.MAIN_SERVER_URL || 'http://localhost:3000';

// Utility function to generate a mock IP address
function generateIpAddress() {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// POST /api/devices/create - Create a new device with a unique name
router.post('/create', async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: "Please provide both a name and a type for the device." });
  }

  const existingDevice = await Device.findOne({ name });
  if (existingDevice) {
    return res.status(400).json({ message: "A device with this name already exists." });
  }

  try {
    const ipAddress = generateIpAddress();
    const newDevice = new Device({ name, type, ipAddress, status: 'off' });
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: "Error creating device", error: error.message });
  }
});

// GET /api/devices/list - List all devices (for demonstration or admin use)
router.get('/list', async (req, res) => {
  try {
    const devices = await Device.find({});
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
});

// POST /api/devices/register - Register a device for the current authenticated user
router.post('/register', async (req, res) => {
  const { deviceId, userId } = req.body; // Receive userId from the backend server

  try {
    const device = await Device.findById(deviceId);
    if (!device) return res.status(404).json({ message: "Device not found." });

    const existingRegistration = await RegisteredDevice.findOne({ deviceId, userId });
    if (existingRegistration) {
      return res.status(400).json({ message: "Device already registered by this user." });
    }

    const uniqueName = `${device.name}-${Date.now()}`;
    const registeredDevice = new RegisteredDevice({
      deviceId,
      userId,
      name: uniqueName,
      type: device.type,
      ipAddress: device.ipAddress,
      status: 'off',
    });

    await registeredDevice.save();

    res.json({ message: "Device registered successfully", registeredDevice });
  } catch (error) {
    res.status(500).json({ message: "Error registering device", error: error.message });
  }
});

// POST /api/devices/toggle/:registeredDeviceId - Toggle a device's status
router.post('/toggle/:registeredDeviceId', async (req, res) => {
  const { registeredDeviceId, userId } = req.body; // Updated to include userId

  try {
    const registeredDevice = await RegisteredDevice.findOne({ _id: registeredDeviceId, userId });
    if (!registeredDevice) return res.status(404).send('Registered device not found or not owned by this user.');

    registeredDevice.status = registeredDevice.status === 'on' ? 'off' : 'on';
    await registeredDevice.save();

    res.json({ message: "Device status toggled successfully", registeredDevice });
  } catch (error) {
    res.status(500).json({ message: "Error toggling device status", error: error.message });
  }
});

// GET /api/devices/registered - List all devices registered by the current authenticated user
router.get('/registered', async (req, res) => {
  const { userId } = req.body; // Assume userId is passed as part of the request

  try {
    const devices = await RegisteredDevice.find({ userId });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered devices', error: error.message });
  }
});

module.exports = router;
