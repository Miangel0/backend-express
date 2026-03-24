const aiClient = require('../integrations/ai/aiClient');
const fs = require('fs');
const path = require('path');
const connectionString = `${process.env.DATABASE_URL}`;
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


class TranslationService {
  /**
   * Create a new translation from uploaded video
   * @param {number} userId - ID of the user
   * @param {string} videoPath - Path to the uploaded video
   * @returns {Promise<Object>} - Translation record
   */
  async createTranslation(userId, videoPath) {
    try {
      // Send video to AI microservice for processing
      const aiResult = await aiClient.translateVideo(videoPath);

      // Store translation in database
      const translation = await prisma.translation.create({
        data: {
          userId,
          videoPath,
          result: aiResult // This is stored as JSON
        }
      });

      return translation;
    } catch (error) {
      // Clean up uploaded file on error
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      throw error;
    }
  }

  /**
   * Get user's translation history
   * @param {number} userId - ID of the user
   * @returns {Promise<Array>} - List of translations
   */
  async getUserTranslations(userId) {
    return prisma.translation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get a specific translation by ID
   * @param {number} translationId - ID of the translation
   * @param {number} userId - ID of the user (for authorization)
   * @returns {Promise<Object>} - Translation record
   */
  async getTranslationById(translationId, userId) {
    return prisma.translation.findFirst({
      where: {
        id: translationId,
        userId
      }
    });
  }

  /**
   * Delete a translation
   * @param {number} translationId - ID of the translation
   * @param {number} userId - ID of the user (for authorization)
   * @returns {Promise<void>}
   */
  async deleteTranslation(translationId, userId) {
    const translation = await this.getTranslationById(translationId, userId);
    
    if (!translation) {
      throw new Error('Translation not found');
    }

    // Delete video file
    if (fs.existsSync(translation.videoPath)) {
      fs.unlinkSync(translation.videoPath);
    }

    // Delete from database
    await prisma.translation.delete({
      where: { id: translationId }
    });
  }

  /**
   * Get statistics about translations
   * @param {number} userId - ID of the user
   * @returns {Promise<Object>} - Translation statistics
   */
  async getTranslationStats(userId) {
    const translations = await prisma.translation.findMany({
      where: { userId }
    });

    const totalTranslations = translations.length;
    const allWords = [];
    
    translations.forEach(t => {
      if (t.result?.words && Array.isArray(t.result.words)) {
        allWords.push(...t.result.words);
      }
    });

    return {
      totalTranslations,
      totalWords: allWords.length,
      uniqueWords: [...new Set(allWords)].length,
      recentWords: allWords.slice(-10)
    };
  }
}

module.exports = new TranslationService();
