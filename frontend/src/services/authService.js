import api from './api.js';

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  
  verifyEmail: async (token) => {
    const res = await api.get(`/auth/verify-email?token=${token}`);
    return res.data;
  },
  
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  
  resetPassword: async (token, password) => {
    const res = await api.post(`/auth/reset-password?token=${token}`, { password });
    return res.data;
  },
  
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },
  
  updateProfile: async (data) => {
    const res = await api.patch('/auth/profile', data);
    return res.data;
  },
  
  changePassword: async (passwords) => {
    const res = await api.patch('/auth/change-password', passwords);
    return res.data;
  },
};
