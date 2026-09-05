'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { MOCK_PSYCHOLOGY_CATEGORIES } from '@/lib/mockData';
import { getTranslation } from '@/lib/translations';
import { HeartHandshake, ShieldAlert, MessageCircle, Smile, ArrowRight } from 'lucide-react';

export default function PsychologyHubScreen() {
  const router = useRouter();
  const { language } = useKiosk();
  const t = getTranslation(language);
  const [selectedCat, setSelectedCat] = useState(MOCK_PSYCHOLOGY_CATEGORIES[0]);

  return (
    <div className="gradient-page relative overflow-hidden flex flex-col min-h-screen pt-20 select-none">
      <KioskHeader title={t.psychModuleTitle} />

      <main className="max-w-6xl mx-auto w-full my-auto flex flex-col justify-center px-4 py-6">
        {/* Title */}
        <div className="text-center mb-4 animate-fade-in-down">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#EAE6DF] text-[#57534E] rounded-full font-bold text-xs mb-2 shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{t.psychBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] mb-1.5 tracking-tight">
            {t.psychHeading}
          </h1>
          <p className="text-[#78716C] text-xs sm:text-sm font-medium max-w-lg mx-auto">
            {t.psychSubheading}
          </p>
        </div>

        {/* MEDICAL DISCLAIMER */}
        <div className="mb-4 p-3.5 bg-white border border-[#EAE6DF] rounded-2xl flex items-start gap-2.5 text-[#57534E] shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs font-medium leading-relaxed">
            {t.confidentialNotice}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CATEGORIES GRID */}
          <div className="lg:col-span-5 space-y-2">
            {MOCK_PSYCHOLOGY_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCat(cat)}
                className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between shadow-2xs active:scale-95 ${
                  selectedCat.id === cat.id
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-white text-[#292524] border-[#EAE6DF] hover:border-[#D6CFBE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold">{cat.title}</h4>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        selectedCat.id === cat.id ? 'text-[#D6D3D1]' : 'text-[#78716C]'
                      }`}
                    >
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT ACTION CARD */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-[#EAE6DF] flex flex-col justify-between animate-fade-in-scale">
            <div>
              <div className="flex items-center gap-3 border-b border-[#EAE6DF] pb-4 mb-4">
                <span className="text-4xl">{selectedCat.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-[#1C1917]">
                    {selectedCat.title}
                  </h2>
                  <p className="text-[#78716C] font-medium text-xs sm:text-sm mt-0.5">
                    {selectedCat.description}
                  </p>
                </div>
              </div>

              {/* Supportive text */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] mb-5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#1C1917] text-sm">
                  <Smile className="w-4 h-4 text-[#0F766E]" />
                  <span>{t.psychHeading}</span>
                </div>
                <p className="text-[#57534E] text-xs leading-relaxed font-medium">
                  {t.aiPsychDesc}
                </p>
              </div>
            </div>

            {/* MAIN ACTIONS */}
            <div>
              <button
                onClick={() => router.push(`/psychology/chat?topic=${encodeURIComponent(selectedCat.title)}&icon=${encodeURIComponent(selectedCat.icon)}`)}
                className="w-full py-4 px-6 bg-[#1C1917] hover:bg-[#292524] active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.startChat}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
