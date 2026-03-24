const translationService = require('../services/translationService');

class TranslationController {
  /**
   * Upload and translate a video
   * POST /api/translations
   */
  async uploadAndTranslate(req, res, next) {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No video file provided'
        });
      }

      const translation = await translationService.createTranslation(
        userId,
        req.file.path
      );

      res.status(201).json({
        success: true,
        message: 'Video translated successfully',
        data: translation
      });
    } catch (error) {
      if (error.message.includes('AI microservice')) {
        res.status(503).json({
          success: false,
          message: error.message
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * Get user's translation history
   * GET /api/translations
   */
  async getTranslations(req, res, next) {
    try {
      const userId = req.user.id;
      const translations = await translationService.getUserTranslations(userId);

      res.status(200).json({
        success: true,
        data: translations
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific translation
   * GET /api/translations/:id
   */
  async getTranslation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const translation = await translationService.getTranslationById(
        parseInt(id),
        userId
      );

      if (!translation) {
        return res.status(404).json({
          success: false,
          message: 'Translation not found'
        });
      }

      res.status(200).json({
        success: true,
        data: translation
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a translation
   * DELETE /api/translations/:id
   */
  async deleteTranslation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await translationService.deleteTranslation(parseInt(id), userId);

      res.status(200).json({
        success: true,
        message: 'Translation deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Translation not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        next(error);
      }
    }
  }

  /**
   * Get translation statistics
   * GET /api/translations/stats
   */
  async getStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await translationService.getTranslationStats(userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TranslationController();
