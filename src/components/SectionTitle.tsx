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
      className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-7 font-montserrat tracking-wide text-[#111] leading-tight optimize-text ${className}`}
    >
      {children}
    </h2>
  );
}