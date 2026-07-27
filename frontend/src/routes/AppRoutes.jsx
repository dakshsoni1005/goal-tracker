import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Layout imports
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Page imports
import LandingPage from '../pages/Landing/LandingPage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import RegisterPage from '../pages/Register/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage.jsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import GoalsPage from '../pages/Goals/GoalsPage.jsx';
import HabitsPage from '../pages/Habits/HabitsPage.jsx';
import CalendarPage from '../pages/Calendar/CalendarPage.jsx';
import NotesPage from '../pages/Notes/NotesPage.jsx';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage.jsx';
import NotificationsPage from '../pages/Notifications/NotificationsPage.jsx';
import ProfilePage from '../pages/Profile/ProfilePage.jsx';
import SettingsPage from '../pages/Settings/SettingsPage.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';

/**
 * Protected Route Wrapper checking token
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slateBg-light dark:bg-slateBg-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

/**
 * Redirect Authenticated User Wrapper
 */
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Protected Dashboards */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <HabitsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
