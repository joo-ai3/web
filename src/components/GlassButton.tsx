import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function GlassButton({ children, className = "", ...props }: GlassButtonProps) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 16px 40px rgba(209, 177, 106, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.3)",
        y: -4
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={clsx(
        "glass px-5 sm:px-7 py-3 text-base sm:text-lg font-semibold uppercase border border-[#d1b16a] rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[48px] will-change-transform relative overflow-hidden",
        "hover:bg-[#d1b16a]/80 hover:text-[#111] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600",
        "backdrop-filter-enhanced",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}