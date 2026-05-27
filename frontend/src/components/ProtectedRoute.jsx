import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, isAdmin }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center bg-soft-white"><div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
