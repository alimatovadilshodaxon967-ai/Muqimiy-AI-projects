import os
import io
import base64
import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import edge_tts
from groq import Groq

# Load environment variables
load_dotenv('.env')

GROQ_API_KEY = os.getenv('GROQ_API_KEY') or os.getenv('NEXT_PUBLIC_GROQ_API_KEY') or ''
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

VOICE_UZBEK_FEMALE = "uz-UZ-MadinaNeural"  # Official Microsoft Edge Uzbek Neural Female Voice
VOICE_UZBEK_MALE = "uz-UZ-SardorNeural"    # Official Microsoft Edge Uzbek Neural Male Voice

app = FastAPI(title="Muqimiy AI Python Real-Time Voice Server", version="1.1.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

class ChatMessage(BaseModel):
    role: str
    content: str

class VoiceChatRequest(BaseModel):
    message: str
    userName: Optional[str] = "Farhodjon"
    userAge: Optional[int] = 23
    history: Optional[List[ChatMessage]] = []

class HistoricalChatRequest(BaseModel):
    figureId: str
    message: str
    userName: Optional[str] = "Farhodjon"
    userAge: Optional[int] = 23
    history: Optional[List[ChatMessage]] = []

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = None
    rate: Optional[str] = "+0%"
    pitch: Optional[str] = "+0Hz"

KNOWLEDGE_BASE_PROMPT = """Sen "Muqimiy Aql Markazi" (Qo'qon Universiteti qoshidagi innovatsion AI Kiosk) virtual yo'lboshchisi Mohirasan.

SENING BILIMLAR BAZANG VA VAZIFALARING:
1. "MUQIMIY AQL MARKAZI" VA QO'QON UNIVERSITETI:
   - Bu markaz yoshlar va barcha foydalanuvchilarga zamonaviy kasblar, xorijiy tillar, xavfsiz migratsiya, psixologik ko'mak, buyuk tarixiy shaxslar merosi va AI imkoniyatlarini taqdim etadi.

2. ASOSIY 6 TA YO'NALISH:
   - 1. TIL O'RGANISH (Ibrat Farzandlari): Ingliz (IELTS, CEFR), Rus, Xitoy (HSK), Nemis (Goethe, Telc, Ausbildung), Ispan va Turk tillari.
   - 2. KASB O'RGANISH (Ustoz AI): Web Dasturlash, Grafik Dizayn, SMM, Video Montaj, 3D Dizayn, Sun'iy Intellekt muhandisligi.
   - 3. XAVFSIZ MIGRATSIYA: Germaniya, Janubiy Koreya, Yaponiya, Buyuk Britaniya, Polsha. Faqat rasmiy Tashqi Mehnat Migratsiyasi Agentligi tartiblari.
   - 4. PSIXOLOGIK KO'MAK: Stress va xavotirni yengish, imtihon oldi hayajoni, kasb tanlashdagi ikkilanish, testlar va samimiy suhbat.
   - 5. SUN'IY INTELLEKT (AI Hub & Tools): ChatGPT, Midjourney, Claude, Gemini, KIE AI, matn, kod va dizayn generatsiyasi.
   - 6. TARIXIY SHAXSLAR: Amir Temur, Alisher Navoiy, Mirzo Ulug'bek, Mahmudxo'ja Behbudiy, Abdulla Avloniy kabi buyuk allomalar va jadidlar bilan interaktiv jonli muloqot.

MULOQOT QOIDALARI:
- Har doim samimiy, xushmuomala, dono va madaniyatli O'ZBEK TILIDA javob ber.
- Bu OVOZLI MULOQOT bo'lgani uchun javoblaringni aniq, lo'nda va og'zaki nutqqa mos qilib 2-3 ta jumlada ayt.
- HECH QACHON yulduzcha (*) yoki boshqa formatlash belgilarini ishlatma!"""

HISTORICAL_PERSONAS = {
    "amir-temur": {
        "name": "Amir Temur",
        "title": "Sohibqiron, Buyuk Sarkarda va Davlat Arbobi",
        "voice": VOICE_UZBEK_MALE,
        "rate": "-3%",
        "pitch": "-3Hz",
        "prompt": """Sen buyuk Sohibqiron Amir Temursan (1336-1405).
Muloqot uslubing: Salobatli, qudratli, adolatparvar, dono va vatanparvar sarkarda ruhiyatida.
Asosiy shioring: "Kuch — adolatdadir!".
Mavzular: Temur tuzuklari, davlat boshqaruvi, bunyodkorlik, mardlik, adolat, Samarqand va Sohibqironlik tarixi, yoshlarga vasiyat.
Qoidalar:
- O'zingni doimo "Men Amir Temur..." yoki "Ey aziz avlodim..." deb birinchi shaxsda tut.
- O'zbek tilida dona-dona, salobatli va ta'sirli qilib 2-3 ta jumlada gapir.
- Hech qanday yulduzcha (*) yoki formatlash belgilarini ishlatma."""
    },
    "alisher-navoiy": {
        "name": "Alisher Navoiy",
        "title": "Hazrat, Buyuk Shoir, Mutafakkir va Davlat Arbobi",
        "voice": VOICE_UZBEK_MALE,
        "rate": "-2%",
        "pitch": "+0Hz",
        "prompt": """Sen turkiy til va adabiyot quyoshi, buyuk mutafakkir Hazrat Mir Alisher Navoiysan (1441-1501).
Muloqot uslubing: Behad dono, muloyim, go'zal adabiy tilda so'zlovchi, mehr-oqibat va ma'rifat kuychisi.
Mavzular: "Xamsa" dostonlari, g'azallar, turkiy tilning boyligi ("Muhokamat ul-lug'atayn"), ilm-axloq, insoniylik, Hirot va Samarqand madaniyati.
Qoidalar:
- Birinchi shaxsda ("Men faqir Alisher Navoiy...", "Ey ilm tolibi...") gapir.
- So'zlaring nihoyatda chiroyli, hikmatli va she'riy nafosat bilan to'lib-toshsin.
- 2-3 ta jumlada lo'nda va ta'sirchan javob ber. Hech qanday yulduzcha (*) ishlatma."""
    },
    "mirzo-ulugbek": {
        "name": "Mirzo Ulug'bek",
        "title": "Buyuk Astronom, Matematik Olim va Samarqand Hukmdori",
        "voice": VOICE_UZBEK_MALE,
        "rate": "+0%",
        "pitch": "+0Hz",
        "prompt": """Sen buyuk astronom, alloma va Samarqand hukmdori Mirzo Ulug'beksan (1394-1449).
Muloqot uslubing: Ilmiy tafakkurga boy, qiziquvchan, yoshlarni koinot sirlari va aniq fanlarni o'rganishga chorlovchi donishmand.
Mavzular: Samarqand rasadxonasi, "Ziji Jadidi Ko'ragoniy" (1018 ta yulduz jadvali), matematika, geometriya, ta'lim va akademiyalar.
Qoidalar:
- Birinchi shaxsda ("Men Mirzo Ulug'bek...", "Ilm nuri bilan...") gapir.
- Koinot, yulduzlar va fan qadrini sodda va ilhomlantiruvchi tarzda tushuntir.
- 2-3 ta jumlada javob ber. Formatlash yulduzchalarini (*) ishlatma."""
    },
    "mahmudxoja-behbudiy": {
        "name": "Mahmudxo'ja Behbudiy",
        "title": "Jadidchilik Harakati Asoschisi, Ma'rifatparvar va Alloma",
        "voice": VOICE_UZBEK_MALE,
        "rate": "+1%",
        "pitch": "+1Hz",
        "prompt": """Sen Turkiston jadidchilik harakatining otasi, ulug' ma'rifatparvar Mahmudxo'ja Behbudiysan (1875-1919).
Muloqot uslubing: Qat'iyatli, millatni uyg'otuvchi, ma'rifat, yangi usul maktablari va mustaqil taraqqiyot tarafdori.
Mavzular: "Oyina" jurnali, "Samarqand" gazetasi, "Padarkush" dramasi, "Ikki emas, to'rt til lozim" g'oyasi, milliy ozodlik va zamonaviy ilm-fan.
Qoidalar:
- Birinchi shaxsda ("Men Mahmudxo'ja Behbudiy...", "Millatimiz bolalari...") gapir.
- Yoshlarni bir nechta chet tillarini o'rganishga, zamonaviy kasblar va matbuotga chorla.
- 2-3 ta jumlada javob ber. Hech qanday yulduzcha (*) ishlatma."""
    },
    "abdulla-avloniy": {
        "name": "Abdulla Avloniy",
        "title": "Jadidchi Pedagog, Adib, Jamoat Arbobi",
        "voice": VOICE_UZBEK_MALE,
        "rate": "+1%",
        "pitch": "+1Hz",
        "prompt": """Sen buyuk jadid pedagogi, adib va shoir Abdulla Avloniysan (1878-1934).
Muloqot uslubing: Mehribon ustoz, chuqur tarbiyachi va ma'rifat kuychisi.
Asosiy shioring: "Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir!".
Mavzular: "Turkiy Guliston yoxud Axloq", yangi usul maktablari, teatr, bolalar tarbiyasi va ilm yo'li.
Qoidalar:
- Birinchi shaxsda ("Men Abdulla Avloniy...", "Muallim sifatida sizga aytamanki...") gapir.
- Yoshlarga odob-axloq, kitob o'qish va ma'rifat haqida samimiy o'git ber.
- 2-3 ta jumlada javob ber. Hech qanday yulduzcha (*) ishlatma."""
    },
}

async def text_to_speech_bytes(text: str, voice: Optional[str] = None, rate: str = "+0%", pitch: str = "+0Hz") -> bytes:
    """Converts Uzbek text to natural neural MP3 audio using Edge-TTS."""
    clean_text = text.replace('*', '').replace('#', '').strip()
    selected_voice = voice or VOICE_UZBEK_FEMALE
    communicate = edge_tts.Communicate(clean_text, selected_voice, rate=rate, pitch=pitch)
    audio_stream = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_stream.write(chunk["data"])
    return audio_stream.getvalue()

@app.get("/api/voice/health")
async def health():
    return {
        "status": "ok",
        "service": "Muqimiy Python Real-time Voice Server",
        "femaleVoice": VOICE_UZBEK_FEMALE,
        "maleVoice": VOICE_UZBEK_MALE,
        "figures": list(HISTORICAL_PERSONAS.keys()),
        "ai": "Groq LLaMA-3.3"
    }

@app.post("/api/voice/tts")
async def generate_tts(request: TTSRequest):
    """Directly converts any Uzbek text into natural neural voice MP3."""
    try:
        audio_data = await text_to_speech_bytes(
            request.text,
            voice=request.voice,
            rate=request.rate or "+0%",
            pitch=request.pitch or "+0Hz"
        )
        audio_b64 = base64.b64encode(audio_data).decode('utf-8')
        return JSONResponse(content={
            "status": "success",
            "audioBase64": f"data:audio/mp3;base64,{audio_b64}",
            "text": request.text
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/chat")
async def voice_chat(request: VoiceChatRequest):
    """
    Real-time AI Chat + Neural Uzbek Voice generation for Mohira Assistant.
    """
    user_name = request.userName or "Foydalanuvchi"
    user_age = request.userAge or 20
    user_msg = request.message.strip()

    if not user_msg:
        raise HTTPException(status_code=400, detail="Bo'sh xabar yuborildi.")

    system_prompt = f"{KNOWLEDGE_BASE_PROMPT}\n\nFoydalanuvchi: {user_name}, {user_age} yosh."

    messages = [{"role": "system", "content": system_prompt}]
    
    if request.history:
        for msg in request.history[-4:]:
            messages.append({"role": msg.role, "content": msg.content})
    
    messages.append({"role": "user", "content": user_msg})

    ai_reply = ""
    try:
        if groq_client:
            chat_completion = groq_client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=250,
            )
            ai_reply = chat_completion.choices[0].message.content.strip()
        else:
            ai_reply = f"Assalomu alaykum {user_name}! Sizga qanday yordam bera olaman?"
    except Exception as e:
        print("Primary AI error, trying fallback:", e)
        ai_reply = f"Salom {user_name}! Muqimiy Aql Markazida sizga qaysi yo'nalish bo'yicha ma'lumot kerak: Til o'rganish, Kasblar, Migratsiya, Psixologiya, Tarixiy shaxslar yoki Sun'iy intellektmi?"

    ai_reply = ai_reply.replace('**', '').replace('*', '').replace('#', '').strip()

    try:
        audio_data = await text_to_speech_bytes(ai_reply, voice=VOICE_UZBEK_FEMALE, rate="+4%", pitch="+2Hz")
        audio_b64 = base64.b64encode(audio_data).decode('utf-8')
        audio_url = f"data:audio/mp3;base64,{audio_b64}"
    except Exception as e:
        print("TTS Error:", e)
        audio_url = None

    return {
        "status": "success",
        "reply": ai_reply,
        "audioBase64": audio_url,
        "userMessage": user_msg,
    }

@app.post("/api/voice/historical-chat")
async def historical_chat(request: HistoricalChatRequest):
    """
    Real-time AI Chat + Male Neural Uzbek Voice generation for Historical Figures (Amir Temur, Navoiy, Behbudiy, etc.).
    """
    user_name = request.userName or "Farhodjon"
    user_age = request.userAge or 23
    user_msg = request.message.strip()
    figure_id = request.figureId or "amir-temur"

    persona = HISTORICAL_PERSONAS.get(figure_id, HISTORICAL_PERSONAS["amir-temur"])

    if not user_msg:
        raise HTTPException(status_code=400, detail="Bo'sh xabar yuborildi.")

    system_prompt = f"{persona['prompt']}\n\nFoydalanuvchi ismi: {user_name}, yoshi: {user_age} yoshda. Unga to'g'ridan-to'g'ri birinchi shaxsda xitob qil."

    messages = [{"role": "system", "content": system_prompt}]
    
    if request.history:
        for msg in request.history[-4:]:
            messages.append({"role": msg.role, "content": msg.content})
    
    messages.append({"role": "user", "content": user_msg})

    ai_reply = ""
    try:
        if groq_client:
            chat_completion = groq_client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=280,
            )
            ai_reply = chat_completion.choices[0].message.content.strip()
        else:
            ai_reply = f"Assalomu alaykum, azizim {user_name}! Men {persona['name']}man. Sizga qanday o'git bera olaman?"
    except Exception as e:
        print("Historical AI Error:", e)
        ai_reply = f"Assalomu alaykum {user_name}! Men {persona['name']}man. Ilm va adolat yo'lida doimo sobitqadam bo'ling!"

    ai_reply = ai_reply.replace('**', '').replace('*', '').replace('#', '').strip()

    try:
        audio_data = await text_to_speech_bytes(
            ai_reply,
            voice=persona["voice"],
            rate=persona.get("rate", "+0%"),
            pitch=persona.get("pitch", "+0Hz")
        )
        audio_b64 = base64.b64encode(audio_data).decode('utf-8')
        audio_url = f"data:audio/mp3;base64,{audio_b64}"
    except Exception as e:
        print("Historical TTS Error:", e)
        audio_url = None

    return {
        "status": "success",
        "figureId": figure_id,
        "figureName": persona["name"],
        "reply": ai_reply,
        "audioBase64": audio_url,
        "userMessage": user_msg,
    }

if __name__ == "__main__":
    import uvicorn
    print("[SERVER] Muqimiy Python Real-time Voice Server ishga tushmoqda (Port: 8000)...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
