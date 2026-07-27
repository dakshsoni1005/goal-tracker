import api from './api.js';

export const notificationService = {
  getNotifications: async (params = {}) => {
    const res = await api.get('/notifications', { params });
    return res.data;
  },
  
  readNotification: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  
  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
  
  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res.data;
  },
};
export default notificationService;
