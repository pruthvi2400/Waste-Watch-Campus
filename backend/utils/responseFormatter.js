/**
 * Standard API response formatter
 * Maintains backward compatibility with frontend expectations
 */

/**
 * Send success response
 * For objects: spreads properties to top level along with success
 * For arrays: wraps in data property along with success
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data, statusCode = 200) => {
  const response = { success: true };
  
  if (Array.isArray(data)) {
    // For arrays, wrap in data property
    response.data = data;
  } else if (typeof data === 'object' && data !== null) {
    // For objects, spread to top level (for direct property access)
    Object.assign(response, data);
  } else {
    // For primitives, wrap in data property
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send success response with message
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data (optional)
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponseWithMessage = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };
  
  if (data !== null) {
    if (Array.isArray(data)) {
      response.data = data;
    } else if (typeof data === 'object' && data !== null) {
      // Spread object properties to top level
      Object.assign(response, data);
    } else {
      response.data = data;
    }
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Array} errors - Additional error details
 * @param {number} statusCode - HTTP status code (default: 400)
 */
const errorResponse = (res, message, errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors })
  });
};

module.exports = {
  successResponse,
  successResponseWithMessage,
  errorResponse
};