import api from './api';

export const feedbackService = {
  async submitFeedback(name, message) {
    const response = await api.post('/feedback', { name, message });
    return response.data;
  },

  async getFeedbacks() {
    const response = await api.get('/getfeedback');
    return response.data;
  }
};
