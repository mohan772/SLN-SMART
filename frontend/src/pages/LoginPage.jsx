import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    const res = await login(username, password);
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 bg-cream/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-beige"
      >
        <div className="p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif font-bold text-forest mb-3">Sign In</h2>
            <p className="text-olive">Fresh produce delivered to your doorstep</p>
          </div>

          {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-forest ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all font-medium"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-forest ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all font-medium"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-5 flex items-center justify-center space-x-3 group text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-8 bg-soft-white border-t border-beige text-center">
          <p className="text-olive font-medium">
            New to SLN?{' '}
            <Link to="/register" className="text-gold font-bold hover:underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

