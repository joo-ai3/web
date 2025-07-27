import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useLang, useTranslation } from '../contexts/LangContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { products } from '../data/products';
import GlassButton from '../components/GlassButton';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';

const FavoritesPage: React.FC = () => {
  const { lang } = useLang();
  const t = useTranslation();
  const { theme } = useTheme();
  const { favorites, removeFromFavorites } = useFavorites();
  const { showToast } = useToast();

  const favoriteProducts = useMemo(() => 
    products.filter(product => favorites.includes(product.id)), 
    [favorites]
  );

  const handleRemoveFavorite = (productId: number) => {
    removeFromFavorites(productId);
    showToast(t('removeFromFavorites'));
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>
            {t('favorites')}
          </SectionTitle>
        </motion.div>

        {favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <GlassCard className="max-w-md mx-auto p-8">
              <FiHeart className="w-16 h-16 mx-auto mb-4 text-[#d1b16a]" />
              <h3 className="text-xl font-semibold mb-2 text-[#111]">
                {t('noFavoritesYet')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('startAddingFavorites')}
              </p>
              <Link to="/products">
                <GlassButton className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80">
                  {t('browseProducts')}
                </GlassButton>
              </Link>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mobile-card-grid md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6"
          >
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="product-card glass rounded-xl shadow-lg border border-white/25 group transition-all duration-300">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <FiHeart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="mobile-product-title font-semibold mb-2 text-[#111]">
                      {product.name[lang]}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.desc[lang]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="mobile-product-price font-bold text-[#d1b16a]">
                        {product.price} {t('egp')}
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <GlassButton className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 text-sm py-2 px-4">
                          {t('viewDetails')}
                        </GlassButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;