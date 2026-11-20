import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { isFirebaseConfigured } from '../firebase/config';
import { exportTransactionsToCsv } from '../utils/exportCsv';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  User,
  DollarSign,
  Moon,
  Sun,
  Database,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const { transactions, loadSampleData, clearAllData } = useTransactions();

  // Profile Edit State
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Dialog State
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage('');
    try {
      await updateProfile(displayName, photoURL);
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      setProfileMessage('Error updating profile: ' + err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your preferences, manage profile details, and control data.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <User className="w-5 h-5 text-brand-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Profile Information
          </h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileMessage && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl">
              {profileMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="text"
                value={user?.email || 'demo@financetracker.app'}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Avatar Photo URL
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <DollarSign className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Preferences & Appearance
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Default Currency
            </label>
            <select
              value={currency.code}
              onChange={(e) => {
                const found = currencies.find((c) => c.code === e.target.value);
                if (found) setCurrency(found);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Currently formatted using <strong>{currency.symbol} ({currency.code})</strong>.
            </p>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Theme Mode
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Dark Mode Active</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span>Light Mode Active</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backend & Firebase Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <Database className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Firebase Connection Status
          </h3>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          {isFirebaseConfigured ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  Connected to Cloud Firestore & Authentication
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Your transactions and budgets are securely persisted with per-user isolation in Firebase Cloud Firestore.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-amber-700 dark:text-amber-400">
                  Running with Local Persistence / Demo Mode
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  To connect your live Firebase project, add your Firebase credentials in <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">.env</code> using <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">.env.example</code>. All app features work smoothly in both modes.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Management & Recovery */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Data Management
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Backup your data, reset sample financial data for testing, or wipe all records.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => exportTransactionsToCsv(transactions)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Backup (CSV)</span>
          </button>

          <button
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-brand-700 dark:text-brand-300 text-xs font-semibold hover:bg-indigo-100/50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100/50 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Financial Records"
        message="Are you sure you want to delete all transactions and budgets? This cannot be undone."
      />
    </div>
  );
};
