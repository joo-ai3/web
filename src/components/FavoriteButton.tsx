import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useLang, useTranslation } from '../contexts/LangContext';

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
  const [animationType, setAnimationType] = useState<'add' | 'remove' | null>(null);

  const isCurrentlyFavorite = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasAlreadyFavorite = isCurrentlyFavorite;
    
    // Set animation type before toggling
    setAnimationType(wasAlreadyFavorite ? 'remove' : 'add');
    setIsAnimating(true);
    
    // Toggle favorite
    toggleFavorite(productId);
    
    // Show toast if enabled
    if (showToastProp) {
      const message = wasAlreadyFavorite ? t("removeFromFavorites") : t("addToFavorites");
      showToast(message);
    }
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
    }, 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`mobile-favorite-btn ${isCurrentlyFavorite ? 'favorited' : ''} ${
        isAnimating && animationType === 'add' ? 'animate-favorite-add' : ''
      } ${
        isAnimating && animationType === 'remove' ? 'animate-favorite-remove' : ''
      } ${className}`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
      aria-label={isCurrentlyFavorite ? t("removeFromFavorites") : t("addToFavorites")}
    >
      <motion.div
        animate={{
          scale: isAnimating ? [1, 1.2, 1] : 1,
          rotate: isAnimating ? [0, -10, 10, 0] : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <FiHeart 
          size={size} 
          className={`transition-all duration-200 ${
            isCurrentlyFavorite 
              ? "text-white fill-current drop-shadow-sm" 
              : "text-gray-400 hover:text-gray-600"
          }`}
          style={{
            filter: isCurrentlyFavorite ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
          }}
        />
      </motion.div>
    </motion.button>
  );
}