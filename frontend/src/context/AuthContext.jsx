import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me', {
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
      
      const res = await axios.post('/api/auth/send-otp', { phoneNumber });
      
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
        ? '/api/auth/register' 
        : action === 'reset-password'
          ? '/api/auth/reset-password'
          : '/api/auth/login';
      
      const payload = { ...userData, otp };

      const res = await axios.post(endpoint, payload);
      
      if (action !== 'reset-password') {
        localStorage.setItem('token', res.data.token);
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
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/auth/login', { username, password });
      
      localStorage.setItem('token', res.data.token);
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
      
      const res = await axios.post('/api/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
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
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
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

