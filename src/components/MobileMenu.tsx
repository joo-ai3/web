import React, { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMenu, FiX, FiShoppingCart, FiUser, FiGrid, FiBox, FiHeart, FiPhone,
  FiSun, FiMoon, FiGlobe, FiLogOut
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

  const menuItems = [
    { to: "/", icon: <FiGrid />, label: t("home") },
    { to: "/products", icon: <FiShoppingCart />, label: t("products") },
    { to: "/about", icon: <FiUser />, label: t("aboutUs") },
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden glass p-2 rounded-lg border border-[#d1b16a]/40"
      >
        <FiMenu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={clsx(
                "fixed top-0 bottom-0 w-[85%] max-w-xs h-screen z-[110] md:hidden overflow-y-auto",
                "bg-white dark:bg-[#1a1a1a] glass border border-[#d1b16a]/30 shadow-xl p-5",
                lang === 'ar' ? 'right-0 border-l' : 'left-0 border-r'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Logo size="small" showText={true} className="flex-shrink-0" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="glass p-2 rounded-lg border border-[#d1b16a]/40 hover:bg-[#d1b16a]/20 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* User */}
              {user && (
                <div className="glass p-4 rounded-xl mb-6 border border-[#d1b16a]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d1b16a]/20 rounded-full flex items-center justify-center">
                      <FiUser size={22} />
                    </div>
                    <div>
                      <div className="font-semibold text-[#111] dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs text-gray-500 uppercase mb-2">{t("menu")}</h3>
                  <div className="space-y-2">
                    {menuItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#d1b16a]/20 transition relative"
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="absolute right-3 bg-[#d1b16a] text-black text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-gray-500 uppercase mb-2">{t("account")}</h3>
                  <div className="space-y-2">
                    {accountItems.map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#d1b16a]/20 transition"
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 transition text-red-600 w-full"
                      >
                        <FiLogOut />
                        <span className="font-medium">{t("logout")}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-gray-500 uppercase mb-2">{t("settings")}</h3>
                  <div className="space-y-3">
                    {/* Theme */}
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        <span className="font-medium">{t("appearance")}</span>
                      </div>
                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="px-3 py-1 text-sm bg-[#d1b16a]/20 rounded-lg hover:bg-[#d1b16a]/30 transition"
                      >
                        {theme === "dark" ? t("light") : t("dark")}
                      </button>
                    </div>

                    {/* Lang */}
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiGlobe />
                        <span className="font-medium">{t("language")}</span>
                      </div>
                      <button
                        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                        className="px-3 py-1 text-sm bg-[#d1b16a]/20 rounded-lg hover:bg-[#d1b16a]/30 transition"
                      >
                        {lang === "ar" ? "EN" : "AR"}
                      </button>
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
