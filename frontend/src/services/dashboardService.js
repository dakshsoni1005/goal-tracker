import api from './api.js';

export const dashboardService = {
  getDashboardData: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};
export default dashboardService;
