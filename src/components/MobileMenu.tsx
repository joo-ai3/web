import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiShoppingCart, FiUser, FiHeart, FiHome, FiGrid,
  FiPhone, FiInfo, FiSun, FiMoon, FiGlobe, FiLogOut, FiBox
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import Logo from './Logo';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLang();
  const t = useTranslation();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const mainMenuItems = [
    { to: "/", icon: <FiHome size={24} />, label: t("home") },
    { to: "/products", icon: <FiGrid size={24} />, label: t("products") },
    { to: "/favorites", icon: <FiHeart size={24} />, label: t("favorites"), badge: favorites.length || null },
    { to: "/cart", icon: <FiShoppingCart size={24} />, label: t("cart"), badge: cart.length || null },
    { to: "/orders", icon: <FiBox size={24} />, label: t("orders") },
    { to: "/about", icon: <FiInfo size={24} />, label: t("aboutUs") },
    { to: "/contact", icon: <FiPhone size={24} />, label: t("contactUs") },
  ];

  const collections = [
    { to: "/products?collection=mens", label: lang === 'ar' ? 'رجالي' : 'Men\'s', emoji: "👟" },
    { to: "/products?collection=womens", label: lang === 'ar' ? 'نسائي' : 'Women\'s', emoji: "👠" },
    { to: "/products?collection=basics", label: lang === 'ar' ? 'أساسي' : 'Essentials', emoji: "⚡" },
  ];

  const closeMenu = () => setIsOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden relative overflow-hidden"
        aria-label="Open menu"
      >
        <div className="modern-glass-button p-3 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center">
          <FiMenu size={22} className="text-primary transition-transform duration-300" />
        </div>
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Full-Screen Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[100] md:hidden"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(0, 0, 0, 0.8)' 
                  : 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
              }}
              onClick={closeMenu}
            />

            {/* Full-Screen Menu Container */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[110] md:hidden flex flex-col"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(10, 10, 10, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)'
              }}
            >
              {/* Header */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between p-6 pt-12"
              >
                <Logo size="medium" />
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={closeMenu}
                  className="relative overflow-hidden"
                  aria-label="Close menu"
                >
                  <div 
                    className="p-4 rounded-2xl border transition-all duration-300 shadow-lg hover:shadow-xl min-h-[56px] min-w-[56px] flex items-center justify-center"
                    style={{
                      background: theme === 'dark' 
                        ? 'rgba(30, 30, 30, 0.8)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(25px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <FiX size={28} className="text-red-500" />
                  </div>
                </motion.button>
              </motion.div>

              {/* User Profile Section */}
              {user && (
                <motion.div
                  variants={itemVariants}
                  className="px-6 mb-8"
                >
                  <div 
                    className="p-6 rounded-2xl border"
                    style={{
                      background: theme === 'dark'
                        ? 'rgba(30, 30, 30, 0.6)'
                        : 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(25px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                      borderColor: theme === 'dark'
                        ? 'rgba(209, 177, 106, 0.3)'
                        : 'rgba(209, 177, 106, 0.2)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)',
                          boxShadow: '0 8px 25px rgba(209, 177, 106, 0.3)'
                        }}
                      >
                        <FiUser size={24} className="text-black" />
                      </div>
                      <div>
                        <div 
                          className="font-bold text-xl mb-1"
                          style={{ color: theme === 'dark' ? '#f5f5f5' : '#222' }}
                        >
                          {user.name}
                        </div>
                        <div 
                          className="text-sm opacity-70"
                          style={{ color: theme === 'dark' ? '#b0b0b0' : '#666' }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Main Navigation */}
              <div className="flex-1 px-6 overflow-y-auto">
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 
                    className="text-lg font-bold mb-4 px-2"
                    style={{ color: theme === 'dark' ? '#d1b16a' : '#d1b16a' }}
                  >
                    {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
                  </h3>
                  <div className="space-y-3">
                    {mainMenuItems.map((item, index) => (
                      <motion.div
                        key={item.to}
                        variants={itemVariants}
                        custom={index}
                      >
                        <Link
                          to={item.to}
                          onClick={closeMenu}
                          className="w-full flex items-center justify-between p-4 rounded-2xl font-semibold text-lg transition-all duration-300 group relative overflow-hidden"
                          style={{
                            background: isActiveLink(item.to) 
                              ? 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)'
                              : theme === 'dark'
                                ? 'rgba(30, 30, 30, 0.6)'
                                : 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(25px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                            border: isActiveLink(item.to)
                              ? '2px solid #d1b16a'
                              : theme === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                : '1px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: isActiveLink(item.to)
                              ? '0 8px 25px rgba(209, 177, 106, 0.4)'
                              : theme === 'dark'
                                ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                                : '0 4px 15px rgba(0, 0, 0, 0.1)',
                            color: isActiveLink(item.to)
                              ? '#000'
                              : theme === 'dark' ? '#f5f5f5' : '#222'
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="transition-transform duration-300 group-hover:scale-110">
                              {item.icon}
                            </div>
                            <span className="font-bold">{item.label}</span>
                          </div>
                          {item.badge && (
                            <div 
                              className="px-3 py-1 rounded-full text-sm font-bold min-w-[24px] text-center"
                              style={{
                                background: isActiveLink(item.to)
                                  ? 'rgba(0, 0, 0, 0.2)'
                                  : '#d1b16a',
                                color: isActiveLink(item.to) ? '#000' : '#000'
                              }}
                            >
                              {item.badge}
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Collections Section */}
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 
                    className="text-lg font-bold mb-4 px-2"
                    style={{ color: theme === 'dark' ? '#d1b16a' : '#d1b16a' }}
                  >
                    {t('collections')}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {collections.map((collection, index) => (
                      <motion.div
                        key={collection.to}
                        variants={itemVariants}
                        custom={index}
                      >
                        <Link
                          to={collection.to}
                          onClick={closeMenu}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl font-semibold text-base transition-all duration-300 group"
                          style={{
                            background: isActiveLink(collection.to) 
                              ? 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)'
                              : theme === 'dark'
                                ? 'rgba(30, 30, 30, 0.4)'
                                : 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(20px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                            border: isActiveLink(collection.to)
                              ? '1px solid #d1b16a'
                              : theme === 'dark'
                                ? '1px solid rgba(255, 255, 255, 0.05)'
                                : '1px solid rgba(0, 0, 0, 0.05)',
                            boxShadow: isActiveLink(collection.to)
                              ? '0 4px 15px rgba(209, 177, 106, 0.3)'
                              : theme === 'dark'
                                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                : '0 2px 8px rgba(0, 0, 0, 0.05)',
                            color: isActiveLink(collection.to)
                              ? '#000'
                              : theme === 'dark' ? '#f5f5f5' : '#222'
                          }}
                        >
                          <span className="text-2xl transition-transform duration-300 group-hover:scale-125">
                            {collection.emoji}
                          </span>
                          <span className="font-semibold">{collection.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Controls */}
              <motion.div
                variants={itemVariants}
                className="p-6 border-t"
                style={{
                  borderColor: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="space-y-4">
                  {/* Theme & Language Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={toggleTheme}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-base transition-all duration-300"
                      style={{
                        background: theme === 'dark'
                          ? 'rgba(30, 30, 30, 0.6)'
                          : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(25px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                        border: theme === 'dark'
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(0, 0, 0, 0.1)',
                        color: theme === 'dark' ? '#f5f5f5' : '#222'
                      }}
                    >
                      {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
                      <span>{theme === "dark" ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={toggleLang}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-base transition-all duration-300"
                      style={{
                        background: theme === 'dark'
                          ? 'rgba(30, 30, 30, 0.6)'
                          : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(25px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                        border: theme === 'dark'
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '1px solid rgba(0, 0, 0, 0.1)',
                        color: theme === 'dark' ? '#f5f5f5' : '#222'
                      }}
                    >
                      <FiGlobe size={20} />
                      <span>{lang === "ar" ? "EN" : "AR"}</span>
                    </motion.button>
                  </div>

                  {/* Account Actions */}
                  {user ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        to="/account"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-base transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)',
                          color: '#000',
                          boxShadow: '0 8px 25px rgba(209, 177, 106, 0.3)'
                        }}
                      >
                        <FiUser size={20} />
                        <span>{t("account")}</span>
                      </Link>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-base transition-all duration-300"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(30, 30, 30, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(25px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444'
                        }}
                      >
                        <FiLogOut size={20} />
                        <span>{t("logout")}</span>
                      </motion.button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-base transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)',
                        color: '#000',
                        boxShadow: '0 8px 25px rgba(209, 177, 106, 0.3)'
                      }}
                    >
                      <FiUser size={20} />
                      <span>{t("login")}</span>
                    </Link>
                  )}
                </div>

                {/* Brand Footer */}
                <div className="mt-6 text-center">
                  <div 
                    className="text-sm font-medium opacity-70"
                    style={{ color: theme === 'dark' ? '#b0b0b0' : '#666' }}
                  >
                    Soleva - {t('slogan')}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}