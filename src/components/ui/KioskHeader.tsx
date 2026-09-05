'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { getTranslation } from '@/lib/translations';
import { ArrowLeft, Home, HelpCircle, LogOut, UserCheck, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';

{/* ════════════════════════════════════════════════════════════
     UZBEK CORNER ORNAMENT (MILLIY BURCHAK NAQSHI)
   ════════════════════════════════════════════════════════════ */}
const UzbekCornerNaqsh: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Soft golden corner fill */}
    <path d="M0 0 H65 C65 35.89 35.89 65 0 65 V0Z" fill="url(#uzbekNaqshGold)" opacity="0.08" />
    
    {/* Geometric concentric arcs */}
    <path d="M0 24 C24 24 24 0 24 0" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M0 46 C46 46 46 0 46 0" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M0 66 C66 66 66 0 66 0" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="3 3" />
    <path d="M0 84 C84 84 84 0 84 0" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    
    {/* Traditional Islimiy Rosette & Star Details */}
    <circle cx="12" cy="12" r="5" fill="#D4AF37" />
    <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
    
    {/* 4-point golden diamond petals */}
    <path d="M24 6 L28 12 L24 18 L20 12 Z" fill="#D4AF37" opacity="0.85" />
    <path d="M6 24 L12 28 L18 24 L12 20 Z" fill="#D4AF37" opacity="0.85" />
    
    <circle cx="40" cy="14" r="2.5" fill="#D4AF37" />
    <circle cx="14" cy="40" r="2.5" fill="#D4AF37" />
    
    <circle cx="58" cy="18" r="2" fill="#D4AF37" opacity="0.75" />
    <circle cx="18" cy="58" r="2" fill="#D4AF37" opacity="0.75" />
    
    {/* Center paisley motif */}
    <path d="M30 30 C30 20 40 20 40 30 C40 40 30 40 30 30 Z" stroke="#D4AF37" strokeWidth="1.4" fill="#D4AF37" fillOpacity="0.2" />
    <circle cx="35" cy="35" r="2" fill="#D4AF37" />

    <defs>
      <linearGradient id="uzbekNaqshGold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

export const KioskHeader: React.FC<{ title?: string; subtitle?: string }> = ({ title, subtitle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearSession, language, setLanguage } = useKiosk();
  const t = getTranslation(language);
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const handleEndSession = () => {
    clearSession();
    router.push('/session-end');
  };

  const isStartPage = pathname === '/' || pathname === '/start';

  return (
    <>
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE6DF] px-4 sm:px-8 py-3 flex items-center justify-between z-40 fixed top-0 left-0 right-0 shadow-2xs">
        {/* Left Side: Back/Home & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {!isStartPage && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white rounded-xl border border-[#E5E0D6] shadow-2xs text-[#292524] font-bold text-xs sm:text-sm hover:bg-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
              title="Orqaga"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.back}</span>
            </button>
          )}

          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 bg-white rounded-xl border border-[#E5E0D6] shadow-2xs text-[#292524] font-bold text-xs sm:text-sm hover:bg-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
            title="Bosh sahifa"
          >
            <Home className="w-4 h-4 text-[#0F766E]" />
            <span className="hidden md:inline">{t.home}</span>
          </button>

          {title && (
            <div className="h-6 w-px bg-[#E5E0D6] hidden sm:block" />
          )}

          {title && (
            <div className="flex flex-col">
              <h1 className="font-black text-[#1C1917] text-xs sm:text-sm lg:text-base tracking-tight uppercase leading-tight">
                {title}
              </h1>
              {subtitle && (
                <span className="text-[9px] sm:text-[10px] font-bold text-[#78716C] uppercase tracking-wider leading-none mt-0.5">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Side: User Profile, Lang, Help, End Session */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User profile pill */}
          {user && (
            <button
              onClick={() => router.push('/profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#E5E0D6] shadow-xs hover:bg-[#F5F2EC] transition-all cursor-pointer"
            >
              {user.avatar ? (
                user.avatar.startsWith('data:') || user.avatar.startsWith('http') || user.avatar.startsWith('/') ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#0F766E]/40"
                  />
                ) : (
                  <span className="text-sm leading-none">{user.avatar}</span>
                )
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
              <span className="font-bold text-[#292524] text-xs">{user.name}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex bg-[#F5F2EC] p-1 rounded-xl border border-[#E5E0D6]">
            {(['UZ', 'RU', 'EN'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-white text-[#0F766E] shadow-2xs'
                    : 'text-[#78716C] hover:text-[#292524]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-[#E5E0D6] shadow-2xs text-[#78716C] hover:text-[#292524] font-bold text-xs sm:text-sm hover:bg-[#F5F2EC] active:scale-95 transition-all cursor-pointer"
            title="Yordam"
          >
            <HelpCircle className="w-4 h-4 text-[#0F766E]" />
            <span className="hidden lg:inline">{t.help}</span>
          </button>

          {/* End Session Button */}
          {user && (
            <button
              onClick={() => setShowConfirmExit(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FEF2F2] rounded-xl border border-[#FEE2E2] shadow-2xs text-[#DC2626] font-bold text-xs sm:text-sm hover:bg-[#FEE2E2] active:scale-95 transition-all cursor-pointer"
              title="Sessiyani yakunlash"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.endSession}</span>
            </button>
          )}
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
           HELP MODAL (WHITE PORCELAIN WITH UZBEK CORNER ORNAMENTS)
         ════════════════════════════════════════════════════════════ */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1222]/60 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
          <div className="relative bg-white rounded-[36px] p-8 sm:p-10 max-w-lg w-full shadow-[0_25px_80px_rgba(0,0,0,0.35)] border-2 border-[#EAE4D8] text-center animate-fade-in-scale overflow-hidden">
            
            {/* 4 Corner Traditional Uzbek Golden Ornaments (Naqshlar) */}
            <UzbekCornerNaqsh className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none" />
            <UzbekCornerNaqsh className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none rotate-90" />
            <UzbekCornerNaqsh className="absolute bottom-0 right-0 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none rotate-180" />
            <UzbekCornerNaqsh className="absolute bottom-0 left-0 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none -rotate-90" />

            {/* Center Icon */}
            <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-100/60 border-2 border-teal-200/80 shadow-[0_8px_20px_rgba(13,148,136,0.15)] flex items-center justify-center text-[#0F766E]">
              <HelpCircle className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.helpModalTitle}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] mb-2 tracking-tight">
              Yordam va Maslahat Markazi
            </h2>
            <p className="text-[#57534E] text-sm mb-6 leading-relaxed font-medium">
              {t.helpModalDesc}
            </p>

            <div className="space-y-3 mb-8 text-left relative z-10">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D8] flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-[11px] text-[#78716C] font-bold uppercase tracking-wider">{t.operator}</div>
                  <div className="text-[#0F766E] font-black text-2xl tracking-tight mt-0.5">+998 73 555-00-11</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAE4D8] flex items-center justify-center text-[#0F766E] shadow-xs">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4D8] shadow-2xs">
                <div className="text-[11px] text-[#78716C] font-bold uppercase tracking-wider">Navbatchi xodim</div>
                <div className="text-[#1C1917] font-bold text-sm mt-0.5">{t.dutyStaff}</div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="relative z-10 w-full py-4 px-6 rounded-2xl bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-extrabold text-sm transition-all cursor-pointer shadow-md"
            >
              {t.understandClose}
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
           CONFIRM EXIT MODAL — CLEAN PREMIUM DESIGN
         ════════════════════════════════════════════════════════════ */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
          <div className="relative bg-white rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-center animate-fade-in-scale overflow-hidden">
            
            {/* Subtle corner ornaments — small & elegant */}
            <UzbekCornerNaqsh className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-40" />
            <UzbekCornerNaqsh className="absolute top-0 right-0 w-16 h-16 pointer-events-none rotate-90 opacity-40" />
            <UzbekCornerNaqsh className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none rotate-180 opacity-40" />
            <UzbekCornerNaqsh className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none -rotate-90 opacity-40" />

            {/* Icon */}
            <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <LogOut className="w-7 h-7 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-[#1C1917] mb-1.5 tracking-tight">
              {t.exitConfirmTitle}
            </h2>

            {/* Subtitle */}
            <p className="text-sm text-[#78716C] leading-relaxed max-w-xs mx-auto mb-5 font-medium">
              {t.exitConfirmDesc}
            </p>

            {/* Privacy Info */}
            <div className="relative z-10 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-100 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-700 font-semibold text-left leading-snug">
                Barcha ma'lumotlaringiz terminaldan 100% xavfsiz o'chiriladi.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex items-center gap-3">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#F5F2EC] hover:bg-[#EAE6DF] text-[#44403C] font-bold text-sm transition-all active:scale-[0.97] cursor-pointer border border-[#E7E0D5]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleEndSession}
                className="flex-1 py-3.5 px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all active:scale-[0.97] cursor-pointer shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.confirmExit}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
