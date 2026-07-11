import api from './api';

export const adminService = {
  async getAllUsers() {
    const response = await api.get('/getAllUsers');
    return response.data;
  },

  async getLockedUsers() {
    const response = await api.get('/GetLockedUsers');
    return response.data;
  },

  async saveLockedUsers(names) {
    const response = await api.post('/AddNewLockedUser', { names });
    return response.data;
  }
};
