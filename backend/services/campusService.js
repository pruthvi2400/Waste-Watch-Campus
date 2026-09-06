const Building = require('../models/Building');
const Floor = require('../models/Floor');
const Room = require('../models/Room');
const WasteReport = require('../models/WasteReport');
const ApiError = require('../utils/ApiError');

/**
 * Get all buildings
 * @returns {Array} List of all buildings
 */
const getBuildings = async () => {
  const buildings = await Building.find({}).sort({ name: 1 });
  return buildings;
};

/**
 * Get building details with floors and rooms
 * @param {string} buildingId - Building MongoDB ID
 * @returns {Object} Building with floors and rooms
 */
const getBuildingDetails = async (buildingId) => {
  // Find building
  const building = await Building.findById(buildingId);

  if (!building) {
    throw ApiError.notFound('Building not found');
  }

  // Find floors in this building sorted by level
  const floors = await Floor.find({ building: building._id }).sort({ level: 1 });

  // Fetch rooms for each floor
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

  return {
    _id: building._id,
    name: building.name,
    floors: floorsWithRooms
  };
};

/**
 * Get room details with associated waste reports
 * @param {string} roomId - Room MongoDB ID
 * @returns {Object} Room details with reports
 */
const getRoomDetails = async (roomId) => {
  // Find room with populated floor and building
  const room = await Room.findById(roomId)
    .populate({
      path: 'floor',
      populate: { path: 'building' }
    })
    .populate('department', 'name');

  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  // Fetch reports for this room sorted by descending creation time
  const reports = await WasteReport.find({ room: room._id })
    .populate('user', 'username email')
    .sort({ created_at: -1 });

  return {
    room,
    reports
  };
};

/**
 * Check if a room exists by ID
 * @param {string} roomId - Room MongoDB ID
 * @returns {Object} Room document
 */
const getRoomById = async (roomId) => {
  const room = await Room.findById(roomId);
  
  if (!room) {
    throw ApiError.notFound('Room not found');
  }
  
  return room;
};

module.exports = {
  getBuildings,
  getBuildingDetails,
  getRoomDetails,
  getRoomById
};
