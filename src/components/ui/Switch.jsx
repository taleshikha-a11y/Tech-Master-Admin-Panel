import React from 'react';
import { motion } from 'framer-motion';

export const Switch = ({
  checked,
  onChange,
  disabled = false,
  label = '',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-300 flex items-center ${
          checked 
            ? 'bg-gradient-to-r from-luxury-gold to-luxury-darkgold' 
            : 'bg-zinc-800 border border-zinc-700/50'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`w-5 h-5 rounded-full shadow-md ${checked ? 'bg-black' : 'bg-zinc-400'}`}
          style={{ x: checked ? '20px' : '0px' }}
        />
      </div>
      {label && (
        <span className={`text-xs font-semibold uppercase tracking-wider ${checked ? 'text-luxury-gold' : 'text-zinc-500'}`}>
          {label}
        </span>
      )}
    </div>
  );
};
