import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useCurrency } from '../context/CurrencyContext';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Target, Plus, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export const BudgetsPage = () => {
  const { budgetProgress, removeBudget } = useTransactions();
  const { format } = useCurrency();
  const { enrichedBudgets, exceededBudgets, nearLimitBudgets, totalBudgeted, totalBudgetSpent } =
    budgetProgress;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const overallPercentage =
    totalBudgeted > 0 ? Math.round((totalBudgetSpent / totalBudgeted) * 100) : 0;
  const totalRemaining = totalBudgeted - totalBudgetSpent;

  const handleDeleteConfirm = async () => {
    if (budgetToDelete) {
      await removeBudget(budgetToDelete.id);
      setBudgetToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budgets & Spending Limits
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set category limits to keep your expenses in check and prevent overspending.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBudget(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Limit</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Budget Overview
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {format(totalBudgetSpent)}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                spent of {format(totalBudgeted)} limit
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalRemaining >= 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {format(totalRemaining)} remaining
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  Over budget by {format(Math.abs(totalRemaining))}
                </span>
              )}{' '}
              across all {enrichedBudgets.length} budgeted categories.
            </p>
          </div>

          <div className="w-full lg:w-72 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Total Utilization</span>
              <span
                className={
                  overallPercentage > 100
                    ? 'text-rose-600 font-bold'
                    : overallPercentage >= 80
                    ? 'text-amber-600 font-bold'
                    : 'text-slate-900 dark:text-white'
                }
              >
                {overallPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallPercentage > 100
                    ? 'bg-rose-500'
                    : overallPercentage >= 80
                    ? 'bg-amber-500'
                    : 'bg-brand-600'
                }`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alerts if any */}
        {(exceededBudgets.length > 0 || nearLimitBudgets.length > 0) && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            {exceededBudgets.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-400"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>
                  <strong>Budget Exceeded Alert:</strong> You have spent {format(b.spent)} on{' '}
                  <strong>{b.category}</strong>, exceeding your limit of {format(b.limit)} by{' '}
                  {format(Math.abs(b.remaining))}.
                </span>
              </div>
            ))}
            {nearLimitBudgets.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-700 dark:text-amber-400"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>
                  <strong>Warning:</strong> You have used {b.percentage}% of your{' '}
                  <strong>{b.category}</strong> budget. {format(b.remaining)} remaining.
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budgets Grid */}
      {enrichedBudgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Budgets Defined"
          description="Create your first category budget to keep tabs on your spendings and avoid surprises."
          actionLabel="Create Budget"
          onAction={() => {
            setSelectedBudget(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrichedBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={(b) => {
                setSelectedBudget(b);
                setIsModalOpen(true);
              }}
              onDelete={(b) => setBudgetToDelete(b)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBudget(null);
        }}
        budgetToEdit={selectedBudget}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message={`Are you sure you want to remove the budget for ${budgetToDelete?.category}?`}
      />
    </div>
  );
};
