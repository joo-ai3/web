import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiShoppingCart, FiUser, FiGrid, FiBox, FiHeart, FiPhone,
  FiSun, FiMoon, FiGlobe, FiLogOut, FiHome, FiInfo, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import Logo from './Logo';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
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
    setCollectionsExpanded(false);
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

  const menuItems = [
    { to: "/", icon: <FiHome />, label: t("home") },
    { 
      to: null, 
      icon: <FiGrid />, 
      label: t("collections"), 
      isCollections: true,
      subItems: [
        { to: "/products?collection=mens", icon: "👟", label: lang === 'ar' ? 'رجالي' : 'Men' },
        { to: "/products?collection=womens", icon: "👠", label: lang === 'ar' ? 'نسائي' : 'Women' },
        { to: "/products?collection=basics", icon: "⚡", label: lang === 'ar' ? 'أساسي' : 'Essentials' },
      ]
    },
    { to: "/favorites", icon: <FiHeart />, label: t("favorites"), badge: favorites.length || null },
    { to: "/cart", icon: <FiShoppingCart />, label: t("cart"), badge: cart.length || null },
    { to: "/orders", icon: <FiBox />, label: t("orders") },
    { to: "/contact", icon: <FiPhone />, label: t("contactUs") },
    { to: "/about", icon: <FiInfo />, label: t("aboutUs") },
  ];

  const closeMenu = () => setIsOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    }
  };

  const menuVariants = {
    hidden: { 
      x: '-100%',
      opacity: 0
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300, 
        mass: 0.8, 
        duration: 0.6 
      } 
    },
    exit: { 
      x: '-100%',
      opacity: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
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

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setIsOpen(true)}
        className="md:hidden relative overflow-hidden group"
        aria-label="Open menu"
      >
        <div className="modern-glass-button p-3 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <FiMenu size={22} className="text-primary relative z-10 transition-transform duration-300 group-hover:rotate-180" />
        </div>
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop with Blur */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[100] md:hidden"
              style={{
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                background: 'rgba(0, 0, 0, 0.1)'
              }}
              onClick={closeMenu}
            />

            {/* Mobile Menu Container */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm z-[110] md:hidden overflow-y-auto"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(15, 15, 15, 0.85)' 
                  : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                borderRight: theme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: theme === 'dark'
                  ? '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  : '0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center justify-between p-6 pt-8 border-b"
                  style={{
                    borderColor: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Logo size="medium" />
                  
                  <motion.button
                    whileTap={{ scale: 0.85, rotate: 90 }}
                    whileHover={{ scale: 1.15 }}
                    onClick={closeMenu}
                    className="relative overflow-hidden group"
                    aria-label="Close menu"
                  >
                    <div 
                      className="p-3 rounded-xl border transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center"
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
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <FiX 
                        size={24} 
                        className="relative z-10 transition-all duration-300"
                        style={{
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                      />
                    </div>
                  </motion.button>
                </motion.div>

                {/* User Profile Section (if logged in) */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="p-6 border-b"
                    style={{
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(209, 177, 106, 0.2)'
                            : 'rgba(209, 177, 106, 0.1)',
                          color: '#d1b16a'
                        }}
                      >
                        <FiUser size={20} />
                      </div>
                      <div>
                        <div 
                          className="font-semibold"
                          style={{ color: theme === 'dark' ? '#f5f5f5' : '#222' }}
                        >
                          {user.name}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: theme === 'dark' ? '#b0b0b0' : '#666' }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Links Section */}
                <motion.div className="flex-1 p-6">
                  <div className="space-y-3">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.to || item.label}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {item.isCollections ? (
                          // Collections with sub-items
                          <div>
                            <button
                              onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                              className="w-full flex items-center justify-between rounded-xl font-semibold text-base transition-all duration-300 group relative overflow-hidden px-4 py-3"
                              style={{
                                background: theme === 'dark'
                                  ? 'rgba(30, 30, 30, 0.6)'
                                  : 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(20px) saturate(150%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                                border: theme === 'dark'
                                  ? '1px solid rgba(255, 255, 255, 0.1)'
                                  : '1px solid rgba(0, 0, 0, 0.1)',
                                boxShadow: theme === 'dark'
                                  ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                                  : '0 4px 15px rgba(0, 0, 0, 0.1)',
                                color: theme === 'dark' ? '#f5f5f5' : '#222'
                              }}
                            >
                              <div className="flex items-center gap-3 relative z-10">
                                <div 
                                  className="transition-transform duration-300 group-hover:scale-110"
                                  style={{ color: theme === 'dark' ? '#f5f5f5' : '#222' }}
                                >
                                  {item.icon}
                                </div>
                                <span className="font-semibold">{item.label}</span>
                              </div>
                              <div 
                                className="transition-transform duration-300"
                                style={{ color: theme === 'dark' ? '#f5f5f5' : '#222' }}
                              >
                                {collectionsExpanded ? <FiChevronUp /> : <FiChevronDown />}
                              </div>
                            </button>
                            
                            {/* Sub-items */}
                            <AnimatePresence>
                              {collectionsExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden mt-2 ml-4 space-y-2"
                                >
                                  {item.subItems?.map((subItem, subIndex) => (
                                    <motion.div
                                      key={subItem.to}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: subIndex * 0.1 }}
                                    >
                                      <Link
                                        to={subItem.to}
                                        onClick={closeMenu}
                                        className="w-full flex items-center gap-3 rounded-lg font-medium text-sm transition-all duration-300 group relative overflow-hidden px-3 py-2"
                                        style={{
                                          background: isActiveLink(subItem.to) 
                                            ? 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)'
                                            : theme === 'dark'
                                              ? 'rgba(30, 30, 30, 0.4)'
                                              : 'rgba(255, 255, 255, 0.4)',
                                          backdropFilter: 'blur(15px) saturate(120%)',
                                          WebkitBackdropFilter: 'blur(15px) saturate(120%)',
                                          border: isActiveLink(subItem.to)
                                            ? '1px solid #d1b16a'
                                            : theme === 'dark'
                                              ? '1px solid rgba(255, 255, 255, 0.05)'
                                              : '1px solid rgba(0, 0, 0, 0.05)',
                                          boxShadow: isActiveLink(subItem.to)
                                            ? '0 4px 15px rgba(209, 177, 106, 0.3)'
                                            : theme === 'dark'
                                              ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                              : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                          color: isActiveLink(subItem.to)
                                            ? '#000'
                                            : theme === 'dark' ? '#f5f5f5' : '#222'
                                        }}
                                      >
                                        <span className="text-lg">{subItem.icon}</span>
                                        <span>{subItem.label}</span>
                                      </Link>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          // Regular menu items
                          <Link
                            to={item.to!}
                            onClick={closeMenu}
                            className="w-full flex items-center justify-between rounded-xl font-semibold text-base transition-all duration-300 group relative overflow-hidden px-4 py-3"
                            style={{
                              background: isActiveLink(item.to!) 
                                ? 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)'
                                : theme === 'dark'
                                  ? 'rgba(30, 30, 30, 0.6)'
                                  : 'rgba(255, 255, 255, 0.6)',
                              backdropFilter: 'blur(20px) saturate(150%)',
                              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                              border: isActiveLink(item.to!)
                                ? '1px solid #d1b16a'
                                : theme === 'dark'
                                  ? '1px solid rgba(255, 255, 255, 0.1)'
                                  : '1px solid rgba(0, 0, 0, 0.1)',
                              boxShadow: isActiveLink(item.to!)
                                ? '0 4px 15px rgba(209, 177, 106, 0.4)'
                                : theme === 'dark'
                                  ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                                  : '0 4px 15px rgba(0, 0, 0, 0.1)',
                              color: isActiveLink(item.to!)
                                ? '#000'
                                : theme === 'dark' ? '#f5f5f5' : '#222'
                            }}
                          >
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="transition-transform duration-300 group-hover:scale-110">
                                {item.icon}
                              </div>
                              <span className="font-semibold">{item.label}</span>
                            </div>
                            {item.badge && (
                              <div 
                                className="px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center relative z-10"
                                style={{
                                  background: isActiveLink(item.to!)
                                    ? 'rgba(0, 0, 0, 0.2)'
                                    : '#d1b16a',
                                  color: isActiveLink(item.to!) ? '#000' : '#000'
                                }}
                              >
                                {item.badge}
                              </div>
                            )}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="p-6 border-t"
                  style={{
                    borderColor: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="space-y-4">
                    {/* Controls Row */}
                    <div className="flex gap-3">
                      {/* Language Toggle */}
                      <button
                        onClick={toggleLang}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(30, 30, 30, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(20px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                          border: theme === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid rgba(0, 0, 0, 0.1)',
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                      >
                        <FiGlobe size={18} />
                        <span>{lang === "ar" ? "EN" : "AR"}</span>
                      </button>

                      {/* Theme Toggle */}
                      <button
                        onClick={toggleTheme}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(30, 30, 30, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(20px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                          border: theme === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid rgba(0, 0, 0, 0.1)',
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                      >
                        {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                        <span>{theme === "dark" ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}</span>
                      </button>
                    </div>

                    {/* Logout Button for logged in users */}
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-semibold text-sm transition-all duration-300"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(30, 30, 30, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(20px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444'
                        }}
                      >
                        <FiLogOut size={18} />
                        <span>{t("logout")}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}