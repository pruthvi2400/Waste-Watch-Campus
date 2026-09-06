const { body, param } = require('express-validator');

/**
 * Validation rules for user registration
 * NOTE: cleaning_staff cannot be created via public registration for security
 * Only 'student' and 'teacher' are allowed for public self-registration
 */
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .isLength({ max: 30 }).withMessage('Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('user_type')
    .optional()
    .isIn(['student', 'teacher'])
    .withMessage('User type must be student or teacher')
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for user ID parameter
 */
const userIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid user ID format')
];

/**
 * Validation middleware to catch validation errors
 */
const validate = (req, res, next) => {
  const errors = [];
  // express-validator stores errors in validationResult(req)
  const { validationResult } = require('express-validator');
  const result = validationResult(req);
  
  if (!result.isEmpty()) {
    result.array().forEach(err => {
      errors.push({
        field: err.path,
        message: err.msg
      });
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  userIdValidation,
  validate
};