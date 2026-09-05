'use client';

import React from 'react';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { MOCK_AI_TOOLS } from '@/lib/mockData';
import { Wrench, ExternalLink } from 'lucide-react';

export default function AIToolsCatalogScreen() {
  const handleOpenTool = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="gradient-page relative overflow-hidden flex flex-col min-h-screen pt-20 select-none">
      <KioskHeader title="AI Tools Katalogi" />

      <main className="max-w-6xl mx-auto w-full my-auto flex flex-col justify-center px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6 animate-fade-in-down">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#EAE6DF] text-[#57534E] rounded-full font-bold text-xs mb-2 shadow-2xs">
            <Wrench className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>AI SERVISLAR HUBLARI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] mb-1.5 tracking-tight">
            Dunyodagi Eng Kuchli Sun’iy Intellekt Vositalari
          </h1>
          <p className="text-[#78716C] text-xs sm:text-sm font-medium max-w-lg mx-auto">
            Matn, rasm, musiqa, video va ta’lim uchun maxsus AI servislari
          </p>
        </div>

        {/* AI TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_AI_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-[#EAE6DF] hover:border-[#D6CFBE] flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-2xl shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1C1917]">{tool.name}</h3>
                    <span className="text-[11px] font-semibold text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded-full border border-[#99F6E4] inline-block mt-0.5">
                      {tool.category}
                    </span>
                  </div>
                </div>

                <p className="text-[#78716C] text-xs sm:text-sm font-medium mb-4 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <button
                onClick={() => handleOpenTool(tool.url)}
                className="w-full py-2.5 px-4 bg-[#1C1917] hover:bg-[#292524] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ochish</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
