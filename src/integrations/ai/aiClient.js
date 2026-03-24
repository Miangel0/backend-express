const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class AIClient {
  constructor(baseURL = process.env.AI_SERVICE_URL || 'http://localhost:5000') {
    this.baseURL = `https://${baseURL}`;
    this.timeout = parseInt(process.env.AI_SERVICE_TIMEOUT) || 300000; // 5 minutes timeout for video processing
  }

  /**
   * Send video to AI microservice for sign language translation
   * @param {string} videoPath - Path to the video file
   * @returns {Promise<Object>} - JSON response with translated words
   */
  async translateVideo(videoPath) {
    try {
      // Check if file exists
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      // Create form data
      const form = new FormData();
      const fileStream = fs.createReadStream(videoPath);
      form.append('video', fileStream);

      // Send to AI microservice
      const response = await axios.post(`${this.baseURL}/predict`, form, {
        headers: form.getHeaders(),
        timeout: this.timeout
      });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.words)) {
        throw new Error('Invalid response format from AI service');
      }

      return response.data;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('AI microservice is not available');
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error('AI microservice hostname not found');
      }
      if (error.response) {
        throw new Error(`AI service error: ${error.response.status} - ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check health status of AI microservice
   * @returns {Promise<boolean>} - Health status
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new AIClient();
