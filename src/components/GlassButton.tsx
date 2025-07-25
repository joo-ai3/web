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
        scale: 1.03, 
        boxShadow: "0 12px 30px rgba(209, 177, 106, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        y: -3
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={clsx(
        "glass px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold uppercase border border-[#d1b16a] rounded-xl shadow flex items-center justify-center gap-2 min-h-[44px] will-change-transform relative overflow-hidden",
        "hover:bg-[#d1b16a]/70 hover:text-[#111] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}