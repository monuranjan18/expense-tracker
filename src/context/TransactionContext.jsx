import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  saveStoredTransactions,
} from '../services/transactionService';
import {
  subscribeToBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  saveStoredBudgets,
} from '../services/budgetService';
import { SAMPLE_TRANSACTIONS, SAMPLE_BUDGETS } from '../utils/sampleData';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest_demo';

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to transactions
  useEffect(() => {
    setLoading(true);
    const unsubTx = subscribeToTransactions(
      userId,
      (data) => {
        setTransactions(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    const unsubBudgets = subscribeToBudgets(
      userId,
      (data) => {
        setBudgets(data);
      },
      (err) => {
        console.error(err);
      }
    );

    return () => {
      if (typeof unsubTx === 'function') unsubTx();
      if (typeof unsubBudgets === 'function') unsubBudgets();
    };
  }, [userId]);

  // Aggregate Calculations
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    const currentYearMonth = new Date().toISOString().slice(0, 7);
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;

    const categoryExpenseMap = {};
    const categoryIncomeMap = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const txMonth = tx.date ? tx.date.slice(0, 7) : '';

      if (tx.type === 'income') {
        totalIncome += amount;
        categoryIncomeMap[tx.category] = (categoryIncomeMap[tx.category] || 0) + amount;
        if (txMonth === currentYearMonth) {
          currentMonthIncome += amount;
        }
      } else {
        totalExpense += amount;
        categoryExpenseMap[tx.category] = (categoryExpenseMap[tx.category] || 0) + amount;
        if (txMonth === currentYearMonth) {
          currentMonthExpense += amount;
        }
      }
    });

    const totalBalance = totalIncome - totalExpense;
    const currentMonthBalance = currentMonthIncome - currentMonthExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const monthlySavingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100 : 0;

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      savingsRate: Math.max(0, savingsRate),
      currentMonthIncome,
      currentMonthExpense,
      currentMonthBalance,
      monthlySavingsRate: Math.max(0, monthlySavingsRate),
      categoryExpenseMap,
      categoryIncomeMap,
    };
  }, [transactions]);

  // Compute budget progress and alerts
  const budgetProgress = useMemo(() => {
    const currentYearMonth = new Date().toISOString().slice(0, 7);

    // Calculate actual spending per category for current month
    const monthlyCategorySpending = {};
    transactions.forEach((tx) => {
      if (tx.type === 'expense' && tx.date && tx.date.startsWith(currentYearMonth)) {
        const cat = tx.category || 'Other';
        monthlyCategorySpending[cat] = (monthlyCategorySpending[cat] || 0) + Number(tx.amount);
      }
    });

    const enrichedBudgets = budgets.map((b) => {
      // Use actual transactions spending for current month or stored spent
      const spent = monthlyCategorySpending[b.category] !== undefined
        ? monthlyCategorySpending[b.category]
        : (b.spent || 0);

      const limit = Number(b.amount) || 1;
      const percentage = Math.round((spent / limit) * 100);
      const remaining = limit - spent;
      const isExceeded = spent > limit;
      const isNearLimit = percentage >= 80 && !isExceeded;

      return {
        ...b,
        spent,
        limit,
        percentage,
        remaining,
        isExceeded,
        isNearLimit,
      };
    });

    const exceededBudgets = enrichedBudgets.filter((b) => b.isExceeded);
    const nearLimitBudgets = enrichedBudgets.filter((b) => b.isNearLimit);

    return {
      enrichedBudgets,
      exceededBudgets,
      nearLimitBudgets,
      totalBudgeted: enrichedBudgets.reduce((acc, b) => acc + b.limit, 0),
      totalBudgetSpent: enrichedBudgets.reduce((acc, b) => acc + b.spent, 0),
    };
  }, [budgets, transactions]);

  // CRUD actions
  const createTransaction = async (data) => {
    return await addTransaction(userId, data);
  };

  const editTransaction = async (id, data) => {
    return await updateTransaction(userId, id, data);
  };

  const removeTransaction = async (id) => {
    return await deleteTransaction(userId, id);
  };

  const createBudget = async (data) => {
    return await addBudget(userId, data);
  };

  const editBudget = async (id, data) => {
    return await updateBudget(userId, id, data);
  };

  const removeBudget = async (id) => {
    return await deleteBudget(userId, id);
  };

  const loadSampleData = () => {
    saveStoredTransactions(userId, SAMPLE_TRANSACTIONS);
    saveStoredBudgets(userId, SAMPLE_BUDGETS);
    setTransactions(SAMPLE_TRANSACTIONS);
    setBudgets(SAMPLE_BUDGETS);
  };

  const clearAllData = () => {
    saveStoredTransactions(userId, []);
    saveStoredBudgets(userId, []);
    setTransactions([]);
    setBudgets([]);
  };

  const value = {
    transactions,
    budgets,
    loading,
    stats,
    budgetProgress,
    createTransaction,
    editTransaction,
    removeTransaction,
    createBudget,
    editBudget,
    removeBudget,
    loadSampleData,
    clearAllData,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};
