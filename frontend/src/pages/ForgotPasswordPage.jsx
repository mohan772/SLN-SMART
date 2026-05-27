import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, ChevronLeft, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import OTPInput from '../components/common/OTPInput';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP & New Password
  const [timer, setTimer] = useState(30);

  const { sendOTP, verifyOTPAndAction, loading, error, setError, setLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 10) {
        setError('Please enter a valid mobile number');
        return;
    }
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const res = await sendOTP(formattedPhone);
    if (res.success) {
      setStep(2);
      setTimer(30);
    }
  };

  const handleResetPassword = async (otpValue) => {
    if (!otpValue && !otp) {
        setError('Please enter the OTP');
        return;
    }
    if (!password) {
        setError('Please enter your new password');
        return;
    }
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const res = await verifyOTPAndAction(otpValue || otp, 'reset-password', { 
      phoneNumber: formattedPhone,
      password 
    });
    if (res.success) {
        navigate('/login', { state: { message: 'Password reset successful. Please login.' } });
    }
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
            <h2 className="text-4xl font-serif font-bold text-forest mb-3">Reset</h2>
            <p className="text-olive">Securely recover your account access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 block"></span>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOTP} 
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-forest ml-1">Registered Mobile Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-olive font-bold border-r border-beige pr-3 flex items-center gap-2">
                        <Phone size={18} className="text-gold" />
                        <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      className="w-full pl-24 pr-4 py-4 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all text-lg font-bold tracking-wider"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
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
                      <span>Send Reset Code</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="reset-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-2 -ml-2 mb-2">
                    <button 
                        onClick={() => setStep(1)}
                        className="p-2 hover:bg-soft-white rounded-full text-olive transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h3 className="font-bold text-forest">Verification Code</h3>
                        <p className="text-xs text-olive">Sent to +91 {phoneNumber}</p>
                    </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3 text-center">
                    <label className="block text-sm font-bold text-forest text-left ml-1">Enter 6-digit Code</label>
                    <OTPInput length={6} onComplete={(val) => setOtp(val)} />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-forest ml-1">New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gold">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="w-full pl-11 pr-12 py-4 bg-soft-white border-2 border-beige rounded-2xl focus:border-gold outline-none transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-olive hover:text-gold"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 pt-2">
                    <div className="text-sm font-medium">
                        {timer > 0 ? (
                            <p className="text-olive">Resend code in <span className="text-gold font-bold">{timer}s</span></p>
                        ) : (
                            <button 
                                onClick={handleSendOTP}
                                className="text-gold font-bold hover:underline underline-offset-4"
                            >
                                Resend Code
                            </button>
                        )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleResetPassword()}
                  disabled={loading}
                  className="w-full btn-premium py-5 flex items-center justify-center space-x-3 group text-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ShieldCheck size={20} />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-soft-white border-t border-beige text-center">
          <Link to="/login" className="text-gold font-bold hover:underline underline-offset-4 flex items-center justify-center gap-2 mx-auto">
            <ChevronLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
