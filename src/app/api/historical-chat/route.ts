import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

interface HistoricalChatBody {
  figureId: string;
  message: string;
  userName?: string;
  userAge?: number;
}

const HISTORICAL_PERSONAS: Record<string, {
  name: string;
  title: string;
  voice: string;
  rate: string;
  pitch: string;
  prompt: string;
}> = {
  'amir-temur': {
    name: 'Amir Temur',
    title: 'Sohibqiron, Buyuk Sarkarda va Davlat Arbobi',
    voice: 'uz-UZ-SardorNeural',
    rate: '-3%',
    pitch: '-3Hz',
    prompt: `Sen buyuk Sohibqiron Amir Temursan (1336-1405).
Muloqot uslubing: Salobatli, qudratli, adolatparvar, dono va vatanparvar sarkarda ruhiyatida.
Asosiy shioring: "Kuch — adolatdadir!".
Mavzular: Temur tuzuklari, davlat boshqaruvi, bunyodkorlik, mardlik, adolat, Samarqand va Sohibqironlik tarixi, yoshlarga vasiyat.
Qoidalar:
- O'zingni doimo "Men Amir Temur..." yoki "Ey aziz avlodim..." deb birinchi shaxsda tut.
- O'zbek tilida dona-dona, salobatli va ta'sirli qilib 2-3 ta jumlada gapir.
- Hech qanday yulduzcha (*) yoki formatlash belgilarini ishlatma.`,
  },
  'alisher-navoiy': {
    name: 'Alisher Navoiy',
    title: 'Hazrat, Buyuk Shoir, Mutafakkir va Davlat Arbobi',
    voice: 'uz-UZ-SardorNeural',
    rate: '-2%',
    pitch: '+0Hz',
    prompt: `Sen turkiy til va adabiyot quyoshi, buyuk mutafakkir Hazrat Mir Alisher Navoiysan (1441-1501).
Muloqot uslubing: Behad dono, muloyim, go'zal adabiy tilda so'zlovchi, mehr-oqibat va ma'rifat kuychisi.
Mavzular: "Xamsa" dostonlari, g'azallar, turkiy tilning boyligi ("Muhokamat ul-lug'atayn"), ilm-axloq, insoniylik, Hirot va Samarqand madaniyati.
Qoidalar:
- Birinchi shaxsda ("Men faqir Alisher Navoiy...", "Ey ilm tolibi...") gapir.
- So'zlaring nihoyatda chiroyli, hikmatli va she'riy nafosat bilan to'lib-toshsin.
- 2-3 ta jumlada lo'nda va ta'sirchan javob ber. Hech qanday yulduzcha (*) ishlatma.`,
  },
  'mirzo-ulugbek': {
    name: "Mirzo Ulug'bek",
    title: 'Buyuk Astronom, Matematik Olim va Samarqand Hukmdori',
    voice: 'uz-UZ-SardorNeural',
    rate: '+0%',
    pitch: '+0Hz',
    prompt: `Sen buyuk astronom, alloma va Samarqand hukmdori Mirzo Ulug'beksan (1394-1449).
Muloqot uslubing: Ilmiy tafakkurga boy, qiziquvchan, yoshlarni koinot sirlari va aniq fanlarni o'rganishga chorlovchi donishmand.
Mavzular: Samarqand rasadxonasi, "Ziji Jadidi Ko'ragoniy" (1018 ta yulduz jadvali), matematika, geometriya, ta'lim va akademiyalar.
Qoidalar:
- Birinchi shaxsda ("Men Mirzo Ulug'bek...", "Ilm nuri bilan...") gapir.
- Koinot, yulduzlar va fan qadrini sodda va ilhomlantiruvchi tarzda tushuntir.
- 2-3 ta jumlada javob ber. Formatlash yulduzchalarini (*) ishlatma.`,
  },
  'mahmudxoja-behbudiy': {
    name: "Mahmudxo'ja Behbudiy",
    title: "Jadidchilik Harakati Asoschisi, Ma'rifatparvar va Alloma",
    voice: 'uz-UZ-SardorNeural',
    rate: '+1%',
    pitch: '+1Hz',
    prompt: `Sen Turkiston jadidchilik harakatining otasi, ulug' ma'rifatparvar Mahmudxo'ja Behbudiysan (1875-1919).
Muloqot uslubing: Qat'iyatli, millatni uyg'otuvchi, ma'rifat, yangi usul maktablari va mustaqil taraqqiyot tarafdori.
Mavzular: "Oyina" jurnali, "Samarqand" gazetasi, "Padarkush" dramasi, "Ikki emas, to'rt til lozim" g'oyasi, milliy ozodlik va zamonaviy ilm-fan.
Qoidalar:
- Birinchi shaxsda ("Men Mahmudxo'ja Behbudiy...", "Millatimiz bolalari...") gapir.
- Yoshlarni bir nechta chet tillarini o'rganishga, zamonaviy kasblar va matbuotga chorla.
- 2-3 ta jumlada javob ber. Hech qanday yulduzcha (*) ishlatma.`,
  },
  'abdulla-avloniy': {
    name: 'Abdulla Avloniy',
    title: 'Jadidchi Pedagog, Adib, Jamoat Arbobi',
    voice: 'uz-UZ-SardorNeural',
    rate: '+1%',
    pitch: '+1Hz',
    prompt: `Sen buyuk jadid pedagogi, adib va shoir Abdulla Avloniysan (1878-1934).
Muloqot uslubing: Mehribon ustoz, chuqur tarbiyachi va ma'rifat kuychisi.
Asosiy shioring: "Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir!".
Mavzular: "Turkiy Guliston yoxud Axloq", yangi usul maktablari, teatr, bolalar tarbiyasi va ilm yo'li.
Qoidalar:
- Birinchi shaxsda ("Men Abdulla Avloniy...", "Muallim sifatida sizga aytamanki...") gapir.
- Yoshlarga odob-axloq, kitob o'qish va ma'rifat haqida samimiy o'git ber.
- 2-3 ta jumlada javob ber. Hech qanday yulduzcha (*) ishlatma.`,
  },
};

function cleanAsterisks(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*/g, '');
}

// 1. Groq
async function callGroq(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.75,
    }),
  });

  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  return cleanAsterisks(data.choices?.[0]?.message?.content || '');
}

// 2. DeepSeek
async function callDeepSeek(systemPrompt: string, userMessage: string): Promise<string> {
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
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.75,
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek error: ${response.status}`);
  const data = await response.json();
  return cleanAsterisks(data.choices?.[0]?.message?.content || '');
}

// 3. Gemini
async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.75 },
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  return cleanAsterisks(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
}

export async function POST(request: NextRequest) {
  try {
    const body: HistoricalChatBody = await request.json();
    const { figureId, message, userName = 'Farhodjon', userAge = 23 } = body;

    if (!figureId || !message) {
      return NextResponse.json({ error: 'figureId and message are required' }, { status: 400 });
    }

    const persona = HISTORICAL_PERSONAS[figureId];
    if (!persona) {
      return NextResponse.json({ error: `Unknown figureId: ${figureId}` }, { status: 400 });
    }

    const systemPrompt = `${persona.prompt}\n\nFoydalanuvchi ismi: ${userName}, yoshi: ${userAge}.`;

    // Try AI providers with fallback chain
    let reply: string;

    try {
      reply = await callGroq(systemPrompt, message);
    } catch {
      try {
        reply = await callDeepSeek(systemPrompt, message);
      } catch {
        try {
          reply = await callGemini(systemPrompt, message);
        } catch {
          reply = `Assalomu alaykum ${userName}! Men ${persona.name}man. Bergan savolingiz juda o'rinli — ilm, adolat va tarbiya yo'lida sobitqadam bo'lsangiz, barcha maqsadlaringizga erishasiz!`;
        }
      }
    }

    // Generate Ultra-Realistic Audio (ElevenLabs first, then Edge TTS fallback)
    let audioBase64: string | null = null;
    const cleanText = reply.replace(/\*/g, '').replace(/#/g, '').trim();

    // 1. Try ElevenLabs
    const elevenApiKey = process.env.ELEVENLABS_API_KEY || 'sk_6a69c04ce21c8204d2ecb33120f4b736d5343fc1d6844c36';
    const elevenVoiceMap: Record<string, string> = {
      'amir-temur': 'pNInz6obpgDQGcFmaJgB',
      'alisher-navoiy': 'JBFqnCBsd6RMkjVDRZzb',
      'mirzo-ulugbek': 'onwK4e9ZLuTAKqWW03F9',
      'mahmudxoja-behbudiy': 'ErXwobaYiN019PkySvjV',
      'abdulla-avloniy': 'nPczCjzI2devNBz1zQrb',
    };

    try {
      const voiceId = elevenVoiceMap[figureId] || 'pNInz6obpgDQGcFmaJgB';
      const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenApiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.85,
            style: 0.40,
            use_speaker_boost: true,
          },
        }),
      });

      if (elevenRes.ok) {
        const arrayBuf = await elevenRes.arrayBuffer();
        audioBase64 = `data:audio/mp3;base64,${Buffer.from(arrayBuf).toString('base64')}`;
      } else {
        throw new Error(`ElevenLabs error: ${elevenRes.status}`);
      }
    } catch (elevenErr) {
      console.warn('ElevenLabs failed in historical chat, falling back to Edge TTS:', elevenErr);
      
      // 2. Edge-TTS fallback
      try {
        const tts = new MsEdgeTTS();
        await tts.setMetadata(persona.voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

        const { audioStream } = tts.toStream(cleanText, { rate: persona.rate, pitch: persona.pitch });

        const chunks: Buffer[] = [];
        await new Promise<void>((resolve, reject) => {
          audioStream.on('data', (chunk: any) => {
            if (chunk instanceof Buffer) chunks.push(chunk);
          });
          audioStream.on('end', () => resolve());
          audioStream.on('error', (err: any) => reject(err));
        });

        const audioBuffer = Buffer.concat(chunks);
        audioBase64 = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;
      } catch (ttsErr) {
        console.error('Edge TTS fallback error:', ttsErr);
      }
    }

    return NextResponse.json({ reply, audioBase64, persona: persona.name });
  } catch (error) {
    console.error('Historical chat API error:', error);
    return NextResponse.json(
      { error: 'Server xatoligi', details: String(error) },
      { status: 500 }
    );
  }
}
