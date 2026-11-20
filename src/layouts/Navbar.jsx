import React from 'react';
import { Plus, Sun, Moon, ShieldCheck, LogOut } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = ({ onOpenTransactionModal }) => {
  const { currency, setCurrency, currencies } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
      {/* Mobile Brand */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
          Finance<span className="text-brand-600">Flow</span>
        </span>
      </div>

      {/* Desktop Search / Welcome note */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.displayName || 'Explorer'}! 👋
        </h2>
        <p className="text-xs text-slate-400">
          Track expenses, maintain budgets, and reach your financial goals.
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Selector */}
        <select
          value={currency.code}
          onChange={(e) => {
            const found = currencies.find((c) => c.code === e.target.value);
            if (found) setCurrency(found);
          }}
          className="text-xs font-semibold px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>

        {/* Theme Toggle (Mobile) */}
        <button
          onClick={toggleTheme}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Add Transaction Button */}
        <button
          onClick={onOpenTransactionModal}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* User Avatar Link */}
        <Link
          to="/settings"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-xs sm:text-sm overflow-hidden border border-brand-200 dark:border-brand-800"
          title="Account Settings"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
          )}
        </Link>
      </div>
    </header>
  );
};
