import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ className = '', size = 'medium' }: LogoProps) {
  const sizeClasses = {
    small: 'h-7 sm:h-8',
    medium: 'h-9 sm:h-10', 
    large: 'h-12 sm:h-14'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="logo-container">
        <img 
          src="/logo.png" 
          alt="Soleva" 
          className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105 drop-shadow-sm`}
        />
      </div>
    </Link>
  );
}