const { body, param } = require('express-validator');

/**
 * Validation rules for creating a waste report
 */
const createReportValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

  body('severity')
    .optional()
    .isIn(['Critical', 'High', 'Medium', 'Low', 'Unknown'])
    .withMessage('Severity must be one of: Critical, High, Medium, Low, Unknown'),

  param('room_id')
    .isMongoId().withMessage('Invalid room ID format')
];

/**
 * Validation rules for updating report status
 */
const updateStatusValidation = [
  param('id')
    .isMongoId().withMessage('Invalid report ID format'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'In Progress', 'Resolved'])
    .withMessage('Status must be one of: Pending, In Progress, Resolved')
];

/**
 * Validation rules for route parameters
 */
const reportIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid report ID format')
];

const roomIdValidation = [
  param('room_id')
    .isMongoId().withMessage('Invalid room ID format')
];

/**
 * Validation middleware to catch validation errors
 */
const validate = (req, res, next) => {
  const errors = [];
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
  createReportValidation,
  updateStatusValidation,
  reportIdValidation,
  roomIdValidation,
  validate
};
