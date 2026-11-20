import React, { useMemo } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { Calendar, TrendingDown, TrendingUp, Award, Clock } from 'lucide-react';

export const WeeklyMonthlyBreakdown = ({ transactions = [] }) => {
  const { format } = useCurrency();

  const metrics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // This week (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Previous week (8 to 14 days ago)
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // This month (1st of current month)
    const currentMonthPrefix = now.toISOString().slice(0, 7);

    // Last month
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${String(
      lastMonthDate.getMonth() + 1
    ).padStart(2, '0')}`;

    let thisWeekExpense = 0;
    let prevWeekExpense = 0;
    let thisMonthExpense = 0;
    let lastMonthExpense = 0;
    let totalExpenseDays = new Set();
    const categoryTotals = {};

    transactions.forEach((tx) => {
      if (tx.type !== 'expense' || !tx.date) return;
      const amount = Number(tx.amount) || 0;
      const txDate = new Date(tx.date);

      if (txDate >= sevenDaysAgo && txDate <= today) {
        thisWeekExpense += amount;
      } else if (txDate >= fourteenDaysAgo && txDate < sevenDaysAgo) {
        prevWeekExpense += amount;
      }

      if (tx.date.startsWith(currentMonthPrefix)) {
        thisMonthExpense += amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
        totalExpenseDays.add(tx.date);
      }

      if (tx.date.startsWith(lastMonthPrefix)) {
        lastMonthExpense += amount;
      }
    });

    const activeDaysCount = Math.max(1, totalExpenseDays.size);
    const avgDailySpend = thisMonthExpense / activeDaysCount;

    // Find top category
    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > topCategoryAmount) {
        topCategory = cat;
        topCategoryAmount = amt;
      }
    });

    // Percentage changes
    const weekDiff = prevWeekExpense > 0
      ? Math.round(((thisWeekExpense - prevWeekExpense) / prevWeekExpense) * 100)
      : 0;

    const monthDiff = lastMonthExpense > 0
      ? Math.round(((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100)
      : 0;

    return {
      thisWeekExpense,
      prevWeekExpense,
      weekDiff,
      thisMonthExpense,
      lastMonthExpense,
      monthDiff,
      avgDailySpend,
      topCategory,
      topCategoryAmount,
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 7-Day Spending */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Last 7 Days</span>
          <Clock className="w-4 h-4 text-brand-500" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {format(metrics.thisWeekExpense)}
        </div>
        <div className="text-[11px] mt-1 flex items-center gap-1">
          {metrics.weekDiff > 0 ? (
            <span className="text-rose-500 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{metrics.weekDiff}%
            </span>
          ) : (
            <span className="text-emerald-500 font-medium flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> {metrics.weekDiff}%
            </span>
          )}
          <span className="text-slate-400">vs prev 7 days</span>
        </div>
      </div>

      {/* Monthly Spending */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>This Month</span>
          <Calendar className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {format(metrics.thisMonthExpense)}
        </div>
        <div className="text-[11px] mt-1 flex items-center gap-1">
          {metrics.monthDiff > 0 ? (
            <span className="text-rose-500 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{metrics.monthDiff}%
            </span>
          ) : (
            <span className="text-emerald-500 font-medium flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> {metrics.monthDiff}%
            </span>
          )}
          <span className="text-slate-400">vs last month</span>
        </div>
      </div>

      {/* Avg Daily Spend */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Avg Daily Spend</span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {format(metrics.avgDailySpend)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Based on active spending days
        </div>
      </div>

      {/* Top Spending Category */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Top Category</span>
          <Award className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
          {metrics.topCategory}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          {format(metrics.topCategoryAmount)} spent this month
        </div>
      </div>
    </div>
  );
};
