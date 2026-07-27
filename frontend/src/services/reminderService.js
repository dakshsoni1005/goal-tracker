import api from './api.js';

export const reminderService = {
  getReminders: async (params = {}) => {
    const res = await api.get('/reminders', { params });
    return res.data;
  },
  
  getReminder: async (id) => {
    const res = await api.get(`/reminders/${id}`);
    return res.data;
  },
  
  createReminder: async (data) => {
    const res = await api.post('/reminders', data);
    return res.data;
  },
  
  updateReminder: async (id, data) => {
    const res = await api.patch(`/reminders/${id}`, data);
    return res.data;
  },
  
  deleteReminder: async (id) => {
    const res = await api.delete(`/reminders/${id}`);
    return res.data;
  },
  
  getActiveReminders: async () => {
    const res = await api.get('/reminders/active');
    return res.data;
  },
};
export default reminderService;
