import api from './api';

export const categoryService = {
  // User Categories
  async getUserCategories() {
    const response = await api.get('/GetCategory');
    return response.data;
  },

  async addUserCategory(categoryData) {
    const response = await api.post('/AddNewCategory', categoryData);
    return response.data;
  },

  async deleteUserCategory(id) {
    const response = await api.delete(`/DeleteCategory/${id}`);
    return response.data;
  },

  // Common/Global Categories
  async getAllCommonCategories() {
    const response = await api.get('/getAllCommonCategories');
    return response.data;
  },

  async addCommonCategory(categoryData) {
    const response = await api.post('/addCategory', categoryData);
    return response.data;
  },

  async deleteCommonCategory(id) {
    const response = await api.delete(`/deleteCommonCategory/${id}`);
    return response.data;
  }
};
