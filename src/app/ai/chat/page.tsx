'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { VoiceAssistant } from '@/components/ui/VoiceAssistant';
import { generateAIResponse, AIMessage } from '@/lib/ai/aiService';
import { Bot, Send, User, Sparkles, ShieldCheck } from 'lucide-react';

function formatMessageContent(content: string) {
  if (!content) return null;

  const cleaned = content
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*/g, '');

  const lines = cleaned.split('\n');

  return (
    <div className="space-y-2 leading-relaxed text-base sm:text-lg font-medium">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+[\.\)]/.test(trimmed);
        const colonIndex = trimmed.indexOf(':');

        if (colonIndex > 0 && colonIndex < 40 && !trimmed.startsWith('http')) {
          const label = trimmed.slice(0, colonIndex + 1);
          const rest = trimmed.slice(colonIndex + 1);

          return (
            <p key={idx} className={isBullet ? 'pl-3 text-[#292524]' : 'text-[#292524]'}>
              <strong className="font-bold text-[#1C1917] mr-1.5">{label}</strong>
              <span>{rest}</span>
            </p>
          );
        }

        return (
          <p key={idx} className={isBullet ? 'pl-3 text-[#292524]' : 'text-[#292524]'}>
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function AIChatScreen() {
  const { user } = useKiosk();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: `Assalomu alaykum, ${user?.name || 'Foydalanuvchi'}! Men sizning sun'iy intellekt yordamchingizman. Menga istalgan savolingizni bering yoki topshiriq topshiring!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isChildMode = user?.ageGroup === '7-12';

  const QUICK_PROMPTS = [
    "Menga kasb tanlashda yordam ber",
    "Ingliz tilini o'rganmoqchiman",
    "Germaniyada ishlash uchun nima kerak?",
    "AI yordamida rasm yaratish haqida ma'lumot ber",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMessages: AIMessage[] = [...messages, { role: 'user', content: query.trim() }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const reply = await generateAIResponse(newMessages, user, 'general');
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Kechirasiz, xizmatni yuklashda muammo yuz berdi. Qayta urinib ko‘ring.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="gradient-page relative flex flex-col h-screen overflow-hidden pt-20 pb-4 px-4 sm:px-8 select-none">
      <KioskHeader title="AI Chat" />

      <main className="w-full max-w-[1600px] mx-auto flex-1 flex flex-col h-full min-h-0">
        {/* Child Safe Indicator if applicable */}
        {isChildMode && (
          <div className="p-2.5 bg-[#F0FDFA] border border-[#99F6E4] rounded-2xl text-[#0F766E] text-xs font-bold flex items-center justify-center gap-2 mb-3 shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
            <span>BOLALAR UCHUN XAVFSIZ REJIM FAOL</span>
          </div>
        )}

        {/* FULL SCREEN CHAT CONTAINER */}
        <div className="flex-1 bg-white rounded-3xl border border-[#EAE6DF] shadow-sm flex flex-col overflow-hidden min-h-0">
          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3.5 items-end ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl flex items-center justify-center text-[#1C1917] shrink-0 shadow-2xs">
                    <Bot className="w-5 h-5 text-[#0F766E]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] px-5 py-4 rounded-3xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1C1917] text-white rounded-br-xs'
                      : 'bg-[#FAF8F5] border border-[#EAE6DF] text-[#1C1917] rounded-bl-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-line text-base sm:text-lg font-semibold">{msg.content}</div>
                  ) : (
                    formatMessageContent(msg.content)
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-10 h-10 bg-[#1C1917] rounded-2xl flex items-center justify-center text-white shrink-0 font-bold text-sm shadow-2xs">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl flex items-center justify-center text-[#1C1917] shrink-0">
                  <Bot className="w-5 h-5 text-[#0F766E] animate-spin-slow" />
                </div>
                <div className="px-5 py-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] text-sm text-[#78716C] font-semibold">
                  Javob tayyorlanmoqda...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="px-6 py-3 bg-[#FAF8F5] border-t border-[#EAE6DF] flex gap-2.5 overflow-x-auto shrink-0">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-xs sm:text-sm py-2 px-4 bg-white border border-[#E5E0D6] text-[#292524] font-bold hover:border-[#1C1917] hover:bg-[#F5F2EC] rounded-xl shrink-0 cursor-pointer transition-all active:scale-95 flex items-center gap-2 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-4 sm:p-5 bg-white border-t border-[#EAE6DF] flex gap-3 items-center shrink-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Savolingizni yozing yoki ovozli gapiring..."
              className="flex-1 min-h-[54px] max-h-[120px] px-5 py-3.5 border border-[#E5E0D6] focus:border-[#1C1917] rounded-2xl text-base sm:text-lg font-medium text-[#1C1917] outline-none resize-none bg-[#FAF8F5]"
              rows={1}
            />

            <VoiceAssistant onSpeechResult={(transcript) => handleSend(transcript)} />

            <button
              onClick={() => handleSend()}
              className="w-14 h-14 rounded-2xl bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs"
              title="Yuborish"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
