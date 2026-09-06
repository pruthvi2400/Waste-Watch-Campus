const asyncHandler = require('../utils/asyncHandler');
const { successResponse, successResponseWithMessage } = require('../utils/responseFormatter');
const reportService = require('../services/reportService');

/**
 * @desc    Submit a new waste report
 * @route   POST /api/reports/room/:room_id
 * @access  Private
 */
const createReport = asyncHandler(async (req, res) => {
  const reportData = {
    ...req.body,
    room_id: req.params.room_id
  };
  const report = await reportService.createReport(reportData, req.files, req.user);
  successResponse(res, report, 201);
});

/**
 * @desc    Update waste report status
 * @route   POST /api/reports/update-status/:id
 * @access  Private/Cleaning Staff
 */
const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await reportService.updateReportStatus(
    req.params.id,
    req.body.status,
    req.user
  );
  successResponseWithMessage(res, 'Report status updated successfully', report);
});

/**
 * @desc    Get current user's submitted reports
 * @route   GET /api/reports/my-reports
 * @access  Private
 */
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getMyReports(req.user._id);
  successResponse(res, reports);
});

/**
 * @desc    Get all reports across campus (For Cleaning Staff Dashboard)
 * @route   GET /api/reports/all
 * @access  Private/Cleaning Staff
 */
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getAllReports();
  successResponse(res, reports);
});

module.exports = {
  createReport,
  updateReportStatus,
  getMyReports,
  getAllReports
};
