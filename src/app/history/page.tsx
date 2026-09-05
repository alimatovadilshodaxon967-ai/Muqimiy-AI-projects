'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { getTranslation } from '@/lib/translations';
import { HISTORICAL_FIGURES } from '@/lib/historicalData';
import { HistoricalFigure, HistoricalTopic } from '@/types';
import { 
  Landmark, Volume2, VolumeX, Mic, MicOff, RotateCcw, 
  Sparkles, BookOpen, Quote, Shield, Award, Compass,
  ChevronRight, ArrowRight, Play, Square, Loader2, MessageSquare
} from 'lucide-react';

export default function HistoryModuleScreen() {
  const router = useRouter();
  const { user, language } = useKiosk();
  const t = getTranslation(language);

  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure>(HISTORICAL_FIGURES[0]);
  const [activeTopic, setActiveTopic] = useState<HistoricalTopic | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState<string>('');
  const [lastUserQuestion, setLastUserQuestion] = useState<string>('');

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const speechAbortRef = useRef<boolean>(false);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const userName = user?.name ? user.name.replace(/[0-9]/g, '').trim() : 'Farhodjon';
  const userAge = user?.age || 23;

  // Stop currently playing audio or browser synthesis
  const stopSpeaking = useCallback(() => {
    speechAbortRef.current = true;
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
      fetchAbortRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.onended = null;
      audioPlayerRef.current.onplay = null;
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsThinking(false);
  }, []);

  // Fallback browser synthesis using Uzbek or Turkish voice
  const fallbackBrowserSpeech = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('sardor') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('pavel'))
      || voices.find(v => v.lang.startsWith('uz'))
      || voices.find(v => v.lang.startsWith('tr'))
      || voices[0];

    if (maleVoice) utterance.voice = maleVoice;
    utterance.rate = 0.88;
    utterance.pitch = 0.75; // Deep male timbre
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Speak text using Python Voice Server (Neural Sardor male voice)
  const playHistoricalSpeech = useCallback(async (text: string, figure: HistoricalFigure) => {
    stopSpeaking();
    speechAbortRef.current = false;
    setCurrentSpeechText(text);
    setIsThinking(true);

    const cleanText = text
      .replace(/[\u{1F600}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{FE00}-\u{FE0F}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]/gu, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*/g, '')
      .trim();

    if (!cleanText) {
      setIsThinking(false);
      return;
    }

    try {
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      // Rate and pitch customizations per historical figure
      let rate = "+0%";
      let pitch = "+0Hz";
      if (figure.id === 'amir-temur') {
        rate = "-4%";
        pitch = "-3Hz";
      } else if (figure.id === 'alisher-navoiy') {
        rate = "-2%";
        pitch = "+0Hz";
      } else if (figure.id === 'mahmudxoja-behbudiy' || figure.id === 'abdulla-avloniy') {
        rate = "+1%";
        pitch = "+1Hz";
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          figureId: figure.id,
          voice: 'uz-UZ-SardorNeural',
          rate,
          pitch,
        }),
        signal: controller.signal,
      });

      setIsThinking(false);

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
            audioPlayerRef.current = null;
          };
          audio.onerror = () => {
            if (speechAbortRef.current) return;
            fallbackBrowserSpeech(cleanText);
          };
          audio.play().catch(() => {
            if (speechAbortRef.current) return;
            fallbackBrowserSpeech(cleanText);
          });
          return;
        }
      }
      fallbackBrowserSpeech(cleanText);
    } catch (e: any) {
      setIsThinking(false);
      if (e?.name === 'AbortError') return;
      fallbackBrowserSpeech(cleanText);
    }
  }, [stopSpeaking, fallbackBrowserSpeech]);

  // Handle selecting a figure
  const handleSelectFigure = (figure: HistoricalFigure) => {
    stopSpeaking();
    setSelectedFigure(figure);
    setActiveTopic(null);
    setLastUserQuestion('');
    // Trigger initial greeting of the figure
    setTimeout(() => {
      playHistoricalSpeech(figure.greetingSpeech, figure);
    }, 200);
  };

  // Handle clicking a topic button
  const handleSelectTopic = (topic: HistoricalTopic) => {
    setActiveTopic(topic);
    setLastUserQuestion(topic.question);
    playHistoricalSpeech(topic.speechText, selectedFigure);
  };

  // Speech-to-Text: Free questioning to the historical figure
  const startListeningQuestion = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi. Iltimos Google Chrome brauzeridan foydalaning.");
      return;
    }

    try {
      stopSpeaking();

      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'uz-UZ';
      recognition.interimResults = true;
      recognition.continuous = false;

      let recognizedText = '';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        recognizedText = transcript;
        setLastUserQuestion(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        const query = recognizedText.trim();
        if (query) {
          askHistoricalAI(query);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Process free-form voice question to the Historical Figure AI
  const askHistoricalAI = async (questionText: string) => {
    if (!questionText || isThinking) return;

    setIsThinking(true);
    setLastUserQuestion(questionText);

    try {
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      const res = await fetch('/api/historical-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          figureId: selectedFigure.id,
          message: questionText,
          userName,
          userAge,
        }),
        signal: controller.signal,
      });

      setIsThinking(false);

      if (speechAbortRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (speechAbortRef.current) return;

        const reply = data.reply || '';
        setCurrentSpeechText(reply);

        if (data.audioBase64) {
          const audio = new Audio(data.audioBase64);
          audioPlayerRef.current = audio;
          audio.onplay = () => {
            if (speechAbortRef.current) { audio.pause(); return; }
            setIsSpeaking(true);
          };
          audio.onended = () => {
            setIsSpeaking(false);
            audioPlayerRef.current = null;
          };
          audio.onerror = () => fallbackBrowserSpeech(reply);
          audio.play().catch(() => fallbackBrowserSpeech(reply));
          return;
        } else {
          fallbackBrowserSpeech(reply);
        }
        return;
      }
      throw new Error('Fallback required');
    } catch (e: any) {
      setIsThinking(false);
      if (e?.name === 'AbortError') return;

      // Fallback matching response
      const fallbackReply = `Assalomu alaykum ${userName}! Men ${selectedFigure.name}man. Bergan savolingiz juda o'rinli: ilm, adolat va tarbiya yo'lida sobitqadam bo'lsangiz, barcha maqsadlaringizga erishasiz!`;
      setCurrentSpeechText(fallbackReply);
      fallbackBrowserSpeech(fallbackReply);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [stopSpeaking]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col pt-16 select-none overflow-y-auto font-sans pb-10">
      {/* Header */}
      <KioskHeader 
        title={t.historyModuleTitle || "TARIXIY SHAXSLAR"} 
        subtitle="BUYUK SIYMOLAR VA JADIDLAR" 
      />

      <main className="flex-1 max-w-[1580px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-4 lg:py-6 flex flex-col justify-between">
        
        {/* ════════════════════════════════════════════════════════════
             TOP CAROUSEL: HISTORICAL FIGURES SELECTOR STRIP
           ════════════════════════════════════════════════════════════ */}
        <div className="mb-6 animate-fade-in-down">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-700" />
              <span className="text-xs sm:text-sm font-black text-[#78716C] uppercase tracking-wider">
                {t.selectFigure || "Tarixiy shaxsni tanlang:"}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#A8A29E]">
              {HISTORICAL_FIGURES.length} ta buyuk siymo
            </span>
          </div>

          {/* Horizontal scrollable / touch friendly buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {HISTORICAL_FIGURES.map((fig) => {
              const isSelected = selectedFigure.id === fig.id;
              return (
                <button
                  key={fig.id}
                  onClick={() => handleSelectFigure(fig)}
                  className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-xs active:scale-95 ${
                    isSelected
                      ? 'bg-white border-2 shadow-md scale-102 ring-4 ring-amber-500/15'
                      : 'bg-white/80 border-[#EAE6DF] hover:bg-white hover:border-[#D6D1C7]'
                  }`}
                  style={{
                    borderColor: isSelected ? fig.color : undefined,
                  }}
                >
                  {/* Portrait Thumbnail */}
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border-2 shadow-xs relative"
                    style={{ borderColor: isSelected ? fig.color : '#EAE6DF' }}
                  >
                    <img 
                      src={fig.portrait} 
                      alt={fig.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && isSpeaking && (
                      <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-xs flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-white animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#1C1917] truncate">
                      {fig.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-[#78716C] truncate mt-0.5">
                      {fig.period}
                    </p>
                    <span 
                      className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1"
                      style={{
                        backgroundColor: fig.accentBg,
                        color: fig.color,
                      }}
                    >
                      {fig.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
             MAIN CONTENT: 2-COLUMN DISPLAY
           ════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch flex-1">

          {/* ════════════════════════════════════════════════════════════
               LEFT: REGAL PORTRAIT / AVATAR & VOICE ACTION CONTROLS
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-white rounded-[36px] border border-[#EAE6DF] shadow-sm p-6 sm:p-8 relative overflow-hidden">
            
            {/* Background Decorative Gradient Aura */}
            <div 
              className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
              style={{ backgroundColor: selectedFigure.color }}
            />
            
            {/* Top Persona Badges */}
            <div className="w-full flex items-center justify-between mb-4 z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-[#1C1917] text-xs font-black uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedFigure.title.split(',')[0]}</span>
              </div>
              <span className="text-xs font-black text-[#78716C] tracking-wide">
                {selectedFigure.period}
              </span>
            </div>

            {/* Large Regal Portrait Frame with Live Pulse / Sound Waves */}
            <div className="relative w-full max-w-[360px] aspect-square rounded-[32px] overflow-hidden shadow-xl border-4 my-2 group transition-all duration-500"
              style={{ borderColor: selectedFigure.color }}
            >
              <img 
                src={selectedFigure.portrait} 
                alt={selectedFigure.fullName}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isSpeaking ? 'scale-105 filter saturate-110' : 'scale-100'
                }`}
              />

              {/* Glowing Aura Effect while Speaking */}
              {isSpeaking && (
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent animate-pulse pointer-events-none"
                />
              )}

              {/* Status Badge floating at bottom of avatar portrait */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black backdrop-blur-md shadow-lg flex items-center gap-2 whitespace-nowrap z-20">
                {isSpeaking ? (
                  <div className="bg-emerald-600/95 text-white px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-md border border-emerald-400/40">
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>{selectedFigure.name} {t.figureSpeaking || 'gapirmoqda...'}</span>
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                ) : isListening ? (
                  <div className="bg-rose-600/95 text-white px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-md border border-rose-400/40">
                    <Mic className="w-4 h-4 text-white animate-bounce" />
                    <span>{t.figureListening || 'Sizni eshitmoqda, gapiring...'}</span>
                  </div>
                ) : isThinking ? (
                  <div className="bg-amber-600/95 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md border border-amber-400/40">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t.figureThinking || 'Fikr yuritmoqda...'}</span>
                  </div>
                ) : (
                  <div className="bg-white/95 text-[#1C1917] px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#EAE6DF] shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold">{selectedFigure.name} • {t.figureIdle || 'Suhbatga shay'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Noble Name & Motto */}
            <div className="text-center my-3 z-10 max-w-sm">
              <h3 className="text-xl sm:text-2xl font-black text-[#1C1917] tracking-tight">
                {selectedFigure.fullName}
              </h3>
              <p className="text-xs sm:text-sm font-bold italic text-amber-800 bg-amber-50/80 border border-amber-200/60 rounded-xl px-3.5 py-1.5 mt-2">
                {selectedFigure.motto}
              </p>
            </div>

            {/* Interactive Voice Controls Bar */}
            <div className="w-full flex items-center gap-2.5 mt-2 z-10">
              {/* Push-to-Talk Mic to Ask Any Custom Question */}
              <button
                onClick={isListening ? () => setIsListening(false) : startListeningQuestion}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                    : 'bg-[#1C1917] hover:bg-[#292524] text-white shadow-md'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Eshitishni to&apos;xtatish</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>🎙️ Ovoz orqali savol berish</span>
                  </>
                )}
              </button>

              {/* Stop Speaking button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="Ovozni to'xtatish"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">To&apos;xtatish</span>
                </button>
              )}

              {/* Replay Current Speech button */}
              {currentSpeechText && !isSpeaking && (
                <button
                  onClick={() => playHistoricalSpeech(currentSpeechText, selectedFigure)}
                  className="p-3 bg-[#FAF8F5] hover:bg-[#F5F2EC] border border-[#EAE6DF] text-[#1C1917] rounded-2xl font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title="Qayta eshitish"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
               RIGHT: TOUCH PROMPT BUTTONS (Tugmalar ro'yxati)
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-white rounded-[36px] border border-[#EAE6DF] shadow-sm p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F5F2EC]">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-6 h-6 text-amber-600" />
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#1C1917] tracking-tight uppercase">
                        {t.instantTopicsTitle || "Mavzuni tanlang (Avatar gapirishni boshlaydi):"}
                      </h3>
                      <p className="text-xs text-[#78716C] font-semibold mt-0.5">
                        Tugmani bosing — {selectedFigure.name} bevosita ovozli hikoya qilib beradi
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
                    {selectedFigure.topics.length} ta mavzu
                  </span>
                </div>

                {/* Grid of Large Touch Prompt Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedFigure.topics.map((topic) => {
                    const isCurrentActive = activeTopic?.id === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`p-5 sm:p-6 rounded-[24px] border text-left transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] flex items-start gap-4 group ${
                          isCurrentActive
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-600 shadow-lg scale-102 ring-4 ring-orange-400/20'
                            : 'bg-[#FAF8F5] hover:bg-white text-[#1C1917] border-[#EAE6DF] hover:border-amber-400 hover:shadow-md'
                        }`}
                      >
                        {/* Topic Icon */}
                        <div 
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${
                            isCurrentActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-white border border-[#EAE6DF] shadow-2xs'
                          }`}
                        >
                          {topic.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm sm:text-base font-black tracking-tight ${
                              isCurrentActive ? 'text-white' : 'text-[#1C1917]'
                            }`}>
                              {topic.title}
                            </h4>
                            <ChevronRight className={`w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1 ${
                              isCurrentActive ? 'text-white' : 'text-amber-600'
                            }`} />
                          </div>
                          <p className={`text-xs font-semibold leading-relaxed line-clamp-2 ${
                            isCurrentActive ? 'text-amber-100' : 'text-[#78716C]'
                          }`}>
                            {topic.question}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Info & Navigation */}
              <div className="mt-6 pt-5 border-t border-[#F5F2EC] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#78716C] font-semibold text-center sm:text-left">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Istalgan tugmani bosing yoki mikrofondan savol bering.</span>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#FAF8F5] hover:bg-[#F5F2EC] border border-[#EAE6DF] text-[#1C1917] rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  <span>Boshqa yo&apos;nalishlar</span>
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
}
