const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret_key_for_jwt'
      );

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return next(ApiError.unauthorized('Not authorized, user not found'));
      }
      return next();
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token has expired'));
      }
      if (error.name === 'JsonWebTokenError') {
        return next(ApiError.unauthorized('Invalid token'));
      }
      return next(ApiError.unauthorized('Not authorized, token failed'));
    }
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized, no token'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.user_type)) {
      return next(ApiError.forbidden('User role not authorized to access this resource'));
    }
    next();
  };
};

module.exports = { protect, authorize };