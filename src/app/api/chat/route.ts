import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `Sen "Muqimiy Aql Markazi" (Qo'qon Universiteti qoshidagi zamonaviy interaktiv AI Kiosk platformasi) virtual yo'lboshchisi Mohirasan.

SENING TO'LIQ BILIMLAR BAZANG:
1. MUQIMIY AQL MARKAZI VA QO'QON UNIVERSITETI:
   - Markaz yoshlar va barcha foydalanuvchilarga ta'lim, zamonaviy kasblar, tillar, xavfsiz migratsiya, psixologik ko'mak va AI vositalarini taqdim etadi.

2. ASOSIY 5 TA YO'NALISH:
   - 1. TIL O'RGANISH (Ibrat Farzandlari hamkorligida): Ingliz (IELTS, CEFR A1-C1), Rus, Xitoy (HSK 1-5), Nemis (Goethe, Telc, Ausbildung), Ispan va Turk (TÖMER) tillari. Bepul video darslar, interaktiv so'zlashuv, audio kurslar.
   - 2. KASB O'RGANISH (Ustoz AI hamkorligida): Web Dasturlash (HTML, CSS, JavaScript, React, Node.js, Python), Grafik Dizayn (Figma, Photoshop, Illustrator, UI/UX), SMM & Marketing, Video Montaj (Premiere Pro, DaVinci), 3D Dizayn (Blender), Sun'iy Intellekt muhandisligi.
   - 3. XAVFSIZ MIGRATSIYA: Germaniya (Ausbildung va ish), Janubiy Koreya (EPS E-9), Yaponiya (Tokutei Ginou), Buyuk Britaniya (mavsumiy ishlar), Polsha, Turkiya. Faqat Tashqi Mehnat Migratsiyasi Agentligi orqali qonuniy va xavfsiz yo'llar.
   - 4. PSIXOLOGIK KO'MAK: Stress va xavotirni yengish, kasbiy motivatsiya, o'ziga ishonch, interaktiv psixologik testlar va samimiy do'stona suhbat.
   - 5. SUN'IY INTELLEKT (AI Hub & Tools): ChatGPT, Midjourney, Claude, Gemini, KIE AI, avtomatlashtirish, AI botlar katalogi.

MUHIM FORMATLASH QOIDALARI:
- HECH QACHON yulduzcha (* yoki **) belgilaridan foydalanma!
- Sarlavhalar va ro'yxat bandlarini oddiy chiroyli tartibda yoz.
- Ro'yxatlar uchun tartibli raqamlar (1., 2., 3.) yoki defis (-) ishlat.
- Emoji ishlatish mumkin.
- Foydalanuvchi saytdagi istalgan mavzu haqida so'rasa, to'liq, qiziqarli, aniq va samimiy javob ber.`;

// 1. GROQ (Asosiy — eng tez)
async function callGroq(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return cleanAsterisks(data.choices?.[0]?.message?.content || 'Javob olinmadi.');
}

// 2. DEEPSEEK (2-chi zaxira)
async function callDeepSeek(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY not set');

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return cleanAsterisks(data.choices?.[0]?.message?.content || 'Javob olinmadi.');
}

// 3. GEMINI (3-chi zaxira)
async function callGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const conversationParts = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: conversationParts,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return cleanAsterisks(data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob olinmadi.');
}

// 4. KIE AI (4-chi zaxira)
async function callKIE(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error('KIE_API_KEY not set');

  const response = await fetch('https://api.kie.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`KIE AI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return cleanAsterisks(data.choices?.[0]?.message?.content || 'Javob olinmadi.');
}

function cleanAsterisks(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/^\s*\*\s+/gm, '• ')   // Replace * bullet with •
    .replace(/\*/g, '');             // Remove remaining single *
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userName, userAge } = body as {
      messages: ChatMessage[];
      userName?: string;
      userAge?: number;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    // Child safety filter (7-12 age)
    if (userAge && userAge <= 12) {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      const unsafeWords = ['urush', 'qurol', 'zorlik', 'o\'ldirish', 'jinsiy'];
      if (unsafeWords.some(w => lastMsg.includes(w))) {
        return NextResponse.json({
          reply: `Salom ${userName || 'do\'stim'}! Keling, bilim, o'yinlar va ijodiy g'oyalar haqida gaplashamiz! 🌟`,
          provider: 'safety-filter',
        });
      }
    }

    // Fallback zanjiri: 1. DeepSeek → 2. Gemini → 3. Groq → 4. KIE AI
    let reply: string;
    let provider: string;

    try {
      reply = await callDeepSeek(messages);
      provider = 'deepseek';
    } catch (deepseekError) {
      console.warn('DeepSeek failed, trying Gemini:', deepseekError);
      try {
        reply = await callGemini(messages);
        provider = 'gemini';
      } catch (geminiError) {
        console.warn('Gemini failed, trying Groq:', geminiError);
        try {
          reply = await callGroq(messages);
          provider = 'groq';
        } catch (groqError) {
          console.warn('Groq failed, trying KIE AI:', groqError);
          try {
            reply = await callKIE(messages);
            provider = 'kie';
          } catch (kieError) {
            console.error('All 4 AI providers failed:', kieError);
            return NextResponse.json({
              reply: `Kechirasiz, hozirda AI xizmati vaqtincha ishlamayapti. Iltimos, qayta urinib ko'ring.`,
              provider: 'fallback',
            });
          }
        }
      }
    }

    return NextResponse.json({ reply, provider });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
