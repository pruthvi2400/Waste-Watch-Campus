const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../validators/authValidators');

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, authUser);
router.get('/profile', protect, getUserProfile);
router.post('/logout', logout);

module.exports = router;
