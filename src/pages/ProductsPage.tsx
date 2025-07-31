import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import SectionTitle from '../components/SectionTitle';
import { products, collections } from '../data/products';

interface Product {
  id: number;
  name: { ar: string; en: string };
  price: number;
  image: string;
  collection: string;
  desc: { ar: string; en: string };
  colors: Array<{ name: { ar: string; en: string }; code: string }>;
  sizes: number[];
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const { lang } = useLang();
  const { theme } = useTheme();
  const t = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const allCollections = ['all', ...collections.map(c => c.id)];

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.desc[lang].toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCollection = selectedCollection === 'all' || product.collection === selectedCollection;
      return matchesSearch && matchesCollection;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return a.name[lang].localeCompare(b.name[lang]);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCollection, sortBy, lang]);

  const handleAddToCart = (product: Product) => {
    // Use first available color and size as defaults
    const defaultColor = product.colors[0]?.name[lang] || '';
    const defaultSize = product.sizes[0] || 0;
    
    addToCart(product, defaultColor, defaultSize);
    showToast(t("addSuccess"));
  };

  const handleFavoriteClick = (productId: number) => {
    toggleFavorite(productId);
    const isNowFavorite = !isFavorite(productId);
    showToast(isNowFavorite ? t("addToFavorites") : t("removeFromFavorites"));
  };

  const getCollectionName = (collectionId: string) => {
    if (collectionId === 'all') return t("products");
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.name[lang] : collectionId;
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <SectionTitle className="mb-4">
            {t("products")}
          </SectionTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {lang === 'ar' 
              ? 'اكتشف مجموعتنا المتنوعة من الأحذية عالية الجودة'
              : 'Discover our diverse collection of high-quality footwear'
            }
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'البحث في المنتجات...' : 'Search products...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass border border-[#d1b16a]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d1b16a] transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Collection Filter */}
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="px-4 py-3 glass border border-[#d1b16a]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d1b16a] transition-all min-w-[150px]"
                >
                  {allCollections.map(collectionId => (
                    <option key={collectionId} value={collectionId}>
                      {getCollectionName(collectionId)}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 glass border border-[#d1b16a]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d1b16a] transition-all min-w-[150px]"
                >
                  <option value="name">{lang === 'ar' ? 'الاسم' : 'Name'}</option>
                  <option value="price-low">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                  <option value="price-high">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                </select>

                {/* View Mode */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-[#d1b16a] text-black shadow-lg' 
                        : 'glass border border-[#d1b16a]/40 hover:bg-[#d1b16a]/20'
                    }`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'list' 
                        ? 'bg-[#d1b16a] text-black shadow-lg' 
                        : 'glass border border-[#d1b16a]/40 hover:bg-[#d1b16a]/20'
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {viewMode === 'grid' ? (
            <div className="ecommerce-grid">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="product-card-pro group cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name[lang]}
                        className="product-image"
                      />
                      <button
                        onClick={() => handleFavoriteClick(product.id)}
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                      >
                        <FiHeart 
                          size={18} 
                          className={isFavorite(product.id) ? "text-red-500 fill-current" : "text-gray-400"} 
                        />
                      </button>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="mobile-product-title font-semibold mb-2 text-[#111] line-clamp-2">
                        {product.name[lang]}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.desc[lang]}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="mobile-product-price font-bold text-[#d1b16a]">
                          {product.price} {t("egp")}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <GlassButton className="w-full bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 py-2 text-sm">
                            {t("viewDetails")}
                          </GlassButton>
                        </Link>
                        <GlassButton
                          onClick={() => handleAddToCart(product)}
                          className="px-3 py-2 text-sm"
                        >
                          <FiShoppingCart size={16} />
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <GlassCard className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                    <div className="w-full sm:w-48 flex-shrink-0">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name[lang]}
                          className="w-full h-48 sm:h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleFavoriteClick(product.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                        >
                          <FiHeart 
                            size={14} 
                            className={isFavorite(product.id) ? "text-red-500 fill-current" : "text-gray-400"} 
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-[#111] mb-2 sm:mb-0">
                            {product.name[lang]}
                          </h3>
                          <span className="text-xl sm:text-2xl font-bold text-[#d1b16a]">
                            {product.price} {t("egp")}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                          {product.desc[lang]}
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <GlassButton className="w-full bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 py-2">
                            {t("viewDetails")}
                          </GlassButton>
                        </Link>
                        <GlassButton
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2"
                        >
                          <FiShoppingCart size={18} />
                          <span className="hidden sm:inline ml-2">{t("addToCart")}</span>
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <GlassCard className="max-w-md mx-auto p-8">
              <FiSearch className="w-16 h-16 mx-auto mb-4 text-[#d1b16a]" />
              <h3 className="text-xl font-semibold mb-2 text-[#111]">
                {lang === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {lang === 'ar' 
                  ? 'لم نجد أي منتجات تطابق معايير البحث الخاصة بك'
                  : 'We couldn\'t find any products matching your search criteria'
                }
              </p>
              <GlassButton
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCollection('all');
                  setSortBy('name');
                }}
                className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80"
              >
                {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
              </GlassButton>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}