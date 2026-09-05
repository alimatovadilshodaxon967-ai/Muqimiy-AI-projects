'use client';

import React, { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { TouchButton } from '@/components/ui/TouchButton';
import { Bot, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function MigrationAssistantScreen() {
  const { user } = useKiosk();
  const [step, setStep] = useState(1);
  const [targetCountry, setTargetCountry] = useState('Germaniya');
  const [goal, setGoal] = useState('Ishlash');
  const [education, setEducation] = useState('Oliy ta’lim');
  const [langLevel, setLangLevel] = useState('Boshlang‘ich');
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 1000);
  };

  return (
    <div className="page-container gradient-page">
      <KioskHeader title="Migratsiya AI Assistant" />

      <main className="page-content max-w-4xl mx-auto w-full my-auto flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/80 animate-fade-in-scale">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-600 to-sky-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
              <Bot className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-100 px-3 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Tayyorgarlik Rejasi
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Shaxsiy Migratsiya Tayyorgarlik Rejasi
              </h1>
            </div>
          </div>

          {!planGenerated ? (
            <div className="space-y-8">
              {/* Question 1: Country */}
              <div>
                <label className="font-bold text-slate-800 text-lg block mb-3">
                  1-savol: Qaysi davlatga ketmoqchisiz?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Germaniya', 'Janubiy Koreya', 'Yaponiya', 'Buyuk Britaniya'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTargetCountry(c)}
                      className={`p-4 rounded-2xl font-bold text-base border-2 transition-all active:scale-95 ${
                        targetCountry === c
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Goal */}
              <div>
                <label className="font-bold text-slate-800 text-lg block mb-3">
                  2-savol: Asosiy maqsadingiz nima?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Ishlash', 'O‘qish', 'Ausbildung / Tajriba'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`p-4 rounded-2xl font-bold text-base border-2 transition-all active:scale-95 ${
                        goal === g
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Language level */}
              <div>
                <label className="font-bold text-slate-800 text-lg block mb-3">
                  3-savol: Chet tili darajangiz qanday?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Boshlang‘ich (0-A2)', 'O‘rta (B1-B2)', 'Yuqori (C1-C2)'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLangLevel(l)}
                      className={`p-4 rounded-2xl font-bold text-base border-2 transition-all active:scale-95 ${
                        langLevel === l
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <TouchButton
                  variant="accent"
                  size="xl"
                  fullWidth
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  icon={<ArrowRight className="w-8 h-8" />}
                >
                  {isGenerating ? "REJA TAYYORLANMOQDA..." : "REJANI SHAKLLANTIRISH ➔"}
                </TouchButton>
              </div>
            </div>
          ) : (
            /* GENERATED STEP BY STEP PLAN */
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 font-bold flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>
                  {user?.name || 'Foydalanuvchi'} uchun {targetCountry}ga ({goal}) rasmiy tayyorgarlik rejasi:
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">1-qadam: Tilni o‘rganish (0-6 oy)</div>
                    <div className="text-slate-600 text-sm">{targetCountry} uchun talab etiladigan til sertifikatini olish. "Ibrat Farzandlari" modulimizdan foydalaning.</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">2-qadam: Kasbiy hujjatlarni apostil qilish</div>
                    <div className="text-slate-600 text-sm">Diplom, sertifikat va mehnat daftarchasini tarjima va tasdiqdan o‘tkazish.</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">3-qadam: Rasmiy portalda arizani ro‘yxatdan o‘tkazish</div>
                    <div className="text-slate-600 text-sm">O‘zbekiston Tashqi Mehnat Migratsiyasi Agentligi rasmiy portalida (migration.uz) ro‘yxatdan o‘tish.</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center shrink-0">4</span>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base">4-qadam: Viza suhbatiga tayyorgarlik</div>
                    <div className="text-slate-600 text-sm">Elchixona talablariga muvofiq moliyaviy kafolat va sug‘urtani rasmiylashtirish.</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <TouchButton
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => setPlanGenerated(false)}
                >
                  QAYTA TAYYORLASH
                </TouchButton>
                <TouchButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => window.open('https://migration.uz', '_blank')}
                >
                  RASMIY MANBAGA O'TISH
                </TouchButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
