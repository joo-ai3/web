import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { FiShoppingCart } from 'react-icons/fi';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation, useLang } from '../contexts/LangContext';
import { products } from '../data/products';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import SectionTitle from '../components/SectionTitle';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const t = useTranslation();
  const { lang } = useLang();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const handleAddToCart = (product: any) => {
    // Use first available color and size as defaults
    const defaultColor = product.colors[0]?.name[lang] || '';
    const defaultSize = product.sizes[0] || 0;
    addToCart(product, defaultColor, defaultSize);
    showToast(t("addSuccess"));
  };

  if (favoriteProducts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 180 }}
              className="mb-8"
            >
              <Heart className="w-20 h-20 mx-auto text-[#d1b16a] drop-shadow-lg animate-liquid-float" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-[#111]"
            >
              {lang === "ar" ? "لا توجد مفضلات بعد" : "No favorites yet"}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              {lang === "ar" 
                ? "ابدأ بإضافة المنتجات إلى مفضلاتك لتراها هنا" 
                : "Start adding products to your favorites to see them here"
              }
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/products">
                <GlassButton className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <FiShoppingCart className="mr-2" />
                  {t("shopNow")}
                </GlassButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle>{t("favorites")}</SectionTitle>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {favoriteProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <GlassCard className="group h-full flex flex-col">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-lg mb-2 text-[#111] line-clamp-2 hover:text-[#d1b16a] transition-colors">
                    {product.name[lang]}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
                  {product.desc[lang]}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-[#d1b16a]">
                    {product.price} {t("egp")}
                  </span>
                  <GlassButton
                    onClick={() => handleAddToCart(product)}
                    className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 px-4 py-2 text-sm"
                  >
                    <FiShoppingCart size={16} />
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
            </h3>
            <p className="text-gray-500 text-center">
              Start adding products to your favorites to see them here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle>{t("favorites")}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <GlassCard key={product.id} className="group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name[lang]}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <h3 className="font-semibold text-lg mb-2">{product.name[lang]}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.desc[lang]}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#d1b16a]">
                  {product.price} {t("egp")}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;