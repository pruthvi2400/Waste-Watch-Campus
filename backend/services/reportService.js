const WasteReport = require('../models/WasteReport');
const Room = require('../models/Room');
const cloudinary = require('../config/cloudinary');
const { analyzeWasteImage } = require('../utils/gemini');
const ApiError = require('../utils/ApiError');

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer to upload
 * @returns {string} Cloudinary secure URL
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'waste_watch_campus' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Create a new waste report
 * @param {Object} reportData - Report data
 * @param {Array} files - Uploaded image files
 * @param {Object} user - Authenticated user
 * @returns {Object} Created report
 */
const createReport = async (reportData, files, user) => {
  const { title, description, severity } = reportData;
  const { room_id } = reportData;

  // Check if room exists
  const room = await Room.findById(room_id);
  if (!room) {
    throw ApiError.notFound('Room not found');
  }

  // Validate at least one image is provided
  if (!files || files.length === 0) {
    throw ApiError.badRequest('At least one waste image is required');
  }

  console.log(`Uploading ${files.length} images to Cloudinary...`);

  // 1. Upload images to Cloudinary
  const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
  const imageUrls = await Promise.all(uploadPromises);

  console.log('Cloudinary images uploaded:', imageUrls);

  // 2. Perform AI classification on the first image
  const firstFile = files[0];
  const { waste_type, severity: aiSeverity } = await analyzeWasteImage(
    firstFile.buffer,
    firstFile.mimetype
  );

  // Override severity only if user set it to 'Unknown' or left it blank
  const chosenSeverity = (severity === 'Unknown' || !severity) ? aiSeverity : severity;

  // 3. Create report
  const report = await WasteReport.create({
    title,
    description,
    images: imageUrls,
    waste_type,
    severity: chosenSeverity,
    status: 'Pending',
    room: room_id,
    user: user._id
  });

  return report;
};

/**
 * Update waste report status
 * @param {string} reportId - Report MongoDB ID
 * @param {string} status - New status
 * @param {Object} user - Authenticated user
 * @returns {Object} Updated report
 */
const updateReportStatus = async (reportId, status, user) => {
  // Find the report
  const report = await WasteReport.findById(reportId);

  if (!report) {
    throw ApiError.notFound('Report not found');
  }

  // Check if user is authorized (only cleaning_staff can update status)
  if (user.user_type !== 'cleaning_staff') {
    throw ApiError.forbidden('Only cleaning staff can update report status');
  }

  // Update status
  report.status = status || 'Resolved';
  await report.save();

  return report;
};

/**
 * Get reports submitted by a specific user
 * @param {string} userId - User MongoDB ID
 * @returns {Array} List of user's reports
 */
const getMyReports = async (userId) => {
  const reports = await WasteReport.find({ user: userId })
    .populate('room')
    .sort({ created_at: -1 });

  return reports;
};

/**
 * Get all reports (for cleaning staff dashboard)
 * @returns {Array} List of all reports
 */
const getAllReports = async () => {
  const reports = await WasteReport.find({})
    .populate({
      path: 'room',
      populate: {
        path: 'floor',
        populate: { path: 'building' }
      }
    })
    .populate('user', 'username email')
    .sort({ created_at: -1 });

  return reports;
};

/**
 * Get report by ID
 * @param {string} reportId - Report MongoDB ID
 * @returns {Object} Report document
 */
const getReportById = async (reportId) => {
  const report = await WasteReport.findById(reportId)
    .populate({
      path: 'room',
      populate: {
        path: 'floor',
        populate: { path: 'building' }
      }
    })
    .populate('user', 'username email');

  if (!report) {
    throw ApiError.notFound('Report not found');
  }

  return report;
};

module.exports = {
  uploadToCloudinary,
  createReport,
  updateReportStatus,
  getMyReports,
  getAllReports,
  getReportById
};
