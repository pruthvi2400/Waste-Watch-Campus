const WasteReport = require('../models/WasteReport');
const Room = require('../models/Room');
const cloudinary = require('../config/cloudinary');
const { analyzeWasteImage } = require('../utils/gemini');

// Helper to upload memory buffer to Cloudinary
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

// @desc    Submit a new waste report
// @route   POST /api/reports/room/:room_id
// @access  Private
const createReport = async (req, res) => {
  const { title, description, severity } = req.body;
  const roomId = req.params.room_id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one waste image is required' });
    }

    console.log(`Uploading ${req.files.length} images to Cloudinary...`);

    // 1. Upload images to Cloudinary
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const imageUrls = await Promise.all(uploadPromises);

    console.log('Cloudinary images uploaded:', imageUrls);

    // 2. Perform AI classification on the first image
    const firstFile = req.files[0];
    const { waste_type, severity: aiSeverity } = await analyzeWasteImage(firstFile.buffer, firstFile.mimetype);

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
      room: roomId,
      user: req.user._id
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting waste report', error: error.message });
  }
};

// @desc    Update waste report status
// @route   POST /api/reports/update-status/:id
// @access  Private/Cleaning Staff
const updateReportStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Authenticated cleaning staff can update status
    if (req.user.user_type !== 'cleaning_staff') {
      return res.status(403).json({ message: 'Only cleaning staff can resolve or update report status' });
    }

    report.status = status || 'Resolved';
    await report.save();

    res.json({ success: true, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating report status', error: error.message });
  }
};

// @desc    Get current user's submitted reports
// @route   GET /api/reports/my-reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({ user: req.user._id })
      .populate('room')
      .sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching your reports', error: error.message });
  }
};

// @desc    Get all reports across campus (For Cleaning Staff Dashboard)
// @route   GET /api/reports/all
// @access  Private/Cleaning Staff
const getAllReports = async (req, res) => {
  try {
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
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all reports', error: error.message });
  }
};

module.exports = {
  createReport,
  updateReportStatus,
  getMyReports,
  getAllReports
};
