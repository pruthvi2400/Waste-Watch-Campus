/**
 * Report Service
 * Handles all waste report-related API calls
 */
import api from '../api/axios';

/**
 * Create a new waste report for a room
 * @param {string} roomId - The room ID to report waste in
 * @param {FormData} formData - Form data containing title, description, severity, images
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createReport = async (roomId, formData) => {
  try {
    const response = await api.post(`/api/reports/room/${roomId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create report'
    };
  }
};

/**
 * Get reports for a specific room
 * @param {string} roomId - The room ID
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getRoomReports = async (roomId) => {
  try {
    // The room endpoint already returns reports, so this is a passthrough
    const response = await api.get(`/api/campus/rooms/${roomId}`);
    return {
      success: true,
      data: response.data.reports || []
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch room reports'
    };
  }
};

/**
 * Get reports submitted by the current user
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getMyReports = async () => {
  try {
    const response = await api.get('/api/reports/my-reports');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch your reports'
    };
  }
};

/**
 * Get all reports (cleaning staff only)
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getAllReports = async () => {
  try {
    const response = await api.get('/api/reports/all');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch all reports'
    };
  }
};

/**
 * Update the status of a report
 * @param {string} reportId - The report ID
 * @param {string} status - The new status ('Resolved', 'In Progress', 'Pending')
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateReportStatus = async (reportId, status) => {
  try {
    const response = await api.post(`/api/reports/update-status/${reportId}`, { status });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update report status'
    };
  }
};

export default {
  createReport,
  getRoomReports,
  getMyReports,
  getAllReports,
  updateReportStatus
};
