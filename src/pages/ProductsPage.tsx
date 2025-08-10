import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGrid, FiList, FiFilter } from "react-icons/fi";
import { useLang, useTranslation } from "../contexts/LangContext";
import { products } from "../data/products";
import clsx from "clsx";

export const ProductsPage: React.FC = () => {
  const { lang } = useLang();
  const t = useTranslation();
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const [selectedCategory, setSelectedCategory] = useState(collectionParam || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const categories = [
    { id: "all", label: lang === "ar" ? "الكل" : "All" },
    { id: "mens", label: lang === "ar" ? "رجالي" : "Men's" },
    { id: "womens", label: lang === "ar" ? "نسائي" : "Women's" },
    { id: "basics", label: lang === "ar" ? "أساسي" : "Essentials" },
  ];

  const sortOptions = [
    { id: "name", label: lang === "ar" ? "الاسم" : "Name" },
    { id: "price-low", label: lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High" },
    { id: "price-high", label: lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low" },
  ];

  useEffect(() => {
    if (collectionParam && collectionParam !== selectedCategory) {
      setSelectedCategory(collectionParam);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [collectionParam]);

  let filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.collection === selectedCategory);

  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return a.name[lang].localeCompare(b.name[lang]);
    }
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-bg-secondary rounded-lg p-4 shadow-lg"
        >
          <h2 className="text-lg font-bold mb-4">{lang === "ar" ? "تصفية" : "Filters"}</h2>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">{lang === "ar" ? "الفئة" : "Category"}</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={clsx(
                    "px-3 py-2 rounded text-sm text-left",
                    selectedCategory === cat.id
                      ? "bg-primary text-black font-semibold"
                      : "hover:bg-bg-tertiary"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-2">{lang === "ar" ? "السعر" : "Price"}</h3>
            <input
              type="range"
              min={0}
              max={5000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full"
            />
            <p className="text-sm mt-1">
              {lang === "ar" ? "حتى" : "Up to"} {priceRange[1]} {t("egp")}
            </p>
          </div>
        </motion.aside>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Controls */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={clsx(
                    "px-4 py-2 rounded",
                    sortBy === option.id
                      ? "bg-primary text-black font-semibold"
                      : "bg-bg-secondary hover:bg-bg-tertiary"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 rounded",
                  viewMode === "grid" ? "bg-primary text-black" : "bg-bg-secondary"
                )}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-2 rounded",
                  viewMode === "list" ? "bg-primary text-black" : "bg-bg-secondary"
                )}
              >
                <FiList />
              </button>
            </div>
          </div>

          {/* Products */}
          <motion.div
            layout
            className={clsx(
              "gap-6",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col"
            )}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-bg-secondary rounded-lg shadow-lg overflow-hidden group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name[lang]}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.name[lang]}</h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                      {product.desc[lang]}
                    </p>
                    <span className="font-bold text-primary">
                      {product.price} {t("egp")}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
