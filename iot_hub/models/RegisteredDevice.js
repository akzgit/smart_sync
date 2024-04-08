const mongoose = require('mongoose');

const registeredDeviceSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  name: String,
  type: String,
  status: { type: String, default: 'off' },
  ipAddress: String,
  totalUsage: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('RegisteredDevice', registeredDeviceSchema);
