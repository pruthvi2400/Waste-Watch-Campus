const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Generate JWT token for user
 * @param {string} userId - User's MongoDB ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'secret_key_for_jwt',
    { expiresIn: '30d' }
  );
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} Created user and token
 */
const registerUser = async (userData) => {
  const { username, email, password, user_type } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email && existingUser.username === username) {
      throw ApiError.conflict('User already exists with that email and username');
    } else if (existingUser.email === email) {
      throw ApiError.conflict('User already exists with that email');
    } else {
      throw ApiError.conflict('User already exists with that username');
    }
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    user_type: user_type || 'student'
  });

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      user_type: user.user_type
    },
    token
  };
};

/**
 * Authenticate user and return token
 * @param {Object} credentials - Login credentials
 * @returns {Object} Authenticated user and token
 */
const authUser = async (credentials) => {
  const { username, password } = credentials;

  // Find user by username
  const user = await User.findOne({ username });

  if (!user) {
    throw ApiError.unauthorized('Invalid username or password');
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw ApiError.unauthorized('Invalid username or password');
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      user_type: user.user_type
    },
    token
  };
};

/**
 * Get user profile by ID
 * @param {string} userId - User's MongoDB ID
 * @returns {Object} User profile
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    user_type: user.user_type,
    created_at: user.created_at
  };
};

/**
 * Get user by ID (for internal use)
 * @param {string} userId - User's MongoDB ID
 * @returns {Object} User document
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  
  return user;
};

/**
 * Logout is handled client-side since we're using stateless JWT.
 * The client simply discards the token.
 * Server-side token blacklist can be added later if needed.
 */

module.exports = {
  generateToken,
  registerUser,
  authUser,
  getUserProfile,
  getUserById
};
