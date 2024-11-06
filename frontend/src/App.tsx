import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuthCheck';
import { ProgressSpinner } from 'primereact/progressspinner';
import Application from './layout/MainLayout';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { ToastProvider } from './context/ToastContext';
import Toast from './lib/Toast';
import Auth from './components/Auth';
import ProtectedRoute from './lib/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { isLoading } = useAuthCheck();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? <Navigate to="/app" replace /> : <Auth signUp={true} />
        } 
      />
      <Route 
        path="/signin" 
        element={
          isAuthenticated ? <Navigate to="/app" replace /> : <Auth signUp={false} />
        } 
      />
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <Application />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/app" replace /> : <Auth signUp={false} />
        } 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
        <Toast />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;