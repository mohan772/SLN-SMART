import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.name) {
      setError('Username, password, and name are required');
      return;
    }
    const res = await register(formData);
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 bg-cream/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-beige"
      >
        <div className="p-8 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif font-bold text-forest mb-3">Join Us</h2>
            <p className="text-olive">Experience the farm-to-table difference</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <User size={16} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <User size={16} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest ml-1">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <Mail size={16} />
                </div>
                <input
                  name="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest ml-1">Phone</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <Phone size={16} />
                </div>
                <input
                  name="phone"
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-forest ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-olive">
                  <Lock size={16} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all text-sm font-medium"
                  placeholder="Choose a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-4 flex items-center justify-center space-x-3 group text-lg mt-6"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-8 bg-soft-white border-t border-beige text-center">
          <p className="text-olive font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-gold font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
