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
  
  const [view, setView] = useState("list");
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
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {filtered.map((prod, index) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
          >
            <div className="product-card glass p-4 rounded-xl shadow-lg border border-white/25 group transition-all duration-300 flex gap-4 items-center md:flex-col md:gap-0 max-h-[160px] md:max-h-none">
              <div className="relative overflow-hidden rounded-lg flex-shrink-0 w-28 h-28 md:w-full md:h-48 md:mb-4">
                <img 
                  src={prod.image} 
                  className="w-28 h-28 md:w-full md:h-48 object-cover rounded-lg transition-transform duration-500 will-change-transform"
                  alt={prod.name[lang]}
                />
                <button
                  onClick={() => handleFavoriteClick(prod.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                >
                  <FiHeart 
                    size={16} 
                    className={isFavorite(prod.id) ? "text-red-500 fill-current" : "text-gray-400"} 
                  />
                </button>
              </div>
              <div className="product-info flex-1 space-y-2">
                <div className="font-bold text-base md:text-lg text-[#111] line-clamp-2">
                  {prod.name[lang]}
                </div>
                <div className="text-[#d1b16a] font-bold text-lg mb-2">
                  {prod.price} {t("egp")}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 hidden md:block">{prod.desc[lang]}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link to={`/product/${prod.id}`}>
                    <GlassButton className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 text-sm py-2 px-4 transition-all duration-200 hover:shadow-lg">
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
