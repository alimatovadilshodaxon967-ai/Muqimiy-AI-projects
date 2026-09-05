'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { getTranslation } from '@/lib/translations';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SessionEndScreen() {
  const router = useRouter();
  const { language } = useKiosk();
  const t = getTranslation(language);

  // Auto redirect to START screen after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="gradient-page justify-center items-center p-6 text-center min-h-screen flex flex-col select-none">
      <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-[#EAE6DF] max-w-lg w-full animate-fade-in-scale">
        <div className="w-16 h-16 bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-[#1C1917] mb-2 tracking-tight">
          {t.sessionEndTitle}
        </h1>

        <p className="text-lg font-bold text-[#57534E] mb-4">
          {t.thankYou}
        </p>

        <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl text-[#78716C] text-xs font-semibold flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
          <span>{t.dataCleared}</span>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full min-h-[54px] py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98] text-white font-black text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>{t.backToStart}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-[#A8A29E] font-medium text-xs">
            Avtomatik yo'naltirilmoqda...
          </p>
        </div>
      </div>
    </div>
  );
}
