const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  severity: { type: String, required: true, enum: ['low', 'medium', 'high', 'critical'] },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, trim: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  contactName: { type: String, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  contactEmail: { type: String, trim: true },
  anonymous: { type: Boolean, default: false },
  status: { type: String, default: 'Active', enum: ['Active', 'Monitoring', 'Resolved'] }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);


