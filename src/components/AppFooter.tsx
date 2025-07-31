import React from 'react';
import { useLang, useTranslation } from '../contexts/LangContext';
import Logo from './Logo';

export default function AppFooter() {
  const { lang } = useLang();
  const t = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass bg-white/20 border-t border-white/20 py-8 sm:py-10 text-center mt-16 sm:mt-20 lg:mt-24">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Logo size="small" className="mb-2 sm:mb-4" />
          <span className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl px-4">
          {lang === "ar"
            ? `© ${currentYear} جميع الحقوق محفوظة لـ سوليفا. مقر الشركة: القاهرة، مصر.`
            : `© ${currentYear} All rights reserved for Soleva. HQ: ${t("companyLocation")}.`}
        </span>
        </div>
      </div>
    </footer>
  );
}
