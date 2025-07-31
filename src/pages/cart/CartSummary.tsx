import React, { useState } from 'react';
import { FiCreditCard, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useLang, useTranslation } from '../../contexts/LangContext';
import { COUPONS } from '../../constants/brand';
import GlassCard from '../GlassCard';
import GlassButton from '../GlassButton';

export default function CartSummary() {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = useTranslation();

  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState<any>(null);

  const handleApplyCoupon = () => {
    const found = COUPONS.find(c => c.code.toUpperCase() === coupon.trim().toUpperCase());
    if (!found) {
      showToast(t("invalidCoupon"));
      setApplied(null);
    } else {
      setApplied(found);
      showToast(t("couponApplied"));
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = applied?.discount ? Math.floor((subtotal * applied.discount) / 100) : 0;
  const shipping = applied?.freeShipping ? 0 : 60;
  const total = subtotal - discount + (cart.length > 0 ? shipping : 0);

  return (
    <GlassCard>
      <h3 className="text-xl font-bold mb-6">{t("total")}</h3>

      {/* Coupon */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            className="glass border border-[#d1b16a]/40 px-3 py-2 rounded-lg flex-1 font-montserrat"
            placeholder={lang === 'ar' ? "أدخل كود الكوبون" : "Enter coupon code"}
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            disabled={!!applied}
          />
          <GlassButton 
            onClick={handleApplyCoupon} 
            disabled={!!applied}
            className="px-4"
          >
            {applied ? t("applied") : t("applyCoupon")}
          </GlassButton>
        </div>
        {applied && (
          <div className="text-green-600 font-semibold text-sm bg-green-50 p-2 rounded-lg">
            ✓ {applied.desc[lang]}
          </div>
        )}
      </div>

      {/* Prices */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between">
          <span>{lang === "ar" ? "الإجمالي قبل الخصم" : "Subtotal"}:</span>
          <span className="font-bold">{subtotal} {t("egp")}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{t("couponDiscount")}:</span>
            <span className="font-bold">-{discount} {t("egp")}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{t("shipping")}:</span>
          <span className="font-bold">
            {shipping === 0 ? t("free") : `${shipping} ${t("egp")}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between text-xl font-bold mb-6">
        <span>{t("total")}:</span>
        <span className="text-[#d1b16a]">{total} {t("egp")}</span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <GlassButton 
          onClick={() => navigate("/checkout", { state: { appliedCoupon: applied } })}
          className="w-full bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80"
        >
          <FiCreditCard />
          {t("checkout")}
        </GlassButton>

        <GlassButton 
          className="w-full bg-gray-400 text-black hover:bg-gray-500 border-none" 
          onClick={() => {
            clearCart();
            showToast(t("cartEmptied"));
          }}
        >
          <FiTrash2 />
          {t("emptyCart")}
        </GlassButton>
      </div>
    </GlassCard>
  );
}
