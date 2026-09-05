'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceAssistantProps {
  onSpeechResult?: (text: string) => void;
  textToSpeak?: string;
  autoSpeak?: boolean;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onSpeechResult,
  textToSpeak,
  autoSpeak = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-To-Speech
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (textToSpeak && autoSpeak) {
      speakText(textToSpeak);
    }
  }, [textToSpeak, autoSpeak]);

  // Speech-To-Text
  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Sizning brauzeringizda ovozli kiritish qo'llab-quvvatlanmaydi.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'uz-UZ';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onSpeechResult && transcript) {
        onSpeechResult(transcript);
      }
    };

    recognition.start();
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Mic Input Button */}
      {onSpeechResult && (
        <button
          onClick={isListening ? () => setIsListening(false) : startListening}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
          title="Ovozli gapirish"
        >
          {isListening ? (
            <>
              <MicOff className="w-6 h-6 animate-bounce" />
              <span className="text-base">Tinglanmoqda...</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span className="text-base">Gapirish 🎙️</span>
            </>
          )}
        </button>
      )}

      {/* TTS Read Aloud Button */}
      {textToSpeak && (
        <button
          onClick={isSpeaking ? stopSpeaking : () => speakText(textToSpeak)}
          className={`p-3 rounded-2xl border transition-all active:scale-95 ${
            isSpeaking
              ? 'bg-sky-500 text-white border-sky-500'
              : 'bg-white/90 text-sky-600 border-sky-300 hover:bg-sky-50'
          }`}
          title="Ovozli eshittirish"
        >
          {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      )}
    </div>
  );
};
