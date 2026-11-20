import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-brand-600 flex items-center justify-center mb-4 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
