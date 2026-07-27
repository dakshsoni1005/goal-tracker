import api from './api.js';

export const noteService = {
  getNotes: async (params = {}) => {
    const res = await api.get('/notes', { params });
    return res.data;
  },
  
  getNote: async (id) => {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },
  
  createNote: async (data) => {
    const res = await api.post('/notes', data);
    return res.data;
  },
  
  updateNote: async (id, data) => {
    const res = await api.patch(`/notes/${id}`, data);
    return res.data;
  },
  
  deleteNote: async (id) => {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
  },
  
  getPinnedNotes: async () => {
    const res = await api.get('/notes/pinned');
    return res.data;
  },
  
  searchNotes: async (q) => {
    const res = await api.get(`/notes/search?q=${q}`);
    return res.data;
  },
};
