import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation, useLang } from '../contexts/LangContext';
import { products } from '../data/products';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { t } = useTranslation();
  const { lang } = useLang();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionTitle>{t("favorites")}</SectionTitle>
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 text-center">
              Start adding products to your favorites to see them here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle>{t("favorites")}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <GlassCard key={product.id} className="group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name[lang]}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <h3 className="font-semibold text-lg mb-2">{product.name[lang]}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.desc[lang]}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#d1b16a]">
                  {product.price} {t("egp")}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;