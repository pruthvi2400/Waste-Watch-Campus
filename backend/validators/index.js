const { registerValidation, loginValidation, userIdValidation, validate } = require('./authValidators');
const {
  createReportValidation,
  updateStatusValidation,
  reportIdValidation,
  roomIdValidation,
  validate: validateReport
} = require('./reportValidators');

module.exports = {
  registerValidation,
  loginValidation,
  userIdValidation,
  validate,
  createReportValidation,
  updateStatusValidation,
  reportIdValidation,
  roomIdValidation,
  validateReport
};
