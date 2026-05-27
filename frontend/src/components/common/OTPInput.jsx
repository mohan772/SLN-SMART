import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setActiveIdx(index + 1);
    }

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveIdx(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, '').split("").slice(0, length);
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    
    const nextIndex = pastedData.length < length ? pastedData.length : length - 1;
    inputRefs.current[nextIndex].focus();
    setActiveIdx(nextIndex);

    if (pastedData.length === length) {
      onComplete(pastedData.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-3 sm:gap-4" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <motion.div
          key={index}
          whileFocus={{ scale: 1.05 }}
          className="relative"
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onFocus={() => setActiveIdx(index)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-soft-white border-2 rounded-2xl outline-none transition-all duration-300 ${
              activeIdx === index 
                ? 'border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] bg-white' 
                : 'border-beige'
            } ${digit ? 'text-forest' : 'text-olive'}`}
          />
          {activeIdx === index && (
            <motion.div 
              layoutId="otp-indicator"
              className="absolute -bottom-1 left-2 right-2 h-1 bg-gold rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default OTPInput;

