const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { uploadErrorHandler, checkFileUpload } = require('../middlewares/uploadValidation');
const authenticateToken = require('../middlewares/auth');
const translationController = require('../controllers/translationController');


router.post(
  '/',
  authenticateToken,
  upload.single('video'),
  checkFileUpload,
  translationController.uploadAndTranslate.bind(translationController)
);

router.get(
  '/',
  authenticateToken,
  translationController.getTranslations.bind(translationController)
);

router.get(
  '/stats',
  authenticateToken,
  translationController.getStats.bind(translationController)
);

router.get(
  '/:id',
  authenticateToken,
  translationController.getTranslation.bind(translationController)
);

router.delete(
  '/:id',
  authenticateToken,
  translationController.deleteTranslation.bind(translationController)
);
// Error handling middleware for multer
router.use(uploadErrorHandler);

module.exports = router;
