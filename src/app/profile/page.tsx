'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { User, Camera, Phone, MapPin, Heart, Save, CheckCircle2, ArrowLeft } from 'lucide-react';

const INTEREST_OPTIONS = [
  { icon: '💻', label: 'Dasturlash' },
  { icon: '🎨', label: 'Dizayn' },
  { icon: '📱', label: 'SMM' },
  { icon: '🌐', label: 'Til o\'rganish' },
  { icon: '✈️', label: 'Chet el' },
  { icon: '🤖', label: 'AI' },
  { icon: '🎬', label: 'Video' },
  { icon: '📚', label: 'Ta\'lim' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useKiosk();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [selectedInterest, setSelectedInterest] = useState(user?.interest || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCustomAvatar(base64);
      setSelectedAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({
      avatar: selectedAvatar,
      phone: phone.trim() || undefined,
      city: city.trim() || undefined,
      interest: selectedInterest || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const displayAvatar = selectedAvatar || customAvatar;
  const isEmojiAvatar = displayAvatar && displayAvatar.length <= 4 && !displayAvatar.startsWith('data:');

  return (
    <div className="gradient-page relative overflow-y-auto flex flex-col min-h-screen pt-20 pb-12 select-none">
      <KioskHeader title="Profil Sozlamalari" />

      <main className="max-w-2xl mx-auto w-full my-auto flex flex-col justify-center px-4 py-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#EAE6DF] w-full animate-fade-in-scale">

          {/* Title Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#EAE6DF] text-[#57534E] rounded-full font-bold text-xs mb-2 shadow-2xs">
              <span>Shaxsiy Profil</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
              {user?.name || 'Foydalanuvchi'}
            </h1>
            <p className="text-[#78716C] text-xs sm:text-sm font-medium mt-0.5">
              Profilingizni shaxsiylashtiring va saqlang
            </p>
          </div>

          {/* Avatar Area */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#EAE6DF] shadow-xs overflow-hidden bg-[#FAF8F5] cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => fileInputRef.current?.click()}
              >
                {isEmojiAvatar ? (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-[#FAF8F5]">
                    {displayAvatar}
                  </div>
                ) : displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FAF8F5]">
                    <User className="w-10 h-10 text-[#78716C]" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center shadow-xs border-2 border-white transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <p className="text-[11px] text-[#A8A29E] font-medium mt-2">Bosib rasm yuklang yoki tayyor avatarni tanlang</p>

            {/* Preset Emoji Avatars */}
            <div className="flex gap-1.5 mt-3 flex-wrap justify-center">
              {['😎', '👨‍💻', '👩‍🎓', '🧑‍🔬', '👨‍🎨', '🧑‍💼', '👩‍🚀', '🦸‍♂️'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => { setSelectedAvatar(emoji); setCustomAvatar(null); }}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                    selectedAvatar === emoji
                      ? 'border-[#1C1917] bg-[#FAF8F5] shadow-xs'
                      : 'border-[#EAE6DF] bg-white hover:border-[#D6CFBE]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE6DF]">
              <label className="flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="text-xs font-bold text-[#1C1917]">Telefon raqam</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full min-h-[40px] py-2 px-3 border border-[#E5E0D6] rounded-xl text-xs sm:text-sm font-medium text-[#1C1917] bg-white outline-none focus:border-[#1C1917] transition-all"
              />
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE6DF]">
              <label className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="text-xs font-bold text-[#1C1917]">Shahar / Tuman</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Masalan: Qo'qon"
                className="w-full min-h-[40px] py-2 px-3 border border-[#E5E0D6] rounded-xl text-xs sm:text-sm font-medium text-[#1C1917] bg-white outline-none focus:border-[#1C1917] transition-all"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE6DF] mb-6">
            <label className="flex items-center gap-1.5 mb-2">
              <Heart className="w-3.5 h-3.5 text-[#0F766E]" />
              <span className="text-xs font-bold text-[#1C1917]">Qiziqish sohasi</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedInterest(opt.label)}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedInterest === opt.label
                      ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                      : 'bg-white text-[#292524] border-[#EAE6DF] hover:border-[#D6CFBE]'
                  }`}
                >
                  <span className="text-sm">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons: Save + Back */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => router.push('/dashboard')}
              className="py-3 px-5 bg-white border border-[#EAE6DF] hover:bg-[#FAF8F5] text-[#292524] font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </button>

            <button
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-[#1C1917] hover:bg-[#292524] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Saqlandi!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Profilni Saqlash</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
