'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { RealisticVideoAvatar } from '@/components/avatar/RealisticVideoAvatar';
import { getTranslation } from '@/lib/translations';
import { ArrowRight, Volume2, RotateCcw } from 'lucide-react';

export default function PersonalizedGreetingScreen() {
  const router = useRouter();
  const { user, language } = useKiosk();
  const t = getTranslation(language);

  const [avatarState, setAvatarState] = useState<'greeting' | 'speaking' | 'idle'>('greeting');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const userName = user?.name ? user.name.replace(/[0-9]/g, '').trim() : 'Farhodjon';

  const greetingSpeech = `Assalomu alaykum, ${userName}! Muqimiy Aql Markaziga xush kelibsiz! Men sizning virtual yordamchingiz Mohiraman. Keling, sizga kerakli yo'nalishni birgalikda tanlaymiz!`;

  const fallbackBrowserSpeech = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(greetingSpeech);
    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find(v => v.lang.startsWith('uz'))
      || voices.find(v => v.lang.startsWith('tr'))
      || voices.find(v => v.lang.startsWith('ru'))
      || voices[0];
    if (uzVoice) utterance.voice = uzVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setAvatarState('greeting');
      setIsPlaying(true);
    };
    utterance.onend = () => {
      setAvatarState('idle');
      setIsPlaying(false);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    };
    utterance.onerror = () => {
      setAvatarState('idle');
      setIsPlaying(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [greetingSpeech, router]);

  const playGreetingAudio = useCallback(async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel();
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: greetingSpeech,
          figureId: 'mohira',
          voice: 'uz-UZ-MadinaNeural',
          rate: '+2%',
          pitch: '+1Hz',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(data.audioBase64);
          audioRef.current = audio;
          audio.onplay = () => {
            setAvatarState('greeting');
            setIsPlaying(true);
          };
          audio.onended = () => {
            setAvatarState('idle');
            setIsPlaying(false);
            setTimeout(() => {
              router.push('/dashboard');
            }, 1200);
          };
          audio.onerror = () => {
            fallbackBrowserSpeech();
          };
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Autoplay blocked by browser:', err);
              fallbackBrowserSpeech();
            });
          }
          return;
        }
      }
      fallbackBrowserSpeech();
    } catch {
      fallbackBrowserSpeech();
    }
  }, [greetingSpeech, fallbackBrowserSpeech, router]);

  useEffect(() => {
    if (!user) {
      router.push('/welcome');
      return;
    }

    const timer = setTimeout(() => {
      playGreetingAudio();
    }, 400);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [user, router, playGreetingAudio]);

  if (!user) return null;

  return (
    <div className="gradient-page relative overflow-hidden flex flex-col min-h-screen pt-20 select-none bg-[#FAF8F5]">
      <KioskHeader title={t.greetingTitle || "MUQIMIY AQL MARKAZI"} subtitle="XUSH KELIBSIZ" />

      <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full my-auto text-center px-4 py-6 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#EAE6DF] w-full flex flex-col items-center animate-fade-in-scale">
          
          {/* Realistic Video Avatar in Greeting State (Hand on chest) */}
          <div className="relative mb-6">
            <RealisticVideoAvatar
              state={avatarState}
              size={240}
              onGreetingEnd={() => setAvatarState('idle')}
              showAura={true}
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs font-black px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
              <span>{isPlaying ? 'Mohira AI • Salomlashmoqda' : 'Mohira AI • Ovozli yordamchi'}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] mb-2 leading-snug tracking-tight">
            Assalomu alaykum, <span className="text-[#0F766E]">{userName}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-[#78716C] font-medium mb-5 max-w-md mx-auto leading-relaxed">
            Muqimiy Aql Markaziga xush kelibsiz! Siz uchun zamonaviy kasblar, xorijiy tillar, migratsiya va sun&apos;iy intellekt yo&apos;nalishlari tayyorlandi.
          </p>

          {/* Manual Replay / Listen button (in case browser blocked autoplay) */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={playGreetingAudio}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ovozni qayta eshitish</span>
            </button>
          </div>

          {/* Action Button */}
          <div className="w-full max-w-sm">
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
                router.push('/dashboard');
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#0F766E] to-[#059669] hover:from-[#0D6B63] hover:to-[#047857] active:scale-[0.98] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Asosiy Dashboardga o&apos;tish</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
