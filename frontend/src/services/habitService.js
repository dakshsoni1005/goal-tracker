import api from './api.js';

export const habitService = {
  getHabits: async (params = {}) => {
    const res = await api.get('/habits', { params });
    return res.data;
  },
  
  getHabit: async (id) => {
    const res = await api.get(`/habits/${id}`);
    return res.data;
  },
  
  createHabit: async (data) => {
    const res = await api.post('/habits', data);
    return res.data;
  },
  
  updateHabit: async (id, data) => {
    const res = await api.patch(`/habits/${id}`, data);
    return res.data;
  },
  
  deleteHabit: async (id) => {
    const res = await api.delete(`/habits/${id}`);
    return res.data;
  },
  
  completeHabit: async (id, date = null) => {
    const payload = date ? { date } : {};
    const res = await api.patch(`/habits/${id}/complete`, payload);
    return res.data;
  },
  
  resetHabit: async (id) => {
    const res = await api.patch(`/habits/${id}/reset`);
    return res.data;
  },
  
  getHabitStreak: async (id) => {
    const res = await api.get(`/habits/${id}/streak`);
    return res.data;
  },
  
  getHabitStats: async (id) => {
    const res = await api.get(`/habits/${id}/stats`);
    return res.data;
  },
};
