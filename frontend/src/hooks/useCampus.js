/**
 * useCampus Hook
 * Provides campus data (buildings, floors, rooms) with loading and error states
 */
import { useState, useEffect, useCallback } from 'react';
import campusService from '../services/campusService';

/**
 * @typedef {Object} UseCampusReturn
 * @property {Array} buildings
 * @property {Object|null} currentBuilding
 * @property {Object|null} currentRoom
 * @property {boolean} loading
 * @property {string|null} error
 * @property {Function} fetchBuildings
 * @property {Function} fetchBuilding
 * @property {Function} fetchRoom
 */

export const useCampus = () => {
  const [buildings, setBuildings] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all buildings
   */
  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await campusService.getBuildings();
    if (result.success) {
      setBuildings(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  /**
   * Fetch a single building by ID
   * @param {string} buildingId 
   */
  const fetchBuilding = useCallback(async (buildingId) => {
    setLoading(true);
    setError(null);
    const result = await campusService.getBuilding(buildingId);
    if (result.success) {
      setCurrentBuilding(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  /**
   * Fetch a single room by ID
   * @param {string} roomId 
   */
  const fetchRoom = useCallback(async (roomId) => {
    setLoading(true);
    setError(null);
    const result = await campusService.getRoom(roomId);
    if (result.success) {
      setCurrentRoom(result.data.room);
      return result.data; // Also return reports if needed
    } else {
      setError(result.error);
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * Clear current building selection
   */
  const clearBuilding = useCallback(() => {
    setCurrentBuilding(null);
  }, []);

  /**
   * Clear current room selection
   */
  const clearRoom = useCallback(() => {
    setCurrentRoom(null);
  }, []);

  return {
    buildings,
    currentBuilding,
    currentRoom,
    loading,
    error,
    fetchBuildings,
    fetchBuilding,
    fetchRoom,
    clearBuilding,
    clearRoom
  };
};

export default useCampus;
