const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  }
});

module.exports = mongoose.model('Floor', floorSchema);
