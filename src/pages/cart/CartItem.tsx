import React from 'react';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useLang, useTranslation } from '../../contexts/LangContext';

export default function CartItem({ item, index, onRemove }: { item: any, index: number, onRemove: (item: any) => void }) {
  const { updateQty } = useCart();
  const { showToast } = useToast();
  const { lang } = useLang();
  const t = useTranslation();

  const handleQty = (diff: number) => {
    const newQty = item.qty + diff;
    if (newQty < 1) return;
    updateQty(item.id, item.color, item.size, newQty);
    showToast(t("updateSuccess"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="cart-item flex flex-col sm:flex-row items-start sm:items-center gap-4 modern-glass-card rounded-xl border border-[var(--border-secondary)] hover:shadow-lg transition-all duration-300 p-4 sm:p-5"
    >
      <img 
        src={item.image} 
        alt={item.name[lang]} 
        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0 transition-transform duration-300 hover:scale-105" 
        loading="lazy"
        decoding="async"
        width="96"
        height="96"
      />

      <div className="flex-1 min-w-0 w-full">
        <h3 className="font-semibold text-base sm:text-lg text-[var(--text-primary)] line-clamp-2 mb-2">{item.name[lang]}</h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-1">
          <div>{t("color")}: {item.color}</div>
          <div>{t("size")}: {item.size}</div>
        </div>
        <div className="text-[var(--primary)] font-bold text-lg mt-2">
          {item.price * item.qty} {t("egp")}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-2 shadow-lg">
          <button
            onClick={() => handleQty(-1)}
            className="quantity-btn"
            disabled={item.qty <= 1}
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span className="quantity-display">{item.qty}</span>
          <button
            onClick={() => handleQty(1)}
            className="quantity-btn"
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="remove-btn w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center glass border border-red-200/50 rounded-xl bg-red-50/80 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 hover:shadow-lg transition-all duration-300"
          aria-label="Remove item from cart"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
}
