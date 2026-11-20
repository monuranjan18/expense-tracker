import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { TransactionProvider } from './context/TransactionContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <TransactionProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Application Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="budgets" element={<BudgetsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </TransactionProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
