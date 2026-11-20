import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { CategoryExpenseChart } from '../components/analytics/CategoryExpenseChart';
import { IncomeVsExpenseChart } from '../components/analytics/IncomeVsExpenseChart';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { WeeklyMonthlyBreakdown } from '../components/analytics/WeeklyMonthlyBreakdown';
import { PieChart, TrendingUp, BarChart3, Activity } from 'lucide-react';

export const AnalyticsPage = () => {
  const { transactions, stats } = useTransactions();
  const [trendDays, setTrendDays] = useState(30);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Financial Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Deep dive into your spending patterns, trends, and category distribution.
        </p>
      </div>

      {/* Quick Metrics Breakdown */}
      <WeeklyMonthlyBreakdown transactions={transactions} />

      {/* Row 1: Spending Trend Line Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Spending Trend
              </h3>
              <p className="text-xs text-slate-400">
                Daily expenditure flow over selected time window
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto text-xs">
            {[
              { days: 7, label: '7 Days' },
              { days: 14, label: '14 Days' },
              { days: 30, label: '30 Days' },
              { days: 60, label: '60 Days' },
            ].map((option) => (
              <button
                key={option.days}
                onClick={() => setTrendDays(option.days)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  trendDays === option.days
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <SpendingTrendChart transactions={transactions} days={trendDays} />
      </div>

      {/* Row 2: Category Breakdown & Income vs Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expenses Doughnut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Expenses by Category
              </h3>
              <p className="text-xs text-slate-400">Proportional distribution of expenses</p>
            </div>
          </div>
          <CategoryExpenseChart categoryExpenseMap={stats.categoryExpenseMap} />
        </div>

        {/* Monthly Income vs Expense Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Income vs Expenses Comparison
              </h3>
              <p className="text-xs text-slate-400">Historical performance over 6 months</p>
            </div>
          </div>
          <IncomeVsExpenseChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
};
