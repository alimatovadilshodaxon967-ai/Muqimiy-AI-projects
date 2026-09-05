'use client';

import React, { useState } from 'react';
import { RealisticVideoAvatar, VideoAvatarState } from '@/components/avatar/RealisticVideoAvatar';
import { ContractAvatar } from '@/components/avatar/ContractAvatar';
import { MemojiAvatar } from '@/components/avatar/MemojiAvatar';
import { GeometricAvatar } from '@/components/avatar/GeometricAvatar';
import { CoderAvatar } from '@/components/avatar/CoderAvatar';
import { SquirrelAvatar } from '@/components/avatar/SquirrelAvatar';
import { PixelArtAvatar } from '@/components/avatar/PixelArtAvatar';
import { DoodleAvatar } from '@/components/avatar/DoodleAvatar';
import type { AvatarState } from '@/lib/avatar/types';
import type { AvatarCustomization } from '@/components/avatar/DefaultAvatar';
import type { MouthSource } from '@/lib/avatar/mouthEngine';
import { Sparkles, Palette } from 'lucide-react';

export type AvatarVariant = 'realistic' | 'memoji' | 'geometric' | 'coder' | 'squirrel' | 'pixelart' | 'doodle';

export interface AIAvatarProps {
  state: AvatarState | VideoAvatarState;
  analyser?: MouthSource;
  size?: number;
  variant?: AvatarVariant;
  onVariantChange?: (variant: AvatarVariant) => void;
  showVariantSelector?: boolean;
  className?: string;
  customization?: Partial<AvatarCustomization>;
  onGreetingEnd?: () => void;
}

export const AVATAR_VARIANTS: { id: AvatarVariant; label: string; icon: string }[] = [
  { id: 'realistic', label: 'Mohira (Real AI)', icon: '👑' },
  { id: 'memoji', label: 'Mohira (3D Memoji)', icon: '👩‍💼' },
  { id: 'geometric', label: 'Geometrik', icon: '🎨' },
  { id: 'coder', label: 'Dasturchi (Coder)', icon: '👨‍💻' },
  { id: 'squirrel', label: 'Maskot (Squirrel)', icon: '🐿️' },
  { id: 'pixelart', label: 'Piksel Art', icon: '👾' },
  { id: 'doodle', label: 'Dudl Chizma', icon: '✏️' },
];

export function AIAvatar({
  state,
  analyser = null,
  size = 280,
  variant: controlledVariant,
  onVariantChange,
  showVariantSelector = true,
  className = '',
  customization,
  onGreetingEnd,
}: AIAvatarProps) {
  const [internalVariant, setInternalVariant] = useState<AvatarVariant>('realistic');
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  const activeVariant = controlledVariant ?? internalVariant;

  const handleSelectVariant = (newVar: AvatarVariant) => {
    if (onVariantChange) {
      onVariantChange(newVar);
    } else {
      setInternalVariant(newVar);
    }
    setShowSelectorModal(false);
  };

  const defaultCustomization: Partial<AvatarCustomization> = {
    skinColor: '#f6c8a8',
    hairColor: '#2d1a12',
    clothingColor: '#0f766e',
    hoodieColor: '#115e59',
    bgColor: '#ccfbf1',
    glasses: false,
    glassesColor: '#1e293b',
    headphones: true,
    headphonesColor: '#0f766e',
    ...customization,
  };

  // Realistic Video Avatar takes priority
  if (activeVariant === 'realistic') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <RealisticVideoAvatar
          state={state as VideoAvatarState}
          size={size}
          onGreetingEnd={onGreetingEnd}
          showAura={true}
        />

        {showVariantSelector && (
          <div className="mt-3 flex items-center gap-1.5 z-20">
            <button
              type="button"
              onClick={() => setShowSelectorModal(!showSelectorModal)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-[#EAE6DF] hover:border-teal-400 text-stone-700 hover:text-teal-700 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Avatar uslubini o'zgartirish"
            >
              <Palette className="w-3.5 h-3.5 text-teal-600" />
              <span>
                {AVATAR_VARIANTS.find((v) => v.id === activeVariant)?.icon}{' '}
                {AVATAR_VARIANTS.find((v) => v.id === activeVariant)?.label}
              </span>
            </button>

            {showSelectorModal && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-2xl p-2 z-50 flex flex-col gap-1 w-56 animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-black text-stone-400 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
                  <span>Avatar uslublari</span>
                  <Sparkles className="w-3 h-3 text-teal-500" />
                </div>
                {AVATAR_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVariant(v.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                      activeVariant === v.id
                        ? 'bg-teal-50 text-teal-800 font-extrabold border border-teal-200'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-base">{v.icon}</span>
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const renderPreset = () => {
    switch (activeVariant) {
      case 'memoji':
        return <MemojiAvatar size={size} customization={defaultCustomization} state={state as AvatarState} />;
      case 'geometric':
        return <GeometricAvatar size={size} customization={defaultCustomization} state={state as AvatarState} />;
      case 'coder':
        return <CoderAvatar size={size} customization={defaultCustomization} state={state as AvatarState} poses />;
      case 'squirrel':
        return <SquirrelAvatar size={size} customization={defaultCustomization} state={state as AvatarState} poses />;
      case 'pixelart':
        return <PixelArtAvatar size={size} customization={defaultCustomization} state={state as AvatarState} />;
      case 'doodle':
        return <DoodleAvatar size={size} customization={defaultCustomization} state={state as AvatarState} />;
      default:
        return <MemojiAvatar size={size} customization={defaultCustomization} state={state as AvatarState} />;
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Animated Glowing Aura */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-500 ${
          state === 'speaking'
            ? 'w-[110%] h-[110%] bg-emerald-400/25 animate-pulse blur-xl scale-110'
            : state === 'listening'
            ? 'w-[115%] h-[115%] bg-rose-500/30 animate-pulse blur-xl scale-110'
            : state === 'thinking'
            ? 'w-[110%] h-[110%] bg-purple-500/25 animate-pulse blur-xl scale-105'
            : 'w-[100%] h-[100%] bg-teal-400/15 blur-lg'
        }`}
      />

      {/* Main Avatar Container */}
      <div
        className={`relative rounded-full overflow-hidden border-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300 bg-gradient-to-b from-[#F0FDF4] to-[#E6F4F1] ${
          state === 'speaking'
            ? 'border-emerald-400 ring-4 ring-emerald-200'
            : state === 'listening'
            ? 'border-rose-500 ring-4 ring-rose-300 scale-102'
            : state === 'thinking'
            ? 'border-purple-400 ring-4 ring-purple-200'
            : 'border-white'
        }`}
        style={{ width: size, height: size }}
      >
        <ContractAvatar
          key={activeVariant}
          state={state as AvatarState}
          analyser={analyser}
          size={size}
          stateColors={{
            idle: '#0f766e',
            listening: '#e11d48',
            thinking: '#9333ea',
            speaking: '#10b981',
            working: '#f59e0b',
          }}
        >
          {renderPreset()}
        </ContractAvatar>
      </div>

      {/* Style Switcher Floating Button */}
      {showVariantSelector && (
        <div className="mt-2.5 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={() => setShowSelectorModal(!showSelectorModal)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-[#EAE6DF] hover:border-teal-400 text-stone-700 hover:text-teal-700 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Avatar uslubini o'zgartirish"
          >
            <Palette className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {AVATAR_VARIANTS.find((v) => v.id === activeVariant)?.icon}{' '}
              {AVATAR_VARIANTS.find((v) => v.id === activeVariant)?.label.split(' ')[0]}
            </span>
          </button>

          {/* Popup Dropdown / Selector */}
          {showSelectorModal && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-2xl p-2 z-50 flex flex-col gap-1 w-56 animate-fade-in">
              <div className="px-3 py-1.5 text-[11px] font-black text-stone-400 uppercase tracking-wider border-b border-stone-100 flex items-center justify-between">
                <span>Avatar uslublari</span>
                <Sparkles className="w-3 h-3 text-teal-500" />
              </div>
              {AVATAR_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectVariant(v.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                    activeVariant === v.id
                      ? 'bg-teal-50 text-teal-800 font-extrabold border border-teal-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}