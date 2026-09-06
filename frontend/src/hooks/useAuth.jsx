/**
 * useAuth Hook
 * Provides authentication state and operations
 */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import authService from '../services/authService';

/**
 * @typedef {Object} AuthUser
 * @property {string} _id
 * @property {string} username
 * @property {string} email
 * @property {string} user_type
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} UseAuthReturn
 * @property {AuthUser|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} loading
 * @property {Function} login
 * @property {Function} register
 * @property {Function} logout
 * @property {Function} refreshUser
 */

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the app and provides authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const result = await authService.getProfile();
        if (result.success) {
          setUser(result.data);
        } else {
          // Token is invalid, clear it
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      setUser({
        _id: result.data._id,
        username: result.data.username,
        email: result.data.email,
        user_type: result.data.user_type
      });
    }
    return result;
  }, []);

  const register = useCallback(async (username, email, password, user_type) => {
    const result = await authService.register(username, email, password, user_type);
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      setUser({
        _id: result.data._id,
        username: result.data.username,
        email: result.data.email,
        user_type: result.data.user_type
      });
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const result = await authService.getProfile();
    if (result.success) {
      setUser(result.data);
    }
    return result;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {UseAuthReturn}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
