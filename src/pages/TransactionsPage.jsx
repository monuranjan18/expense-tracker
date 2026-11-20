import React, { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useCurrency } from '../context/CurrencyContext';
import { TransactionItem } from '../components/transactions/TransactionItem';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { exportTransactionsToCsv } from '../utils/exportCsv';
import { Plus, Download, Receipt, ArrowUpDown } from 'lucide-react';

export const TransactionsPage = () => {
  const {
    transactions,
    loading,
    removeTransaction,
  } = useTransactions();
  const { format } = useCurrency();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txToDelete, setTxToDelete] = useState(null);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
  };

  // Filter & Sort Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesDesc = (tx.description || '').toLowerCase().includes(q);
          const matchesCategory = (tx.category || '').toLowerCase().includes(q);
          const matchesNotes = (tx.notes || '').toLowerCase().includes(q);
          const matchesMethod = (tx.paymentMethod || '').toLowerCase().includes(q);
          if (!matchesDesc && !matchesCategory && !matchesNotes && !matchesMethod) {
            return false;
          }
        }

        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
          return false;
        }

        // Date range
        if (startDate && tx.date < startDate) return false;
        if (endDate && tx.date > endDate) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'date-desc') {
          return new Date(b.date) - new Date(a.date);
        }
        if (sortOrder === 'date-asc') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortOrder === 'amount-desc') {
          return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        }
        if (sortOrder === 'amount-asc') {
          return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, startDate, endDate, sortOrder]);

  // Aggregate sums of filtered transactions
  const { totalFilteredIncome, totalFilteredExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredTransactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') inc += amt;
      else exp += amt;
    });
    return { totalFilteredIncome: inc, totalFilteredExpense: exp };
  }, [filteredTransactions]);

  const handleExport = () => {
    exportTransactionsToCsv(filteredTransactions, `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleDeleteConfirm = async () => {
    if (txToDelete) {
      await removeTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, filter, and track all your income and expenses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSelectedTx(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <TransactionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onResetFilters={handleResetFilters}
      />

      {/* Subheader: Results count & summary badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>Showing <strong>{filteredTransactions.length}</strong> transactions</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Income: {format(totalFilteredIncome)}
          </span>
          <span className="text-rose-600 dark:text-rose-400 font-medium">
            Expense: {format(totalFilteredExpense)}
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description={
            transactions.length === 0
              ? 'Start by recording your first transaction.'
              : 'Try clearing your filters or search term to see more results.'
          }
          actionLabel={transactions.length === 0 ? 'Add First Transaction' : 'Clear Filters'}
          onAction={
            transactions.length === 0
              ? () => {
                  setSelectedTx(null);
                  setIsModalOpen(true);
                }
              : handleResetFilters
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={(item) => {
                setSelectedTx(item);
                setIsModalOpen(true);
              }}
              onDelete={(item) => setTxToDelete(item)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }}
        transactionToEdit={selectedTx}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message={`Are you sure you want to delete the transaction "${txToDelete?.description}" of ${format(
          txToDelete?.amount || 0
        )}?`}
      />
    </div>
  );
};
