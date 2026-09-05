export type Language = 'UZ' | 'RU' | 'EN';

export const translations = {
  UZ: {
    // Header & Nav
    back: 'ORQAGA',
    home: 'BOSH SAHIFA',
    help: 'YORDAM',
    endSession: 'YAKUNLASH',
    headerBrand: 'MUQIMIY AQL MARKAZI',
    profileTitle: 'Profil Yaratish',
    greetingTitle: 'Xush Kelibsiz',
    dashboardTitle: 'Asosiy Dashboard',
    category: 'Kategoriya',
    yearsOld: 'yosh',
    
    // Help Modal
    helpModalTitle: 'Sizga yordam kerakmi?',
    helpModalDesc: 'Markazimiz xodimi har doim ko\'mak berishga tayyor. Shuningdek, ekraningizdagi ovozli ko\'rsatmalarni tinglashingiz mumkin.',
    operator: 'Markaz operatori:',
    dutyStaff: 'Muqimiy Aql Markazi navbatchisi',
    understandClose: 'TUSHUNDIM / YOPISH',

    // Exit Confirm Modal
    exitConfirmTitle: 'Sessiyani yakunlaysizmi?',
    exitConfirmDesc: 'Barcha kiritilgan vaqtinchalik ma\'lumotlaringiz qurilmadan xavfsiz tozalanadi.',
    cancel: 'BEKOR QILISH',
    confirmExit: 'YAKUNLASH',

    // Welcome / Profile Page
    welcomeBadge: 'Aql Markaziga Xush Kelibsiz!',
    welcomeHeading: 'Sizga mos xizmatlarni tavsiya qilishimiz uchun ma’lumotlaringizni kiriting',
    welcomeSubheading: 'Tizim yoshingizga mos raqamli tavsiyalarni avtomatik tayyorlaydi.',
    nameLabel: 'Ismingiz:',
    namePlaceholder: 'Masalan: Dilshod, Anvar...',
    ageLabel: 'Yoshingiz:',
    agePlaceholder: 'Masalan: 22',
    genderLabel: 'Jinsingiz:',
    genderOptional: '(ixtiyoriy)',
    male: 'Erkak',
    female: 'Ayol',
    quickAgeTitle: 'Tezkor yosh tanlash:',
    quickAges: [
      { label: '7-12 yosh (Bolalar)', value: 10 },
      { label: '13-17 yosh (O‘smirlar)', value: 15 },
      { label: '18-24 yosh (Yoshlar)', value: 20 },
      { label: '25-35 yosh', value: 28 },
      { label: '36-50 yosh', value: 42 },
      { label: '50+ yosh', value: 55 },
    ],
    errorName: 'Iltimos, ismingizni kiriting',
    errorAge: 'Iltimos, yoshingizni to‘g‘ri kiriting (5 - 100 yosh)',
    validCheck: 'To‘g‘ri',
    continueBtn: 'DAVOM ETISH',

    // Greeting Page
    greetingHello: 'Salom',
    greetingSubtitle: 'Aql Markazimizga xush kelibsiz. Siz uchun 5 ta asosiy raqamli yo\'nalishimiz shay holatda!',
    greetingVoice: 'Salom, {name}! Sizga qanday yordam berishimiz mumkin? Yoshingizga mos raqamli xizmatlar tayyor.',
    goToDashboard: 'ASOSIY DASHBOARDGA O\'TISH',

    // Dashboard Page
    dashWelcome: 'Salom, {name}!',
    dashInstruction: 'Istalgan bo‘limni tanlash uchun ekrandagi katta tugmani bosing.',
    rec_7_12: 'Bolalar uchun: Til o‘rganish va AI bilan ijod qilish tavsiya etiladi!',
    rec_13_17: 'O‘smirlar uchun: Zamonaviy kasblar, IT va til o‘rganish bo‘limlari mos keladi!',
    rec_18_24: 'Yoshlar va kattalar uchun: Kasb o‘rganish, migratsiya yo‘riqnomalari va AI imkoniyatlari!',
    rec_default: 'Siz uchun barcha 5 ta yo‘nalish va bepul ta’limiy resurslar ochiq!',
    
    // 5 Directions
    dir1_title: '1. TIL O‘RGANISH',
    dir1_desc: 'Xorijiy tillarni o‘rganing (Ingliz, Rus, Xitoy, Nemis)',
    dir1_badge: 'Ibrat Farzandlari',

    dir2_title: '2. KASB O‘RGANISH',
    dir2_desc: 'Zamonaviy kasblarni egallang (IT, Dizayn, SMM, AI)',
    dir2_badge: 'Ustoz AI',

    dir3_title: '3. MIGRATSIYA',
    dir3_desc: 'Xorijga chiqishdan oldin kerakli rasmiy ma’lumotlarni oling',
    dir3_badge: 'Rasmiy Manba',

    dir4_title: '4. PSIXOLOGIK KO‘MAK',
    dir4_desc: 'Suhbatlashing, testlardan o‘ting va tavsiyalar oling',
    dir4_badge: 'Ehtiyotkor AI',

    dir5_title: '5. AI MULOQOT',
    dir5_desc: 'AI imkoniyatlaridan va AI Tools katalogidan foydalaning',
    dir5_badge: 'AI Hub',

    dir6_title: '6. TARIXIY SHAXSLAR',
    dir6_desc: 'Buyuk allomalar va jadidlar bilan interaktiv jonli muloqot',
    dir6_badge: 'Buyuk Siymolar',

    // History Hub Page
    historyModuleTitle: 'Tarixiy Shaxslar Moduli',
    historyBadge: '6-BO\'LIM: BUYUK AJDODLAR VA JADIDLAR',
    historyHeading: 'Buyuk Ajdodlarimizning Jonli Merosi',
    historySubheading: 'Tarixiy shaxsni tanlang va qiziqarli mavzular bo\'yicha uning jonli hikoyasini tinglang',
    selectFigure: 'Tarixiy shaxsni tanlang:',
    askVoiceQuestion: 'Ovoz orqali savol berish',
    replaySpeech: 'Qayta eshitish',
    stopSpeech: 'To\'xtatish',
    instantTopicsTitle: 'Mavzuni tanlang (Avatar gapirishni boshlaydi):',
    figureSpeaking: 'gapirmoqda...',
    figureListening: 'Sizni eshitmoqda, gapiring...',
    figureThinking: 'Javob tayyorlamoqda...',
    figureIdle: 'Suhbatga shay',


    // Language Hub Page
    langModuleTitle: 'Til O\'rganish Moduli',
    langSectionBadge: '1-BO\'LIM: XORIJIY TILLAR',
    langMainHeading: 'Chet Tillarini Behad O\'rganing',
    langSubHeading: 'O\'zingizga kerakli til va darajani tanlang',
    levelsCount: 'ta daraja',
    availableLevels: 'Mavjud Darajalar:',
    coveredAreas: 'Qamrab Olingan Yo\'nalishlar:',
    ibratProject: '"Ibrat Farzandlari" Rasmiy Loyihasi',
    ibratDesc: 'Bepul va sifatli til darslarini rasmiy platformada davom ettiring.',
    ibratBtn: 'IBRAT FARZANDLARI ORQALI O\'RGANISH',

    // Career Hub Page
    careerModuleTitle: 'Kasb O\'rganish Moduli',
    careerSectionBadge: '2-BO\'LIM: ZAMONAVIY KASBLAR',
    careerHeading: 'Kelajak Kasblarini Egallang',
    careerSubheading: 'O\'zingizga mos bo\'lgan zamonaviy sohani tanlang',
    requiredSkills: 'Talab qilinadigan ko\'nikmalar:',
    ustozAi: '"Ustoz AI" Onlayn Ta\'lim Platformasi',
    ustozDesc: 'Bepul interaktiv darslar va amaliy mashg\'ulotlar.',
    startLearning: 'DARS KURSINI BOSHLASH',

    // Migration Hub Page
    migrationModuleTitle: 'Rasmiy Migratsiya Yo\'riqnomasi',
    migrationBadge: '3-BO\'LIM: MEHNAT MIGRATSIYASI VA TA\'LIM',
    migrationHeading: 'Xorijga Chiqishdan Oldin Rasmiy Ma\'lumotlar',
    migrationSubheading: 'Xavfsiz va qonuniy mehnat hamda ta\'lim yo\'llari',
    tabWork: 'Mehnat Migratsiyasi',
    tabStudy: 'Xorijda Ta\'lim',
    tabLiving: 'Yashash Sharoitlari',
    requiredLang: 'Talab etiladigan til:',
    demandJobs: 'Talab yuqori kasblar:',
    officialLinks: 'Rasmiy Havolalar va Manbalar:',
    officialWarning: 'Diqqat! Faqat rasmiy manbalardan foydalaning va aldanib qolmang.',

    // Psychology Hub Page
    psychModuleTitle: 'Psixologik Ko\'mak Moduli',
    psychBadge: '4-BO\'LIM: RUHIY SALOMATLIK VA QO\'LLAB-QUVVATLASH',
    psychHeading: 'Siz Yolg\'iz Emassiz',
    psychSubheading: 'Maxfiy va samimiy psixologik ko\'mak platformasi',
    aiPsychologist: 'AI Psixolog bilan suhbat',
    aiPsychDesc: '24/7 rejimida anonim va tushunuvchan sun\'iy intellect bilan muloqot qiling.',
    startChat: 'SUHBATNI BOSHLASH',
    confidentialNotice: 'Barcha suhbatlar to\'liq anonim va maxfiy saqlanadi.',

    // AI Hub Page
    aiModuleTitle: 'AI Muloqot va Asboblar',
    aiBadge: '5-BO\'LIM: SUN\'IY INTELLEKT',
    aiHeading: 'Sun\'iy Intellekt Imkoniyatlari',
    aiSubheading: 'AI yordamida savollaringizga javob oling va vazifalarni bajaring',
    openChat: 'Ochiq AI Chat',
    aiToolsCatalog: 'AI Tools Katalogi',
    askAnything: 'Xohlagan savolingizni bering...',
    send: 'YUBORISH',

    // Session End Page
    sessionEndTitle: 'Sessiya Yakunlandi',
    thankYou: 'Rahmat! Tashrifingiz uchun tashakkur.',
    dataCleared: 'Barcha vaqtinchalik ma\'lumotlaringiz xavfsiz tozalandi.',
    backToStart: 'BOSH SAHIFAGA QAYTISH',

    // Start Page
    startBrand: 'MUQIMIY “AQL MARKAZI”',
    startSubBrand: 'Qo‘qon shahri • Innovatsion ta’lim va raqamli xizmatlar platformasi',
    startKioskBadge: 'KIOSK MODE #01 • ONLINE',
    startProjectTitle: 'Raqamli Muqimiy Kiosk Loyihasi',
    startMainTitle1: 'MUQIMIY ',
    startMainTitle2: '“AQL MARKAZI”',
    startMotto: '“Bir maskan — ta’lim, kasb-hunar, chet tillari, migratsiya, psixologik ko‘mak va sun’iy intellekt texnologiyalari.”',
    startButton: 'START / BOSHLASH',
    startInstruction: 'Boshlash uchun ekranga bosing',
  },
  RU: {
    // Header & Nav
    back: 'НАЗАД',
    home: 'ГЛАВНАЯ',
    help: 'ПОМОЩЬ',
    endSession: 'ЗАВЕРШИТЬ',
    headerBrand: 'ЦЕНТР РАЗУМА МУКИМИ',
    profileTitle: 'Создание Профиля',
    greetingTitle: 'Добро пожаловать',
    dashboardTitle: 'Главная Панель',
    category: 'Категория',
    yearsOld: 'лет',

    // Help Modal
    helpModalTitle: 'Вам нужна помощь?',
    helpModalDesc: 'Сотрудник нашего центра всегда готов помочь. Также вы можете прослушать голосовые инструкции на экране.',
    operator: 'Оператор центра:',
    dutyStaff: 'Дежурный Центра Разума Мукими',
    understandClose: 'ПОНЯТНО / ЗАКРЫТЬ',

    // Exit Confirm Modal
    exitConfirmTitle: 'Завершить сессию?',
    exitConfirmDesc: 'Все ваши введенные временные данные будут безопасно удалены с устройства.',
    cancel: 'ОТМЕНА',
    confirmExit: 'ЗАВЕРШИТЬ',

    // Welcome / Profile Page
    welcomeBadge: 'Добро пожаловать в Центр Разума!',
    welcomeHeading: 'Введите ваши данные, чтобы мы могли рекомендовать подходящие услуги',
    welcomeSubheading: 'Система автоматически подготовит цифровые рекомендации в соответствии с вашим возрастом.',
    nameLabel: 'Ваше имя:',
    namePlaceholder: 'Например: Дилшод, Анвар...',
    ageLabel: 'Ваш возраст:',
    agePlaceholder: 'Например: 22',
    genderLabel: 'Ваш пол:',
    genderOptional: '(необязательно)',
    male: 'Мужской',
    female: 'Женский',
    quickAgeTitle: 'Быстрый выбор возраста:',
    quickAges: [
      { label: '7-12 лет (Дети)', value: 10 },
      { label: '13-17 лет (Подростки)', value: 15 },
      { label: '18-24 лет (Молодежь)', value: 20 },
      { label: '25-35 лет', value: 28 },
      { label: '36-50 лет', value: 42 },
      { label: '50+ лет', value: 55 },
    ],
    errorName: 'Пожалуйста, введите ваше имя',
    errorAge: 'Пожалуйста, укажите корректный возраст (5 - 100 лет)',
    validCheck: 'Верно',
    continueBtn: 'ПРОДОЛЖИТЬ',

    // Greeting Page
    greetingHello: 'Привет',
    greetingSubtitle: 'Добро пожаловать в наш Центр Разума. Для вас готовы 5 основных цифровых направлений!',
    greetingVoice: 'Привет, {name}! Чем мы можем вам помочь? Цифровые услуги, соответствующие вашему возрасту, готовы.',
    goToDashboard: 'ПЕРЕЙТИ К ГЛАВНОЙ ПАНЕЛИ',

    // Dashboard Page
    dashWelcome: 'Привет, {name}!',
    dashInstruction: 'Нажмите большую кнопку на экране, чтобы выбрать нужный раздел.',
    rec_7_12: 'Для детей: Рекомендуется изучение языков и творчество с ИИ!',
    rec_13_17: 'Для подростков: Подходят современные профессии, IT и изучение языков!',
    rec_18_24: 'Для молодежи и взрослых: Обучение профессиям, инструкции по миграции и возможности ИИ!',
    rec_default: 'Для вас открыты все 5 направлений и бесплатные образовательные ресурсы!',

    // 5 Directions
    dir1_title: '1. ИЗУЧЕНИЕ ЯЗЫКОВ',
    dir1_desc: 'Изучайте иностранные языки (Английский, Русский, Китайский, Немецкий)',
    dir1_badge: 'Ибрат Фарзандлари',

    dir2_title: '2. ОБУЧЕНИЕ ПРОФЕССИЯМ',
    dir2_desc: 'Осваивайте современные профессии (IT, Дизайн, SMM, AI)',
    dir2_badge: 'Устоз AI',

    dir3_title: '3. МИГРАЦИЯ',
    dir3_desc: 'Получите официальную информацию перед выездом за рубеж',
    dir3_badge: 'Официальный Источник',

    dir4_title: '4. ПСИХОЛОГИЧЕСКАЯ ПОМОЩЬ',
    dir4_desc: 'Общайтесь, проходите тесты и получайте рекомендации',
    dir4_badge: 'Заботливый ИИ',

    dir5_title: '5. ОБЩЕНИЕ С ИИ',
    dir5_desc: 'Пользуйтесь возможностями ИИ и каталогом AI Tools',
    dir5_badge: 'AI Hub',

    dir6_title: '6. ИСТОРИЧЕСКИЕ ЛИЧНОСТИ',
    dir6_desc: 'Интерактивный живой диалог с великими мыслителями и джадидами',
    dir6_badge: 'Великие Личности',

    // History Hub Page
    historyModuleTitle: 'Модуль Исторических Личностей',
    historyBadge: 'РАЗДЕЛ 6: ВЕЛИКИЕ ПРЕДКИ И ДЖАДИДЫ',
    historyHeading: 'Живое Наследие Наших Великих Предков',
    historySubheading: 'Выберите историческую личность и слушайте ее живой рассказ по выбранным темам',
    selectFigure: 'Выберите историческую личность:',
    askVoiceQuestion: 'Задать вопрос голосом',
    replaySpeech: 'Слушать снова',
    stopSpeech: 'Остановить',
    instantTopicsTitle: 'Выберите тему (Аватар начнет говорить):',
    figureSpeaking: 'говорит...',
    figureListening: 'Слушает вас, говорите...',
    figureThinking: 'Готовит ответ...',
    figureIdle: 'Готов к беседе',


    // Language Hub Page
    langModuleTitle: 'Модуль Изучения Языков',
    langSectionBadge: 'РАЗДЕЛ 1: ИНОСТРАННЫЕ ЯЗЫКИ',
    langMainHeading: 'Изучайте Иностранные Языки Легко',
    langSubHeading: 'Выберите нужный язык и уровень',
    levelsCount: 'уровней',
    availableLevels: 'Доступные Уровни:',
    coveredAreas: 'Охваченные Направления:',
    ibratProject: 'Официальный Проект "Ибрат Фарзандлари"',
    ibratDesc: 'Продолжайте бесплатные и качественные уроки на официальной платформе.',
    ibratBtn: 'УЧИТЬСЯ ЧЕРЕЗ ИБРАТ ФАРЗАНДЛАРИ',

    // Career Hub Page
    careerModuleTitle: 'Модуль Обучения Профессиям',
    careerSectionBadge: 'РАЗДЕЛ 2: СОВРЕМЕННЫЕ ПРОФЕССИИ',
    careerHeading: 'Освойте Профессии Будущего',
    careerSubheading: 'Выберите подходящее современное направление',
    requiredSkills: 'Требуемые навыки:',
    ustozAi: 'Образовательная Платформа "Ustoz AI"',
    ustozDesc: 'Бесплатные интерактивные уроки и практические занятия.',
    startLearning: 'НАЧАТЬ КУРС УРОКОВ',

    // Migration Hub Page
    migrationModuleTitle: 'Официальный Справочник Миграции',
    migrationBadge: 'РАЗДЕЛ 3: ТРУДОВАЯ МИГРАЦИЯ И ОБУЧЕНИЕ',
    migrationHeading: 'Официальная Информация Перед Поездкой',
    migrationSubheading: 'Безопасные и законные пути трудоустройства и обучения',
    tabWork: 'Трудовая Миграция',
    tabStudy: 'Обучение за Рубежом',
    tabLiving: 'Условия Проживания',
    requiredLang: 'Требуемый язык:',
    demandJobs: 'Востребованные профессии:',
    officialLinks: 'Официальные Ссылки и Источники:',
    officialWarning: 'Внимание! Используйте только официальные источники и не поддавайтесь обману.',

    // Psychology Hub Page
    psychModuleTitle: 'Модуль Психологической Помощи',
    psychBadge: 'РАЗДЕЛ 4: МЕНТАЛЬНОЕ ЗДОРОВЬЕ И ПОДДЕРЖКА',
    psychHeading: 'Вы Не Одиноки',
    psychSubheading: 'Конфиденциальная и искренняя платформа поддержки',
    aiPsychologist: 'Разговор с AI Психологом',
    aiPsychDesc: '24/7 общайтесь с анонимным и понимающим искусственным интеллектом.',
    startChat: 'НАЧАТЬ ДИАЛОГ',
    confidentialNotice: 'Все беседы полностью анонимны и конфиденциальны.',

    // AI Hub Page
    aiModuleTitle: 'Общение с ИИ и Инструменты',
    aiBadge: 'РАЗДЕЛ 5: ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ',
    aiHeading: 'Возможности Искусственного Интеллекта',
    aiSubheading: 'Получайте ответы на вопросы и выполняйте задачи с помощью ИИ',
    openChat: 'Открытый Чат с ИИ',
    aiToolsCatalog: 'Каталог AI Tools',
    askAnything: 'Задайте любой вопрос...',
    send: 'ОТПРАВИТЬ',

    // Session End Page
    sessionEndTitle: 'Сессия Завершена',
    thankYou: 'Спасибо за ваш визит!',
    dataCleared: 'Все ваши временные данные безопасно удалены.',
    backToStart: 'ВЕРНУТЬСЯ НА ГЛАВНУЮ',

    // Start Page
    startBrand: 'ЦЕНТР РАЗУМА “МУКИМИ”',
    startSubBrand: 'Город Коканд • Инновационная платформа образования и цифровых услуг',
    startKioskBadge: 'КИОСК РЕЖИМ #01 • ONLINE',
    startProjectTitle: 'Цифровой Проект Киоска Мукими',
    startMainTitle1: 'МУКИМИ ',
    startMainTitle2: '“AI CENTER”',
    startMotto: '“Единый центр образования, профессий, языков, миграции, психологической помощи и технологий ИИ.”',
    startButton: 'СТАРТ / НАЧАТЬ',
    startInstruction: 'Нажмите на экран, чтобы начать',
  },
  EN: {
    // Header & Nav
    back: 'BACK',
    home: 'HOME',
    help: 'HELP',
    endSession: 'END SESSION',
    headerBrand: 'MUQIMIY MIND CENTER',
    profileTitle: 'Create Profile',
    greetingTitle: 'Welcome',
    dashboardTitle: 'Main Dashboard',
    category: 'Category',
    yearsOld: 'years old',

    // Help Modal
    helpModalTitle: 'Do you need assistance?',
    helpModalDesc: 'Our center staff is always ready to assist you. You can also listen to voice instructions on the screen.',
    operator: 'Center operator:',
    dutyStaff: 'Muqimiy Mind Center Duty Officer',
    understandClose: 'GOT IT / CLOSE',

    // Exit Confirm Modal
    exitConfirmTitle: 'End current session?',
    exitConfirmDesc: 'All your temporary session data will be safely removed from this kiosk.',
    cancel: 'CANCEL',
    confirmExit: 'END SESSION',

    // Welcome / Profile Page
    welcomeBadge: 'Welcome to Mind Center!',
    welcomeHeading: 'Please enter your details so we can recommend tailored services',
    welcomeSubheading: 'The system automatically prepares digital recommendations tailored to your age.',
    nameLabel: 'Your Name:',
    namePlaceholder: 'e.g., Dilshod, Alex...',
    ageLabel: 'Your Age:',
    agePlaceholder: 'e.g., 22',
    genderLabel: 'Your Gender:',
    genderOptional: '(optional)',
    male: 'Male',
    female: 'Female',
    quickAgeTitle: 'Quick age selection:',
    quickAges: [
      { label: '7-12 years (Kids)', value: 10 },
      { label: '13-17 years (Teens)', value: 15 },
      { label: '18-24 years (Youth)', value: 20 },
      { label: '25-35 years', value: 28 },
      { label: '36-50 years', value: 42 },
      { label: '50+ years', value: 55 },
    ],
    errorName: 'Please enter your name',
    errorAge: 'Please enter a valid age (5 - 100 years)',
    validCheck: 'Valid',
    continueBtn: 'CONTINUE',

    // Greeting Page
    greetingHello: 'Hello',
    greetingSubtitle: 'Welcome to our Mind Center. 5 main digital directions are ready for you!',
    greetingVoice: 'Hello, {name}! How can we assist you? Digital services matching your age are ready.',
    goToDashboard: 'GO TO MAIN DASHBOARD',

    // Dashboard Page
    dashWelcome: 'Hello, {name}!',
    dashInstruction: 'Tap any large button on the screen to choose a direction.',
    rec_7_12: 'For kids: Language learning and AI creativity recommended!',
    rec_13_17: 'For teens: Modern professions, IT, and language learning sections!',
    rec_18_24: 'For youth & adults: Career learning, migration guides, and AI tools!',
    rec_default: 'All 5 directions and free educational resources are available for you!',

    // 5 Directions
    dir1_title: '1. LANGUAGE LEARNING',
    dir1_desc: 'Learn foreign languages (English, Russian, Chinese, German)',
    dir1_badge: 'Ibrat Farzandlari',

    dir2_title: '2. CAREER LEARNING',
    dir2_desc: 'Master modern skills (IT, Design, SMM, AI)',
    dir2_badge: 'Ustoz AI',

    dir3_title: '3. MIGRATION',
    dir3_desc: 'Get official information before going abroad',
    dir3_badge: 'Official Source',

    dir4_title: '4. PSYCHOLOGICAL SUPPORT',
    dir4_desc: 'Chat, take tests, and receive helpful recommendations',
    dir4_badge: 'Caring AI',

    dir5_title: '5. AI CHAT',
    dir5_desc: 'Utilize AI tools and ask open questions to AI',
    dir5_badge: 'AI Hub',

    dir6_title: '6. HISTORICAL FIGURES',
    dir6_desc: 'Interactive live dialogue with great scholars and Jadids',
    dir6_badge: 'Great Figures',

    // History Hub Page
    historyModuleTitle: 'Historical Figures Module',
    historyBadge: 'SECTION 6: GREAT ANCESTORS & JADIDS',
    historyHeading: 'Living Heritage of Our Great Ancestors',
    historySubheading: 'Select a historical figure and listen to their live spoken storytelling on selected topics',
    selectFigure: 'Select a historical figure:',
    askVoiceQuestion: 'Ask question by voice',
    replaySpeech: 'Replay Speech',
    stopSpeech: 'Stop',
    instantTopicsTitle: 'Choose a topic (Avatar starts speaking):',
    figureSpeaking: 'is speaking...',
    figureListening: 'Listening to you, please speak...',
    figureThinking: 'Preparing answer...',
    figureIdle: 'Ready to talk',


    // Language Hub Page
    langModuleTitle: 'Language Learning Module',
    langSectionBadge: 'SECTION 1: FOREIGN LANGUAGES',
    langMainHeading: 'Learn Foreign Languages Easily',
    langSubHeading: 'Choose your desired language and level',
    levelsCount: 'levels',
    availableLevels: 'Available Levels:',
    coveredAreas: 'Covered Skill Areas:',
    ibratProject: 'Official "Ibrat Farzandlari" Project',
    ibratDesc: 'Continue free high-quality language lessons on the official platform.',
    ibratBtn: 'LEARN VIA IBRAT FARZANDLARI',

    // Career Hub Page
    careerModuleTitle: 'Career Learning Module',
    careerSectionBadge: 'SECTION 2: MODERN PROFESSIONS',
    careerHeading: 'Master Future Professions',
    careerSubheading: 'Select a modern career field that suits you',
    requiredSkills: 'Required Skills:',
    ustozAi: '"Ustoz AI" Online Education Platform',
    ustozDesc: 'Free interactive lessons and practical exercises.',
    startLearning: 'START COURSE LESSONS',

    // Migration Hub Page
    migrationModuleTitle: 'Official Migration Guide',
    migrationBadge: 'SECTION 3: WORK MIGRATION & EDUCATION',
    migrationHeading: 'Official Info Before Travelling Abroad',
    migrationSubheading: 'Safe, official, and legal pathways for work & education',
    tabWork: 'Work Migration',
    tabStudy: 'Study Abroad',
    tabLiving: 'Living Conditions',
    requiredLang: 'Required Language:',
    demandJobs: 'In-demand Jobs:',
    officialLinks: 'Official Links & Resources:',
    officialWarning: 'Notice! Only use official government sources and stay safe from scams.',

    // Psychology Hub Page
    psychModuleTitle: 'Psychological Support Module',
    psychBadge: 'SECTION 4: MENTAL HEALTH & SUPPORT',
    psychHeading: 'You Are Not Alone',
    psychSubheading: 'Confidential and friendly mental wellness platform',
    aiPsychologist: 'Chat with AI Psychologist',
    aiPsychDesc: '24/7 confidential and empathetic AI conversation partner.',
    startChat: 'START CHAT',
    confidentialNotice: 'All conversations are completely private and confidential.',

    // AI Hub Page
    aiModuleTitle: 'AI Chat & Tools',
    aiBadge: 'SECTION 5: ARTIFICIAL INTELLIGENCE',
    aiHeading: 'Artificial Intelligence Capabilities',
    aiSubheading: 'Get answers to your questions and complete tasks with AI',
    openChat: 'Open AI Chat',
    aiToolsCatalog: 'AI Tools Catalog',
    askAnything: 'Ask anything you want...',
    send: 'SEND',

    // Session End Page
    sessionEndTitle: 'Session Ended',
    thankYou: 'Thank you for visiting!',
    dataCleared: 'All temporary data has been safely cleared.',
    backToStart: 'BACK TO START',

    // Start Page
    startBrand: 'MUQIMIY “AI CENTER”',
    startSubBrand: 'Kokand City • Innovative Education & Digital Services Platform',
    startKioskBadge: 'KIOSK MODE #01 • ONLINE',
    startProjectTitle: 'Digital Muqimiy Kiosk Project',
    startMainTitle1: 'MUQIMIY ',
    startMainTitle2: '“AI CENTER”',
    startMotto: '“One place for education, careers, languages, migration support, psychological assistance, and AI technologies.”',
    startButton: 'START',
    startInstruction: 'Tap the screen to begin',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.UZ;
}
