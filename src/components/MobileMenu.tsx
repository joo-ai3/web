import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiShoppingCart, FiUser, FiGrid, FiBox, FiHeart, FiPhone,
  FiSun, FiMoon, FiGlobe, FiLogOut, FiHome, FiInfo, FiSettings
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

  const menuItems = [
    { to: "/", icon: <FiHome />, label: t("home") },
    { to: "/products", icon: <FiGrid />, label: t("products") },
    { to: "/about", icon: <FiInfo />, label: t("aboutUs") },
    { to: "/contact", icon: <FiPhone />, label: t("contactUs") },
    { to: "/favorites", icon: <FiHeart />, label: t("favorites"), badge: favorites.length || null },
    { to: "/cart", icon: <FiShoppingCart />, label: t("cart"), badge: cart.length || null },
  ];

  const accountItems = user
    ? [
        { to: "/account", icon: <FiUser />, label: t("account") },
        { to: "/orders", icon: <FiBox />, label: t("orders") },
      ]
    : [
        { to: "/login", icon: <FiUser />, label: t("login") },
        { to: "/register", icon: <FiUser />, label: t("register") },
      ];

  const closeMenu = () => setIsOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.25, 
        ease: [0.4, 0, 0.2, 1] 
      } 
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
        type: 'spring', 
        damping: 25, 
        stiffness: 300, 
        mass: 0.8, 
        duration: 0.5 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10, 
      transition: { 
        duration: 0.25, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 + i * 0.05, 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }
    })
  };

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden relative overflow-hidden group"
        aria-label="Open menu"
      >
        <div className="glass backdrop-blur-20 p-3 rounded-xl border border-[#d1b16a]/30 hover:border-[#d1b16a]/50 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d1b16a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FiMenu size={22} className="text-[#d1b16a] relative z-10 transition-transform duration-300 group-hover:rotate-180" />
        </div>
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] md:hidden"
            />

            {/* Fullscreen Menu */}
            <div className="fixed inset-0 z-[110] md:hidden">
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={clsx(
                  "w-full h-full overflow-y-auto",
                  "glass backdrop-blur-30 border-0 shadow-2xl",
                  theme === 'dark'
                    ? "bg-[#0a0a0a]/95"
                    : "bg-white/95"
                )}
              >
                <div className="p-6 min-h-full flex flex-col">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center justify-between mb-8"
                  >
                    <Logo size="small" className="flex-shrink-0" />
                    <motion.button
                      whileTap={{ scale: 0.85, rotate: 90 }}
                      whileHover={{ scale: 1.15 }}
                      onClick={closeMenu}
                      className="relative overflow-hidden group"
                      aria-label="Close menu"
                    >
                      <div className="glass backdrop-blur-20 p-3 rounded-xl border border-[#d1b16a]/30 hover:border-[#d1b16a]/60 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <FiX size={20} className="text-[#d1b16a] relative z-10 transition-transform duration-300 group-hover:rotate-90" />
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* User Profile */}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="glass backdrop-blur-20 p-4 rounded-2xl mb-6 border border-[#d1b16a]/20 bg-gradient-to-br from-[#d1b16a]/10 via-transparent to-[#d1b16a]/5 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#d1b16a]/30 to-[#d1b16a]/10 rounded-full flex items-center justify-center shadow-inner border border-[#d1b16a]/20">
                          <FiUser size={20} className="text-[#d1b16a]" />
                        </div>
                        <div>
                          <div className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`}>
                            {user.name}
                          </div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="mb-8"
                    >
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === 'ar' ? 'التنقل' : 'Navigation'}
                      </h3>
                      <div className="space-y-2">
                        {menuItems.map((item, index) => (
                          <motion.div
                            key={item.to}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              to={item.to}
                              onClick={closeMenu}
                              className={clsx(
                                'w-full flex items-center justify-between p-4 rounded-xl font-semibold transition-all duration-300 group',
                                isActiveLink(item.to)
                                  ? 'bg-[#d1b16a] text-black shadow-lg'
                                  : `glass hover:bg-[#d1b16a]/20 ${theme === 'dark' ? 'text-gray-200 hover:text-[#d1b16a]' : 'text-gray-700 hover:text-[#d1b16a]'}`
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={clsx(
                                  'transition-transform duration-300 group-hover:scale-110',
                                  isActiveLink(item.to) ? 'text-black' : ''
                                )}>
                                  {item.icon}
                                </div>
                                <span className="text-base">{item.label}</span>
                              </div>
                              {item.badge && (
                                <div className={clsx(
                                  'px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center',
                                  isActiveLink(item.to)
                                    ? 'bg-black/20 text-black'
                                    : 'bg-[#d1b16a] text-black'
                                )}>
                                  {item.badge}
                                </div>
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Account Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="mb-8"
                    >
                      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t("account")}
                      </h3>
                      <div className="space-y-2">
                        {accountItems.map((item, index) => (
                          <motion.div
                            key={item.to}
                            custom={index + menuItems.length}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              to={item.to}
                              onClick={closeMenu}
                              className={clsx(
                                'w-full flex items-center gap-4 p-4 rounded-xl font-semibold transition-all duration-300 group',
                                isActiveLink(item.to)
                                  ? 'bg-[#d1b16a] text-black shadow-lg'
                                  : `glass hover:bg-[#d1b16a]/20 ${theme === 'dark' ? 'text-gray-200 hover:text-[#d1b16a]' : 'text-gray-700 hover:text-[#d1b16a]'}`
                              )}
                            >
                              <div className={clsx(
                                'transition-transform duration-300 group-hover:scale-110',
                                isActiveLink(item.to) ? 'text-black' : ''
                              )}>
                                {item.icon}
                              </div>
                              <span className="text-base">{item.label}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Settings & Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-auto"
                  >
                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t("settings")}
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                      {/* Theme Toggle */}
                      <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center justify-between p-4 rounded-xl font-semibold transition-all duration-300 glass hover:bg-[#d1b16a]/20 ${theme === 'dark' ? 'text-gray-200 hover:text-[#d1b16a]' : 'text-gray-700 hover:text-[#d1b16a]'}`}
                      >
                        <div className="flex items-center gap-4">
                          {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
                          <span className="text-base">{t("appearance")}</span>
                        </div>
                        <span className="text-sm opacity-70">
                          {theme === "dark" ? t("light") : t("dark")}
                        </span>
                      </button>

                      {/* Language Toggle */}
                      <button
                        onClick={toggleLang}
                        className={`w-full flex items-center justify-between p-4 rounded-xl font-semibold transition-all duration-300 glass hover:bg-[#d1b16a]/20 ${theme === 'dark' ? 'text-gray-200 hover:text-[#d1b16a]' : 'text-gray-700 hover:text-[#d1b16a]'}`}
                      >
                        <div className="flex items-center gap-4">
                          <FiGlobe size={20} />
                          <span className="text-base">{t("language")}</span>
                        </div>
                        <span className="text-sm opacity-70">
                          {lang === "ar" ? "English" : "العربية"}
                        </span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl font-semibold transition-all duration-300 glass hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200/50"
                      >
                        <FiLogOut size={20} />
                        <span className="text-base">{t("logout")}</span>
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}