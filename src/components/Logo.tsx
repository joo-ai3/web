import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showSlogan?: boolean;
}

export default function Logo({ className = '', size = 'medium', showText = true, showSlogan = false }: LogoProps) {
  const { lang } = useLang();
  
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10', 
    large: 'h-14'
  };

  const textSizeClasses = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  const sloganSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex-shrink-0 logo-container">
        <img 
          src="/logo.png" 
          alt="Soleva" 
          className={`${sizeClasses[size]} w-auto transition-all duration-300 hover:scale-105 drop-shadow-md`}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-[#d1b16a] ${textSizeClasses[size]} tracking-wide`}>
            SOLEVA
          </span>
          {showSlogan && (
            <span className={`text-gray-600 ${sloganSizeClasses[size]} font-medium tracking-wide`}>
              {lang === 'ar' ? 'خطوتك تفرق' : 'Made to Move'}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}