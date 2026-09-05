'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { Bot, CheckCircle2, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { saveKioskSurveyResult } from '@/lib/firebase/db';

/* ─── Types ─────────────────────────────────────────────── */
interface SurveyOption { id: string; label: string; }
interface SurveyStep {
  id: string;
  question: (name: string) => string;
  options: SurveyOption[];
}
interface ChatMessage { role: 'ai' | 'user'; text: string; }

/* ─── 1-chi Boshlang'ich Savol (Yo'nalish Tanlash) ───────── */
const INITIAL_STEP: SurveyStep = {
  id: 'main_goal',
  question: (name) => `Salom, ${name}! Men sizning shaxsiy AI yordamchingizman.\nBugun sizga eng ko'p qaysi yo'nalish kerak?`,
  options: [
    { id: 'language',   label: "🌍 Til o'rganmoqchiman" },
    { id: 'career',     label: "💻 Zamonaviy kasb va IT" },
    { id: 'migration',  label: "✈️ Xorijga chiqish & Migratsiya" },
    { id: 'psychology', label: "🧠 Psixologik ko'mak va maslahat" },
    { id: 'ai',         label: "🤖 AI texnologiyalarini o'rganish" },
  ],
};

/* ─── Har bir yo'nalish uchun maxsus 4 ta moslashtirilgan savol ─── */
const DIRECTION_BRANCHES: Record<string, SurveyStep[]> = {
  // 1. TIL O'RGANISH
  language: [
    {
      id: 'lang_choice',
      question: () => "Qaysi xorijiy tilni o'rganmoqchisiz?",
      options: [
        { id: 'english', label: "🇬🇧 Ingliz tili (IELTS / CEFR)" },
        { id: 'german',  label: "🇩🇪 Nemis tili (Goethe / Ausbildung)" },
        { id: 'russian', label: "🇷🇺 Rus tili (Erkin so'zlashuv)" },
        { id: 'asian',   label: "🇨🇳 🇰🇷 Xitoy, Koreys yoki Arab tili" },
      ],
    },
    {
      id: 'lang_level',
      question: () => "Ushbu til bo'yicha hozirgi darajangiz qanday?",
      options: [
        { id: 'a0_beginner', label: "Noldan, alifbodan boshlayman" },
        { id: 'a1_elementary', label: "Boshlang'ich grammatikani bilaman" },
        { id: 'b1_intermediate', label: "O'rta daraja, so'zlashuv amaliyoti kerak" },
        { id: 'c1_advanced', label: "Kuchli daraja, imtihonga tayyorlanmoqchiman" },
      ],
    },
    {
      id: 'lang_purpose',
      question: () => "Til o'rganishda asosiy maqsadingiz nima?",
      options: [
        { id: 'cert', label: "Xalqaro sertifikat olish (IELTS/CEFR/Goethe)" },
        { id: 'study_work', label: "Xorijda o'qish yoki ishlash" },
        { id: 'travel_fluent', label: "Erkin gaplashish va sayohat" },
        { id: 'career_boost', label: "Ishda yuqori maoshli lavozimga chiqish" },
      ],
    },
    {
      id: 'lang_time',
      question: (name) => `Ajoyib, ${name}! Har kuni til o'rganishga qancha vaqt ajrata olasiz?`,
      options: [
        { id: '15m', label: "15 – 30 daqiqa (Tezkor mikro-darslar)" },
        { id: '1h',  label: "1 – 2 soat (Muntazam o'rganish)" },
        { id: '3h',  label: "2 soatdan ortiq (Intensiv o'rganish 🚀)" },
      ],
    },
  ],

  // 2. KASB VA IT
  career: [
    {
      id: 'it_field',
      question: () => "Qaysi zamonaviy kasb sizga ko'proq qiziq?",
      options: [
        { id: 'programming', label: "💻 Dasturlash (Frontend, Python, Backend)" },
        { id: 'design',      label: "🎨 Grafik dizayn & UI/UX dizayn" },
        { id: 'marketing',   label: "📱 SMM, Kopirayting & Digital Marketing" },
        { id: 'ai_data',     label: "🤖 Sun'iy Intellekt (AI) & Data tahlil" },
      ],
    },
    {
      id: 'it_experience',
      question: () => "Bu sohadagi hozirgi bilim va tajribangiz qanday?",
      options: [
        { id: 'zero',   label: "Noldan, endi qiziqib boshlayapman" },
        { id: 'basics', label: "Asosiy tushunchalar va tajribam bor" },
        { id: 'junior', label: "O'rta daraja, amaliy portfolio kerak" },
        { id: 'pro',    label: "Professional darajaga chiqmoqchiman" },
      ],
    },
    {
      id: 'it_goal',
      question: () => "Kasb o'rganishdan asosiy maqsadingiz nima?",
      options: [
        { id: 'job',       label: "IT kompaniyada yuqori maoshli ish topish" },
        { id: 'freelance', label: "Frilanserlik orqali mustaqil daromad qilish" },
        { id: 'startup',   label: "O'z IT loyiham yoki startapimni boshlash" },
        { id: 'business',  label: "Mavjud biznesimni raqamlashtirish" },
      ],
    },
    {
      id: 'it_time',
      question: (name) => `Zo'r, ${name}! Kuniga amaliyot qilishga qancha vaqt ajrata olasiz?`,
      options: [
        { id: '15m', label: "15 – 30 daqiqa (Nazariya va tushunchalar)" },
        { id: '1h',  label: "1 – 2 soat (Amaliy mashqlar va kodlash)" },
        { id: '3h',  label: "2 soatdan ortiq (To'liq real loyihalar yaratish 🚀)" },
      ],
    },
  ],

  // 3. MIGRATSIYA & XORIJIY IMKONIYATLAR
  migration: [
    {
      id: 'country_target',
      question: () => "Xorijda qaysi davlat sizni ko'proq qiziqtirmoqda?",
      options: [
        { id: 'germany_eu', label: "🇩🇪 Germaniya va Yevropa Ittifoqi" },
        { id: 'asia_kr_jp', label: "🇰🇷 🇯🇵 Janubiy Koreya va Yaponiya" },
        { id: 'us_uk',      label: "🇺🇸 🇬🇧 AQSh va Buyuk Britaniya" },
        { id: 'uae_gulf',   label: "🇦🇪 BAA (Dubay) va Fors ko'rfazi" },
      ],
    },
    {
      id: 'mig_purpose',
      question: () => "Xorijga chiqishdagi asosiy maqsadingiz nima?",
      options: [
        { id: 'work_legal', label: "Qonuniy mehnat va ishga joylashish" },
        { id: 'study_grant', label: "Grant asosida universitetda o'qish" },
        { id: 'ausbildung', label: "Kasbiy ta'lim (Ausbildung) dasturlari" },
        { id: 'internship', label: "Xalqaro stajirovka va malaka oshirish" },
      ],
    },
    {
      id: 'mig_info_need',
      question: () => "Sizga qanday rasmiy ma'lumot eng zarur?",
      options: [
        { id: 'visa_docs',  label: "Viza va rasmiy hujjatlar ro'yxati" },
        { id: 'agencies',   label: "Qonuniy mehnat agentliklari va vakansiyalar" },
        { id: 'lang_certs', label: "Til sertifikati talablari va imtihonlar" },
        { id: 'safety',     label: "Moslashuv, xavfsizlik va yashash sharoitlari" },
      ],
    },
    {
      id: 'mig_language_level',
      question: (name) => `Tushunarli, ${name}. O'sha davlat tilini bilish darajangiz qanday?`,
      options: [
        { id: 'no_lang',   label: "Hali boshlamaganman, o'rganishim kerak" },
        { id: 'basic_lang', label: "Boshlang'ich so'zlashuv darajasidaman" },
        { id: 'certified', label: "Xalqaro sertifikatim bor (B1/B2/IELTS)" },
        { id: 'fluent',    label: "Erkin muloqot qila olaman 🚀" },
      ],
    },
  ],

  // 4. PSIXOLOGIK KO'MAK VA MASLAHAT
  psychology: [
    {
      id: 'psy_concern',
      question: () => "Hozirda sizni ko'proq qaysi holat bezovta qilmoqda?",
      options: [
        { id: 'stress',     label: "O'qish yoki ishdagi charchoq va stress" },
        { id: 'anxiety',    label: "Kelajak haqidagi xavotir va noaniqlik" },
        { id: 'motivation', label: "O'ziga ishonchsizlik va motivatsiya yetishmasligi" },
        { id: 'relations',  label: "Yaqinlar bilan munosabatlardagi qiyinchiliklar" },
      ],
    },
    {
      id: 'psy_help_type',
      question: () => "Sizga qanday ko'rinishdagi ko'mak qulayroq?",
      options: [
        { id: 'ai_chat',    label: "AI psixolog bilan maxfiy suhbatlashish" },
        { id: 'test_diag',  label: "Ruhiy holatni aniqlovchi qiziqarli testlar" },
        { id: 'meditation', label: "Nafas va tinchlantiruvchi mashqlar" },
        { id: 'guidance',   label: "Mutaxassis maslahatlari va kitoblar" },
      ],
    },
    {
      id: 'psy_sleep',
      question: () => "Oxirgi paytlarda uyqu va ruhiy xotirjamligingiz qanday?",
      options: [
        { id: 'sleep_ok',   label: "Yaxshi, faqat fikrlarim ko'p" },
        { id: 'sleep_bad',  label: "Uyqu buzilgan, tez charchayapman" },
        { id: 'irritable',  label: "Tez asabiylashib, siqilyapman" },
        { id: 'neutral',    label: "O'zgaruvchan, ba'zan yaxshi, ba'zan og'ir" },
      ],
    },
    {
      id: 'psy_result',
      question: (name) => `Sizni tushundim, ${name}. Bugungi ko'makdan qanday natija kutmoqdasiz?`,
      options: [
        { id: 'relief',     label: "Ichki yengillik va ruhiy xotirjamlik" },
        { id: 'action_plan', label: "Aniq yechimlar va maslahatlar topish" },
        { id: 'self_aware', label: "O'zimni yaxshiroq anglash va tushunish" },
        { id: 'just_talk',  label: "Erkin va do'stona suhbatlashish 🌿" },
      ],
    },
  ],

  // 5. SUN'IY INTELLEKT (AI) IMKONIYATLARI
  ai: [
    {
      id: 'ai_intent',
      question: () => "Sun'iy intellektdan qaysi maqsadda foydalanmoqchisiz?",
      options: [
        { id: 'study_help', label: "Darslar, referat va o'qishni osonlashtirish" },
        { id: 'work_auto',  label: "Ish va biznes jarayonlarini avtomatlashtirish" },
        { id: 'creative',   label: "Rasm, video, audio va dizaynlar yaratish" },
        { id: 'coding_ai',  label: "Dasturlash va kod yozishda yordamchi" },
      ],
    },
    {
      id: 'ai_experience',
      question: () => "Sun'iy intellekt vositalari bo'yicha tajribangiz qanday?",
      options: [
        { id: 'newbie',   label: "Yangi boshlayapman, nimalar qilishini bilmoqchiman" },
        { id: 'chatgpt',  label: "ChatGPT va boshqa AI lardan foydalanib turaman" },
        { id: 'prompts',  label: "Aniq va professional prompt yozishni bilaman" },
        { id: 'advanced', label: "AI modellarini o'z sohamga chuqur kiritmoqchiman" },
      ],
    },
    {
      id: 'ai_tools_fav',
      question: () => "Qaysi AI yo'nalishi sizga ko'proq qiziq?",
      options: [
        { id: 'text_ai',   label: "Matnli AI (ChatGPT, DeepSeek, Claude)" },
        { id: 'visual_ai', label: "Vizual AI (Midjourney, DALL-E, Canva AI)" },
        { id: 'media_ai',  label: "Ovozli va video AI generatorlar" },
        { id: 'dev_ai',    label: "Kod va ma'lumotlar tahlili AI lari" },
      ],
    },
    {
      id: 'ai_daily_time',
      question: (name) => `Ajoyib, ${name}! AI bilan ishlashga kunlik qancha vaqt ajratasiz?`,
      options: [
        { id: '15m', label: "15 – 30 daqiqa (Tezkor savol-javob)" },
        { id: '1h',  label: "1 – 2 soat (Ijodiy va amaliy ishlar)" },
        { id: '3h',  label: "2 soatdan ortiq (Professional loyihalar 🚀)" },
      ],
    },
  ],
};

/* ─── Component ─────────────────────────────────────────── */
export default function SurveyPage() {
  const router   = useRouter();
  const { user } = useKiosk();

  const [activeSteps,  setActiveSteps]  = useState<SurveyStep[]>([INITIAL_STEP]);
  const [stepIndex,    setStepIndex]    = useState(0);
  const [messages,     setMessages]     = useState<ChatMessage[]>([]);
  const [showOptions,  setShowOptions]  = useState(false);
  const [answers,      setAnswers]      = useState<Record<string, string>>({});
  const [finished,     setFinished]     = useState(false);
  const [redirecting,  setRedirecting]  = useState(false);
  const [hoveredOpt,   setHoveredOpt]   = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const userName  = user?.name ? user.name.replace(/[0-9]/g, '').trim() : "Do'stim";

  useEffect(() => { if (!user) router.push('/welcome'); }, [user, router]);

  /* First AI message */
  useEffect(() => {
    if (!user) return;
    const firstQ = INITIAL_STEP.question(userName);
    setTimeout(() => {
      setMessages([{ role: 'ai', text: firstQ }]);
      setTimeout(() => setShowOptions(true), 400);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* Auto-scroll to bottom */
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  }, [messages, showOptions, finished]);

  const handleSelect = (option: SurveyOption) => {
    const currentStep = activeSteps[stepIndex];
    const newAnswers = { ...answers, [currentStep.id]: option.id };
    setAnswers(newAnswers);
    setShowOptions(false);
    setHoveredOpt(null);

    setMessages(prev => [...prev, { role: 'user', text: option.label }]);

    let nextSteps = activeSteps;

    // Agar 1-savol bo'lsa, tanlangan yo'nalishga qarab keyingi 4 ta savol yuklanadi!
    if (stepIndex === 0) {
      const selectedBranch = DIRECTION_BRANCHES[option.id] || DIRECTION_BRANCHES.language;
      nextSteps = [INITIAL_STEP, ...selectedBranch];
      setActiveSteps(nextSteps);
    }

    const nextIndex = stepIndex + 1;

    if (nextIndex < nextSteps.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: nextSteps[nextIndex].question(userName) }]);
        setTimeout(() => {
          setStepIndex(nextIndex);
          setShowOptions(true);
        }, 300);
      }, 550);
    } else {
      saveKioskSurveyResult(user, newAnswers);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: `Rahmat, ${userName}! Siz tanlagan yo'nalish bo'yicha barcha ma'lumotlar tahlil qilindi va shaxsiy tavsiyalar tayyorlandi. Endi asosiy boshqaruv paneliga o'tamiz!`,
        }]);
        setFinished(true);
      }, 550);
    }
  };

  const handleGoToDashboard = () => {
    setRedirecting(true);
    setTimeout(() => router.push('/dashboard'), 600);
  };

  if (!user) return null;

  const totalSteps = 5;
  const progress = Math.round(((stepIndex + (finished ? 1 : 0)) / totalSteps) * 100);

  // Helper to find label for summary chips
  const findAnswerLabel = (key: string, val: string) => {
    const initOpt = INITIAL_STEP.options.find(o => o.id === val);
    if (initOpt) return initOpt.label;
    for (const branch of Object.values(DIRECTION_BRANCHES)) {
      for (const step of branch) {
        if (step.id === key) {
          const opt = step.options.find(o => o.id === val);
          if (opt) return opt.label;
        }
      }
    }
    return val;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#F2ECE1] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#E8F3EE] rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-[#EAE6DF] flex flex-col overflow-hidden"
           style={{ height: 'calc(100vh - 48px)', maxHeight: '680px' }}>

        {/* Header */}
        <div className="bg-[#FAF8F5] border-b border-[#EAE6DF] px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-[#1C1917] rounded-xl flex items-center justify-center text-white shadow-xs">
            <Bot size={20} />
          </div>

          <div className="flex-1">
            <div className="text-[#1C1917] font-bold text-sm">Muqimiy AI Yordamchi</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
              <span className="text-[#0F766E] text-xs font-semibold">Moslashuvchan tahlil</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D6] rounded-full px-3 py-1 text-xs font-bold text-[#78716C]">
            {Math.min(stepIndex + 1, totalSteps)} / {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#F0ECE4]">
          <div
            className="h-full bg-[#0F766E] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5 bg-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 items-end ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              style={{ animation: 'fadeInUp 0.3s ease both' }}
            >
              {msg.role === 'ai' ? (
                <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-[#1C1917] shrink-0">
                  <Bot size={16} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#1C1917] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {userName[0]?.toUpperCase()}
                </div>
              )}

              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-[#FAF8F5] border border-[#EAE6DF] text-[#1C1917] rounded-bl-xs font-medium'
                    : 'bg-[#1C1917] text-white rounded-br-xs font-semibold'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Options */}
          {showOptions && !finished && activeSteps[stepIndex] && (
            <div className="pl-10 flex flex-col gap-2" style={{ animation: 'fadeInUp 0.3s ease both' }}>
              {activeSteps[stepIndex].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHoveredOpt(opt.id)}
                  onMouseLeave={() => setHoveredOpt(null)}
                  className="text-left px-4 py-3 bg-white border border-[#E5E0D6] hover:border-[#1C1917] hover:bg-[#FAF8F5] text-[#292524] font-semibold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between shadow-2xs"
                >
                  <span>{opt.label}</span>
                  <ChevronRight size={16} className="text-[#A8A29E]" />
                </button>
              ))}
            </div>
          )}

          {/* Finished state */}
          {finished && (
            <div className="pl-10" style={{ animation: 'fadeInUp 0.4s ease both' }}>
              <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1C1917]">Tahlil yakunlandi!</div>
                    <div className="text-xs text-[#78716C]">Siz uchun barcha 5 ta yo'nalish tayyor</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {Object.entries(answers).map(([key, val]) => (
                    <span key={key} className="px-2.5 py-1 bg-white border border-[#E5E0D6] text-[#44403C] text-[11px] font-bold rounded-lg shadow-2xs">
                      {findAnswerLabel(key, val)}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleGoToDashboard}
                  disabled={redirecting}
                  className="w-full min-h-[54px] py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                >
                  {redirecting ? (
                    <>
                      <Sparkles size={18} className="animate-spin" />
                      <span>Yuklanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Asosiy bo'limga o'tish</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
