import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize: Load user & token from storage if present, verify profile
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        
        try {
          // verify profile validity on startup
          const res = await authService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Silent auth validation failed on startup: ', err.message);
          // Token is invalid/expired
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success(res.message || 'Logged in successfully!');
        return res.data;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, timezone) => {
    setLoading(true);
    try {
      const res = await authService.register({ name, email, password, timezone });
      if (res.success && res.data) {
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success(res.message || 'Registration successful!');
        return res.data;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error: ', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      toast.success('Logged out successfully.');
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      if (res.success && res.data) {
        const updatedUser = { ...user, ...res.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success(res.message || 'Profile updated successfully!');
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
