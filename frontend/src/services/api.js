import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // receive cookies
});

// Request Interceptor: Inject JWT token if stored in localstorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error popups
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Display toast for validation/database errors
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired / Unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Do not spam auth toast unless it's not a background check
        if (!configIsHealthOrBackground(error.config)) {
          toast.error('Session expired. Please log in again.');
        }
      } else if (error.response.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else if (error.response.data?.errors && error.response.data.errors.length > 0) {
        // Express-validator validation failure details
        error.response.data.errors.forEach((err) => {
          toast.error(`${err.field ? `${err.field}: ` : ''}${err.message}`);
        });
      } else {
        toast.error(message);
      }
    } else {
      toast.error('Network Connection Error. Verify server status.');
    }
    
    return Promise.reject(error);
  }
);

const configIsHealthOrBackground = (config) => {
  return (
    config?.url?.endsWith('/health') ||
    config?.url?.endsWith('/profile') ||
    config?.url?.endsWith('/unread-count') ||
    config?.url?.endsWith('/active')
  );
};

export default api;
