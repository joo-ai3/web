import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import { useLang, useTranslation } from '../contexts/LangContext';
import { products } from '../data/products';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import SectionTitle from '../components/SectionTitle';
import Logo from '../components/Logo';
import FavoriteButton from '../components/FavoriteButton';

export default function Home() {
  const { lang } = useLang();
  const t = useTranslation();

  // Get featured products (first 6 products)
  const featuredProducts = products.slice(0, 6);

  const features = [
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: t("freeShipping"),
      description: lang === 'ar' ? "شحن مجاني للطلبات فوق 500 جنيه" : "Free shipping on orders over 500 EGP"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: t("securePayment"),
      description: lang === 'ar' ? "دفع آمن 100%" : "100% secure payment processing"
    },
    {
      icon: <FiHeadphones className="w-8 h-8" />,
      title: t("customerSupport"),
      description: lang === 'ar' ? "دعم العملاء على مدار الساعة" : "Round the clock customer support"
    }
  ];


  return (
    <div className="min-h-screen bg-app visual-hierarchy">
      {/* Hero Section */}
      <section className="relative section-spacing px-4 text-center" role="banner" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d1b16a]/10 via-transparent to-[#d1b16a]/5"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <Logo size="large" className="justify-center mb-6" />
          </motion.div>
          
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bold mb-6 text-[#111] leading-tight"
          >
            {lang === 'ar' ? 'مرحباً بك في سوليفا' : 'Welcome to Soleva'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {lang === 'ar' 
              ? 'اكتشف مجموعة أحذية فاخرة بتصميم عصري وجودة لا مثيل لها'
              : 'Discover premium footwear with modern design and unmatched quality'
            }
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Link to="/products">
              <GlassButton 
                className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                aria-label="Shop now - Browse our products"
              >
                <FiShoppingBag className="w-5 h-5 mr-2" />
                {t("shopNow")}
              </GlassButton>
            </Link>
            <Link to="/about">
              <GlassButton 
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                aria-label="Learn more about our collection"
              >
                {t("discoverCollection")}
              </GlassButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing px-4" aria-labelledby="features-title">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle id="features-title" className="text-center mb-8 sm:mb-12">
              {lang === 'ar' ? 'لماذا تختار سوليفا؟' : 'Why Choose Soleva?'}
            </SectionTitle>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <GlassCard className="text-center p-6 sm:p-8 h-full" role="article">
                  <div className="text-[#d1b16a] mb-6 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#111]" role="heading" aria-level="3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing px-4" aria-labelledby="featured-title">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <SectionTitle id="featured-title">
              {t("featuredProducts")}
            </SectionTitle>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              {lang === 'ar' 
                ? 'منتجات مختارة بعناية خصيصاً لك'
                : 'Handpicked items just for you'
              }
            </p>
          </motion.div>
          
          <div className="ecommerce-grid">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <article className="product-card-pro group cursor-pointer" role="article">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name[lang]}
                      className="product-image"
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <FavoriteButton productId={product.id} size={20} />
                  </div>
                  
                  <div className="product-info">
                    <h3 className="mobile-product-title font-semibold mb-2 text-[#111] line-clamp-2" role="heading" aria-level="3">
                      {product.name[lang]}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                      {product.desc[lang]}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="mobile-product-price font-bold text-[#d1b16a]" role="text" aria-label={`Price: ${product.price} ${t("egp")}`}>
                        {product.price} {t("egp")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <GlassButton 
                          className="w-full bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 py-2 text-xs sm:text-sm"
                          aria-label={`View details for ${product.name[lang]}`}
                        >
                          {t("viewDetails")}
                        </GlassButton>
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Link to="/products">
              <GlassButton 
                className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 px-6 sm:px-8 py-3 text-base sm:text-lg"
                aria-label="View all products in our collection"
              >
                {lang === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
              </GlassButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing px-4" aria-labelledby="cta-title">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-6 sm:p-8 lg:p-12">
              <h2 id="cta-title" className="font-bold mb-4 sm:mb-6 text-[#111]">
                {lang === 'ar' 
                  ? 'مستعد لتجربة الجودة الفائقة؟'
                  : 'Ready to Experience Premium Quality?'
                }
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {lang === 'ar'
                  ? 'انضم إلى آلاف العملاء الراضين الذين يثقون في سوليفا'
                  : 'Join thousands of satisfied customers who trust Soleva for their premium needs'
                }
              </p>
              <Link to="/products">
                <GlassButton 
                  className="bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg"
                  aria-label="Start shopping now"
                >
                  {t("shopNow")}
                </GlassButton>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}