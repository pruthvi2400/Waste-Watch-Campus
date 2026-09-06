/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

/**
 * Route protection for authenticated users
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render if authenticated
 * @param {Array<string>} [props.allowedRoles] - Optional array of allowed user types
 * @param {React.ReactNode} [props.fallback] - Optional fallback component
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null, 
  fallback = null 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <Loading fullScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.user_type)) {
      // Redirect to appropriate page based on role
      if (user.user_type === 'cleaning_staff') {
        return <Navigate to="/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;
