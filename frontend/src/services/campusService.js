/**
 * Campus Service
 * Handles all campus-related API calls (buildings, floors, rooms)
 */
import api from '../api/axios';

/**
 * Get all buildings on campus
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getBuildings = async () => {
  try {
    const response = await api.get('/api/campus/buildings');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch buildings'
    };
  }
};

/**
 * Get detailed information about a specific building
 * @param {string} buildingId 
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getBuilding = async (buildingId) => {
  try {
    const response = await api.get(`/api/campus/buildings/${buildingId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch building details'
    };
  }
};

/**
 * Get detailed information about a specific room
 * @param {string} roomId 
 * @returns {Promise<{success: boolean, data?: {room: object, reports: array}, error?: string}>}
 */
export const getRoom = async (roomId) => {
  try {
    const response = await api.get(`/api/campus/rooms/${roomId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch room details'
    };
  }
};

export default {
  getBuildings,
  getBuilding,
  getRoom
};
