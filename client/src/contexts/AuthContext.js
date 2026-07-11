import React, { createContext, useState, useContext } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('AdminToken') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [loading, setLoading] = useState(false);

  const login = async (loginData) => {
    setLoading(true);
    try {
      const data = await authService.login(loginData);
      localStorage.setItem('token', data.token);
      const user = data.user?.username || 'user';
      localStorage.setItem('username', user);
      
      setToken(data.token);
      setUsername(user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      return await authService.register(registerData);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (adminData) => {
    setLoading(true);
    try {
      const data = await authService.adminLogin(adminData);
      localStorage.setItem('AdminToken', data.token);
      setAdminToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const adminRegister = async (registerData) => {
    setLoading(true);
    try {
      return await authService.adminRegister(registerData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
  };

  const adminLogout = () => {
    localStorage.removeItem('AdminToken');
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      adminToken,
      username,
      loading,
      login,
      register,
      adminLogin,
      adminRegister,
      logout,
      adminLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
