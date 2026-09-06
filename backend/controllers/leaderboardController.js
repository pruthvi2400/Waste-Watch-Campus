const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormatter');
const leaderboardService = require('../services/leaderboardService');

/**
 * @desc    Get leaderboard rankings
 * @route   GET /api/leaderboard
 * @access  Public
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await leaderboardService.getLeaderboard();
  successResponse(res, leaderboard);
});

module.exports = { getLeaderboard };
