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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
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
        damping: 30, 
        stiffness: 450,
        mass: 0.7,
        duration: 0.35
      }
    },
    exit: { 
      x: lang === 'ar' ? '100%' : '-100%',
      opacity: 0,
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 500,
        mass: 0.5,
        duration: 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: lang === 'ar' ? 25 : -25 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.08 + i * 0.04,
        duration: 0.35,
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
        className="md:hidden glass p-2.5 rounded-lg border border-[#d1b16a]/40 hover:bg-[#d1b16a]/10 transition-all duration-200 shadow-md min-h-[40px] min-w-[40px] flex items-center justify-center"
      >
        <FiMenu size={20} className="text-[#d1b16a]" />
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
                "fixed top-0 bottom-0 w-[85%] max-w-xs h-screen z-[110] md:hidden overflow-y-auto",
                "glass backdrop-blur-xl border shadow-2xl",
                theme === 'dark' 
                  ? "bg-[#1a1a1a]/95 border-[#d1b16a]/20" 
                  : "bg-white/95 border-[#d1b16a]/30",
                lang === 'ar' ? 'right-0 border-l border-[#d1b16a]/30' : 'left-0 border-r border-[#d1b16a]/30'
              )}
              style={{
                boxShadow: theme === 'dark' 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(209, 177, 106, 0.15)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(209, 177, 106, 0.1)'
              }}
            >
              <div className="p-4 h-full flex flex-col">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                  className="flex items-center justify-between mb-6"
                >
                  <Logo size="small" className="flex-shrink-0" />
                  <motion.button
                    whileTap={{ scale: 0.9, rotate: 90 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={closeMenu}
                    className="glass p-2 rounded-lg border border-[#d1b16a]/40 hover:bg-[#d1b16a]/20 transition-all duration-200 shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <FiX size={20} className="text-[#d1b16a]" />
                  </motion.button>
                </motion.div>

                {/* User Profile */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    className="glass p-3 rounded-xl mb-6 border border-[#d1b16a]/20 bg-gradient-to-r from-[#d1b16a]/10 to-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#d1b16a]/20 rounded-full flex items-center justify-center shadow-inner">
                        <FiUser size={20} className="text-[#d1b16a]" />
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`}>
                          {user.name}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="space-y-6">
                    {/* Navigation */}
                    <div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className={`text-xs uppercase tracking-wider mb-3 font-semibold px-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t("menu")}
                      </motion.h3>
                      <div className="space-y-1">
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
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 relative group min-h-[44px] touch-manipulation ${
                                theme === 'dark' 
                                  ? 'hover:bg-[#d1b16a]/15 text-[var(--text-primary)]' 
                                  : 'hover:bg-[#d1b16a]/20 text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="text-[#d1b16a] group-hover:scale-110 transition-transform duration-200">
                                {React.cloneElement(item.icon, { size: 20 })}
                              </div>
                              <span className="font-medium text-sm flex-1 text-[var(--text-primary)]">
                                {item.label}
                              </span>
                              {item.badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 500 }}
                                  className="bg-[#d1b16a] text-[#000000] text-xs px-2 py-0.5 rounded-full font-semibold shadow-md"
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
                        transition={{ delay: 0.35 }}
                        className={`text-xs uppercase tracking-wider mb-3 font-semibold px-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t("account")}
                      </motion.h3>
                      <div className="space-y-1">
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
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 min-h-[44px] touch-manipulation ${
                                theme === 'dark' 
                                  ? 'hover:bg-[#d1b16a]/15 text-[var(--text-primary)]' 
                                  : 'hover:bg-[#d1b16a]/20 text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="text-[#d1b16a]">{React.cloneElement(item.icon, { size: 20 })}</div>
                              <span className="font-medium text-sm text-[var(--text-primary)]">
                                {item.label}
                              </span>
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
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-red-600 w-full min-h-[44px] touch-manipulation ${
                                theme === 'dark' ? 'hover:bg-red-900/20' : 'hover:bg-red-100'
                              }`}
                            >
                              <FiLogOut size={20} />
                              <span className="font-medium text-sm">{t("logout")}</span>
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
                        transition={{ delay: 0.4 }}
                        className={`text-xs uppercase tracking-wider mb-3 font-semibold px-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {t("settings")}
                      </motion.h3>
                      <div className="space-y-2">
                        {/* Theme Toggle */}
                        <motion.div
                          custom={menuItems.length + accountItems.length + 1}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex items-center justify-between p-3 glass rounded-lg border min-h-[44px] ${
                            theme === 'dark' 
                              ? 'border-[#d1b16a]/15 bg-gray-800/30' 
                              : 'border-[#d1b16a]/20 bg-gray-50/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#d1b16a]">
                              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </div>
                            <span className="font-medium text-sm text-[var(--text-primary)]">
                              {t("appearance")}
                            </span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium min-h-[44px] touch-manipulation text-[#000000] ${
                              theme === 'dark'
                                ? 'bg-[#d1b16a]/15 hover:bg-[#d1b16a]/25 text-[#d1b16a]'
                                : 'bg-[#d1b16a]/20 hover:bg-[#d1b16a]/30 text-[#d1b16a]'
                            }`}
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
                          className={`flex items-center justify-between p-3 glass rounded-lg border min-h-[44px] ${
                            theme === 'dark' 
                              ? 'border-[#d1b16a]/15 bg-gray-800/30' 
                              : 'border-[#d1b16a]/20 bg-gray-50/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#d1b16a]">
                              <FiGlobe size={20} />
                            </div>
                            <span className="font-medium text-sm text-[var(--text-primary)]">
                              {t("language")}
                            </span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleLang}
                            className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium min-h-[44px] touch-manipulation text-[#000000] ${
                              theme === 'dark'
                                ? 'bg-[#d1b16a]/15 hover:bg-[#d1b16a]/25 text-[#d1b16a]'
                                : 'bg-[#d1b16a]/20 hover:bg-[#d1b16a]/30 text-[#d1b16a]'
                            }`}
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