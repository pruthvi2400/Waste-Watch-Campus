const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  images: {
    type: [String], // Array of URLs / Cloudinary URLs
    default: []
  },
  waste_type: {
    type: String,
    required: true,
    default: 'Unknown'
  },
  severity: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium', 'Low', 'Unknown'],
    default: 'Unknown'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('WasteReport', wasteReportSchema);
