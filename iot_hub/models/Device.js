const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['smart bulb', 'smart switch', 'smart socket'] },
  status: { type: String, required: true, default: 'off' },
  ipAddress: { type: String, required: true },
  registered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);