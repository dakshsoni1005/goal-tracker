import api from './api.js';

export const analyticsService = {
  getDashboardAnalytics: async () => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },
  
  getMonthlyAnalytics: async () => {
    const res = await api.get('/analytics/monthly');
    return res.data;
  },
  
  getYearlyAnalytics: async () => {
    const res = await api.get('/analytics/yearly');
    return res.data;
  },
};
export default analyticsService;
