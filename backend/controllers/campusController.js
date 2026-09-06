const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormatter');
const campusService = require('../services/campusService');

/**
 * @desc    Get all buildings
 * @route   GET /api/campus/buildings
 * @access  Public
 */
const getBuildings = asyncHandler(async (req, res) => {
  const buildings = await campusService.getBuildings();
  successResponse(res, buildings);
});

/**
 * @desc    Get building details with its floors and rooms
 * @route   GET /api/campus/buildings/:id
 * @access  Public
 */
const getBuildingDetails = asyncHandler(async (req, res) => {
  const building = await campusService.getBuildingDetails(req.params.id);
  successResponse(res, building);
});

/**
 * @desc    Get room details with associated waste reports
 * @route   GET /api/campus/rooms/:id
 * @access  Public
 */
const getRoomDetails = asyncHandler(async (req, res) => {
  const result = await campusService.getRoomDetails(req.params.id);
  successResponse(res, result);
});

module.exports = {
  getBuildings,
  getBuildingDetails,
  getRoomDetails
};
