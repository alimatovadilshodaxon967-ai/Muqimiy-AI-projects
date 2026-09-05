'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { TouchButton } from '@/components/ui/TouchButton';
import { HeartHandshake, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "1. So'nggi haftalarda o'zingizda tez-tez ruhiy charchoq yoki holsizlik sezdingizmi?",
    options: ["Umuman yo'q", "Ba'zan", "Tez-tez", "Har kuni"],
  },
  {
    id: 2,
    question: "2. Rejalashtirgan ishlaringizni bajarishga motivatsiya va ishtiyoq yetarlimi?",
    options: ["Juda yuqori", "Etarli", "Ozroq kamaygan", "Umuman yo'q"],
  },
  {
    id: 3,
    question: "3. Uyqu sifatidan qoniqasizmi (vaqtida uxlash va tetik uyg'onish)?",
    options: ["A'lo darajada", "O'rtacha", "Yomon", "Juda yomon"],
  },
  {
    id: 4,
    question: "4. Atrofdagilar yoki yaqinlaringiz bilan muloqot qilish sizga qanchalik qulay?",
    options: ["Juda qulay", "O'rtacha", "Bir oz qiyin", "Yolg'iz qolishni afzal ko'raman"],
  },
];

export default function PsychologyTestScreen() {
  const router = useRouter();
  const { user } = useKiosk();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (idx: number) => {
    const updated = [...answers, idx];
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  return (
    <div className="page-container gradient-page">
      <KioskHeader title="Psixologik Holat Testi" />

      <main className="page-content max-w-3xl mx-auto w-full my-auto flex flex-col justify-center">
        <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/80 animate-fade-in-scale">
          {!isCompleted ? (
            <div>
              {/* Progress */}
              <div className="flex items-center justify-between text-slate-500 font-bold text-sm mb-2">
                <span>SAVOL {currentQ + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}% Bajarildi</span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-8">
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 leading-relaxed">
                {QUESTIONS[currentQ].question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {QUESTIONS[currentQ].options.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(idx)}
                    className="touch-btn touch-btn-outline w-full justify-start text-left text-xl p-5 hover:border-rose-400 hover:bg-rose-50 active:scale-98"
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-sm shrink-0 mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* NON-CLINICAL CAUTIOUS RESULT (REQUIREMENT 13) */
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <HeartHandshake className="w-12 h-12" />
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900">
                Test Yakunlandi!
              </h2>

              {/* Cautious Non-Clinical Feedback Statement */}
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-slate-800 text-left space-y-4">
                <div className="font-bold text-rose-900 text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-rose-600" />
                  Natija boyicha umumiy sharh:
                </div>
                <p className="text-slate-700 text-base leading-relaxed">
                  Javoblaringizda vaqtinchalik stress yoki ruhiy charchoq belgilari sezilishi mumkin. Bu kundalik mashg'ulotlar, o'qish yoki ish bosimi bilan bog'liq bo'lishi tabiiy.
                </p>
                <div className="p-4 bg-white rounded-xl border border-rose-100 text-sm font-semibold text-rose-950">
                  ⚠️ <em>Agar bu holat davom etsa yoki kundalik hayotingizga jiddiy ta’sir qilsa, inson mutaxassisi bilan suhbatlashish foydali bo‘lishi mumkin.</em>
                </div>
              </div>

              <div className="flex gap-4">
                <TouchButton
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleRestart}
                  icon={<RotateCcw className="w-5 h-5" />}
                >
                  TESTNI QAYTA O'TISH
                </TouchButton>

                <TouchButton
                  variant="accent"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/psychology/chat')}
                >
                  AI BILAN SUHBAT ➔
                </TouchButton>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
