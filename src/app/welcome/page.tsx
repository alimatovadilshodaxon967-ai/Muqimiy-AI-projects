'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { TouchButton } from '@/components/ui/TouchButton';
import { getTranslation } from '@/lib/translations';
import { ArrowRight, ShieldCheck, Globe, CheckCircle2, User, Calendar, Sparkles } from 'lucide-react';
import { saveKioskUser } from '@/lib/firebase/db';

export default function WelcomeProfileScreen() {
  const router = useRouter();
  const { setUserProfile, language, setLanguage } = useKiosk();
  const t = getTranslation(language);

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [error, setError] = useState('');


  const handleNameChange = (val: string) => {
    // Only allow letters, spaces, hyphens, and apostrophes (Uzbek Cyrillic/Latin compatible)
    const filtered = val.replace(/[^a-zA-Zа-яА-ЯёЁo‘O‘g‘G‘oʻOʻgʻGʻ'` -]/g, '');
    setName(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.replace(/[0-9]/g, '').trim();
    if (!cleanName) {
      setError(t.errorName);
      return;
    }
    setError('');
    const userAge = age ? Number(age) : 20;
    setUserProfile(cleanName, userAge);
    saveKioskUser(cleanName, userAge);
    router.push('/dashboard');
  };

  return (
    <div className="gradient-page relative overflow-y-auto flex flex-col min-h-screen pt-20 pb-8 select-none">
      <KioskHeader title={t.profileTitle} />

      <main className="flex flex-col items-center justify-center max-w-xl mx-auto w-full my-auto px-4 py-4 sm:py-6 relative z-10 animate-fade-in-scale">
        <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-8 md:p-10 rounded-[32px] shadow-2xl border border-[#EAE6DF] w-full text-slate-900">
          {/* Header & Language Switch */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF8F5] border border-[#EAE6DF] text-[#0F766E] rounded-full font-bold text-xs shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{t.welcomeBadge}</span>
              </div>

              {/* Language Selector Bar */}
              <div className="inline-flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#E5E0D6]">
                <Globe className="w-3.5 h-3.5 text-[#78716C] ml-1.5" />
                {(['UZ', 'RU', 'EN'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      language === lang
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] mb-2 leading-tight tracking-tight">
              {t.welcomeHeading}
            </h1>
            <p className="text-[#78716C] text-xs sm:text-sm font-medium max-w-md mx-auto">
              {t.welcomeSubheading}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-xl font-bold text-center text-xs animate-bounce">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME INPUT */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE6DF] focus-within:border-[#0F766E] transition-all">
              <label className="flex items-center gap-2 text-sm font-black text-[#1C1917] mb-2">
                <User className="w-4 h-4 text-[#0F766E]" />
                <span>{t.nameLabel}</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full min-h-[50px] py-2.5 pl-4 pr-24 border border-[#D6CFBE] rounded-xl text-base font-bold text-[#1C1917] bg-white transition-all outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                  autoFocus
                />
                {name.trim().length > 0 && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#0F766E] font-bold text-xs bg-[#F0FDFA] px-2.5 py-1 rounded-lg border border-[#99F6E4]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.validCheck || "To'g'ri"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AGE INPUT & QUICK SELECTORS */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE6DF] focus-within:border-[#0F766E] transition-all">
              <label className="flex items-center gap-2 text-sm font-black text-[#1C1917] mb-2">
                <Calendar className="w-4 h-4 text-[#0F766E]" />
                <span>{t.ageLabel}</span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder={t.agePlaceholder}
                  className="w-full min-h-[50px] py-2.5 pl-4 pr-24 border border-[#D6CFBE] rounded-xl text-base font-bold text-[#1C1917] bg-white transition-all outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                  min={5}
                  max={100}
                />
                {age && Number(age) >= 5 && Number(age) <= 100 && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#0F766E] font-bold text-xs bg-[#F0FDFA] px-2.5 py-1 rounded-lg border border-[#99F6E4]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.validCheck || "To'g'ri"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <TouchButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                iconPosition="right"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                {t.continueBtn}
              </TouchButton>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#78716C] font-medium text-center">
            <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span>Ma'lumotlar faqat kiosk ichida saqlanadi va to'liq maxfiylik ta'minlanadi.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
