/**
 * AuthContext - Legacy compatibility wrapper
 * Now uses the useAuth hook internally
 * @deprecated Use useAuth hook directly instead
 */
import React from 'react';
import { AuthProvider as NewAuthProvider, useAuth as useNewAuth } from '../hooks/useAuth';

// Re-export the AuthProvider and useAuth hook for backward compatibility
export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  return <NewAuthProvider>{children}</NewAuthProvider>;
};

export const useAuth = () => {
  const auth = useNewAuth();
  return auth;
};

export default AuthProvider;
