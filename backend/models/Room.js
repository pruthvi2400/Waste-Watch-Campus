const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  room_number: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  room_type: {
    type: String,
    required: true,
    enum: ['classroom', 'lab']
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
});

module.exports = mongoose.model('Room', roomSchema);
