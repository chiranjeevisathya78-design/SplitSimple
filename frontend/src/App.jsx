import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailPage from './pages/GroupDetailPage';
import ExpensesPage from './pages/ExpensesPage';
import CreateExpensePage from './pages/CreateExpensePage';
import BalancesPage from './pages/BalancesPage';
import SettlementsPage from './pages/SettlementsPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/new" element={<CreateGroupPage />} />
            <Route path="/groups/:id" element={<GroupDetailPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/new" element={<CreateExpensePage />} />
            <Route path="/balances" element={<BalancesPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
