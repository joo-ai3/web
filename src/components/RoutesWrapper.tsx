import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { AnimatePresence } from 'framer-motion';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

import Home from '../pages/Home';
import ProductsPage from '../pages/ProductsPage';
import ProductPage from '../pages/ProductPage';
import CollectionPage from '../pages/CollectionPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmation from '../pages/OrderConfirmation';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AccountPage from '../pages/AccountPage';
import OrdersPage from '../pages/OrdersPage';
import OrderTrackingPage from '../pages/OrderTrackingPage';
import NotFoundPage from '../pages/NotFoundPage';
import FavoritesPage from '../pages/FavoritesPage';
import ContactPage from '../pages/ContactPage';
import AboutPage from '../pages/AboutPage';
import ProtectedRoute from './ProtectedRoute';

export default function RoutesWrapper() {
  const { lang } = useLang();
  const safeLang = ["ar", "en"].includes(lang) ? lang : "en";

  return (
    <div dir={safeLang === "ar" ? "rtl" : "ltr"} className={`${safeLang === "ar" ? "font-arabic" : "font-montserrat"} min-h-screen`}>
      <Router>
        <AppHeader />
        <main className="pt-16 sm:pt-20 lg:pt-24 min-h-[calc(100vh-56px)] bg-app">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/collections/:id" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <AppFooter />
      </Router>
    </div>
  );
}

