import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-7 font-montserrat tracking-wide text-[#111] leading-tight ${className}`}>
      {children}
    </h2>
  );
}