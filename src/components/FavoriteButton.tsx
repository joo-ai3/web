import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import clsx from 'clsx';

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  size?: number;
  showToast?: boolean;
}

export default function FavoriteButton({ 
  productId, 
  className = '', 
  size = 20, 
  showToast: showToastProp = true 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const t = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);

  const isCurrentlyFavorite = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    toggleFavorite(productId);
    
    if (showToastProp) {
      const message = isCurrentlyFavorite ? t("removeFromFavorites") : t("addToFavorites");
      showToast(message);
    }
    
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={clsx(
        'favorite-btn relative overflow-hidden group',
        {
          'active': isCurrentlyFavorite,
          'animate-heart-beat': isAnimating
        },
        className
      )}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.15 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      aria-label={isCurrentlyFavorite ? t("removeFromFavorites") : t("addToFavorites")}
      style={{
        width: size * 2.2,
        height: size * 2.2,
        background: isCurrentlyFavorite 
          ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
          : theme === 'dark' 
            ? 'rgba(23, 23, 23, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: isCurrentlyFavorite 
          ? '1px solid #ef4444' 
          : theme === 'dark'
            ? '1px solid rgba(209, 177, 106, 0.3)'
            : '1px solid rgba(209, 177, 106, 0.4)',
        borderRadius: '50%',
        boxShadow: isCurrentlyFavorite
          ? '0 8px 25px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.2)'
          : theme === 'dark'
            ? '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(209, 177, 106, 0.15)'
            : '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(209, 177, 106, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Animated Background Gradient */}
      <div 
        className={clsx(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isCurrentlyFavorite 
            ? "bg-gradient-to-br from-red-400/20 to-red-600/20" 
            : "bg-gradient-to-br from-[#d1b16a]/20 to-[#d1b16a]/10"
        )}
      />
      
      {/* Ripple Effect */}
      <div 
        className={clsx(
          "absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-150",
          isCurrentlyFavorite 
            ? "bg-red-500/30" 
            : "bg-[#d1b16a]/30"
        )}
      />

      <motion.div
        animate={{
          scale: isAnimating ? [1, 1.4, 1] : 1,
          rotate: isAnimating ? [0, -15, 15, 0] : 0,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 flex items-center justify-center w-full h-full"
      >
        <FiHeart 
          size={size} 
          className={clsx(
            'transition-all duration-300',
            isCurrentlyFavorite 
              ? 'fill-current text-white drop-shadow-sm' 
              : theme === 'dark'
                ? 'text-gray-300 group-hover:text-[#d1b16a]'
                : 'text-gray-600 group-hover:text-[#d1b16a]'
          )}
          style={{
            filter: isCurrentlyFavorite 
              ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' 
              : 'none'
          }}
        />
      </motion.div>

      {/* Pulse Animation for Active State */}
      {isCurrentlyFavorite && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
}