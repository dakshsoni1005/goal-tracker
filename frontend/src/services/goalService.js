import api from './api.js';

export const goalService = {
  getGoals: async (params = {}) => {
    const res = await api.get('/goals', { params });
    return res.data;
  },
  
  getGoal: async (id) => {
    const res = await api.get(`/goals/${id}`);
    return res.data;
  },
  
  createGoal: async (data) => {
    const res = await api.post('/goals', data);
    return res.data;
  },
  
  updateGoal: async (id, data) => {
    const res = await api.patch(`/goals/${id}`, data);
    return res.data;
  },
  
  deleteGoal: async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
  },
  
  completeGoal: async (id) => {
    const res = await api.patch(`/goals/${id}/complete`);
    return res.data;
  },
  
  archiveGoal: async (id) => {
    const res = await api.patch(`/goals/${id}/archive`);
    return res.data;
  },
  
  unarchiveGoal: async (id) => {
    const res = await api.patch(`/goals/${id}/unarchive`);
    return res.data;
  },
  
  getTodayGoals: async () => {
    const res = await api.get('/goals/today');
    return res.data;
  },
  
  getUpcomingGoals: async () => {
    const res = await api.get('/goals/upcoming');
    return res.data;
  },
  
  getOverdueGoals: async () => {
    const res = await api.get('/goals/overdue');
    return res.data;
  },
  
  searchGoals: async (q) => {
    const res = await api.get(`/goals/search?q=${q}`);
    return res.data;
  },
  
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },
  
  createCategory: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  },
};
