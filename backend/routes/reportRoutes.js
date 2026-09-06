const express = require('express');
const router = express.Router();
const { createReport, updateReportStatus, getMyReports, getAllReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createReportValidation, updateStatusValidation, roomIdValidation, validate } = require('../validators/reportValidators');

// Create report: validate room_id param first, then upload, then body validation
router.post('/room/:room_id', protect, roomIdValidation, validate, upload.array('images', 5), createReportValidation, validate, createReport);
router.post('/update-status/:id', protect, updateStatusValidation, validate, updateReportStatus);
router.get('/my-reports', protect, getMyReports);
router.get('/all', protect, authorize('cleaning_staff'), getAllReports);

module.exports = router;