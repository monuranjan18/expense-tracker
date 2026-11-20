import React from 'react';
import { TransactionItem } from '../transactions/TransactionItem';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../common/EmptyState';

export const RecentTransactions = ({ transactions = [], onEdit, onDelete, onAddNew }) => {
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Recent Transactions
          </h3>
        </div>

        <Link
          to="/transactions"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 transition"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          title="No recent transactions"
          description="Record your income or expenses to see them here."
          actionLabel="Add Transaction"
          onAction={onAddNew}
        />
      ) : (
        <div className="space-y-2.5">
          {recent.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
