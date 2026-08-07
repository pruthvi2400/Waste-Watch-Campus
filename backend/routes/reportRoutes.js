const express = require('express');
const router = express.Router();
const { createReport, updateReportStatus, getMyReports, getAllReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/room/:room_id', protect, upload.array('images', 5), createReport);
router.post('/update-status/:id', protect, updateReportStatus);
router.get('/my-reports', protect, getMyReports);
router.get('/all', protect, authorize('cleaning_staff'), getAllReports);

module.exports = router;
