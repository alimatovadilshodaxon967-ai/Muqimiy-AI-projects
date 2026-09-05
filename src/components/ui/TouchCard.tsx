'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface TouchCardProps {
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  imageSrc?: string;
  onClick?: () => void;
  colorScheme?: 'blue' | 'green' | 'sky' | 'amber' | 'rose' | 'purple';
  badge?: string;
  highlighted?: boolean;
}

export const TouchCard: React.FC<TouchCardProps> = ({
  title,
  description,
  icon,
  imageSrc,
  onClick,
  colorScheme = 'green',
  badge,
  highlighted = false,
}) => {
  const getBadgeStyle = () => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'sky':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'green':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-between p-6 sm:p-7 md:p-8 rounded-[32px] bg-white border border-[#EAE6DF] hover:border-[#0F766E] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 active:scale-[0.98] cursor-pointer min-h-[420px] sm:min-h-[460px] md:min-h-[490px] overflow-hidden ${
        highlighted ? 'ring-2 ring-[#0F766E] border-[#0F766E]' : ''
      }`}
    >
      {/* Top Accent Line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {badge && (
        <span className={`absolute top-4 right-4 border text-xs font-black px-3 py-1 rounded-full z-10 tracking-wide shadow-2xs ${getBadgeStyle()}`}>
          {badge}
        </span>
      )}

      {imageSrc ? (
        <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-[26px] overflow-hidden border border-[#F0ECE4] shadow-xs my-auto group-hover:scale-104 transition-transform duration-300 shrink-0 bg-[#FAF8F5] relative">
          <Image
            src={imageSrc}
            alt={title}
            width={240}
            height={240}
            className="w-full h-full object-cover"
          />
        </div>
      ) : icon ? (
        <div className="w-32 h-32 rounded-[26px] bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-5xl my-auto text-[#292524] group-hover:scale-105 transition-transform duration-300">
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-2 text-center w-full mt-auto pt-3">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#1C1917] tracking-tight group-hover:text-[#0F766E] transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-[#78716C] font-semibold text-xs sm:text-sm md:text-base leading-relaxed max-w-[95%]">
          {description}
        </p>

        <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-[#0F766E] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Bo'limga o'tish</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
