import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang, useTranslation } from '../contexts/LangContext';
import SectionTitle from '../components/SectionTitle';
import GlassButton from '../components/GlassButton';
import FavoriteButton from '../components/FavoriteButton';
import { products } from '../data/products';

export const ProductsPage: React.FC = () => {
  const { lang } = useLang();
  const t = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'electronics', 'clothing', 'home', 'books'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <SectionTitle 
            title={t('products.title')} 
            subtitle={t('products.subtitle')}
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <GlassButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              className="capitalize"
            >
              {t(`categories.${category}`)}
            </GlassButton>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="glass-card p-6 h-full flex flex-col transition-all duration-300 hover:scale-105">
                {/* Product Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <FavoriteButton productId={product.id} />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {product.name[lang]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
                    {product.description[lang]}
                  </p>
                  
                  {/* Price and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ${product.price}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/product/${product.id}`} className="w-full">
                    <GlassButton variant="primary" className="w-full">
                      {t('common.viewDetails')}
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </motion.div>
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
            <div className="glass-card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {t('products.noProducts')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('products.noProductsDescription')}
              </p>
              <GlassButton
                onClick={() => setSelectedCategory('all')}
                variant="primary"
              >
                {t('products.showAll')}
              </GlassButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};