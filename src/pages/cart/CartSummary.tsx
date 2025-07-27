import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useLang, useTranslation } from '../../contexts/LangContext';
import { COUPONS } from '../../constants/brand';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';

export default function CartSummary() {
  const { cart } = useCart();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = useTranslation();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);

  const handleApplyCoupon = () => {
    const validCoupon = COUPONS.find(c => c.code === coupon.toUpperCase());
    if (validCoupon) {
      setApplied(validCoupon);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = applied ? (total * applied.discount) / 100 : 0;
  const finalTotal = total - discount;

  if (cart.length === 0) return null;

  return (
    <GlassCard className="sticky top-4">
      <h3 className="text-xl font-bold mb-4 text-[#d1b16a] font-playfair">
        {t("orderSummary")}
      </h3>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name[lang]} × {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            className="glass border border-[#d1b16a]/40 px-3 py-2 rounded-lg flex-1 font-montserrat min-h-[44px]"
            placeholder={lang === 'ar' ? "أدخل كود الكوبون" : "Enter coupon code"}
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
          />
          <GlassButton 
            onClick={handleApplyCoupon} 
            disabled={!!applied}
            className="px-4 w-full sm:w-auto"
          >
            {applied ? t("applied") : t("applyCoupon")}
          </GlassButton>
        </div>
        {applied && (
          <p className="text-green-400 text-sm">
            {applied.code} - {applied.discount}% {t("discount")}
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-[#d1b16a]/20 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>{t("subtotal")}</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-400">
            <span>{t("discount")}</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg text-[#d1b16a] border-t border-[#d1b16a]/20 pt-2">
          <span>{t("total")}</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <GlassButton className="w-full mt-6">
        <GlassButton 
          onClick={() => navigate("/checkout", { state: { appliedCoupon: applied } })}
          className="mobile-checkout-btn w-full bg-[#d1b16a] text-black border-none hover:bg-[#d1b16a]/80"
        >
          <FiCreditCard />
          {t("proceedToCheckout")}
        </GlassButton>
      </GlassButton>
    </GlassCard>
  );
}