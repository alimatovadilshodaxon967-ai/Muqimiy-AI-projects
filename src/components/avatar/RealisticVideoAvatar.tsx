'use client';

import React, { useRef, useEffect, useState } from 'react';

export type VideoAvatarState = 'idle' | 'listening' | 'speaking' | 'thinking' | 'greeting';

export interface RealisticVideoAvatarProps {
  state: VideoAvatarState;
  size?: number;
  width?: number | string;
  height?: number | string;
  rounded?: string;
  className?: string;
  onGreetingEnd?: () => void;
  showAura?: boolean;
}

export function RealisticVideoAvatar({
  state,
  size,
  width,
  height,
  rounded = 'rounded-3xl',
  className = '',
  onGreetingEnd,
  showAura = true,
}: RealisticVideoAvatarProps) {
  const greetingVideoRef = useRef<HTMLVideoElement>(null);
  const idleVideoRef = useRef<HTMLVideoElement>(null);
  const talkingVideoRef = useRef<HTMLVideoElement>(null);

  const [activeVideo, setActiveVideo] = useState<'greeting' | 'idle' | 'talking'>('idle');

  // Switch video based on avatar state
  useEffect(() => {
    if (state === 'greeting') {
      setActiveVideo('greeting');
      if (greetingVideoRef.current) {
        greetingVideoRef.current.currentTime = 0;
        greetingVideoRef.current.play().catch(() => {});
      }
    } else if (state === 'speaking') {
      setActiveVideo('talking');
      if (talkingVideoRef.current) {
        talkingVideoRef.current.play().catch(() => {});
      }
      if (idleVideoRef.current) {
        idleVideoRef.current.pause();
      }
    } else {
      // idle, listening, or thinking
      setActiveVideo('idle');
      if (idleVideoRef.current) {
        idleVideoRef.current.play().catch(() => {});
      }
      if (talkingVideoRef.current) {
        talkingVideoRef.current.pause();
      }
    }
  }, [state]);

  // Handle greeting video finish
  const handleGreetingEnded = () => {
    if (onGreetingEnd) {
      onGreetingEnd();
    } else {
      setActiveVideo('idle');
    }
  };

  const containerStyle: React.CSSProperties = {
    width: width || size || '100%',
    height: height || size || '100%',
  };

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={containerStyle}
    >
      {/* Dynamic Glowing Auras for Card/Frame */}
      {showAura && (
        <>
          {state === 'speaking' && (
            <div className={`absolute -inset-1.5 ${rounded} bg-gradient-to-r from-emerald-500/40 via-teal-400/30 to-emerald-500/40 animate-pulse blur-xl pointer-events-none`} />
          )}

          {state === 'listening' && (
            <div className={`absolute -inset-1.5 ${rounded} bg-gradient-to-r from-rose-500/50 via-pink-400/40 to-rose-500/50 animate-pulse blur-xl pointer-events-none`} />
          )}

          {state === 'thinking' && (
            <div className={`absolute -inset-1.5 ${rounded} bg-purple-500/40 animate-pulse blur-xl pointer-events-none`} />
          )}

          {state === 'greeting' && (
            <div className={`absolute -inset-1.5 ${rounded} bg-gradient-to-r from-amber-400/40 via-teal-400/30 to-amber-400/40 animate-pulse blur-xl pointer-events-none`} />
          )}
        </>
      )}

      {/* Main Luxury Kiosk Video Screen Container */}
      <div 
        className={`w-full h-full ${rounded} overflow-hidden border-[3px] relative shadow-[0_25px_60px_rgba(0,0,0,0.18)] bg-[#0B1120] transition-all duration-500 ${
          state === 'speaking'
            ? 'border-emerald-400 ring-4 ring-emerald-200/60 shadow-emerald-500/25'
            : state === 'listening'
            ? 'border-rose-500 ring-4 ring-rose-300/60 shadow-rose-500/25 scale-[1.01]'
            : state === 'thinking'
            ? 'border-purple-400 ring-4 ring-purple-200/60'
            : state === 'greeting'
            ? 'border-amber-400 ring-4 ring-amber-200/60'
            : 'border-white/80 ring-1 ring-black/5 hover:border-emerald-300/80'
        }`}
      >
        {/* 1. Greeting Video (Hand on chest Uzbek greeting) */}
        <video
          ref={greetingVideoRef}
          src="/avatar/greeting.mp4"
          playsInline
          muted
          autoPlay={state === 'greeting'}
          onEnded={handleGreetingEnded}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
            activeVideo === 'greeting' ? 'opacity-100 z-30' : 'opacity-0 z-0 pointer-events-none'
          }`}
        />

        {/* 2. Idle / Listening Video (Smiling, gentle blinking & breathing) */}
        <video
          ref={idleVideoRef}
          src="/avatar/idle.mp4"
          playsInline
          muted
          loop
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
            activeVideo === 'idle' ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
          }`}
        />

        {/* 3. Talking Video (Speaking with natural lip & head articulation) */}
        <video
          ref={talkingVideoRef}
          src="/avatar/talking.mp4"
          playsInline
          muted
          loop
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
            activeVideo === 'talking' ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
          }`}
        />

        {/* Fallback Static Image if video loading */}
        <img
          src="/images/ai_assistant.jpg"
          alt="Mohira AI Avatar"
          className="absolute inset-0 w-full h-full object-cover object-center -z-10"
        />

        {/* Cinematic Subtle Bottom Gradient Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-30" />
      </div>
    </div>
  );
}
