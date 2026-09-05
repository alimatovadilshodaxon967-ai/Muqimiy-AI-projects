'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { MOCK_CAREERS } from '@/lib/mockData';
import { CareerDirection } from '@/types';
import { getTranslation } from '@/lib/translations';
import { Briefcase, ExternalLink, Bot, Star, Volume2, Mic, MicOff, Loader2, Sparkles, PhoneCall, PhoneOff } from 'lucide-react';
import { RealisticVideoAvatar } from '@/components/avatar/RealisticVideoAvatar';
import { generateAIResponse, AIMessage } from '@/lib/ai/aiService';

export default function CareerHubScreen() {
  const router = useRouter();
  const { user, language } = useKiosk();
  const t = getTranslation(language);
  const [selectedCareer, setSelectedCareer] = useState<CareerDirection>(MOCK_CAREERS[0]);

  const userName = user?.name ? user.name.replace(/[0-9]/g, '').trim() : 'Farhodjon';

  // AI Avatar & Voice states
  const [avatarState, setAvatarState] = useState<'greeting' | 'idle'>('greeting');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [liveVoiceActive, setLiveVoiceActive] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const speechAbortRef = useRef<boolean>(false);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const liveVoiceActiveRef = useRef<boolean>(false);
  const isThinkingRef = useRef<boolean>(false);

  liveVoiceActiveRef.current = liveVoiceActive;
  isThinkingRef.current = isThinking;

  // Generate speech text for career
  const getCareerSpeech = useCallback((career: CareerDirection) => {
    return `${career.title} kasbi haqida ma'lumot: ${career.description}. Asosiy talab etiladigan ko'nikmalar: ${career.skills.join(', ')}. O'rtacha oylik daromad ${career.averageSalary || 'yuqori darajada'}. Ustoz AI yordamida o'quv rejasini hoziroq boshlashingiz mumkin!`;
  }, []);

  // Text-to-Speech function
  const speakText = useCallback(async (text: string, isInitialGreeting = false, autoContinue = true) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }

    speechAbortRef.current = false;
    if (isInitialGreeting) {
      setAvatarState('greeting');
    } else {
      setAvatarState('idle');
    }
    setIsSpeaking(true);

    const cleanText = text
      .replace(/[\u{1F600}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*/g, '')
      .trim();

    try {
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          figureId: 'mohira',
          voice: 'uz-UZ-MadinaNeural',
          rate: '+2%',
          pitch: '+1Hz',
        }),
        signal: controller.signal,
      });

      if (speechAbortRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (speechAbortRef.current) return;

        if (data.audioBase64) {
          const audio = new Audio(data.audioBase64);
          audioPlayerRef.current = audio;
          audio.onplay = () => {
            if (speechAbortRef.current) { audio.pause(); return; }
            setIsSpeaking(true);
          };
          audio.onended = () => {
            setIsSpeaking(false);
            setAvatarState('idle');
            audioPlayerRef.current = null;
            if (liveVoiceActiveRef.current && autoContinue) {
              setTimeout(() => {
                if (!isThinkingRef.current && liveVoiceActiveRef.current) {
                  startListening();
                }
              }, 350);
            }
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            setAvatarState('idle');
          };
          audio.play().catch(() => {
            setIsSpeaking(false);
            setAvatarState('idle');
          });
          return;
        }
      }
    } catch {}

    // Fallback browser speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setAvatarState('idle');
        if (liveVoiceActiveRef.current && autoContinue) {
          setTimeout(() => {
            if (!isThinkingRef.current && liveVoiceActiveRef.current) {
              startListening();
            }
          }, 350);
        }
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setAvatarState('idle');
      };
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    speechAbortRef.current = true;
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
      fetchAbortRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsThinking(false);
  }, []);

  // Process User Voice Query
  const handleUserVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsThinking(true);
    setIsListening(false);

    try {
      const prompt: AIMessage[] = [
        {
          role: 'system',
          content: `Sen "Muqimiy Aql Markazi" zamonaviy kasblar bo'limi yo'lboshchisi Mohirasan.
Foydalanuvchi ismi: ${userName}.
Hozirda tanlangan kasb: ${selectedCareer.title}.
Foydalanuvchining kasb va daromad haqidagi savoliga o'zbek tilida juda samimiy, dono va lo'nda (2-3 jumla) qilib javob ber.`,
        },
        {
          role: 'user',
          content: queryText,
        },
      ];

      const response = await generateAIResponse(prompt, user, 'career');
      setIsThinking(false);
      speakText(response, false, true);
    } catch {
      setIsThinking(false);
      speakText(`Kechirasiz ${userName}, savolingizni yaxshi tushuna olmadim. Iltimos yana bir bor ayting.`, false, true);
    }
  };

  // Start Voice Listening
  const startListening = () => {
    stopSpeaking();
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi.");
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'uz-UZ';
      rec.interimResults = false;
      rec.continuous = false;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserVoiceQuery(transcript);
        }
      };
      rec.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      rec.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Toggle Live Voice Call
  const toggleLiveVoice = () => {
    if (liveVoiceActive) {
      setLiveVoiceActive(false);
      stopListening();
      stopSpeaking();
    } else {
      stopSpeaking();
      setLiveVoiceActive(true);
      startListening();
    }
  };

  // Initial welcome on page mount
  useEffect(() => {
    const welcomeSpeech = `Assalomu alaykum, ${userName}! Zamonaviy kasb o‘rganish bo‘limiga xush kelibsiz! O‘ng tomondan o‘zingizga qiziq kasbni tanlang yoki mikrofondan savol bering, men sizga barcha ma'lumotlarni tushuntirib beraman.`;
    const timer = setTimeout(() => {
      speakText(welcomeSpeech, true, false);
    }, 400);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
      stopListening();
    };
  }, [userName, speakText, stopSpeaking]);

  // Handle select career
  const handleSelectCareer = (career: CareerDirection) => {
    setSelectedCareer(career);
    const speech = getCareerSpeech(career);
    speakText(speech, false, false);
  };

  return (
    <div className="gradient-page relative overflow-y-auto flex flex-col min-h-screen pt-20 pb-8 select-none">
      <KioskHeader title={t.careerModuleTitle} />

      <main className="max-w-[1520px] mx-auto w-full my-auto flex flex-col justify-center px-4 sm:px-8 py-3">
        {/* Title Badge */}
        <div className="text-center mb-3 animate-fade-in-down">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white border border-[#EAE6DF] text-[#0F766E] rounded-full font-black text-xs sm:text-sm mb-1 shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{t.careerSectionBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
            {t.careerHeading}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ════════════════════════════════════════════════════════════
               LEFT COLUMN: EXTRA-LARGE LUXURY AI AVATAR & VOICE TALK
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
            
            {/* Grand Kiosk Avatar Screen */}
            <div className="w-full max-w-[560px] h-[520px] sm:h-[580px] lg:h-[640px] xl:h-[670px] relative">
              <RealisticVideoAvatar
                state={
                  isSpeaking
                    ? (avatarState === 'greeting' ? 'greeting' : 'speaking')
                    : isListening
                    ? 'listening'
                    : isThinking
                    ? 'thinking'
                    : 'idle'
                }
                onGreetingEnd={() => setAvatarState('idle')}
                rounded="rounded-[36px]"
                showAura={true}
                className="w-full h-full"
              />

              {/* Real-time Status Overlay Badge on Avatar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black backdrop-blur-md shadow-lg flex items-center gap-1.5 whitespace-nowrap z-40">
                {isSpeaking ? (
                  <div className="bg-emerald-600/95 text-white px-4 py-1 rounded-full flex items-center gap-2 animate-pulse shadow-md border border-emerald-400/40">
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>Mohira tushuntirmoqda...</span>
                  </div>
                ) : isListening ? (
                  <div className="bg-rose-600/95 text-white px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-md border border-rose-400/40">
                    <Mic className="w-4 h-4 text-white animate-bounce" />
                    <span>Sizni eshitmoqdaman, gapiring...</span>
                  </div>
                ) : isThinking ? (
                  <div className="bg-amber-600/95 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md border border-amber-400/40">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Mohira javob tayyorlamoqda...</span>
                  </div>
                ) : (
                  <div className="bg-white/95 text-[#0F766E] px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#EAE6DF] shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold">Mohira AI • Ovozli muloqot</span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Voice Interaction Controls */}
            <div className="w-full max-w-[560px] flex items-center justify-center gap-3">
              <button
                onClick={toggleLiveVoice}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                  liveVoiceActive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                    : 'bg-gradient-to-r from-[#0F766E] to-[#059669] hover:from-[#0D6B63] hover:to-[#047857] text-white shadow-emerald-200 hover:scale-102'
                }`}
              >
                {liveVoiceActive ? (
                  <>
                    <PhoneOff className="w-4 h-4" />
                    <span>Ovozli muloqotni yakunlash</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>🎙️ Mohira bilan ovozli gaplashish</span>
                  </>
                )}
              </button>

              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                  isListening 
                    ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse' 
                    : 'bg-white border border-[#EAE6DF] text-[#0F766E] hover:bg-[#F5F2EC]'
                }`}
                title="Mikrofon orqali gapirish"
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 animate-bounce" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
               RIGHT COLUMN: CAREER CARDS & LEARNING ACTIONS
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[36px] shadow-sm border border-[#E2E8F0] flex flex-col justify-between space-y-5 animate-fade-in-scale">
            
            {/* Top Selected Career Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl p-2 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0]">
                  {selectedCareer.icon}
                </span>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-[11px] mb-0.5">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Tanlangan kasb</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    {selectedCareer.title}
                  </h2>
                </div>
              </div>

              {selectedCareer.averageSalary && (
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                    O‘rtacha: {selectedCareer.averageSalary}
                  </span>
                </div>
              )}
            </div>

            {/* Career Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[320px] overflow-y-auto pr-1">
              {MOCK_CAREERS.map((career) => {
                const isSelected = selectedCareer.id === career.id;
                return (
                  <div
                    key={career.id}
                    onClick={() => handleSelectCareer(career)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between shadow-2xs active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg scale-[1.01] ring-2 ring-teal-400'
                        : 'bg-[#FAF8F5] text-[#1C1917] border-[#E2E8F0] hover:border-[#0F766E] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl p-1.5 rounded-xl bg-white/10 shrink-0">
                        {career.icon}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-black leading-tight">
                          {career.title}
                        </h3>
                        <p
                          className={`text-[11px] font-semibold mt-0.5 line-clamp-1 ${
                            isSelected ? 'text-[#CBD5E1]' : 'text-[#64748B]'
                          }`}
                        >
                          {career.skills.slice(0, 3).join(' • ')}
                        </p>
                      </div>
                    </div>

                    {career.popular && (
                      <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                        isSelected 
                          ? 'bg-white/15 text-amber-300 border-white/20' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span>TOP</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* MAIN ACTION: START COURSE & AI USTOZ */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F0FDFA] to-[#E6FFFA] rounded-2xl border-2 border-[#99F6E4] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="text-center sm:text-left">
                <div className="font-black text-[#0F766E] text-base sm:text-lg">
                  {selectedCareer.title} bo‘yicha ta'lim olish
                </div>
                <div className="text-[#134E4A] text-xs font-semibold mt-0.5">
                  Ustoz AI ko‘magida shaxsiy o‘rganish yo‘l xaritasini boshlang
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => router.push('/ai')}
                  className="w-full sm:w-auto min-h-[50px] px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 hover:scale-102"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ustoz AI bilan boshlash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
