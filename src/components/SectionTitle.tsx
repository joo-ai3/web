import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  role?: string;
  'aria-level'?: number;
}

export default function SectionTitle({ children, className = "", id, role = "heading", ...props }: SectionTitleProps) {
  return (
    <h2 
      id={id}
      role={role}
      aria-level={props['aria-level'] || 2}
      className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-montserrat tracking-wide text-[#111] leading-tight optimize-text text-center ${className}`}
    >
      {children}
    </h2>
  );
}