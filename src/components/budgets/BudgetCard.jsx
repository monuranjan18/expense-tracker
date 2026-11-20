import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { BudgetProgressBar } from './BudgetProgressBar';
import { useCurrency } from '../../context/CurrencyContext';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { format } = useCurrency();
  const {
    category,
    limit,
    spent,
    percentage,
    remaining,
    isExceeded,
    isNearLimit,
  } = budget;

  return (
    <div
      className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isExceeded
          ? 'border-rose-200 dark:border-rose-900/60 ring-1 ring-rose-500/20'
          : isNearLimit
          ? 'border-amber-200 dark:border-amber-900/60'
          : 'border-slate-100 dark:border-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Category
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {category}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Edit Budget"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Delete Budget"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Values */}
      <div className="space-y-2 mb-3">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Spent: <strong className="text-slate-900 dark:text-white">{format(spent)}</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Limit: <strong className="text-slate-900 dark:text-white">{format(limit)}</strong>
          </span>
        </div>

        <BudgetProgressBar
          percentage={percentage}
          isExceeded={isExceeded}
          isNearLimit={isNearLimit}
        />
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {percentage}% used
        </span>

        {isExceeded ? (
          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Exceeded by {format(Math.abs(remaining))}
          </span>
        ) : isNearLimit ? (
          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            {format(remaining)} remaining (Warning)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {format(remaining)} left
          </span>
        )}
      </div>
    </div>
  );
};
