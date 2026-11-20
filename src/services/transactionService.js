import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { SAMPLE_TRANSACTIONS } from '../utils/sampleData';

const getLocalStorageKey = (userId) => `expense_tracker_tx_${userId || 'guest'}`;

export const getStoredTransactions = (userId) => {
  const data = localStorage.getItem(getLocalStorageKey(userId));
  if (!data) {
    // Initialize with sample transactions for demo/preview purposes if empty
    localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(SAMPLE_TRANSACTIONS));
    return SAMPLE_TRANSACTIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredTransactions = (userId, transactions) => {
  localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(transactions));
  // Dispatch custom event for cross-component sync in demo mode
  window.dispatchEvent(new CustomEvent('expense_tracker_tx_updated', { detail: { userId } }));
};

export const subscribeToTransactions = (userId, onNext, onError) => {
  if (!userId) {
    onNext([]);
    return () => {};
  }

  if (isFirebaseConfigured && db) {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const transactions = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        onNext(transactions);
      },
      (error) => {
        console.error('Firestore transactions error:', error);
        if (onError) onError(error);
      }
    );
  } else {
    // Demo / Local storage mode
    const loadData = () => {
      const txs = getStoredTransactions(userId);
      // Sort by date desc
      txs.sort((a, b) => new Date(b.date) - new Date(a.date));
      onNext(txs);
    };

    loadData();

    const handler = (e) => {
      if (!e.detail || e.detail.userId === userId) {
        loadData();
      }
    };

    window.addEventListener('expense_tracker_tx_updated', handler);
    return () => window.removeEventListener('expense_tracker_tx_updated', handler);
  }
};

export const addTransaction = async (userId, transactionData) => {
  if (!userId) throw new Error('User ID is required');

  const cleanData = {
    ...transactionData,
    amount: Number(transactionData.amount) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    const ref = collection(db, 'users', userId, 'transactions');
    const docRef = await addDoc(ref, {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...cleanData };
  } else {
    const current = getStoredTransactions(userId);
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...cleanData,
    };
    saveStoredTransactions(userId, [newTx, ...current]);
    return newTx;
  }
};

export const updateTransaction = async (userId, transactionId, updatedData) => {
  if (!userId || !transactionId) throw new Error('User and Transaction ID are required');

  const cleanData = {
    ...updatedData,
    amount: Number(updatedData.amount) || 0,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId, 'transactions', transactionId);
    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
    return { id: transactionId, ...cleanData };
  } else {
    const current = getStoredTransactions(userId);
    const updated = current.map((tx) =>
      tx.id === transactionId ? { ...tx, ...cleanData } : tx
    );
    saveStoredTransactions(userId, updated);
    return { id: transactionId, ...cleanData };
  }
};

export const deleteTransaction = async (userId, transactionId) => {
  if (!userId || !transactionId) throw new Error('User and Transaction ID are required');

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(docRef);
    return transactionId;
  } else {
    const current = getStoredTransactions(userId);
    const filtered = current.filter((tx) => tx.id !== transactionId);
    saveStoredTransactions(userId, filtered);
    return transactionId;
  }
};
