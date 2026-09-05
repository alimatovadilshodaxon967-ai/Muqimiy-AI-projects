import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const ELEVENLABS_VOICE_MAP: Record<string, string> = {
  'mohira': 'EXAVITQu4vr4xnSDxMaL', // Bella - Soft, warm, pleasant female voice
  'mohira-ai': 'EXAVITQu4vr4xnSDxMaL',
  'female': 'EXAVITQu4vr4xnSDxMaL',
  'amir-temur': 'pNInz6obpgDQGcFmaJgB', // Adam - Deep, commanding, regal
  'alisher-navoiy': 'JBFqnCBsd6RMkjVDRZzb', // George - Warm, poetic, wise
  'mirzo-ulugbek': 'onwK4e9ZLuTAKqWW03F9', // Daniel - Clear, scientific, authoritative
  'mahmudxoja-behbudiy': 'ErXwobaYiN019PkySvjV', // Antoni - Resolute, energetic reformer
  'abdulla-avloniy': 'nPczCjzI2devNBz1zQrb', // Brian - Wise educator, empathetic
};

async function synthesizeElevenLabs(text: string, figureOrVoiceId?: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_6a69c04ce21c8204d2ecb33120f4b736d5343fc1d6844c36';
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const voiceId = (figureOrVoiceId && ELEVENLABS_VOICE_MAP[figureOrVoiceId]) 
    || (figureOrVoiceId && figureOrVoiceId.length > 10 ? figureOrVoiceId : null)
    || 'pNInz6obpgDQGcFmaJgB';

  const cleanText = text
    .replace(/[\u{1F600}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*/g, '')
    .trim();

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
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

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs TTS failed: ${response.status} - ${err}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:audio/mp3;base64,${buffer.toString('base64')}`;
}

async function synthesizeEdgeTTS(text: string, voice?: string, figureId?: string, rate?: string, pitch?: string): Promise<string> {
  const isFemale = voice?.toLowerCase().includes('madina') || voice?.toLowerCase().includes('female') || figureId === 'mohira' || figureId === 'mohira-ai' || figureId === 'female';
  const selectedVoice = voice || (isFemale ? 'uz-UZ-MadinaNeural' : 'uz-UZ-SardorNeural');
  const selectedRate = rate || (isFemale ? '+2%' : '+0%');
  const selectedPitch = pitch || (isFemale ? '+1Hz' : '+0Hz');

  const tts = new MsEdgeTTS();
  await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(text, { rate: selectedRate, pitch: selectedPitch });

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    audioStream.on('data', (chunk: any) => {
      if (chunk instanceof Buffer) chunks.push(chunk);
    });
    audioStream.on('end', () => resolve());
    audioStream.on('error', (err: any) => reject(err));
  });

  const audioBuffer = Buffer.concat(chunks);
  return `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, figureId, voice, rate, pitch } = body as {
      text: string;
      figureId?: string;
      voice?: string;
      rate?: string;
      pitch?: string;
    };

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // 1. First priority: Ultra-realistic ElevenLabs neural voice
    try {
      const audioBase64 = await synthesizeElevenLabs(text, figureId || voice);
      return NextResponse.json({
        status: 'success',
        provider: 'elevenlabs',
        audioBase64,
      });
    } catch (elevenErr) {
      console.warn('ElevenLabs TTS failed, falling back to Microsoft Edge Neural:', elevenErr);
      
      // 2. Second priority: Free, reliable Microsoft Edge Neural Uzbek TTS (Madina for female, Sardor for male)
      const audioBase64 = await synthesizeEdgeTTS(text, voice, figureId, rate, pitch);
      return NextResponse.json({
        status: 'success',
        provider: 'edge-tts',
        audioBase64,
      });
    }
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'TTS xizmati xatolikka uchradi', details: String(error) },
      { status: 500 }
    );
  }
}
