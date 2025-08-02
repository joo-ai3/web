import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
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
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={clsx(
        'favorite-btn',
        {
          'active': isCurrentlyFavorite,
          'animate-heart-beat': isAnimating
        },
        className
      )}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.15 }}
      aria-label={isCurrentlyFavorite ? t("removeFromFavorites") : t("addToFavorites")}
    >
      <motion.div
        animate={{
          scale: isAnimating ? [1, 1.3, 1] : 1,
          rotate: isAnimating ? [0, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <FiHeart 
          size={size} 
          className={clsx(
            'transition-all duration-200',
            isCurrentlyFavorite 
              ? 'fill-current text-white' 
              : 'text-gray-600'
          )}
        />
      </motion.div>
    </motion.button>
  );
}