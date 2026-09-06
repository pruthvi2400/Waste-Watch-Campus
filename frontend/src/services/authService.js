/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import api from '../api/axios';

/**
 * Login user with username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login', { username, password });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

/**
 * Register a new user
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @param {string} user_type - 'student', 'teacher', or 'cleaning_staff'
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const register = async (username, email, password, user_type) => {
  try {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
      user_type
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};

/**
 * Get current user profile
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/api/auth/profile');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
};

/**
 * Logout user (client-side only - backend is stateless JWT)
 * @returns {void}
 */
export const logout = () => {
  localStorage.removeItem('token');
};

export default {
  login,
  register,
  getProfile,
  logout
};
