/**
 * Leaderboard Service
 * Handles leaderboard-related API calls
 */
import api from '../api/axios';

/**
 * Get the campus leaderboard data
 * @returns {Promise<{success: boolean, data?: {overall_scores: array, college_data: object}, error?: string}>}
 */
export const getLeaderboard = async () => {
  try {
    const response = await api.get('/api/leaderboard');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch leaderboard'
    };
  }
};

export default {
  getLeaderboard
};
