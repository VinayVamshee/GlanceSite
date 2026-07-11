import api from './api';

export const backgroundService = {
  // User custom background
  async getUserBackground() {
    const response = await api.get('/getUserBackground');
    return response.data;
  },

  async saveUserBackground(backgroundImage) {
    const response = await api.post('/saveUserBackground', { backgroundImage });
    return response.data;
  },

  // Common background (used for non-logged in or fallback)
  async getCommonBackground() {
    const response = await api.get('/getCommonBackground');
    return response.data;
  },

  async saveCommonBackground(backgroundImage) {
    const response = await api.post('/saveCommonBackground', { backgroundImage });
    return response.data;
  }
};
