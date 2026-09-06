/**
 * useLeaderboard Hook
 * Provides leaderboard data with loading and error states
 */
import { useState, useCallback } from 'react';
import leaderboardService from '../services/leaderboardService';

/**
 * @typedef {Object} LeaderboardData
 * @property {Array} overall_scores
 * @property {Object} college_data
 */

/**
 * @typedef {Object} UseLeaderboardReturn
 * @property {Array} overallScores
 * @property {Object} collegeData
 * @property {boolean} loading
 * @property {string|null} error
 * @property {Function} fetchLeaderboard
 */

export const useLeaderboard = () => {
  const [overallScores, setOverallScores] = useState([]);
  const [collegeData, setCollegeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch leaderboard data
   */
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await leaderboardService.getLeaderboard();
    if (result.success) {
      setOverallScores(result.data.overall_scores);
      setCollegeData(result.data.college_data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  /**
   * Clear leaderboard data
   */
  const clearLeaderboard = useCallback(() => {
    setOverallScores([]);
    setCollegeData({});
    setError(null);
  }, []);

  return {
    overallScores,
    collegeData,
    loading,
    error,
    fetchLeaderboard,
    clearLeaderboard
  };
};

export default useLeaderboard;
