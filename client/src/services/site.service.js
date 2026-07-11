import api from './api';

export const siteService = {
  // User sites
  async getUserSites() {
    const response = await api.get('/GetSite');
    return response.data;
  },

  async addUserSite(siteData) {
    const response = await api.post('/AddNewSite', siteData);
    return response.data;
  },

  async updateUserSite(id, siteData) {
    const response = await api.put(`/sites/${id}`, siteData);
    return response.data;
  },

  async deleteUserSite(id) {
    const response = await api.delete(`/DeleteSite/${id}`);
    return response.data;
  },

  // Common/Global sites (Managed by Admin or visible to all)
  async getAllCommonSites() {
    const response = await api.get('/getAllSites');
    return response.data;
  },

  async addCommonSite(siteData) {
    const response = await api.post('/addSite', siteData);
    return response.data;
  },

  async updateCommonSite(id, siteData) {
    const response = await api.put(`/editCommonSite/${id}`, siteData);
    return response.data;
  },

  async deleteCommonSite(id) {
    const response = await api.delete(`/deletecommonsite/${id}`);
    return response.data;
  }
};
