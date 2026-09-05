'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { getTranslation } from '@/lib/translations';
import { Bot, MessageSquare, Wrench, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AIHubScreen() {
  const router = useRouter();
  const { user, language } = useKiosk();
  const t = getTranslation(language);

  const isChildMode = user?.ageGroup === '7-12';

  return (
    <div className="gradient-page relative overflow-y-auto flex flex-col min-h-screen pt-20 pb-10 select-none">
      <KioskHeader title={t.aiModuleTitle} />

      <main className="max-w-6xl mx-auto w-full my-auto flex flex-col justify-center px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#EAE6DF] text-[#57534E] rounded-full font-bold text-sm mb-3 shadow-2xs">
            <Bot className="w-4 h-4 text-[#0F766E]" />
            <span>{t.aiBadge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1C1917] mb-2 tracking-tight">
            {t.aiHeading}
          </h1>
          <p className="text-[#78716C] text-base sm:text-lg font-medium max-w-2xl mx-auto">
            {t.aiSubheading}
          </p>

          {isChildMode && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1 bg-[#F0FDFA] text-[#0F766E] rounded-full font-bold text-xs border border-[#99F6E4]">
              <ShieldCheck className="w-4 h-4" />
              <span>Bolalar xavfsiz rejimi</span>
            </div>
          )}
        </div>

        {/* 2 MAIN CARDS: CHAT vs AI TOOLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* OPEN CHAT CARD */}
          <div
            onClick={() => router.push('/ai/chat')}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EAE6DF] hover:border-[#D6CFBE] shadow-xs hover:shadow-md transition-all duration-250 hover:-translate-y-1 active:scale-[0.98] cursor-pointer flex flex-col justify-between min-h-[320px] group"
          >
            <div>
              <div className="w-16 h-16 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl flex items-center justify-center text-[#1C1917] mb-6 group-hover:border-[#1C1917] transition-colors">
                <MessageSquare className="w-8 h-8 text-[#1C1917]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] mb-3 group-hover:text-[#0F766E] transition-colors tracking-tight">
                {t.openChat}
              </h2>
              <p className="text-[#78716C] text-sm sm:text-base leading-relaxed font-medium">
                {t.aiSubheading}
              </p>
            </div>

            <div className="pt-8">
              <button className="w-full min-h-[56px] py-3.5 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer active:scale-95">
                <span>{t.startChat}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI TOOLS HUB CARD */}
          <div
            onClick={() => router.push('/ai/tools')}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EAE6DF] hover:border-[#0F766E] shadow-sm hover:shadow-lg transition-all duration-250 hover:-translate-y-1 active:scale-[0.98] cursor-pointer flex flex-col justify-between min-h-[320px] group"
          >
            <div>
              <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#0F766E] mb-6 group-hover:border-[#0F766E] transition-colors">
                <Wrench className="w-8 h-8 text-[#0F766E]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-3 group-hover:text-[#0F766E] transition-colors tracking-tight">
                {t.aiToolsCatalog}
              </h2>
              <p className="text-[#64748B] text-sm sm:text-base leading-relaxed font-semibold">
                ChatGPT, Gemini, Midjourney, Suno, Canva...
              </p>
            </div>

            <div className="pt-8">
              <button className="w-full min-h-[56px] py-3.5 px-6 bg-[#F8FAFC] border-1.5 border-[#CBD5E1] group-hover:border-[#0F766E] group-hover:bg-[#F0FDFA] text-[#0F172A] font-black text-base rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-95 shadow-2xs">
                <span>Katalogni ko'rish</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* QUICK CATEGORY CHIPS */}
        <div className="p-6 bg-white rounded-3xl border border-[#EAE6DF] shadow-2xs">
          <div className="text-xs font-bold text-[#78716C] mb-3 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{t.aiHeading}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: 'Matn & Insho' },
              { label: 'Tarjima (Uz-En-Ru-Zh-De)' },
              { label: 'Rasm va Poster' },
              { label: 'Video G\'oya' },
              { label: 'Qo\'shiq & Musiqa' },
              { label: 'Biznes G\'oyalar' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => router.push('/ai/chat')}
                className="bg-[#FAF8F5] hover:bg-[#F5F2EC] text-[#292524] text-sm font-bold border border-[#EAE6DF] hover:border-[#1C1917] cursor-pointer py-2.5 px-4 rounded-xl transition-all shadow-2xs"
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
