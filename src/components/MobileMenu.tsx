import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMenu, FiX, FiShoppingCart, FiUser, FiGrid, FiBox, FiHeart, FiPhone,
  FiSun, FiMoon, FiGlobe, FiLogOut, FiHome, FiInfo
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { to: "/", icon: <FiHome />, label: t("home") },
    { to: "/products", icon: <FiShoppingCart />, label: t("products") },
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const menuVariants = {
    hidden: { 
      x: lang === 'ar' ? '100%' : '-100%',
      opacity: 0
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 28, 
        stiffness: 400,
        mass: 0.8,
        duration: 0.4
      }
    },
    exit: { 
      x: lang === 'ar' ? '100%' : '-100%',
      opacity: 0,
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 500,
        mass: 0.6,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: lang === 'ar' ? 30 : -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden glass p-3 rounded-xl border border-[#d1b16a]/40 hover:bg-[#d1b16a]/10 transition-all duration-200 shadow-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
      >
        <FiMenu size={24} className="text-[#d1b16a]" />
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />

            {/* Enhanced Slide Panel */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={clsx(
                "fixed top-0 bottom-0 w-[90%] max-w-sm h-screen z-[110] md:hidden overflow-y-auto",
                "glass bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border shadow-2xl",
                lang === 'ar' ? 'right-0 border-l border-[#d1b16a]/30' : 'left-0 border-r border-[#d1b16a]/30'
              )}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(209, 177, 106, 0.1)'
              }}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center justify-between mb-8"
                >
                  <Logo size="medium" showText={true} className="flex-shrink-0" />
                  <motion.button
                    whileTap={{ scale: 0.9, rotate: 90 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={closeMenu}
                    className="glass p-3 rounded-xl border border-[#d1b16a]/40 hover:bg-[#d1b16a]/20 transition-all duration-200 shadow-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                  >
                    <FiX size={22} className="text-[#d1b16a]" />
                  </motion.button>
                </motion.div>

                {/* User Profile */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="glass p-5 rounded-2xl mb-8 border border-[#d1b16a]/20 bg-gradient-to-r from-[#d1b16a]/10 to-transparent"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#d1b16a]/20 rounded-full flex items-center justify-center shadow-inner">
                        <FiUser size={24} className="text-[#d1b16a]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#111] dark:text-white text-lg">{user.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="space-y-8">
                    {/* Navigation */}
                    <div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-semibold"
                      >
                        {t("menu")}
                      </motion.h3>
                      <div className="space-y-2">
                        {menuItems.map((item, i) => (
                          <motion.div
                            key={item.to}
                            custom={i}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              to={item.to}
                              onClick={closeMenu}
                              className="mobile-nav-item flex items-center gap-4 p-4 rounded-xl hover:bg-[#d1b16a]/20 transition-all duration-300 relative group min-h-[56px] touch-manipulation"
                            >
                              <div className="text-[#d1b16a] group-hover:scale-110 transition-transform duration-200">
                                {item.icon}
                              </div>
                              <span className="font-semibold text-base flex-1">{item.label}</span>
                              {item.badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 500 }}
                                  className="bg-[#d1b16a] text-black text-xs px-2.5 py-1 rounded-full font-bold shadow-lg"
                                >
                                  {item.badge}
                                </motion.span>
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Account */}
                    <div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-semibold"
                      >
                        {t("account")}
                      </motion.h3>
                      <div className="space-y-2">
                        {accountItems.map((item, i) => (
                          <motion.div
                            key={item.to}
                            custom={i + menuItems.length}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              to={item.to}
                              onClick={closeMenu}
                              className="mobile-nav-item flex items-center gap-4 p-4 rounded-xl hover:bg-[#d1b16a]/20 transition-all duration-300 min-h-[56px] touch-manipulation"
                            >
                              <div className="text-[#d1b16a]">{item.icon}</div>
                              <span className="font-semibold text-base">{item.label}</span>
                            </Link>
                          </motion.div>
                        ))}
                        {user && (
                          <motion.div
                            custom={accountItems.length + menuItems.length}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <button
                              onClick={() => {
                                logout();
                                closeMenu();
                              }}
                              className="mobile-nav-item flex items-center gap-4 p-4 rounded-xl hover:bg-red-100 transition-all duration-300 text-red-600 w-full min-h-[56px] touch-manipulation"
                            >
                              <FiLogOut />
                              <span className="font-semibold text-base">{t("logout")}</span>
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Settings */}
                    <div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-semibold"
                      >
                        {t("settings")}
                      </motion.h3>
                      <div className="space-y-3">
                        {/* Theme Toggle */}
                        <motion.div
                          custom={menuItems.length + accountItems.length + 1}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center justify-between p-4 glass rounded-xl border border-[#d1b16a]/20 min-h-[56px]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-[#d1b16a]">
                              {theme === 'dark' ? <FiSun /> : <FiMoon />}
                            </div>
                            <span className="font-semibold text-base">{t("appearance")}</span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="px-4 py-2 text-sm bg-[#d1b16a]/20 rounded-lg hover:bg-[#d1b16a]/30 transition-all duration-200 font-semibold min-h-[40px] touch-manipulation"
                          >
                            {theme === "dark" ? t("light") : t("dark")}
                          </motion.button>
                        </motion.div>

                        {/* Language Toggle */}
                        <motion.div
                          custom={menuItems.length + accountItems.length + 2}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center justify-between p-4 glass rounded-xl border border-[#d1b16a]/20 min-h-[56px]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-[#d1b16a]">
                              <FiGlobe />
                            </div>
                            <span className="font-semibold text-base">{t("language")}</span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                            className="px-4 py-2 text-sm bg-[#d1b16a]/20 rounded-lg hover:bg-[#d1b16a]/30 transition-all duration-200 font-semibold min-h-[40px] touch-manipulation"
                          >
                            {lang === "ar" ? "EN" : "AR"}
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}