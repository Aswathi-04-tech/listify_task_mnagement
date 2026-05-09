/*
 * AuthContext
 * Provides authentication state and actions throughout the app
 */

import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage for persistence across refreshes
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      setUser({ _id: data._id, name: data.name, email: data.email });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Registration failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      setUser({ _id: data._id, name: data.name, email: data.email });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
