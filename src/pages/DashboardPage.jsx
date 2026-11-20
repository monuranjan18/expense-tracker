import React, { useState } from 'react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { BudgetOverviewCard } from '../components/dashboard/BudgetOverviewCard';
import { CategoryExpenseChart } from '../components/analytics/CategoryExpenseChart';
import { IncomeVsExpenseChart } from '../components/analytics/IncomeVsExpenseChart';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useTransactions } from '../context/TransactionContext';
import { useCurrency } from '../context/CurrencyContext';
import { PlusCircle, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const {
    transactions,
    stats,
    budgetProgress,
    removeTransaction,
    loadSampleData,
  } = useTransactions();
  const { format } = useCurrency();

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txToDelete, setTxToDelete] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleEditTx = (tx) => {
    setSelectedTx(tx);
    setIsTxModalOpen(true);
  };

  const handleAddNewTx = () => {
    setSelectedTx(null);
    setIsTxModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (txToDelete) {
      await removeTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-brand-500/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-brand-100 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Monthly Financial Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-sm text-brand-100/90 mt-1 max-w-xl">
            This month you've saved <strong className="text-white">{format(stats.currentMonthBalance)}</strong> ({stats.monthlySavingsRate.toFixed(1)}% of your monthly income).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewTx}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-sm shadow-md transition-all hover:scale-102"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <SummaryCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Income vs Expenses
              </h3>
              <p className="text-xs text-slate-400">Monthly comparison (Last 6 Months)</p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <IncomeVsExpenseChart transactions={transactions} />
        </div>

        {/* Category Expense Doughnut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Expense Breakdown
              </h3>
              <p className="text-xs text-slate-400">By category</p>
            </div>
          </div>
          <CategoryExpenseChart categoryExpenseMap={stats.categoryExpenseMap} />
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions + Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions
            transactions={transactions}
            onEdit={handleEditTx}
            onDelete={(tx) => setTxToDelete(tx)}
            onAddNew={handleAddNewTx}
          />
        </div>

        <div>
          <BudgetOverviewCard
            budgetProgress={budgetProgress}
            onAddNewBudget={() => setIsBudgetModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setSelectedTx(null);
        }}
        transactionToEdit={selectedTx}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to remove "${txToDelete?.description}"?`}
      />
    </div>
  );
};
