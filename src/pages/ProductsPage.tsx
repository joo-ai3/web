import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiList, FiSearch, FiHeart } from 'react-icons/fi';
import { useLang, useTranslation } from '../contexts/LangContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { products } from '../data/products';
import GlassButton from '../components/GlassButton';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const { lang } = useLang();
  const t = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  
  // Default to list view on mobile, grid on desktop
  const getDefaultView = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? "list" : "grid";
    }
    return "grid";
  };
  
  const [view, setView] = useState(getDefaultView);
  const [search, setSearch] = useState("");

  const filtered = products.filter(p =>
    p.name[lang].toLowerCase().includes(search.toLowerCase())
  );
  
  const handleFavoriteClick = (productId: number) => {
    toggleFavorite(productId);
    const isNowFavorite = !isFavorite(productId);
    showToast(isNowFavorite ? t("addToFavorites") : t("removeFromFavorites"));
  };

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111]">{t("products")}</h1>
        <div className="hidden sm:flex items-center gap-2">
          <GlassButton 
            onClick={() => setView("grid")} 
            className={view === "grid" ? "bg-[#d1b16a] text-black" : ""}
          >
            <FiGrid />
          </GlassButton>
          <GlassButton 
            onClick={() => setView("list")} 
            className={view === "list" ? "bg-[#d1b16a] text-black" : ""}
          >
            <FiList />
          </GlassButton>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
        <input
          className="glass border border-[#d1b16a]/40 px-12 py-3 sm:py-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#d1b16a] min-h-[44px] text-base"
          placeholder={lang === "ar" ? "بحث عن منتج..." : "Search for a product..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Not Found */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <div className="text-lg sm:text-xl">{t("productNotFound")}</div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className={
        view === "grid" && window.innerWidth >= 768
          ? "grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
          : "flex flex-col gap-4 sm:gap-6"
      }>
        {filtered.map((prod, index) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
          >
            <div className={`product-card glass p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/25 group transition-all duration-300 ${
              view === "list" || window.innerWidth < 768 
                ? "flex gap-3 sm:gap-4 items-center" 
                : "flex flex-col"
            }`}>
              <div className={`relative overflow-hidden rounded-lg flex-shrink-0 ${
                view === "list" || window.innerWidth < 768 
                  ? "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32" 
                  : "w-full mb-4"
              }`}>
                <img 
                  src={prod.image} 
                  className={`object-cover rounded-lg transition-transform duration-500 will-change-transform ${
                    view === "list" || window.innerWidth < 768 
                      ? "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32" 
                      : "w-full h-40 sm:h-48"
                  }`}
                  alt={prod.name[lang]}
                />
                <button
                  onClick={() => handleFavoriteClick(prod.id)}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <FiHeart 
                    size={14} 
                    className={isFavorite(prod.id) ? "text-red-500 fill-current" : "text-gray-400"} 
                  />
                </button>
              </div>
              <div className={`product-info flex-1 space-y-1 sm:space-y-2 ${
                view === "list" || window.innerWidth < 768 ? "pl-0" : ""
              }`}>
                <div className="font-bold text-sm sm:text-base lg:text-lg text-[#111] line-clamp-2">
                  {prod.name[lang]}
                </div>
                <div className="text-[#d1b16a] font-bold text-base sm:text-lg mb-1 sm:mb-2">
                  {prod.price} {t("egp")}
                </div>
                {(view === "grid" && window.innerWidth >= 768) && (
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{prod.desc[lang]}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1 sm:mt-2">
                  <Link to={`/product/${prod.id}`}>
                    <GlassButton className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 transition-all duration-200 hover:shadow-lg">
                      {lang === "ar" ? "تفاصيل" : "Details"}
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
