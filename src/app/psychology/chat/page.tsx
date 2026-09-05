'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKiosk } from '@/context/KioskContext';
import { KioskHeader } from '@/components/ui/KioskHeader';
import { generateAIResponse, AIMessage } from '@/lib/ai/aiService';
import { 
  HeartHandshake, Send, Bot, User, ShieldAlert, 
  Play, Pause, Volume2, Sparkles, Wind, 
  ArrowLeft, RefreshCw, Mic, MicOff, CheckCircle2,
  Smile, Frown, Flame, Heart, Music, ListMusic, X, Maximize2, Minimize2
} from 'lucide-react';

// 15 Curated High-Frequency Healing & Brain Cleansing Tracks (Handpan & Solfeggio Hz)
interface HzRelaxTrack {
  id: string;
  hz: string;
  videoId: string;
  title: string;
  category: 'high' | 'mild' | 'calm' | 'sadness';
  categoryLabel: string;
  icon: string;
  description: string;
  effect: string;
}

const HZ_HEALING_TRACKS: HzRelaxTrack[] = [
  // 1. Yuqori Stress & Xavotir (1111 Hz, 963 Hz, 852 Hz, Alpha)
  {
    id: 'hz-1111',
    hz: '1111 Hz',
    videoId: '1C51Rz0G184',
    title: '1111 Hz Healing Handpan (Malte Marten)',
    category: 'high',
    categoryLabel: 'Yuqori Stress & Miyani Tozalash',
    icon: '✨',
    description: '1111 Hz Oliy chastotali Handpan meditatsiyasi. Miyadagi barcha xavotir va bosimni yuvib tashlaydi.',
    effect: 'Miyani tozalash va to‘liq xotirjamlik',
  },
  {
    id: 'hz-963',
    hz: '963 Hz',
    videoId: 'WPni755-Krg',
    title: '963 Hz Pineal Gland & Pure Brain Reset',
    category: 'high',
    categoryLabel: 'Yuqori Stress & Miyani Tozalash',
    icon: '🧘',
    description: '963 Hz Epifiz bezi va miyani salbiy fikrlardan tozalovchi sof chastota.',
    effect: 'Salbiy fikrlarni to‘xtatish va ongni poklash',
  },
  {
    id: 'hz-852',
    hz: '852 Hz',
    videoId: '1ZYbU82GVz4',
    title: '852 Hz Overthinking & Anti-Anxiety Flow',
    category: 'high',
    categoryLabel: 'Yuqori Stress & Miyani Tozalash',
    icon: '🧠',
    description: '852 Hz Miyadagi to‘xtovsiz o‘y-xayollar va vahimani bartaraf etuvchi garmoniya.',
    effect: 'Miyadagi shovqinni o‘chirish',
  },
  {
    id: 'hz-alpha',
    hz: '8-12 Hz',
    videoId: '77ZozI0rw7w',
    title: 'Alpha Brainwave Deep Stress Release',
    category: 'high',
    categoryLabel: 'Yuqori Stress & Miyani Tozalash',
    icon: '🌊',
    description: 'Alfa to‘lqinlari orqali 10 daqiqada asab tizimini normallashtirish va pulsni pasaytirish.',
    effect: 'Asab tizimini tez tinchlantirish',
  },

  // 2. O‘rtacha Charchoq & Stress (528 Hz, 741 Hz, 396 Hz, Lofi)
  {
    id: 'hz-528-handpan',
    hz: '528 Hz',
    videoId: 'mPZkdNFkNps',
    title: '528 Hz Seeds of Calm Handpan (Malte Marten)',
    category: 'mild',
    categoryLabel: 'Charchoq & Stressni Yengish',
    icon: '🌿',
    description: '528 Hz Mo‘jizaviy chastota. Hujayralarni yangilaydi, charchoqni oladi va kuch bag‘ishlaydi.',
    effect: 'Ruhiy quvvatni tiklash va charchoqni olish',
  },
  {
    id: 'hz-741',
    hz: '741 Hz',
    videoId: 'hlWiI4xVXKY',
    title: '741 Hz Detox & Mental Refreshing',
    category: 'mild',
    categoryLabel: 'Charchoq & Stressni Yengish',
    icon: '🍃',
    description: '741 Hz Ruhiy va aqliy toksinlarni haydash, yangi kuch va intuitsiyani uyg‘otish.',
    effect: 'Aqliy charchoqni quvish',
  },
  {
    id: 'hz-396',
    hz: '396 Hz',
    videoId: '4xDzrJKXOOY',
    title: '396 Hz Release Pressure & Guilt',
    category: 'mild',
    categoryLabel: 'Charchoq & Stressni Yengish',
    icon: '⚡',
    description: '396 Hz Ichki qo‘rquv va ish bosimidan xalos bo‘lish chastotasi.',
    effect: 'Ishdagi bosimni yengillashtirish',
  },
  {
    id: 'hz-lofi-chill',
    hz: '432 Hz',
    videoId: '1ZYbU82GVz4',
    title: '432 Hz Lofi Chill & Nature Acoustic',
    category: 'mild',
    categoryLabel: 'Charchoq & Stressni Yengish',
    icon: '☕',
    description: 'Mayin lofi ritmlari va sokin tabiat sadosi bilan yoqimli hordiq.',
    effect: 'Yengil dam olish va xotirjamlik',
  },

  // 3. Sokin & Barqaror (432 Hz, Theta, Crystal Bowls, Forest)
  {
    id: 'hz-432-golden',
    hz: '432 Hz',
    videoId: 'hlWiI4xVXKY',
    title: '432 Hz Golden Light of Peace (Handpan)',
    category: 'calm',
    categoryLabel: 'Chuqur Meditatsiya & Osoyishtalik',
    icon: '☀️',
    description: '432 Hz Olam bilan uyg‘unlik. Eng mayin va tabiiy tebranish chastotasi.',
    effect: 'Chuqur ichki xotirjamlik',
  },
  {
    id: 'hz-theta',
    hz: '6 Hz',
    videoId: 'WPni755-Krg',
    title: 'Theta Wave (6Hz) Deep Mind Reset',
    category: 'calm',
    categoryLabel: 'Chuqur Meditatsiya & Osoyishtalik',
    icon: '🌌',
    description: 'Chuqur meditatsiya va miyaning chuqur neyronlarini dam oldiruvchi Teta to‘lqini.',
    effect: 'Chuqur neyronal yangilanish',
  },
  {
    id: 'hz-crystal',
    hz: '432 Hz',
    videoId: '77ZozI0rw7w',
    title: 'Crystal Singing Bowls 432 Hz Sound Bath',
    category: 'calm',
    categoryLabel: 'Chuqur Meditatsiya & Osoyishtalik',
    icon: '🔮',
    description: 'Kristall kosalar va mayin ohanglar orqali fazoviy sukunat.',
    effect: 'Miyadagi barcha taranglikni yo‘qotish',
  },
  {
    id: 'hz-forest-zen',
    hz: '432 Hz',
    videoId: 'hlWiI4xVXKY',
    title: 'Yashil O‘rmon & Handpan Sadosi',
    category: 'calm',
    categoryLabel: 'Chuqur Meditatsiya & Osoyishtalik',
    icon: '🌲',
    description: 'O‘rmon qushlari, shabboda va sokin Handpan garmoniyasi.',
    effect: 'Ijobiy energiya va tabiat quchog‘i',
  },

  // 4. Qalb Siqilishi & G‘amginlik (639 Hz, 174 Hz, Ocean, All Solfeggio)
  {
    id: 'hz-639',
    hz: '639 Hz',
    videoId: 'bn9F19Hi1Lk',
    title: '639 Hz Heart Chakra & Emotional Healing',
    category: 'sadness',
    categoryLabel: 'Qalb Siqilishi & Mehrli Dalda',
    icon: '💖',
    description: '639 Hz Qalb jarohatlarini davolovchi, mehr va mehr-oqibat tuyg‘usini uyg‘otuvchi chastota.',
    effect: 'Qalbga iliqlik va taskin',
  },
  {
    id: 'hz-174',
    hz: '174 Hz',
    videoId: 'bn9F19Hi1Lk',
    title: '174 Hz Natural Pain & Tension Relief',
    category: 'sadness',
    categoryLabel: 'Qalb Siqilishi & Mehrli Dalda',
    icon: '🌊',
    description: '174 Hz Ruhiy og‘riqlar va ichki siqilishni yengillashtiruvchi sokin dengiz to‘lqini.',
    effect: 'Ichki siqilishni yengillashtirish',
  },
  {
    id: 'hz-9-solfeggio',
    hz: 'All Hz',
    videoId: '1C51Rz0G184',
    title: '9 Solfeggio Frequencies Full Healing Journey',
    category: 'sadness',
    categoryLabel: 'Qalb Siqilishi & Mehrli Dalda',
    icon: '🌈',
    description: 'Barcha 9 ta shifobaxsh chastotalarning to‘liq ruhiy tiklanish sayohati.',
    effect: 'To‘liq ruhiy va emotsional tiklanish',
  },
];

// 3-Step Interactive Stress Diagnostic Test
interface TestQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    level: 'calm' | 'mild' | 'high' | 'sadness';
    icon: string;
  }[];
}

const DIAGNOSTIC_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    question: "Hozirgi paytda o‘zingizni ruhiy jihatdan qanday his qilyapsiz?",
    options: [
      { text: "Xotirjam va yaxshiman", level: "calm", icon: "🟢" },
      { text: "Biroz charchaganman, fikrlar ko‘p", level: "mild", icon: "🟡" },
      { text: "Kuchli stress, bosim va xavotirdaman", level: "high", icon: "🔴" },
      { text: "Qalbim g‘amgin, yolg‘izlik sezilyapti", level: "sadness", icon: "💔" },
    ],
  },
  {
    id: 2,
    question: "Oxirgi kunlarda uyqu va ichki xotirjamligingiz qanday?",
    options: [
      { text: "A'lo darajada, tetik uyg‘onaman", level: "calm", icon: "✨" },
      { text: "Uyqum notinch, fikrlar band qiladi", level: "mild", icon: "🌙" },
      { text: "Deyarli uxlay olmayapman, xavotir kuchli", level: "high", icon: "⚡" },
      { text: "O‘rnimdan turishga ham ishtiyoq yo‘q", level: "sadness", icon: "🌧️" },
    ],
  },
  {
    id: 3,
    question: "Hozir sizga qanday shifobaxsh musiqa ko‘proq kerak?",
    options: [
      { text: "432 Hz tabiat va sokinlik", level: "calm", icon: "🎵" },
      { text: "528 Hz charchoqni quvuvchi Handpan", level: "mild", icon: "🌿" },
      { text: "1111 Hz / 963 Hz miyani tozalovchi yuqori chastota", level: "high", icon: "🧘" },
      { text: "639 Hz qalbga taskin beruvchi mayin ohang", level: "sadness", icon: "💖" },
    ],
  },
];

function PsychologyChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic') || 'Ruhiy Xotirjamlik';
  const iconParam = searchParams.get('icon') || '🌸';

  const { user } = useKiosk();
  const userName = user?.name ? user.name.replace(/[0-9]/g, '').trim() : 'Farhodjon';

  // Diagnostic Test State
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<'calm' | 'mild' | 'high' | 'sadness'>('high');

  // Music State
  const [activeTrack, setActiveTrack] = useState<HzRelaxTrack>(HZ_HEALING_TRACKS[0]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showTrackDrawer, setShowTrackDrawer] = useState(false);

  // Breathing Guide
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);

  // Chat State
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Set default track for level
  const getDefaultTrackForLevel = (level: 'calm' | 'mild' | 'high' | 'sadness'): HzRelaxTrack => {
    const matched = HZ_HEALING_TRACKS.find(t => t.category === level);
    return matched || HZ_HEALING_TRACKS[0];
  };

  // Complete diagnostic test & initialize chat
  const handleAnswerQuestion = (level: 'calm' | 'mild' | 'high' | 'sadness') => {
    const nextAnswers = [...selectedAnswers, level];
    setSelectedAnswers(nextAnswers);

    if (currentQIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Determine dominant level
      const counts: Record<string, number> = { calm: 0, mild: 0, high: 0, sadness: 0 };
      nextAnswers.forEach(l => { counts[l] = (counts[l] || 0) + 1; });
      let dominantLevel: 'calm' | 'mild' | 'high' | 'sadness' = level;
      let maxCount = 0;
      (Object.keys(counts) as Array<'calm' | 'mild' | 'high' | 'sadness'>).forEach(k => {
        if (counts[k] > maxCount) {
          maxCount = counts[k];
          dominantLevel = k;
        }
      });

      setStressLevel(dominantLevel);
      const matched = getDefaultTrackForLevel(dominantLevel);
      setActiveTrack(matched);
      setHasCompletedTest(true);

      // Generate personalized welcome greeting
      let levelGreeting = "";
      if (dominantLevel === 'high') {
        levelGreeting = `Assalomu alaykum, ${userName}! 🌸 Test natijangizga ko‘ra sizda yuqori stress va miya toliqishi sezilmoqda.\n\nSiz uchun miyadagi barcha zo‘riqishni tozalovchi shifobaxsh "${matched.title}" (${matched.hz}) musiqasi tayyorlandi. Yuqoridagi "Musiqani boshlash" va "4-7-8 Nafas mashqi" orqali tinchlanishingiz mumkin. Dilingizdagilarni bemalol ayting.`;
      } else if (dominantLevel === 'mild') {
        levelGreeting = `Assalomu alaykum, ${userName}! 🌸 O‘rtacha charchoq va fikrlar toliqishini yengishingiz uchun sizga "${matched.title}" (${matched.hz}) shifobaxsh musiqasi ulandi.\n\nO‘zingizni qanday his qilyapsiz? Maslahat kerak bo‘lsa, yozing yoki mikrofonda ayting.`;
      } else if (dominantLevel === 'sadness') {
        levelGreeting = `Assalomu alaykum, ${userName}! 🌸 Ko‘nglingizdagi g‘amginlikni his qilyapman. Siz uchun qalbga taskin beruvchi "${matched.title}" (${matched.hz}) sadolari tanlandi. Istalgan mavzuda dildan suhbatlashishimiz mumkin.`;
      } else {
        levelGreeting = `Assalomu alaykum, ${userName}! 🌸 Sizning xotirjam holatda ekaningizdan xursandman. Siz uchun tabiat bilan uyg‘unlashtiruvchi "${matched.title}" (${matched.hz}) musiqasi tanlandi. Qanday maqsadingiz yoki savolingiz bo‘lsa, suhbatlashishga tayyorman!`;
      }

      setMessages([{ role: 'assistant', content: levelGreeting }]);
    }
  };

  // Quick 1-click level select without full test
  const handleQuickLevelSelect = (level: 'calm' | 'mild' | 'high' | 'sadness') => {
    setStressLevel(level);
    const matched = getDefaultTrackForLevel(level);
    setActiveTrack(matched);
    setHasCompletedTest(true);
    const greeting = `Assalomu alaykum, ${userName}! 🌸 Holatingizga mos ravishda shifobaxsh "${matched.title}" (${matched.hz}) musiqasi tanlandi. Qanday savolingiz yoki xavotiringiz bor?`;
    setMessages([{ role: 'assistant', content: greeting }]);
  };

  // Select custom Hz track from 15-track list
  const handleSelectCustomTrack = (track: HzRelaxTrack) => {
    setActiveTrack(track);
    setStressLevel(track.category);
    setIsMusicPlaying(true);
    setShowTrackDrawer(false);
  };

  // Restart diagnostic test
  const handleRestartTest = () => {
    setHasCompletedTest(false);
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setIsMusicPlaying(false);
    setShowBreathing(false);
    setShowVideoPlayer(false);
  };

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 4-7-8 Breathing Loop
  useEffect(() => {
    if (!showBreathing) return;
    let timer: NodeJS.Timeout;

    const runCycle = () => {
      setBreathPhase('inhale');
      setBreathCountdown(4);
      timer = setTimeout(() => {
        setBreathPhase('hold');
        setBreathCountdown(7);
        timer = setTimeout(() => {
          setBreathPhase('exhale');
          setBreathCountdown(8);
          timer = setTimeout(runCycle, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();
    const interval = setInterval(() => {
      setBreathCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [showBreathing]);

  // Text-to-speech for psychologist answers
  const speakPsychologist = async (text: string) => {
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*/g, '')
      .trim();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          figureId: 'mohira',
          voice: 'uz-UZ-MadinaNeural',
          rate: '+0%',
          pitch: '+0Hz',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }
          const audio = new Audio(data.audioBase64);
          audioPlayerRef.current = audio;
          audio.play().catch(() => {});
        }
      }
    } catch {}
  };

  // Send message
  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const newHistory: AIMessage[] = [
      ...messages,
      { role: 'user', content: query.trim() },
    ];

    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      const aiPrompt: AIMessage[] = [
        {
          role: 'system',
          content: `Sen "Muqimiy Aql Markazi" psixologik ko'mak markazining tajribali, muloyim va dildosh virtual psixologi Mohirasan.
Foydalanuvchi ismi: ${userName}.
Mavzu: "${topicParam}".
Foydalanuvchining aniqlangan ruhiy holat darajasi: "${activeTrack.categoryLabel}".
Tinglayotgan musiqasi: "${activeTrack.title}" (${activeTrack.hz}).
Vazifang:
1. Foydalanuvchini chin dildan tingla va unga mehrli, dono dalda ber.
2. O'zbek tilida samimiy, lo'nda va yengillik bag'ishlovchi amaliy maslahatlar ber (2-3 ta qisqa jumla).
3. 1111 Hz va Handpan shifobaxsh chastotalari orqali miyani tozalashni, 4-7-8 nafas mashqini tavsiya qil.`,
        },
        ...newHistory,
      ];

      const reply = await generateAIResponse(aiPrompt, user, 'psychology');
      const updatedMessages: AIMessage[] = [
        ...newHistory,
        { role: 'assistant', content: reply },
      ];

      setMessages(updatedMessages);
      speakPsychologist(reply);
    } catch {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: `Kechirasiz, ${userName}. Aloqada biroz uzilish bo‘ldi. Iltimos yana bir bor fikringizni bildiring, sizni tinglashga tayyorman.`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'uz-UZ';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col pt-16 select-none overflow-hidden font-sans">
      <KioskHeader 
        title="PSIXOLOGIK MASLAHAT & SHIFOBAXSH HZ MUSIQALAR" 
        subtitle="1111 HZ HANDPAN • MIYANI TOZALOVCHI SOLFEGGIO CHASTOTALAR" 
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-3 flex flex-col min-h-0 justify-between">
        
        {/* ════════════════════════════════════════════════════════════
             CLEAN TOP ACTION BAR (1 SINGLE MINIMALIST ROW)
           ════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-3 border border-[#EAE6DF] shadow-xs flex flex-wrap items-center justify-between gap-3 mb-3 shrink-0">
          
          {/* Left: Back + Topic + Active Hz Frequency Pill */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => router.push('/psychology')}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE6DF] text-[#1C1917] transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ortga</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200/80 rounded-xl text-xs font-bold text-teal-800">
              <span>{iconParam}</span>
              <span>{topicParam}</span>
            </div>

            {hasCompletedTest && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-xl text-xs font-black text-[#1C1917]">
                <span className="text-emerald-600">{activeTrack.icon}</span>
                <span>{activeTrack.hz} • {activeTrack.title}</span>
              </div>
            )}
          </div>

          {/* Right Controls: Play / Pause + 15 Hz Drawer + Video + Breathing + Retest */}
          {hasCompletedTest && (
            <div className="flex items-center gap-2">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => setIsMusicPlaying(prev => !prev)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
                  isMusicPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md ring-2 ring-red-300 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md ring-2 ring-emerald-300'
                }`}
                title="Musiqani boshlash yoki to'xtatish"
              >
                {isMusicPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Musiqani to‘xtatish</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>▶️ {activeTrack.hz} Musiqani boshlash</span>
                  </>
                )}
              </button>

              {/* 15 Hz Tracks Selector Drawer Button */}
              <button
                onClick={() => setShowTrackDrawer(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Barcha 15 ta shifobaxsh musiqalar ro'yxati"
              >
                <ListMusic className="w-4 h-4 text-teal-600" />
                <span className="hidden sm:inline">15 ta Hz Musiqalar</span>
              </button>

              {/* Show/Hide Video Visualizer */}
              <button
                onClick={() => setShowVideoPlayer(prev => !prev)}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  showVideoPlayer
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-[#FAF8F5] text-[#78716C] border-[#EAE6DF] hover:bg-white'
                }`}
                title={showVideoPlayer ? "Videoni yashirish" : "Videoni ko'rish"}
              >
                {showVideoPlayer ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* 4-7-8 Breathing Button */}
              <button
                onClick={() => setShowBreathing(prev => !prev)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showBreathing
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[#FAF8F5] border border-[#EAE6DF] text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Wind className="w-4 h-4 text-purple-500" />
                <span className="hidden md:inline">4-7-8 Nafas</span>
              </button>

              {/* Retest button */}
              <button
                onClick={handleRestartTest}
                className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE6DF] text-[#78716C] border border-[#EAE6DF] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Qayta test topshirish"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════
             EMBEDDED YOUTUBE PLAYER (VIDEO OR INVISIBLE AUDIO)
           ════════════════════════════════════════════════════════════ */}
        {hasCompletedTest && isMusicPlaying && showVideoPlayer && (
          <div className="mb-3 bg-black rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-xl relative aspect-video max-h-[280px] sm:max-h-[340px] mx-auto w-full max-w-3xl animate-fade-in">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeTrack.videoId}?autoplay=1&loop=1&playlist=${activeTrack.videoId}&controls=1`}
              title="YouTube Healing Stream"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute top-2 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeTrack.hz} • {activeTrack.title}</span>
            </div>
          </div>
        )}

        {hasCompletedTest && isMusicPlaying && !showVideoPlayer && (
          <div className="w-0 h-0 overflow-hidden opacity-0 pointer-events-none absolute">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeTrack.videoId}?autoplay=1&loop=1&playlist=${activeTrack.videoId}&controls=0`}
              title="YouTube Audio Stream"
              allow="autoplay"
            />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
             MODAL / DRAWER: 15 CURATED HZ HEALING TRACKS
           ════════════════════════════════════════════════════════════ */}
        {showTrackDrawer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#EAE6DF] animate-fade-in-scale">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#1C1917]">
                      15 ta Shifobaxsh Hz & Handpan Musiqalari
                    </h3>
                    <p className="text-xs text-[#78716C] font-semibold">
                      Miyani tozalovchi va asab tizimini davolovchi Solfeggio chastotalari
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTrackDrawer(false)}
                  className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE6DF] text-[#78716C] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tracks List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {HZ_HEALING_TRACKS.map((track, idx) => {
                  const isCurrent = activeTrack.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectCustomTrack(track)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center justify-between gap-3 shadow-2xs active:scale-[0.99] ${
                        isCurrent
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md scale-[1.01]'
                          : 'bg-[#FAF8F5] text-[#1C1917] border-[#EAE6DF] hover:border-teal-500 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{track.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                              isCurrent ? 'bg-teal-500/30 text-teal-300' : 'bg-teal-50 text-teal-800'
                            }`}>
                              {track.hz}
                            </span>
                            <h4 className="text-sm font-bold">{track.title}</h4>
                          </div>
                          <p className={`text-xs mt-0.5 ${isCurrent ? 'text-slate-300' : 'text-[#78716C]'}`}>
                            {track.description}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[11px] font-black px-3 py-1 rounded-xl shrink-0 ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-white text-teal-800 border border-[#EAE6DF]'
                      }`}>
                        {isCurrent && isMusicPlaying ? '▶️ Yangramoqda' : 'Tanlash'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
             4-7-8 RELAXATION BREATHING OVERLAY
           ════════════════════════════════════════════════════════════ */}
        {showBreathing && (
          <div className="mb-3 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-2 transition-all duration-1000 shadow-md ${
                breathPhase === 'inhale'
                  ? 'scale-110 bg-teal-500/30 border-teal-400 text-teal-200'
                  : breathPhase === 'hold'
                  ? 'scale-110 bg-purple-500/40 border-purple-400 text-purple-200'
                  : 'scale-90 bg-indigo-500/30 border-indigo-400 text-indigo-200'
              }`}>
                {breathCountdown}s
              </div>
              <div>
                <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block">4-7-8 Antistress Nafasi</span>
                <h4 className="text-sm sm:text-base font-bold">
                  {breathPhase === 'inhale' && '🌸 Burundan sekin chuqur nafas oling...'}
                  {breathPhase === 'hold' && '✨ Nafasni ushlab turing...'}
                  {breathPhase === 'exhale' && '🍃 Og‘izdan mayin chiqarib yuboring...'}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setShowBreathing(false)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold cursor-pointer"
            >
              Yopish
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
             STEP 1: INTERACTIVE STRESS & MOOD LEVEL DIAGNOSTIC TEST
           ════════════════════════════════════════════════════════════ */}
        {!hasCompletedTest ? (
          <div className="flex-1 bg-white rounded-3xl border border-[#EAE6DF] shadow-sm flex flex-col justify-center p-6 sm:p-10 max-w-3xl mx-auto w-full animate-fade-in-scale">
            
            {/* Test Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full font-bold text-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Ruhiy Holat & Stress Darajasi Testi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1C1917]">
                {DIAGNOSTIC_QUESTIONS[currentQIndex].question}
              </h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">
                Savol {currentQIndex + 1} / {DIAGNOSTIC_QUESTIONS.length} — Natijaga ko‘ra sizga mos shifobaxsh Hz musiqa va maslahat tanlanadi
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden mb-6 border border-[#EAE6DF]">
              <div 
                className="bg-teal-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {DIAGNOSTIC_QUESTIONS[currentQIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerQuestion(opt.level)}
                  className="p-4 rounded-2xl border-2 border-[#EAE6DF] hover:border-teal-600 hover:bg-teal-50/50 bg-white text-left transition-all cursor-pointer flex items-center gap-3.5 shadow-2xs active:scale-98 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <span className="text-sm font-bold text-[#1C1917] group-hover:text-teal-900 leading-snug">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick 1-Click Level Jump */}
            <div className="pt-4 border-t border-[#EAE6DF] text-center">
              <span className="text-[11px] font-bold text-[#78716C] block mb-2">
                Yoki to‘g‘ridan-to‘g‘ri shifobaxsh Hz chastotani 1 bosishda tanlang:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleQuickLevelSelect('high')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 transition-all cursor-pointer"
                >
                  🔴 1111 Hz / 963 Hz (Miyani tozalash)
                </button>
                <button
                  onClick={() => handleQuickLevelSelect('mild')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-all cursor-pointer"
                >
                  🟡 528 Hz / 741 Hz (Charchoqni quvish)
                </button>
                <button
                  onClick={() => handleQuickLevelSelect('calm')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  🟢 432 Hz / Teta (Sokinlik & Meditatsiya)
                </button>
                <button
                  onClick={() => handleQuickLevelSelect('sadness')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 transition-all cursor-pointer"
                >
                  💔 639 Hz / 174 Hz (Qalbga taskin)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════
               STEP 2: CLEAN MINIMALIST DIALOGUE CHATROOM
             ════════════════════════════════════════════════════════════ */
          <div className="flex-1 bg-white rounded-3xl border border-[#EAE6DF] shadow-sm flex flex-col overflow-hidden min-h-0 animate-fade-in">
            
            {/* MESSAGES SCROLL LIST */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 items-end ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center text-[#0F766E] shrink-0 shadow-2xs">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-700 text-white rounded-br-xs font-semibold shadow-xs'
                        : 'bg-[#FAF8F5] border border-[#EAE6DF] text-[#1C1917] rounded-bl-xs font-medium whitespace-pre-line shadow-2xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-10 h-10 bg-[#1C1917] rounded-2xl flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center text-[#0F766E] shrink-0">
                    <Bot className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="px-4 py-2.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] text-xs text-[#78716C] font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                    <span>Mohira javob tayyorlamoqda...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR WITH VOICE & SEND */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#EAE6DF] flex gap-2.5 items-center shrink-0">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Dilingizdagi fikr yoki xavotirni yozing..."
                className="flex-1 min-h-[48px] max-h-[100px] px-4 py-3 border border-[#EAE6DF] focus:border-teal-600 rounded-2xl text-sm font-medium text-[#1C1917] outline-none resize-none bg-[#FAF8F5]"
                rows={1}
              />

              {/* Voice Mic Button */}
              <button
                onClick={toggleListening}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isListening
                    ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse'
                    : 'bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100'
                }`}
                title={isListening ? "To'xtatish" : "Ovozli gapirish"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                className="w-12 h-12 rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md"
                title="Yuborish"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM CONFIDENTIALITY BADGE */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#78716C] font-semibold px-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Muloqot 100% anonim va xavfsiz. Shifobaxsh Hz chastotalar bilan ruhiy quvvat oling.</span>
          </div>
          <span className="hidden sm:inline text-teal-700">Muqimiy Aql Markazi</span>
        </div>
      </main>
    </div>
  );
}

export default function PsychologyChatScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-teal-800 font-bold">Yuklanmoqda...</div>}>
      <PsychologyChatContent />
    </Suspense>
  );
}
