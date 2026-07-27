import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { Toaster } from 'react-hot-toast';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* Toast alerts overlay */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#f8fafc',
                fontSize: '13px',
              },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
