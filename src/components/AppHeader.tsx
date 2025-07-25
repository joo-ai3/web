import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMoon, FiSun, FiHeart } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLang, useTranslation } from '../contexts/LangContext';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

export default function AppHeader() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const t = useTranslation();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-[#d1b16a]/40 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 shadow-lg min-h-[64px]">
      {/* Logo */}
      <Logo size="medium" showText={true} className="flex-shrink-0" />

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-3">
        {/* Links */}
        <Link to="/" className="hover:text-[#d1b16a] transition-colors px-2 lg:px-3 py-2 text-sm lg:text-base">
          {t("home")}
        </Link>
        <Link to="/products" className="hover:text-[#d1b16a] transition-colors px-2 lg:px-3 py-2 text-sm lg:text-base">
          {t("products")}
        </Link>
        <Link to="/about" className="hover:text-[#d1b16a] transition-colors px-2 lg:px-3 py-2 text-sm lg:text-base">
          {t("aboutUs")}
        </Link>
        <Link to="/contact" className="hover:text-[#d1b16a] transition-colors px-2 lg:px-3 py-2 text-sm lg:text-base">
          {t("contactUs")}
        </Link>
        
        {/* Favorites */}
        <Link to="/favorites" className="hover:text-[#d1b16a] transition-colors relative flex items-center gap-1 px-2 lg:px-3 py-2">
          <FiHeart />
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="hover:text-[#d1b16a] transition-colors relative flex items-center gap-1 px-2 lg:px-3 py-2">
          <FiShoppingCart />
          {Array.isArray(cart) && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#d1b16a] text-black rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 lg:gap-2 ml-2 lg:ml-4">
          {/* Theme Switcher */}
          <button
            aria-label="Toggle Theme"
            className="glass border rounded-lg px-2 lg:px-3 py-2 hover:bg-[#d1b16a]/20 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {/* Language Switcher */}
          <button
            aria-label="Switch Language"
            className="glass border rounded-lg px-2 lg:px-3 py-2 hover:bg-[#d1b16a]/20 transition-colors font-semibold text-xs lg:text-sm min-h-[40px]"
            onClick={toggleLang}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          {/* Account/Login */}
          <Link
            to={user ? "/account" : "/login"}
            className="glass border rounded-lg px-2 lg:px-3 py-2 hover:bg-[#d1b16a]/20 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <FiUser />
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu />
    </header>
  );
}
