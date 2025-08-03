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
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
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
      scale: 0.9,
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

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden relative overflow-hidden group"
      >
        <div className="glass backdrop-blur-20 p-3 rounded-xl border border-[#d1b16a]/30 hover:border-[#d1b16a]/50 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d1b16a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FiMenu size={22} className="text-[#d1b16a] relative z-10 transition-transform duration-300 group-hover:rotate-180" />
        </div>
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Enhanced Backdrop with Blur */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] md:hidden"
            />

            {/* Centered Modal Menu */}
            <div className="fixed inset-0 z-[110] md:hidden flex items-center justify-center p-4">
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={clsx(
                  "w-[80%] max-w-md max-h-[90vh] overflow-y-auto",
                  "glass backdrop-blur-30 border shadow-2xl rounded-3xl",
                  theme === 'dark' 
                    ? "bg-[#0a0a0a]/95 border-[#d1b16a]/25" 
                    : "bg-white/95 border-[#d1b16a]/30"
                )}
                style={{
                  boxShadow: theme === 'dark' 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(209, 177, 106, 0.2)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(209, 177, 106, 0.15)'
                }}
              >
                <div className="p-6">
                  {/* Enhanced Header */}
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
                    >
                      <div className="glass backdrop-blur-20 p-3 rounded-xl border border-[#d1b16a]/30 hover:border-[#d1b16a]/60 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <FiX size={20} className="text-[#d1b16a] relative z-10 transition-transform duration-300 group-hover:rotate-90" />
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Enhanced User Profile */}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="glass backdrop-blur-20 p-4 rounded-2xl mb-6 border border-[#d1b16a]/20 bg-gradient-to-br from-[#d1b16a]/10 via-transparent to-[#d1b16a]/5 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#d1b16a]/30 to-[#d1b16a]/10 rounded-full flex items-center justify-center shadow-inner border border-[#d1b16a]/20">
                          <FiUser size={18} className="text-[#d1b16a]" />
                        </div>
                        <div>
                          <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-[#111]'}`}>
                            {user.name}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="space-y-6">
                    <div>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`text-xs uppercase tracking-wider mb-3 font-bold px-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
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
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative group min-h-[48px] touch-manipulation overflow-hidden ${
                                theme === 'dark' 
                                  ? 'hover:bg-[#d1b16a]/20 text-[var(--text-primary)]' 
                                  : 'hover:bg-[#d1b16a]/15 text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#d1b16a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="text-[#d1b16a] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                {React.cloneElement(item.icon, { size: 20 })}
                              </div>
                              <span className="font-semibold text-sm flex-1 text-[var(--text-primary)] relative z-10">
                                {item.label}
                              </span>
                              {item.badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 400 }}
                                  className="bg-gradient-to-r from-[#d1b16a] to-[#d1b16a]/80 text-[#000000] text-xs px-2 py-1 rounded-full font-bold shadow-lg relative z-10"
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
                        className={`text-xs uppercase tracking-wider mb-3 font-bold px-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
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
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 min-h-[48px] touch-manipulation relative group overflow-hidden ${
                                theme === 'dark' 
                                  ? 'hover:bg-[#d1b16a]/20 text-[var(--text-primary)]' 
                                  : 'hover:bg-[#d1b16a]/15 text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-[#d1b16a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="text-[#d1b16a] relative z-10">{React.cloneElement(item.icon, { size: 20 })}</div>
                              <span className="font-semibold text-sm text-[var(--text-primary)] relative z-10">
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
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-red-500 w-full min-h-[48px] touch-manipulation relative group overflow-hidden ${
                                theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <FiLogOut size={20} className="relative z-10" />
                              <span className="font-semibold text-sm relative z-10">{t("logout")}</span>
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
                        className={`text-xs uppercase tracking-wider mb-3 font-bold px-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
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
                          className={`flex items-center justify-between p-3 glass backdrop-blur-20 rounded-xl border min-h-[48px] ${
                            theme === 'dark' 
                              ? 'border-[#d1b16a]/20 bg-gray-800/40' 
                              : 'border-[#d1b16a]/25 bg-gray-50/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#d1b16a]">
                              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </div>
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {t("appearance")}
                            </span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={toggleTheme}
                            className={`px-3 py-2 text-xs rounded-lg transition-all duration-300 font-semibold min-h-[36px] touch-manipulation ${
                              theme === 'dark'
                                ? 'bg-[#d1b16a]/20 hover:bg-[#d1b16a]/30 text-[#d1b16a] border border-[#d1b16a]/30'
                                : 'bg-[#d1b16a]/15 hover:bg-[#d1b16a]/25 text-[#d1b16a] border border-[#d1b16a]/30'
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
                          className={`flex items-center justify-between p-3 glass backdrop-blur-20 rounded-xl border min-h-[48px] ${
                            theme === 'dark' 
                              ? 'border-[#d1b16a]/20 bg-gray-800/40' 
                              : 'border-[#d1b16a]/25 bg-gray-50/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-[#d1b16a]">
                              <FiGlobe size={20} />
                            </div>
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {t("language")}
                            </span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={toggleLang}
                            className={`px-3 py-2 text-xs rounded-lg transition-all duration-300 font-semibold min-h-[36px] touch-manipulation ${
                              theme === 'dark'
                                ? 'bg-[#d1b16a]/20 hover:bg-[#d1b16a]/30 text-[#d1b16a] border border-[#d1b16a]/30'
                                : 'bg-[#d1b16a]/15 hover:bg-[#d1b16a]/25 text-[#d1b16a] border border-[#d1b16a]/30'
                            }`}
                          >
                            {lang === "ar" ? "EN" : "AR"}
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}