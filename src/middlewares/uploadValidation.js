const path = require('path');

/**
 * Middleware to handle video upload errors
 */
const uploadErrorHandler = (error, req, res, next) => {
  if (error.code === 'FILE_TOO_LARGE') {
    return res.status(413).json({
      success: false,
      message: 'File is too large. Maximum size is 100MB'
    });
  }
  
  if (error.message === 'Only video files are allowed') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Only one file is allowed'
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Upload error: ' + error.message
    });
  }

  next();
};

/**
 * Middleware to check if file was uploaded
 */
const checkFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No video file provided'
    });
  }
  next();
};

module.exports = {
  uploadErrorHandler,
  checkFileUpload
};
