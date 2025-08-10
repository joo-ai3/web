import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiFilter, FiHeart } from 'react-icons/fi';
import clsx from 'clsx';
import { useLang, useTranslation } from '../contexts/LangContext';
import { products } from '../data/products';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';

export const ProductsPage: React.FC = () => {
  const { lang } = useLang();
  const t = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const collectionParam = searchParams.get('collection');
  const [selectedCategory, setSelectedCategory] = useState<string>(collectionParam || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
    { id: 'mens', label: lang === 'ar' ? 'رجالي' : 'Men\'s' },
    { id: 'womens', label: lang === 'ar' ? 'نسائي' : 'Women\'s' },
    { id: 'basics', label: lang === 'ar' ? 'أساسي' : 'Essentials' }
  ];

  const sortOptions = [
    { id: 'name', label: lang === 'ar' ? 'الاسم' : 'Name' },
    { id: 'price-low', label: lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { id: 'price-high', label: lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const newCollection = collectionParam || 'all';
    if (newCollection !== selectedCategory) {
      setSelectedCategory(newCollection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [collectionParam, selectedCategory, location.search]);

  let filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.collection === selectedCategory);

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name[lang].localeCompare(b.name[lang]);
    }
  });

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4">{t('products')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'اكتشف مجموعتنا الكاملة من المنتجات الفاخرة'
              : 'Discover our complete collection of premium products'}
          </p>
        </motion.div>

        {/* الفلاتر */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            
            {/* الفئات */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <GlassButton
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </GlassButton>
              ))}
            </div>

            {/* ترتيب وطريقة عرض */}
            <div className="flex items-center gap-4">
              {/* الترتيب */}
              <div className="flex items-center gap-2">
                <FiFilter size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-input py-2 px-3 text-sm min-h-[40px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* طريقة العرض */}
              <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-black'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  aria-label="Grid view"
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-black'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  aria-label="List view"
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* عرض المنتجات */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={clsx(
            'products-grid',
            viewMode === 'grid' ? '' : 'grid-cols-1 max-w-4xl mx-auto'
          )}
        >
          {filteredProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={clsx(
                'product-card group h-full interactive-hover',
                viewMode === 'list' && 'flex flex-row items-center'
              )}
            >
              <Link to={`/product/${product.id}`} className="block h-full">
                <div className={clsx(
                  'product-card-image relative overflow-hidden',
                  viewMode === 'list' && 'w-48 h-48 flex-shrink-0'
                )}>
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* زر المفضلة */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className={clsx(
                      "absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors",
                      favorites.includes(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-bg-secondary text-text-primary hover:bg-red-500 hover:text-white"
                    )}
                  >
                    <FiHeart size={18} />
                  </button>
                </div>

                <div className={clsx(
                  'product-card-content flex-1 flex flex-col',
                  viewMode === 'list' && 'flex-1 p-4'
                )}>
                  <h3 className={clsx(
                    'font-semibold mb-2',
                    viewMode === 'grid' ? 'text-base' : 'text-lg'
                  )}>
                    {product.name[lang]}
                  </h3>
                  <p className={clsx(
                    'text-text-secondary mb-3 flex-1',
                    viewMode === 'grid' ? 'text-sm' : 'text-base'
                  )}>
                    {product.desc[lang]}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-primary">
                      {product.price} {t('egp')}
                    </span>
                  </div>

                  <GlassButton variant="primary" className="w-full text-black">
                    {t('viewDetails')}
                  </GlassButton>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* لو مفيش منتجات */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <GlassCard className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                {lang === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
              </h3>
              <GlassButton variant="primary" onClick={() => setSelectedCategory('all')}>
                {lang === 'ar' ? 'عرض جميع المنتجات' : 'Show All Products'}
              </GlassButton>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};
