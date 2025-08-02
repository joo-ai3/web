import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMoon, FiSun, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import Logo from './Logo';
import clsx from 'clsx';

export default function AppHeader() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const t = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/products', label: t('products') },
    { to: '/about', label: t('aboutUs') },
    { to: '/contact', label: t('contactUs') }
  ];

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        {/* Logo */}
        <Logo size="medium" />

        {/* Desktop Navigation */}
        <div className="nav-links hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'nav-link',
                isActiveLink(link.to) && 'text-primary bg-primary-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Favorites - Desktop */}
          <Link 
            to="/favorites" 
            className="hidden md:flex nav-link relative"
            aria-label={`${t("favorites")} ${favorites.length > 0 ? `(${favorites.length} items)` : ''}`}
          >
            <FiHeart size={20} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Cart - Desktop */}
          <Link 
            to="/cart" 
            className="hidden md:flex nav-link relative"
            aria-label={`${t("cart")} ${cart.length > 0 ? `(${cart.length} items)` : ''}`}
          >
            <FiShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="btn btn-ghost px-3 py-2 text-sm font-semibold"
            aria-label={`Switch to ${lang === "ar" ? "English" : "Arabic"} language`}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Account - Desktop */}
          <Link
            to={user ? "/account" : "/login"}
            className="hidden md:flex btn btn-ghost p-2"
            aria-label={user ? t("account") : t("login")}
          >
            <FiUser size={20} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden btn btn-ghost p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border-primary bg-glass-bg backdrop-blur-20"
        >
          <div className="nav-container py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'nav-link text-left',
                    isActiveLink(link.to) && 'text-primary bg-primary-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t border-border-primary">
                <Link 
                  to="/favorites" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link flex items-center gap-2"
                >
                  <FiHeart size={18} />
                  {t("favorites")}
                  {favorites.length > 0 && (
                    <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                <Link 
                  to="/cart" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link flex items-center gap-2"
                >
                  <FiShoppingCart size={18} />
                  {t("cart")}
                  {cart.length > 0 && (
                    <span className="bg-primary text-black rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>

                <Link
                  to={user ? "/account" : "/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link flex items-center gap-2 text-[var(--text-primary)]"
                >
                  <FiUser size={18} />
                  {user ? t("account") : t("login")}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}