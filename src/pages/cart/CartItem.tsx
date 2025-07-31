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
      className="mobile-cart-item cart-item flex flex-col sm:flex-row items-start sm:items-center gap-4 glass rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 p-5"
    >
      <img 
        src={item.image} 
        alt={item.name[lang]} 
        className="mobile-cart-image w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg flex-shrink-0 transition-transform duration-300 hover:scale-105" 
      />

      <div className="flex-1 min-w-0 w-full">
        <h3 className="mobile-cart-title font-bold line-clamp-2">{item.name[lang]}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>{t("color")}: {item.color}</div>
          <div>{t("size")}: {item.size}</div>
        </div>
        <div className="mobile-cart-price text-[#d1b16a] font-bold mt-2">
          {item.price * item.qty} {t("egp")}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-2 w-full sm:w-auto">
        <div className="quantity-control">
          <button
            onClick={() => handleQty(-1)}
            className="quantity-btn"
            disabled={item.qty <= 1}
          >
            <FiMinus />
          </button>
          <span className="quantity-display">{item.qty}</span>
          <button
            onClick={() => handleQty(1)}
            className="quantity-btn"
          >
            <FiPlus />
          </button>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="remove-btn w-12 h-12 flex items-center justify-center"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
