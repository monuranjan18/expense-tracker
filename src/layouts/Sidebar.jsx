import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = ({ onOpenTransactionModal }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/analytics', label: 'Analytics', icon: PieChart },
    { to: '/budgets', label: 'Budgets', icon: Target },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            Finance<span className="text-brand-600">Flow</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Expense Tracker</p>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="px-5 pt-6 pb-2">
        <button
          onClick={onOpenTransactionModal}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer & Theme Toggle */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium">Appearance</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Demo Mode'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
