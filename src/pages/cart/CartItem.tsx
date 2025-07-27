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
      whileHover={{ y: -2, scale: 1.01 }}
      className="cart-item flex flex-row items-center gap-4 p-4 glass rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 max-h-[140px]"
    >
      <img 
        src={item.image} 
        alt={item.name[lang]} 
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0 transition-transform duration-300 hover:scale-105" 
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base line-clamp-2">{item.name[lang]}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>{t("color")}: {item.color}</div>
          <div>{t("size")}: {item.size}</div>
        </div>
        <div className="text-[#d1b16a] font-bold text-base mt-2">
          {item.price * item.qty} {t("egp")}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQty(-1)}
            className="glass w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#d1b16a]/20 transition-colors min-h-[44px]"
          >
            <FiMinus />
          </button>
          <span className="w-8 text-center font-bold text-base">{item.qty}</span>
          <button
            onClick={() => handleQty(1)}
            className="glass w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#d1b16a]/20 transition-colors min-h-[44px]"
          >
            <FiPlus />
          </button>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="glass w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors min-h-[44px]"
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
}
