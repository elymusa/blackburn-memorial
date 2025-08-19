import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect ensures that when the app loads, we correctly set the auth state.
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ username, password });

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', body, config);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      // On failure, clear any potential stale token and throw error
      logout();
      throw new Error(err.response ? err.response.data.msg : 'Login Failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;