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
    { to: "/products?collection=mens", icon: <FiUser />, label: lang === 'ar' ? 'رجالي' : 'Men' },
    { to: "/products?collection=womens", icon: <FiUser />, label: lang === 'ar' ? 'نسائي' : 'Women' },
    { to: "/products?collection=basics", icon: <FiGrid />, label: lang === 'ar' ? 'سوليفا بيسكس' : 'Soleva Basics' },
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
        duration: 0.3, 
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
      y: '-100%',
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300, 
        mass: 0.8, 
        duration: 0.5 
      } 
    },
    exit: { 
      y: '-100%',
      opacity: 0,
      transition: { 
        duration: 0.3, 
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
            {/* Full Screen Overlay */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[100] md:hidden"
              style={{
                background: theme === 'dark' 
                  ? 'rgba(15, 15, 15, 0.75)' 
                  : 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              {/* Full Screen Menu Container */}
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-full flex flex-col"
              >
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center justify-between p-6 pt-8"
                >
                  {/* Centered Logo */}
                  <div className="flex-1 flex justify-center">
                    <Logo size="large" className="flex-shrink-0" />
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    whileTap={{ scale: 0.85, rotate: 90 }}
                    whileHover={{ scale: 1.15 }}
                    onClick={closeMenu}
                    className="relative overflow-hidden group"
                    aria-label="Close menu"
                  >
                    <div className="modern-glass-button p-3 rounded-xl border border-primary/30 hover:border-red-400/60 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <FiX size={24} className="text-primary group-hover:text-red-500 relative z-10 transition-all duration-300" />
                    </div>
                  </motion.button>
                </motion.div>

                {/* Navigation Links Section */}
                <div className="flex-1 flex flex-col justify-center px-6 py-8">
                  <div className="space-y-4 max-w-sm mx-auto w-full">
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
                            'w-full flex items-center justify-between rounded-2xl font-bold text-lg transition-all duration-300 group relative overflow-hidden',
                            'px-5 py-4 letter-spacing-wide',
                            isActiveLink(item.to)
                              ? 'bg-primary text-black shadow-lg'
                              : `modern-glass-button hover:bg-primary/20 ${theme === 'dark' ? 'text-gray-200 hover:text-primary' : 'text-gray-800 hover:text-primary'}`
                          )}
                          style={{
                            letterSpacing: '0.5px',
                            background: isActiveLink(item.to) 
                              ? 'linear-gradient(135deg, #d1b16a 0%, #b8965a 100%)'
                              : theme === 'dark'
                                ? 'rgba(10, 10, 10, 0.6)'
                                : 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(25px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                            border: isActiveLink(item.to)
                              ? '2px solid #d1b16a'
                              : theme === 'dark'
                                ? '2px solid rgba(255, 255, 255, 0.1)'
                                : '2px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: isActiveLink(item.to)
                              ? '0 8px 25px rgba(209, 177, 106, 0.5), 0 0 0 1px rgba(209, 177, 106, 0.3)'
                              : theme === 'dark'
                                ? '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                                : '0 8px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          {/* Glow effect on hover */}
                          <div className={clsx(
                            'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                            isActiveLink(item.to) 
                              ? 'bg-gradient-to-br from-primary/30 to-primary/10' 
                              : 'bg-gradient-to-br from-primary/20 to-primary/5'
                          )} />
                          
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={clsx(
                              'transition-transform duration-300 group-hover:scale-110',
                              isActiveLink(item.to) ? 'text-black' : ''
                            )}>
                              {item.icon}
                            </div>
                            <span className="text-lg font-bold">{item.label}</span>
                          </div>
                          {item.badge && (
                            <div className={clsx(
                              'px-3 py-1 rounded-full text-sm font-bold min-w-[24px] text-center relative z-10',
                              isActiveLink(item.to)
                                ? 'bg-black/20 text-black'
                                : 'bg-primary text-black'
                            )}>
                              {item.badge}
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="p-6 pb-8"
                >
                  <div className="max-w-sm mx-auto space-y-4">
                    {/* Controls Row */}
                    <div className="flex gap-3">
                      {/* Language Toggle */}
                      <button
                        onClick={toggleLang}
                        className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-lg transition-all duration-300 modern-glass-button hover:bg-primary/20"
                        style={{
                          letterSpacing: '0.5px',
                          background: theme === 'dark'
                            ? 'rgba(10, 10, 10, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(25px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                          border: theme === 'dark'
                            ? '2px solid rgba(255, 255, 255, 0.1)'
                            : '2px solid rgba(0, 0, 0, 0.1)',
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                      >
                        <FiGlobe size={20} />
                        <span>{lang === "ar" ? "EN" : "AR"}</span>
                      </button>

                      {/* Theme Toggle */}
                      <button
                        onClick={toggleTheme}
                        className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-lg transition-all duration-300 modern-glass-button hover:bg-primary/20"
                        style={{
                          letterSpacing: '0.5px',
                          background: theme === 'dark'
                            ? 'rgba(10, 10, 10, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(25px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                          border: theme === 'dark'
                            ? '2px solid rgba(255, 255, 255, 0.1)'
                            : '2px solid rgba(0, 0, 0, 0.1)',
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                      >
                        {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
                        <span>{theme === "dark" ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'داكن' : 'Dark')}</span>
                      </button>
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center gap-4">
                      <a
                        href="https://instagram.com/soleva"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 modern-glass-button hover:bg-primary/20"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(10, 10, 10, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(25px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                          border: theme === 'dark'
                            ? '2px solid rgba(255, 255, 255, 0.1)'
                            : '2px solid rgba(0, 0, 0, 0.1)',
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                        aria-label="Instagram"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com/soleva"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 modern-glass-button hover:bg-primary/20"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(10, 10, 10, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(25px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                          border: theme === 'dark'
                            ? '2px solid rgba(255, 255, 255, 0.1)'
                            : '2px solid rgba(0, 0, 0, 0.1)',
                          color: theme === 'dark' ? '#f5f5f5' : '#222'
                        }}
                        aria-label="Facebook"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    </div>

                    {/* Logout Button for logged in users */}
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-bold text-lg transition-all duration-300 modern-glass-button hover:bg-red-100 text-red-600 hover:text-red-700"
                        style={{
                          letterSpacing: '0.5px',
                          background: theme === 'dark'
                            ? 'rgba(10, 10, 10, 0.6)'
                            : 'rgba(255, 255, 255, 0.6)',
                          backdropFilter: 'blur(25px) saturate(180%)',
                          WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                          border: '2px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <FiLogOut size={20} />
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