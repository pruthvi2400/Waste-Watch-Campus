import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get('/api/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Only clear token if the request failed with actual authorization issue
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser({
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        user_type: response.data.user_type
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (username, email, password, user_type) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        user_type
      });

      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser({
        _id: response.data._id,
        username: response.data.username,
        email: response.data.email,
        user_type: response.data.user_type
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
