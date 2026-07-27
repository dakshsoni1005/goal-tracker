import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slateBg-light dark:bg-slateBg-dark px-6 text-center transition-colors duration-200">
      <div className="space-y-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">404 - Page Not Found</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            The page you are looking for does not exist or has been shifted.
          </p>
        </div>
        <Link to="/" className="inline-block">
          <Button size="sm" className="flex items-center space-x-1.5">
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
