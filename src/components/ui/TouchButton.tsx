'use client';

import React from 'react';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'dark' | 'outline' | 'ghost' | 'danger' | 'start';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'start':
        return 'touch-btn-vision-start';
      case 'dark':
        return 'bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#334155] text-white shadow-md border border-slate-700/50';
      case 'accent':
      case 'primary':
        return 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-[0_8px_22px_rgba(5,150,105,0.28)] border border-emerald-400/40';
      case 'outline':
        return 'bg-white hover:bg-slate-50 text-[#0F172A] border-1.5 border-[#CBD5E1] hover:border-[#0F766E] shadow-2xs';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100/80 text-[#475569] hover:text-[#0F172A]';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_6px_18px_rgba(220,38,38,0.25)] border border-red-400/30';
      default:
        return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md';
    }
  };

  const getSizeClass = () => {
    if (variant === 'start') return '';
    switch (size) {
      case 'sm':
        return 'min-h-[42px] px-4 py-2 text-xs sm:text-sm rounded-xl font-bold';
      case 'lg':
        return 'min-h-[58px] px-8 py-3.5 text-base sm:text-lg rounded-2xl font-black';
      case 'xl':
        return 'min-h-[66px] px-10 py-4 text-lg sm:text-xl rounded-2xl font-black';
      case 'md':
      default:
        return 'min-h-[50px] px-6 py-3 text-sm sm:text-base rounded-2xl font-bold';
    }
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center gap-2.5 transition-all duration-250 cursor-pointer active:scale-[0.98] select-none ${getVariantClass()} ${getSizeClass()} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="shrink-0 flex items-center transition-transform group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span className="tracking-wide text-center">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 flex items-center transition-transform group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  );
};
