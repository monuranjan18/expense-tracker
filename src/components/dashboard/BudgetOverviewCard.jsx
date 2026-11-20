import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, AlertTriangle, AlertCircle } from 'lucide-react';
import { BudgetProgressBar } from '../budgets/BudgetProgressBar';
import { useCurrency } from '../../context/CurrencyContext';

export const BudgetOverviewCard = ({ budgetProgress, onAddNewBudget }) => {
  const { format } = useCurrency();
  const { enrichedBudgets, exceededBudgets, nearLimitBudgets } = budgetProgress;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Monthly Budget Progress
            </h3>
          </div>
          <Link
            to="/budgets"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 transition"
          >
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Alerts Banner if any */}
        {(exceededBudgets.length > 0 || nearLimitBudgets.length > 0) && (
          <div className="space-y-2 mb-4">
            {exceededBudgets.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-400 font-medium"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>
                  <strong>{b.category}</strong> exceeded by {format(Math.abs(b.remaining))}!
                </span>
              </div>
            ))}
            {nearLimitBudgets.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-medium"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>
                  <strong>{b.category}</strong> is at {b.percentage}% of budget.
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Budgets List Preview */}
        {enrichedBudgets.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-400">
            <p className="mb-3">No budgets set for this month yet.</p>
            <button
              onClick={onAddNewBudget}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              + Create Category Budget
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrichedBudgets.slice(0, 4).map((b) => (
              <div key={b.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {b.category}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {format(b.spent)} / {format(b.limit)} ({b.percentage}%)
                  </span>
                </div>
                <BudgetProgressBar
                  percentage={b.percentage}
                  isExceeded={b.isExceeded}
                  isNearLimit={b.isNearLimit}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {enrichedBudgets.length > 0 && (
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>{enrichedBudgets.length} categories tracked</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Total Limit: {format(budgetProgress.totalBudgeted)}
          </span>
        </div>
      )}
    </div>
  );
};
