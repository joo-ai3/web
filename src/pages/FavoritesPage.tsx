import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import { products } from '../data/products';
import SectionTitle from '../components/SectionTitle';
import GlassButton from '../components/GlassButton';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { lang } = useLang();
  const t = useTranslation();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 180 }}
            className="mb-8"
          >
            <FiHeart size={80} className="mx-auto text-[#d1b16a] drop-shadow-lg animate-liquid-float" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold mb-4 text-[#111]"
          >
            {t("favorites")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-8 leading-relaxed text-sm"
          >
            {lang === "ar"
              ? "لم تقم بإضافة أي منتجات للمفضلة بعد. ابدأ بتصفح مجموعتنا الرائعة!"
              : "You haven't added any products to favorites yet. Start browsing our amazing collection!"
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link to="/products">
              <GlassButton className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <FiShoppingBag className="mr-2" />
                {t("shopNow")}
              </GlassButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="container mx-auto py-10 px-4"
    >
      <SectionTitle>{t("favorites")}</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {favoriteProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
            className="product-card glass p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md border border-white/20 group transition-all duration-300 flex sm:flex-col gap-3 sm:gap-0"
          >
            <div className="relative overflow-hidden rounded-lg sm:rounded-xl mb-0 sm:mb-3 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name[lang]}
                className="w-20 h-20 sm:w-full sm:h-32 md:h-40 object-cover transition-transform duration-500"
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200"
              >
                <FiHeart
                  size={12}
                  className="text-red-500 fill-current"
                />
              </button>
            </div>

            <div className="product-info space-y-1 sm:space-y-2 flex-1">
              <h3 className="font-bold text-sm sm:text-base text-[#111] line-clamp-2 leading-tight">
                {product.name[lang]}
              </h3>
              <p className="text-[#d1b16a] font-bold text-sm sm:text-base md:text-lg">
                {product.price} {t("egp")}
              </p>
              <p className="text-gray-600 text-xs line-clamp-2 hidden sm:block">
                {product.desc[lang]}
              </p>

              <div className="flex gap-2 pt-1 sm:pt-2">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <GlassButton className="w-full bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 text-xs sm:text-sm py-1.5 sm:py-2 transition-all duration-200 hover:shadow-lg">
                    {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                  </GlassButton>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
