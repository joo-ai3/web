import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from '../../contexts/LangContext';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';

interface CartSummaryProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  onCheckout, 
  showCheckoutButton = true 
}) => {
  const { items, getTotalPrice, getTotalItems } = useCart();
  const { t } = useTranslation();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return null;
  }

  return (
    <GlassCard className="sticky top-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('cart.summary', 'Order Summary')}
      </h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>{t('cart.subtotal', 'Subtotal')} ({getTotalItems()} {t('cart.items', 'items')})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>{t('cart.shipping', 'Shipping')}</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 dark:text-green-400">
                {t('cart.freeShipping', 'Free')}
              </span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>{t('cart.tax', 'Tax')}</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <hr className="border-gray-200 dark:border-gray-700" />
        
        <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <span>{t('cart.total', 'Total')}</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {subtotal < 100 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t('cart.freeShippingPromo', 'Add')} ${(100 - subtotal).toFixed(2)} {t('cart.freeShippingPromo2', 'more for free shipping!')}
          </p>
        </div>
      )}

      {showCheckoutButton && (
        <GlassButton
          onClick={onCheckout}
          className="w-full py-3 text-lg font-semibold"
          variant="primary"
        >
          {t('cart.proceedToCheckout', 'Proceed to Checkout')}
        </GlassButton>
      )}
    </GlassCard>
  );
};

export default CartSummary;