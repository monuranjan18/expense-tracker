import React from 'react';
import {
  ShoppingBag,
  Utensils,
  Car,
  GraduationCap,
  Film,
  HeartPulse,
  Receipt,
  Plane,
  Briefcase,
  Laptop,
  TrendingUp,
  DollarSign,
  HelpCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate } from '../../utils/formatters';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food':
      return Utensils;
    case 'Shopping':
      return ShoppingBag;
    case 'Transport':
      return Car;
    case 'Education':
      return GraduationCap;
    case 'Entertainment':
      return Film;
    case 'Healthcare':
      return HeartPulse;
    case 'Bills':
      return Receipt;
    case 'Travel':
      return Plane;
    case 'Salary':
      return Briefcase;
    case 'Freelancing':
      return Laptop;
    case 'Business':
      return TrendingUp;
    case 'Investment':
      return DollarSign;
    default:
      return HelpCircle;
  }
};

export const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { format } = useCurrency();
  const Icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <div className="group flex items-center justify-between p-3.5 sm:p-4 bg-white dark:bg-slate-900/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-all duration-200 shadow-sm hover:shadow">
      {/* Left: Icon & Details */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            isIncome
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {transaction.description}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {transaction.category}
            </span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
            {transaction.paymentMethod && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                  {transaction.paymentMethod}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amount & Actions */}
      <div className="flex items-center gap-3 sm:gap-4 pl-2 flex-shrink-0">
        <div className="text-right">
          <span
            className={`text-sm sm:text-base font-bold ${
              isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {isIncome ? '+' : '-'} {format(transaction.amount)}
          </span>
          {transaction.notes && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px] text-right">
              {transaction.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              title="Edit transaction"
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction)}
              title="Delete transaction"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
