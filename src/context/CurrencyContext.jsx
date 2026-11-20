import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_currency');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return CURRENCIES[0]; // INR ₹ by default
  });

  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('expense_tracker_currency', JSON.stringify(newCurrency));
  };

  const format = (amount) => {
    return formatCurrency(amount, currency.symbol, currency.code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};
