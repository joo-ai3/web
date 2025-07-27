import React from 'react';
import { useLang, useTranslation } from '../contexts/LangContext';
import Logo from './Logo';

export default function AppFooter() {
  const { lang } = useLang();
  const t = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass bg-white/20 border-t border-white/20 py-6 text-center mt-24">
      <div className="flex flex-col items-center gap-2 px-4">
        <Logo size="medium" className="mb-4" />
        <span className="text-[#666] text-sm leading-relaxed max-w-xl">
          {lang === "ar"
            ? `© ${currentYear} جميع الحقوق محفوظة لـ سوليفا. مقر الشركة: القاهرة، مصر.`
            : `© ${currentYear} All rights reserved for Soleva. HQ: ${t("companyLocation")}.`}
        </span>
      </div>
    </footer>
  );
}
