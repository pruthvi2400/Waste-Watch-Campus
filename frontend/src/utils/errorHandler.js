/**
 * Centralized error handling utility for the frontend
 * Parses API errors and returns user-friendly messages
 */

/**
 * Extract a user-friendly error message from an error response
 * @param {Error} error - The error object (usually from axios)
 * @param {string} fallbackMessage - Default message if extraction fails
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, fallbackMessage = 'An unexpected error occurred') => {
  // Handle axios errors
  if (error?.response?.data) {
    const { data } = error.response;
    
    // Check for structured error response: { success: false, message, errors }
    if (data.success === false) {
      // Return the main message if available
      if (data.message) {
        return data.message;
      }
      // Handle validation errors array
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0]?.msg || data.errors[0]?.message || fallbackMessage;
      }
    }
    
    // Fallback to direct message property
    if (data.message) {
      return data.message;
    }
    
    // Handle specific status codes
    if (error.response.status === 401) {
      return 'Authentication failed. Please log in again.';
    }
    if (error.response.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response.status === 500) {
      return 'Server error. Please try again later.';
    }
  }
  
  // Handle network errors
  if (error?.message?.includes('Network Error')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Handle timeout errors
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  
  // Fallback to the error's own message or the provided fallback
  return error?.message || fallbackMessage;
};

/**
 * Check if an error indicates an authentication failure
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  if (error?.response?.status === 401) {
    const message = error?.response?.data?.message || '';
    return message.includes('token') || message.includes('auth') || message.includes('login');
  }
  return false;
};

/**
 * Check if an error indicates a permission/authorization failure
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export const isForbiddenError = (error) => {
  return error?.response?.status === 403;
};

export default {
  getErrorMessage,
  isAuthError,
  isForbiddenError
};
