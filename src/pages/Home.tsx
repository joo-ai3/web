import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useLang, useTranslation } from '../contexts/LangContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { collections, products } from '../data/products';
import SectionTitle from '../components/SectionTitle';
import Logo from '../components/Logo';

export default function Home() {
  const { lang } = useLang();
  const t = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const handleFavoriteClick = (productId: number) => {
    toggleFavorite(productId);
    const isNowFavorite = !isFavorite(productId);
    showToast(isNowFavorite ? t("addToFavorites") : t("removeFromFavorites"));
  };

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="text-center mb-16"
      >
        <div className="mb-8">
          <Logo size="large" showText={true} showSlogan={true} className="justify-center" />
        </div>
        <h1 className="mobile-title text-2xl sm:text-4xl md:text-6xl font-bold mb-4 text-[#111] tracking-wide leading-snug">
          {lang === 'ar' ? 'خطوتك تفرق' : 'Made to Move'}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto px-4">
          {lang === "ar"
            ? "اكتشف مجموعة متنوعة من الأحذية المصرية عالية الجودة للرجال والنساء"
            : "Discover our diverse collection of high-quality Egyptian footwear for men and women"
          }
        </p>
      </motion.div>

      {/* Collections */}
      <SectionTitle>{t("collections")}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-16">
        {collections.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link to={`/collections/${col.id}`}>
              <div className="product-card glass rounded-2xl sm:rounded-[2rem] shadow-md overflow-hidden h-48 sm:h-64 flex flex-col justify-end relative group">
                <img
                  src={col.image}
                  alt={col.name[lang]}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 p-4 sm:p-6">
                  <div className="text-sm sm:text-xl font-bold text-white mb-1">{col.name[lang]}</div>
                  <div className="text-gray-300 text-xs">{col.desc[lang]}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Featured Products */}
      <SectionTitle>{t("products")}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {products.slice(0, 3).map((prod, index) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link to={`/product/${prod.id}`}>
              <div className="product-card glass p-2 sm:p-4 rounded-2xl shadow-md border border-white/20 group transition-all duration-300">
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <img
                    src={prod.image}
                    alt={prod.name[lang]}
                    className="w-full h-28 sm:h-40 object-cover transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavoriteClick(prod.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200"
                  >
                    <FiHeart
                      size={16}
                      className={isFavorite(prod.id) ? "text-red-500 fill-current" : "text-gray-400"}
                    />
                  </button>
                </div>
                <div className="product-info">
                  <div className="font-bold text-sm sm:text-base mb-1 text-[#111]">{prod.name[lang]}</div>
                  <div className="text-[#d1b16a] font-bold text-base sm:text-lg">{prod.price} {t("egp")}</div>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">{prod.desc[lang]}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
