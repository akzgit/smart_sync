const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const axios = require('axios');
const auth = require('./authRoutes')

const MAIN_SERVER_URL = 'http://localhost:3000';

function generateIpAddress() {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

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
        const newDevice = new Device({ name, type, ipAddress, status: 'off', registered: false });
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ message: "Error creating device", error: error.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        const devices = await Device.find({});
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching devices', error: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { deviceId } = req.body;
    const userId = req.session.userId; // Now using session to get userId
    const userid=auth.userid;
    if (!userid) {
        return res.status(403).json({ message: "Authentication required"+userid });
    }

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({ message: "Device not found." });
        }

        if (device.registered) {
            return res.status(400).json({ message: "This device is already registered." });
        }

        device.registered = true;
        await device.save();

        const response = await axios.post(`${MAIN_SERVER_URL}/api/devices/register`, {
            deviceId,
            userid
        });

        res.json({ message: 'Device registered successfully', data: response.data });
    } catch (error) {
        console.error("Failed to register device:", error.message);
        res.status(500).json({ message: 'Failed to register device', error: error.toString() });
    }
});

router.post('/toggle/:registeredDeviceId', async (req, res) => {
    const { registeredDeviceId } = req.params;

    try {
        const device = await Device.findById(registeredDeviceId);
        if (!device || !device.registered) {
            return res.status(404).json({ message: "Registered device not found or not registered." });
        }

        device.status = device.status === 'on' ? 'off' : 'on';
        await device.save();

        res.json({ message: 'Device status toggled successfully', device });
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle device status', error: error.toString() });
    }
});

router.post('/registrationComplete', async (req, res) => {
    const { deviceId, userId } = req.body;
    console.log(`Device with ID ${deviceId} registered by user ${userId} successfully.`);
    res.json({ message: 'Registration acknowledged by the main server.' });
});

module.exports = router;
