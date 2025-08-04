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
import MobileMenu from './MobileMenu';
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
    <header className="nav" role="banner" aria-label="Main navigation">
      <div className="nav-container">
        {/* Logo */}
        <Logo size="medium" />

        {/* Desktop Navigation */}
        <nav className="nav-links hidden md:flex" role="navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className={clsx(
                'nav-link',
                isActiveLink(link.to) && 'text-primary bg-primary-50'
              )}
              aria-current={isActiveLink(link.to) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center" aria-hidden="true">
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
              <span className="absolute -top-1 -right-1 bg-primary text-black rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center" aria-hidden="true">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-3 interactive-hover min-h-[44px] min-w-[44px]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="btn btn-ghost px-4 py-3 text-base font-bold interactive-hover min-h-[44px]"
            aria-label={`Switch to ${lang === "ar" ? "English" : "Arabic"} language`}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Account - Desktop */}
          <Link
            to={user ? "/account" : "/login"}
            className="hidden md:flex btn btn-ghost p-3 interactive-hover min-h-[44px] min-w-[44px]"
            aria-label={user ? t("account") : t("login")}
          >
            <FiUser size={20} />
          </Link>

          {/* Mobile Menu Toggle */}
          <MobileMenu />
        </div>
      </div>

    </header>
  );
}