import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { useTransactions } from '../../context/TransactionContext';
import { useCurrency } from '../../context/CurrencyContext';

export const BudgetModal = ({ isOpen, onClose, budgetToEdit = null }) => {
  const { createBudget, editBudget, budgets } = useTransactions();
  const { currency } = useCurrency();

  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category || EXPENSE_CATEGORIES[0]);
      setAmount(budgetToEdit.amount || '');
      setMonth(budgetToEdit.month || new Date().toISOString().slice(0, 7));
    } else {
      // Pick first unallocated category if possible
      const allocated = budgets.map((b) => b.category);
      const unallocated = EXPENSE_CATEGORIES.find((c) => !allocated.includes(c));
      setCategory(unallocated || EXPENSE_CATEGORIES[0]);
      setAmount('');
      setMonth(new Date().toISOString().slice(0, 7));
    }
    setError('');
  }, [budgetToEdit, isOpen, budgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please set a budget limit greater than 0.');
      return;
    }

    // Check duplicate category if creating new
    if (!budgetToEdit) {
      const exists = budgets.some(
        (b) => b.category.toLowerCase() === category.toLowerCase() && b.month === month
      );
      if (exists) {
        setError(`A budget for ${category} in this month already exists. Please edit it instead.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        category,
        amount: parseFloat(amount),
        month,
      };

      if (budgetToEdit && budgetToEdit.id) {
        await editBudget(budgetToEdit.id, payload);
      } else {
        await createBudget(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Edit Budget Limit' : 'Set Category Budget'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 rounded-xl border border-rose-200/50 dark:border-rose-900/50">
            {error}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Expense Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={Boolean(budgetToEdit)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Limit Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Monthly Limit ({currency.symbol})
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              {currency.symbol}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              required
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            You will be alerted when spending in {category} approaches 80% or exceeds this limit.
          </p>
        </div>

        {/* Target Month */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
            Month
          </label>
          <input
            type="month"
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : budgetToEdit ? 'Update Budget' : 'Set Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
