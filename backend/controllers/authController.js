const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/responseFormatter');
const authService = require('../services/authService');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  successResponse(res, result, 201);
});

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const result = await authService.authUser(req.body);
  successResponse(res, result);
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user._id);
  successResponse(res, profile);
});

/**
 * @desc    Logout user (client-side token handling)
 * @route   POST /api/auth/logout
 * @access  Public
 * @note    For stateless JWT, logout is handled client-side by removing the token.
 *          This endpoint exists for API consistency and future token blacklist support.
 */
const logout = asyncHandler(async (req, res) => {
  // With stateless JWT, the server doesn't need to do anything
  // The client should remove the token from storage
  successResponse(res, { message: 'Logged out successfully. Token removal handled client-side.' });
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  logout
};