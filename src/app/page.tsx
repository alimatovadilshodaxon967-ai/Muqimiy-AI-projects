'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { getTranslation } from '@/lib/translations';
import { 
  Sparkles, ArrowRight, Globe, Briefcase, Compass, 
  HeartHandshake, Bot, Zap, Users
} from 'lucide-react';

/* ─── Animated counter for statistics ─── */
function AnimatedNumber({ target, suffix = '', mounted }: { target: number; suffix?: string; mounted: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    let animId: number;
    const delay = 1500;
    const duration = target > 100 ? 2200 : 800;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }, delay);

    return () => { clearTimeout(timeout); if (animId) cancelAnimationFrame(animId); };
  }, [mounted, target]);

  return <>{value.toLocaleString()}{suffix}</>;
}

export default function StartScreen() {
  const router = useRouter();
  const { language, setLanguage } = useKiosk();
  const t = getTranslation(language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleStart = () => {
    router.push('/welcome');
  };

  const directions = [
    { id: 'lang', title: t.dir1_title, desc: t.dir1_desc, badge: t.dir1_badge, icon: Globe, color: '#0EA5E9' },
    { id: 'career', title: t.dir2_title, desc: t.dir2_desc, badge: t.dir2_badge, icon: Briefcase, color: '#10B981' },
    { id: 'migration', title: t.dir3_title, desc: t.dir3_desc, badge: t.dir3_badge, icon: Compass, color: '#F59E0B' },
    { id: 'psychology', title: t.dir4_title, desc: t.dir4_badge, icon: HeartHandshake, color: '#F43F5E', descFull: t.dir4_desc },
    { id: 'ai', title: t.dir5_title, desc: t.dir5_desc, badge: t.dir5_badge, icon: Bot, color: '#14B8A6' },
  ];

  const stats = [
    { value: 5000, suffix: '+', label: 'Foydalanuvchi', icon: Users },
    { value: 5, suffix: '', label: "Yo'nalish", icon: Compass },
    { value: 3, suffix: '', label: 'Tilda Xizmat', icon: Globe },
    { value: 24, suffix: '/7', label: 'AI Yordamchi', icon: Bot },
  ];

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-[#080C18] select-none">

      {/* ════════════════════════════════════════════════════════════
           FULL-SCREEN CINEMATIC BACKGROUND — YOUTH INNOVATION LAB
         ════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {/* Future Skills & Youth Innovation Lab Background */}
        <div
          className="absolute inset-0 bg-cover bg-center presidential-slow-zoom"
          style={{ backgroundImage: "url('/images/future_skills_lab.jpg')" }}
        />
        {/* Primary cinematic gradient — lab and kiosk visible through center */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, 
            rgba(8,12,24,0.75) 0%, 
            rgba(8,12,24,0.38) 20%, 
            rgba(8,12,24,0.22) 36%,
            rgba(8,12,24,0.48) 56%,
            rgba(8,12,24,0.84) 76%,
            rgba(8,12,24,0.97) 100%
          )`
        }} />
        {/* Subtle center illumination */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.06) 0%, transparent 60%)'
        }} />
        {/* Cinematic vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(8,12,24,0.55) 100%)'
        }} />
      </div>

      {/* ════════════════════════════════════════════════════════════
           GLASSMORPHISM NAVBAR
         ════════════════════════════════════════════════════════════ */}
      <header className={`relative z-30 mx-5 sm:mx-8 mt-4 shrink-0 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
        <nav
          className="px-5 sm:px-6 py-3.5 rounded-2xl flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Left — Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-[13px] font-black tracking-tight text-white/90 leading-tight">{t.startBrand}</h2>
              <p className="text-[9px] text-white/40 font-semibold mt-0.5 tracking-wide">{t.startSubBrand}</p>
            </div>
          </div>

          {/* Right — Controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex p-[3px] rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['UZ', 'RU', 'EN'] as const).map((lang) => (
                <button
                  key={lang} type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1.5 text-[11px] font-black rounded-lg transition-all duration-300 cursor-pointer ${
                    language === lang
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >{lang}</button>
              ))}
            </div>
            {/* Kiosk Status */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="text-[10px] font-black text-amber-300 tracking-wider">{t.startKioskBadge}</span>
            </div>
          </div>
        </nav>
      </header>

      {/* ════════════════════════════════════════════════════════════
           HERO SECTION — TITLE, MOTTO, CTA
         ════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 -mt-6">

        {/* Project Badge */}
        <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/90">
              {t.startProjectTitle}
            </span>
          </div>
        </div>

        {/* Main Title — Pure White + Imperial Amber Gold */}
        <div className={`text-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            <span className="text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">{t.startMainTitle1}</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #FDBA74 0%, #F97316 50%, #EA580C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.startMainTitle2}
            </span>
          </h1>
        </div>

        {/* Motto */}
        <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p
            className="text-slate-100 max-w-xl mx-auto text-center mt-5 mb-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', fontWeight: 600, lineHeight: 1.7 }}
          >
            {t.startMotto}
          </p>
        </div>

        {/* CTA Button — Imperial Gold Breathing Glow */}
        <div className={`transition-all duration-1000 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="relative">
            {/* Breathing glow behind button */}
            <div
              className="absolute -inset-3 rounded-[24px] pointer-events-none presidential-breathe"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', filter: 'blur(22px)' }}
            />
            <button
              onClick={handleStart}
              className="relative group cursor-pointer active:scale-[0.97] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3.5 shadow-2xl"
              style={{
                minHeight: '68px',
                minWidth: '320px',
                padding: '18px 48px',
                fontSize: '17px',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFF',
                background: 'linear-gradient(135deg, #B45309 0%, #D97706 35%, #F59E0B 75%, #FBBF24 100%)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(217,119,6,0.4), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white/90 group-hover:rotate-12 transition-transform duration-300" />
              <span className="drop-shadow-md">{t.startButton}</span>
              <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>


      </main>

      {/* ════════════════════════════════════════════════════════════
           BOTTOM SECTION — STATS, CARDS, FOOTER
         ════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 px-5 sm:px-8 pb-4 shrink-0">

        {/* Gold Separator */}
        <div className={`max-w-[500px] mx-auto mb-4 transition-all duration-1000 delay-[1200ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }} />
        </div>

        {/* ─── Statistics Bar ─── */}
        <div className={`max-w-[1100px] mx-auto mb-4 transition-all duration-1000 delay-[1300ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div
            className="flex items-center justify-center gap-6 sm:gap-10 px-6 py-3 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2.5">
                    <StatIcon className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.45)' }} />
                    <div>
                      <div className="text-white/90 font-black text-base sm:text-lg tracking-tight leading-none">
                        <AnimatedNumber target={stat.value} suffix={stat.suffix} mounted={mounted} />
                      </div>
                      <div className="text-white/25 text-[8px] sm:text-[9px] font-bold tracking-wider uppercase mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ─── 5 Service Direction Cards ─── */}
        <div className={`max-w-[1100px] mx-auto mb-3 transition-all duration-1000 delay-[1500ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {directions.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={handleStart}
                  className="presidential-glass-card group relative rounded-2xl p-4 flex flex-col justify-between min-h-[155px] cursor-pointer active:scale-[0.97] transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-3.5 right-3.5 h-[2px] rounded-b-full opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: item.color }}
                  />

                  <div className="flex items-start justify-between gap-1.5 mb-2">
                    <div
                      className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-black shrink-0"
                      style={{ background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}18` }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <div className="font-black text-white/85 text-[13px] sm:text-sm tracking-tight mb-0.5 group-hover:text-white transition-colors leading-snug">
                      {item.title}
                    </div>
                    <p className="text-[10px] text-white/30 leading-snug font-semibold line-clamp-2 group-hover:text-white/50 transition-colors">
                      {item.desc || (item as any).descFull}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className={`max-w-[1100px] mx-auto transition-all duration-1000 delay-[1700ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center py-1.5">
            <span className="text-[9px] font-semibold tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.12)' }}>
              🇺🇿 O'zbekiston Respublikasi  •  Qo'qon Shahri  •  Kokand University  •  "Raqamli O'zbekiston — 2030"
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
