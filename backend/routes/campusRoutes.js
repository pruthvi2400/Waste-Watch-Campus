const express = require('express');
const router = express.Router();
const { getBuildings, getBuildingDetails, getRoomDetails } = require('../controllers/campusController');

router.get('/buildings', getBuildings);
router.get('/buildings/:id', getBuildingDetails);
router.get('/rooms/:id', getRoomDetails);

module.exports = router;
