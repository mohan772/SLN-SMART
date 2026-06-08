import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
      const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Send OTP using Backend (MSG91)
  const sendOTP = async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.post('/auth/send-otp', { phoneNumber });
      
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Send OTP Error:", err);
      const message = err.response?.data?.message || 'Failed to send OTP';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and then call backend action (register/login/reset)
  const verifyOTPAndAction = async (otp, action, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const phoneNumber = userData.phoneNumber || userData.phone;

      const endpoint = action === 'register' 
        ? '/auth/register' 
        : action === 'reset-password'
          ? '/auth/reset-password'
          : '/auth/login';
      
      const payload = { ...userData, otp };

      const res = await api.post(endpoint, payload);
      
      if (action !== 'reset-password') {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
      }
      
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Verification failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Simple Login with Username and Password
  const login = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);
      
const res = await api.post('/auth/login', { identifier, password });

      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Simple Register with Username and Password
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
const res = await api.post('/auth/register', userData);

      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        logout,
        login,
        register,
        sendOTP,
        verifyOTPAndAction,
        setLoading,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

