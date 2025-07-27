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
          <Logo size="large" className="justify-center" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-[#111] tracking-wide leading-snug">
          {lang === 'ar' ? 'خطوتك تفرق' : 'Made to Move'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto px-4">
          {lang === "ar"
            ? "اكتشف مجموعة متنوعة من الأحذية المصرية عالية الجودة للرجال والنساء"
            : "Discover our diverse collection of high-quality Egyptian footwear for men and women"
          }
        </p>
      </motion.div>

      {/* Collections */}
      <SectionTitle>{t("collections")}</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-12 md:mb-16">
        {collections.map((col, index) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link to={`/collections/${col.id}`}>
              <div className="product-card glass rounded-xl sm:rounded-2xl shadow-md overflow-hidden h-40 sm:h-48 md:h-64 flex flex-col justify-end relative group">
                <img
                  src={col.image}
                  alt={col.name[lang]}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 p-3 sm:p-4 md:p-6">
                  <div className="text-sm sm:text-lg md:text-xl font-bold text-white mb-1">{col.name[lang]}</div>
                  <div className="text-gray-300 text-xs sm:text-sm">{col.desc[lang]}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Featured Products */}
      <SectionTitle>{t("products")}</SectionTitle>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-6">
        {products.slice(0, 3).map((prod, index) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link to={`/product/${prod.id}`}>
              <div className="product-card glass rounded-lg shadow-md border border-white/20 group transition-all duration-300 p-3 flex flex-row md:flex-col gap-3 md:gap-0 max-h-[150px] md:max-h-none">
                <div className="relative overflow-hidden rounded-lg mb-0 md:mb-3 flex-shrink-0">
                  <img
                    src={prod.image}
                    alt={prod.name[lang]}
                    className="w-24 h-24 md:w-full md:h-40 object-cover transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavoriteClick(prod.id);
                    }}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200"
                  >
                    <FiHeart
                      size={14}
                      className={isFavorite(prod.id) ? "text-red-500 fill-current" : "text-gray-400"}
                    />
                  </button>
                </div>
                <div className="product-info flex-1 flex flex-col justify-between">
                  <div className="font-bold text-sm md:text-base text-[#111] line-clamp-2 mb-1">
                    {prod.name[lang]}
                  </div>
                  <div className="font-bold text-base md:text-lg text-[#d1b16a] mb-2 md:mb-0">
                    {prod.price} {t("egp")}
                  </div>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2 hidden md:block">
                    {prod.desc[lang]}
                  </p>
                  <div className="md:hidden">
                    <button className="bg-[#d1b16a] text-black px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#d1b16a]/80 transition-colors">
                      {t("addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
