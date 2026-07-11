import api from './api';

export const authService = {
  async login(loginData) {
    const response = await api.post('/login', loginData);
    return response.data;
  },

  async register(registerData) {
    const response = await api.post('/register', registerData);
    return response.data;
  },

  async adminLogin(adminData) {
    const response = await api.post('/admin/login', adminData);
    return response.data;
  },

  async adminRegister(registerData) {
    const response = await api.post('/admin/register', registerData);
    return response.data;
  }
};
