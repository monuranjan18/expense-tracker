import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { SAMPLE_BUDGETS } from '../utils/sampleData';

const getLocalStorageKey = (userId) => `expense_tracker_budgets_${userId || 'guest'}`;

export const getStoredBudgets = (userId) => {
  const data = localStorage.getItem(getLocalStorageKey(userId));
  if (!data) {
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(SAMPLE_BUDGETS));
    return SAMPLE_BUDGETS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredBudgets = (userId, budgets) => {
  localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(budgets));
  window.dispatchEvent(new CustomEvent('expense_tracker_budgets_updated', { detail: { userId } }));
};

export const subscribeToBudgets = (userId, onNext, onError) => {
  if (!userId) {
    onNext([]);
    return () => {};
  }

  if (isFirebaseConfigured && db) {
    const budgetsRef = collection(db, 'users', userId, 'budgets');
    const q = query(budgetsRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const budgets = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onNext(budgets);
      },
      (error) => {
        console.error('Firestore budgets error:', error);
        if (onError) onError(error);
      }
    );
  } else {
    const loadData = () => {
      const budgets = getStoredBudgets(userId);
      onNext(budgets);
    };

    loadData();

    const handler = (e) => {
      if (!e.detail || e.detail.userId === userId) {
        loadData();
      }
    };

    window.addEventListener('expense_tracker_budgets_updated', handler);
    return () => window.removeEventListener('expense_tracker_budgets_updated', handler);
  }
};

export const addBudget = async (userId, budgetData) => {
  if (!userId) throw new Error('User ID is required');

  const cleanData = {
    ...budgetData,
    amount: Number(budgetData.amount) || 0,
    month: budgetData.month || new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    const ref = collection(db, 'users', userId, 'budgets');
    const docRef = await addDoc(ref, {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...cleanData };
  } else {
    const current = getStoredBudgets(userId);
    const newBudget = {
      id: 'budget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...cleanData,
    };
    saveStoredBudgets(userId, [...current, newBudget]);
    return newBudget;
  }
};

export const updateBudget = async (userId, budgetId, updatedData) => {
  if (!userId || !budgetId) throw new Error('User and Budget ID are required');

  const cleanData = {
    ...updatedData,
    amount: Number(updatedData.amount) || 0,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId, 'budgets', budgetId);
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
    return { id: budgetId, ...cleanData };
  } else {
    const current = getStoredBudgets(userId);
    const updated = current.map((b) =>
      b.id === budgetId ? { ...b, ...cleanData } : b
    );
    saveStoredBudgets(userId, updated);
    return { id: budgetId, ...cleanData };
  }
};

export const deleteBudget = async (userId, budgetId) => {
  if (!userId || !budgetId) throw new Error('User and Budget ID are required');

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId, 'budgets', budgetId);
    await deleteDoc(docRef);
    return budgetId;
  } else {
    const current = getStoredBudgets(userId);
    const filtered = current.filter((b) => b.id !== budgetId);
    saveStoredBudgets(userId, filtered);
    return budgetId;
  }
};
