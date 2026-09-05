# MUQIMIY “AQL MARKAZI” — PUBLIC DIGITAL SERVICE KIOSK PLATFORM

**Slogan:** *“Bir maskan — bilim, kasb, til, ko‘mak va zamonaviy AI imkoniyatlari.”*

**Joylashuv:** Qo‘qon shahri, Muqimiy mahallasi.  
**Fizik format:** 4 ta Touchscreen All-in-One (1920×1080) kiosk terminallari.

---

## 🌟 LOYIHA HAQIDA

Muqimiy “Aql Markazi” platformasi — mahalla fuqarolari uchun mo‘ljallangan, sun’iy intellekt (AI) bilan jihozlangan raqamli davlat va ta’lim xizmatlari kiosk platformasidir. Foydalanuvchilar bitta sodda va sensorli interfeys orqali quyidagi 5 ta asosiy yo‘nalishdan foydalanishlari mumkin:

1. **🌐 Til O‘rganish Moduli** (Ingliz, Rus, Xitoy, Nemis tili + "Ibrat Farzandlari" integratsiyasi)
2. **💼 Kasb O‘rganish Moduli** (Dasturlash, Grafik dizayn, SMM, AI + "Ustoz AI" integratsiyasi)
3. **✈️ Migratsiya Moduli** (Rasmiy manbalarga ulangan xorijda o‘qish/ishlash yo‘riqnomasi + AI Assistant)
4. **💬 Psixologik Ko‘mak Moduli** (Ehtiyotkor AI muloqoti, maxfiy testlar va inson mutaxassisiga yo‘naltirish)
5. **🤖 AI Bilan Ochiq Muloqot Hub** (Ochiq AI Chat, Ovozli navigatsiya va AI Tools katalogi)

---

## 📐 ASOSIY TAMOYILLAR VA UX

- **“Bitta ekran — beshta yo‘nalish”** printsiplari bo‘yicha qurilgan touchscreen-first interfeys.
- **Katta sensorli tugmalar** (minimum 48-64px+ touch targets).
- **Ovozli navigatsiya va ovozli muloqot** (Web Speech API STT/TTS).
- **Yosh guruhlariga moslashtirish:** 7–12 (Child Safe Mode), 13–17 (O‘smirlar), 18–24 (Yoshlar), 25–35, 36–50, 50+.
- **Avtomatik sessiya tozalanishi:** 5 daqiqa faoliyatsizlikda avtomatik sessiya yopiladi va barcha shaxsiy ma’lumotlar tozalanadi.
- **4 ta Terminal Monitoringi (Admin Panel):** Terminal 1..4 bo‘yicha real-vaqt rejimida monitoring (Online/Idle/Offline).

---

## 🛠️ TEXNOLOGIK STACK

| Layer | Texnologiya |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router, TypeScript, React 19) |
| **Styling** | Tailwind CSS v4 + Custom Design System |
| **Icons** | Lucide React |
| **Voice Interface** | Web Speech API (Uzbek STT/TTS) |
| **AI Integration** | Provider Pattern (Demo Mode / OpenAI / Gemini) |
| **State & Session** | React Context + SessionStorage isolation |

---

## 🚀 ISHGA TUSHIRISH VA LOYIHANI YURITISH

### 1. Reformat / O'rnatish
```bash
# Node.js PATH ni sozlash (Lokal portativ Node):
$env:PATH = "C:\nodejs\node-v22.16.0-win-x64;" + $env:PATH

# Qaramliklarni o'rnatish:
npm install
```

### 2. Development Rejimida Ishga Tushirish
```bash
npm run dev
```
Brauzerda oching: [http://localhost:3000](http://localhost:3000)

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🔐 ADMIN PANEL VA KIOSK MODE

- **Admin Login:** `/admin/login`
- **Demo Admin credentials:**
  - **Login:** `admin`
  - **Parol:** `admin123`
- Admin panel orqali 4 ta touchscreen terminal holati ko'rib boriladi, tashqi URL manzillar ("Ibrat Farzandlari", "Ustoz AI") hamda statistika va sozlamalar boshqariladi.

---

## 📋 SAHIFALAR STRUKTURASI (33+ SCREENS)

1. `/` — Splash / Start Screen
2. `/welcome` — User Profile (Ism va Yosh kiritish)
3. `/greeting` — Personalized AI Greeting
4. `/dashboard` — Main 5 Directions Dashboard
5. `/language` — Language Hub
6. `/career` — Career Hub
7. `/migration` — Migration Hub
8. `/migration/assistant` — Migration AI Assistant
9. `/psychology` — Psychology Hub
10. `/psychology/chat` — Psychology AI Chat
11. `/psychology/test` — Psychology Evaluation Test
12. `/ai` — AI Hub
13. `/ai/chat` — Open AI Chat
14. `/ai/tools` — AI Tools Catalog
15. `/session-end` — Session Data Cleanup
16. `/admin/login` — Admin Login
17. `/admin` — Admin Dashboard & Terminal Monitoring
