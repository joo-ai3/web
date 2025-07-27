import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useLang } from '../contexts/LangContext';
import { useTranslation } from '../contexts/LangContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { products } from '../data/products';
import GlassButton from '../components/GlassButton';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';

const FavoritesPage: React.FC = () => {
  const { lang } = useLang();
  const { t } = useTranslation();
  const { favorites, removeFavorite } = useFavorites();
  const { showToast } = useToast();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const handleRemoveFavorite = (productId: string) => {
    removeFavorite(productId);
    showToast(t('removedFromFavorites'), 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle 
            title={t('favorites')} 
            subtitle={t('favoritesSubtitle')}
          />
        </motion.div>

        {favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <GlassCard className="max-w-md mx-auto p-8">
              <FiHeart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {t('noFavorites')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('noFavoritesDescription')}
              </p>
              <Link to="/products">
                <GlassButton>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <FiHeart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                      {product.name[lang]}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {product.description[lang]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        ${product.price}
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <GlassButton size="sm">
                          {t('viewDetails')}
                        </GlassButton>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;