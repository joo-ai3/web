import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { useLang, useTranslation } from '../contexts/LangContext';
import { products } from '../data/products';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import FavoriteButton from '../components/FavoriteButton';
import clsx from 'clsx';

export const ProductsPage: React.FC = () => {
  const { lang } = useLang();
  const t = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

  const categories = [
    { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
    { id: 'mens', label: lang === 'ar' ? 'رجالي' : 'Men\'s' },
    { id: 'womens', label: lang === 'ar' ? 'نسائي' : 'Women\'s' },
    { id: 'basics', label: lang === 'ar' ? 'أساسي' : 'Basics' }
  ];

  const sortOptions = [
    { id: 'name', label: lang === 'ar' ? 'الاسم' : 'Name' },
    { id: 'price-low', label: lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { id: 'price-high', label: lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' }
  ];

  let filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.collection === selectedCategory);

  // Sort products
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4">
            {t('products')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {lang === 'ar' 
              ? 'اكتشف مجموعتنا الكاملة من الأحذية الفاخرة'
              : 'Discover our complete collection of premium footwear'
            }
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Category Filter */}
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

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Sort */}
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

                {/* View Mode */}
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
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={clsx(
            'mobile-products-grid sm:grid gap-4 sm:gap-6',
            viewMode === 'grid' 
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'sm:grid-cols-1'
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
                'mobile-product-card sm:product-card group h-full interactive-hover',
                viewMode === 'list' && 'sm:flex sm:flex-row sm:items-center'
              )}
            >
              <Link to={`/product/${product.id}`} className="block h-full">
                <div className={clsx(
                  'mobile-product-image sm:product-card-image relative',
                  viewMode === 'list' && 'sm:w-48 sm:h-48 sm:flex-shrink-0'
                )}>
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                    loading={index < 8 ? "eager" : "lazy"}
                    decoding="async"
                    width="300"
                    height="300"
                  />
                  <FavoriteButton productId={product.id} />
                </div>
                
                <div className={clsx(
                  'mobile-product-info sm:product-card-content flex-1 flex flex-col',
                  viewMode === 'list' && 'sm:flex-1'
                )}>
                  <h3 className={clsx(
                    'mobile-product-title sm:font-semibold mb-2 line-clamp-2 text-[var(--text-primary)]',
                    viewMode === 'grid' ? 'sm:text-base' : 'sm:text-base'
                  )}>
                    {product.name[lang]}
                  </h3>
                  <p className={clsx(
                    'text-[var(--text-secondary)] mb-3 line-clamp-2 flex-1 hidden sm:block',
                    viewMode === 'grid' ? 'sm:text-sm' : 'sm:text-sm'
                  )}>
                    {product.desc[lang]}
                  </p>
                  
                  <div className={clsx(
                    'flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4',
                    viewMode === 'list' ? 'sm:justify-start' : 'justify-between sm:justify-between'
                  )}>
                    <span className={clsx(
                      'mobile-product-price sm:font-bold text-[var(--primary)]',
                      viewMode === 'grid' ? 'sm:text-base' : 'sm:text-base'
                    )}>
                      {product.price} {t('egp')}
                    </span>
                    
                    {/* Colors Preview - Hidden on mobile */}
                    <div className={clsx(
                      'hidden sm:flex gap-1',
                      viewMode === 'grid' && 'sm:flex'
                    )}>
                      {product.colors.slice(0, 3).map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-4 h-4 rounded-full border border-[var(--border-primary)]"
                          style={{ backgroundColor: color.code }}
                          title={color.name[lang]}
                          aria-label={color.name[lang]}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-bg-tertiary border border-border-primary flex items-center justify-center text-xs font-medium">
                          +{product.colors.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto hidden sm:block">
                    <GlassButton 
                      variant="primary" 
                      className="w-full text-[#000000]"
                      size={viewMode === 'list' ? 'lg' : 'md'}
                    >
                      {t('viewDetails')}
                    </GlassButton>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <GlassCard className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                {lang === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
              </h3>
              <p className="text-text-secondary mb-6">
                {lang === 'ar' 
                  ? 'لم نجد أي منتجات في هذه الفئة'
                  : 'We couldn\'t find any products in this category'
                }
              </p>
              <GlassButton
                variant="primary"
                onClick={() => setSelectedCategory('all')}
              >
                {lang === 'ar' ? 'عرض جميع المنتجات' : 'Show All Products'}
              </GlassButton>
            </GlassCard>
          </motion.div>
        )}

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-text-secondary">
              {lang === 'ar' 
                ? `عرض ${filteredProducts.length} منتج`
                : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};