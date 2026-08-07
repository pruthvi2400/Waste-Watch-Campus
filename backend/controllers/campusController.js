const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const WasteReport = require('../models/WasteReport');

// @desc    Get all buildings
// @route   GET /api/campus/buildings
// @access  Public
const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find({});
    res.json(buildings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching buildings', error: error.message });
  }
};

// @desc    Get building details with its floors and rooms
// @route   GET /api/campus/buildings/:id
// @access  Public
const getBuildingDetails = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }

    // Find floors in this building sorted by level
    const floors = await Floor.find({ building: building._id }).sort({ level: 1 });

    // For each floor, fetch rooms
    const floorsWithRooms = await Promise.all(
      floors.map(async (floor) => {
        const rooms = await Room.find({ floor: floor._id }).populate('department', 'name');
        return {
          _id: floor._id,
          name: floor.name,
          level: floor.level,
          rooms: rooms
        };
      })
    );

    res.json({
      _id: building._id,
      name: building.name,
      floors: floorsWithRooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching building details', error: error.message });
  }
};

// @desc    Get room details with associated waste reports
// @route   GET /api/campus/rooms/:id
// @access  Public
const getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: 'floor',
        populate: { path: 'building' }
      })
      .populate('department', 'name');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Fetch reports for this room sorted by descending creation time
    const reports = await WasteReport.find({ room: room._id })
      .populate('user', 'username email')
      .sort({ created_at: -1 });

    res.json({
      room,
      reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching room details', error: error.message });
  }
};

module.exports = {
  getBuildings,
  getBuildingDetails,
  getRoomDetails
};
