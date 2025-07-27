import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ className = '', size = 'medium' }: LogoProps) {
  const sizeClasses = {
    small: 'h-10 sm:h-12',
    medium: 'h-12 sm:h-14', 
    large: 'h-16 sm:h-18'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="logo-container flex items-center">
        <img 
          src="/logo.png" 
          alt="Soleva" 
          className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105 drop-shadow-sm`}
        />
      </div>
    </Link>
  );
}