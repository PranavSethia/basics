const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | ${req.method} ${req.url}`);

  if (err.isJoi) {
    return res.status(400).json({ success: false, error: err.details[0].message });
  }

  if (err.code === '23505') {
    return res.status(409).json({ success: false, error: 'Record already exists' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ success: false, error: 'Referenced record not found' });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
