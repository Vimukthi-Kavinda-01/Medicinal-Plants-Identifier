import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const JWT_KEY = 'herbsense_jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(JWT_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // On mount: rehydrate user from stored JWT
  useEffect(() => {
    const storedToken = localStorage.getItem(JWT_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    async function rehydrate() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem(JWT_KEY);
          setToken(null);
          setUser(null);
        }
      } catch {
        // Network error — keep token but no user until next attempt
        localStorage.removeItem(JWT_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    rehydrate();
  }, []);

  const login = useCallback(async (loginStr, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: loginStr, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Login failed');
    }

    localStorage.setItem(JWT_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Registration failed');
    }

    localStorage.setItem(JWT_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(JWT_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
