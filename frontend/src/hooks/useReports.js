/**
 * useReports Hook
 * Provides report-related operations with loading and error states
 */
import { useState, useCallback } from 'react';
import reportService from '../services/reportService';

/**
 * @typedef {Object} Report
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {string} waste_type
 * @property {string} severity
 * @property {string} status
 * @property {Array<string>} images
 * @property {Object} user
 * @property {Object} room
 * @property {string} created_at
 */

/**
 * @typedef {Object} UseReportsReturn
 * @property {Array<Report>} reports
 * @property {boolean} loading
 * @property {string|null} error
 * @property {Function} fetchMyReports
 * @property {Function} fetchAllReports
 * @property {Function} createReport
 * @property {Function} updateStatus
 */

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch reports submitted by the current user
   */
  const fetchMyReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await reportService.getMyReports();
    if (result.success) {
      setReports(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  /**
   * Fetch all reports (cleaning staff only)
   */
  const fetchAllReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await reportService.getAllReports();
    if (result.success) {
      setReports(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  /**
   * Create a new report
   * @param {string} roomId 
   * @param {FormData} formData 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const createReport = useCallback(async (roomId, formData) => {
    setLoading(true);
    setError(null);
    const result = await reportService.createReport(roomId, formData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  /**
   * Update report status
   * @param {string} reportId 
   * @param {string} status 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const updateStatus = useCallback(async (reportId, status) => {
    setLoading(true);
    setError(null);
    const result = await reportService.updateReportStatus(reportId, status);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, []);

  /**
   * Clear reports list
   */
  const clearReports = useCallback(() => {
    setReports([]);
    setError(null);
  }, []);

  return {
    reports,
    loading,
    error,
    fetchMyReports,
    fetchAllReports,
    createReport,
    updateStatus,
    clearReports
  };
};

export default useReports;
