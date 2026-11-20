import React from 'react';
import { StatCard } from '../common/StatCard';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { useCurrency } from '../../context/CurrencyContext';

export const SummaryCards = () => {
  const { stats } = useTransactions();
  const { format } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* Total Balance */}
      <StatCard
        title="Total Balance"
        value={format(stats.totalBalance)}
        subtitle="Current net available"
        icon={Wallet}
        variant="balance"
      />

      {/* Total Income */}
      <StatCard
        title="Total Income"
        value={format(stats.totalIncome)}
        subtitle="All-time earnings"
        icon={TrendingUp}
        variant="income"
      />

      {/* Total Expenses */}
      <StatCard
        title="Total Expenses"
        value={format(stats.totalExpense)}
        subtitle="All-time spendings"
        icon={TrendingDown}
        variant="expense"
      />

      {/* Monthly Savings */}
      <StatCard
        title="Monthly Savings"
        value={format(stats.currentMonthBalance)}
        subtitle={`${stats.monthlySavingsRate.toFixed(1)}% saved this month`}
        icon={PiggyBank}
        variant="brand"
      />
    </div>
  );
};
