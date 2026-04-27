// ==================== СОСТОЯНИЕ ИГРЫ И КОНСТАНТЫ ====================

const AppState = {
    currentChild: null,
    coins: 0,
    coins_earned_total: 0,
    totalSolved: 0,
    totalGames: 0,
    streak: 0,
    currentSubject: null,
    currentWorld: null,
    currentRobotSkin: '🤖',
    settings: { soundEnabled: true, voiceEnabled: true },
    inventory: {
        robotSkins: ['🤖'],
        accessories: [],
        skipTokens: 0,
        reviveTokens: 0
    },
    ownedPets: [],
    pet: null,
    petPlates: [
        { food: 'apple', emoji: '🍎', quantity: 3 },
        { food: 'cookie', emoji: '🍪', quantity: 5 },
        { food: null, emoji: '🍽️', quantity: 0 }
    ],
    petRoom: 'bedroom',
    progress: {
        math: { topics: {}, diplomas: [] },
        russian: { topics: {}, diplomas: [] },
        english: { topics: {}, diplomas: [] },
        world: { topics: {}, diplomas: [] }
    },
    album: [],
    diplomas: [],
    achievements: [],
    dailyTasks: [],
    dailyPlantStage: 0,
    lastDailyDate: '',
    parentControl: {
        dailyTimeLimit: 60,
        timePlayedToday: 0,
        password: '0000'
    },
    gameRecords: {},
    solvedHistory: [],
    purchaseHistory: [],
    mistakesHistory: []
};

const PETS = {
    cat: { name: 'Кошка', emoji: '🐱' },
    dog: { name: 'Собака', emoji: '🐶' },
    rabbit: { name: 'Кролик', emoji: '🐰' },
    fox: { name: 'Лис', emoji: '🦊' },
    koala: { name: 'Коала', emoji: '🐨' },
    pig: { name: 'Свинка', emoji: '🐷' }
};

const PET_FOOD = [
    { id: 'apple', emoji: '🍎', name: 'Яблоко', nutrition: 20, price: 5 },
    { id: 'banana', emoji: '🍌', name: 'Банан', nutrition: 20, price: 5 },
    { id: 'cookie', emoji: '🍪', name: 'Печенье', nutrition: 15, happiness: 5, price: 8 },
    { id: 'pizza', emoji: '🍕', name: 'Пицца', nutrition: 40, happiness: 15, price: 20 },
    { id: 'cake', emoji: '🎂', name: 'Тортик', nutrition: 50, happiness: 20, price: 25 },
    { id: 'icecream', emoji: '🍦', name: 'Мороженое', nutrition: 15, happiness: 15, price: 10 },
    { id: 'bone', emoji: '🦴', name: 'Косточка', nutrition: 30, price: 10 },
    { id: 'fish', emoji: '🐟', name: 'Рыбка', nutrition: 25, price: 12 }
];

const PET_ACCESSORIES = [
    { id: 'hat_cap', emoji: '🧢', name: 'Кепка', slot: 'hat', price: 50 },
    { id: 'hat_crown', emoji: '👑', name: 'Корона', slot: 'hat', price: 150 },
    { id: 'hat_top', emoji: '🎩', name: 'Цилиндр', slot: 'hat', price: 100 },
    { id: 'hat_grad', emoji: '🎓', name: 'Выпускник', slot: 'hat', price: 80 },
    { id: 'hat_party', emoji: '🎊', name: 'Праздничная', slot: 'hat', price: 40 }
];

const ACHIEVEMENTS_LIST = [
    // Базовые (из твоего файла)
    { id: 'first', name: '📜 Первые шаги', desc: 'Реши первую задачу', reward: 10 },
    { id: 'ten', name: '🎯 Десятка', desc: 'Реши 10 задач', reward: 15 },
    { id: 'twenty', name: '🌟 20 задач', desc: 'Реши 20 задач', reward: 20 },
    { id: 'fifty', name: '💪 50 задач', desc: 'Реши 50 задач', reward: 30 },
    { id: 'hundred', name: '🎉 100 задач', desc: 'Реши 100 задач', reward: 50 },
    { id: 'coin10', name: '🪙 10 монет', desc: 'Накопи 10 монет', reward: 5 },
    { id: 'coin50', name: '💰 50 монет', desc: 'Накопи 50 монет', reward: 10 },
    { id: 'coin100', name: '💎 100 монет', desc: 'Накопи 100 монет', reward: 20 },
    { id: 'streak3', name: '📅 3 дня подряд', desc: 'Заходи в игру 3 дня подряд', reward: 15 },
    { id: 'streak7', name: '⭐ Неделя', desc: 'Заходи в игру 7 дней подряд', reward: 30 },
    { id: 'perfect1', name: '🎯 Первый идеальный', desc: 'Сделай идеальный раунд', reward: 20 },
    { id: 'buyFirst', name: '🛍️ Первая покупка', desc: 'Купи что-нибудь в магазине', reward: 10 },
    { id: 'collector', name: '🧩 Коллекционер', desc: 'Накопи 3 пропуска', reward: 30 },
    { id: 'petOwner', name: '🐾 Друг питомцев', desc: 'Купи питомца', reward: 30 },
    { id: 'mazeMaster', name: '🗺️ Исследователь', desc: 'Пройди лабиринт', reward: 20 },
    { id: 'wordMaster', name: '❓ Словесник', desc: 'Отгадай слово', reward: 20 },
    { id: 'checkersWin', name: '⚫ Шашист', desc: 'Выиграй в шашки', reward: 25 },
    { id: 'ticTacWin', name: '❌ Крестик', desc: 'Выиграй в крестики-нолики', reward: 20 },
    { id: 'memoryMaster', name: '🧠 Мастер памяти', desc: 'Пройди игру Найди пару', reward: 25 },
    { id: 'battleshipMaster', name: '🚢 Адмирал', desc: 'Победи в морском бое', reward: 30 },
    { id: 'sudokuMaster', name: '🧩 Судоку-мастер', desc: 'Реши судоку 4×4', reward: 25 },
    { id: 'shootMaster', name: '🎯 Снайпер', desc: 'Попади в 10 целей', reward: 25 },
    { id: 'fastCompare', name: '⚡ Быстрый ум', desc: 'Правильно сравни 20 чисел', reward: 25 },
    { id: 'clockMaster', name: '🕐 Повелитель времени', desc: 'Правильно определи время 5 раз', reward: 20 },
    // Новые учебные
    { id: 'math_25', name: '🧮 Математик', desc: 'Пройди 25 тем по математике', reward: 50 },
    { id: 'russian_23', name: '📖 Грамотей', desc: 'Пройди 23 темы по русскому', reward: 50 },
    { id: 'english_22', name: '🇬🇧 Полиглот', desc: 'Пройди 22 темы по английскому', reward: 50 },
    { id: 'world_22', name: '🌍 Натуралист', desc: 'Пройди 22 темы по окруж. миру', reward: 50 },
    { id: 'marathon_5', name: '🏃 Марафонец', desc: 'Пройди 5 марафонов', reward: 25 },
    { id: 'perfect_5', name: '⭐ Отличник', desc: 'Получи 3 звезды в 5 темах', reward: 35 },
    // Новые для питомца
    { id: 'pet_feed_10', name: '🍖 Кормилец', desc: 'Покорми питомца 10 раз', reward: 15 },
    { id: 'pet_pet_10', name: '🤗 Заботливый', desc: 'Погладь питомца 10 раз', reward: 15 },
    { id: 'pet_sleep_5', name: '😴 Соня', desc: 'Уложи питомца спать 5 раз', reward: 10 },
    { id: 'pet_hat_3', name: '🎩 Модник', desc: 'Купи 3 шляпы для питомца', reward: 30 },
    // Новые коллекционные
    { id: 'coin500', name: '💵 Богач', desc: 'Накопи 500 монет', reward: 40 },
    { id: 'coin1000', name: '🏦 Миллионер', desc: 'Накопи 1000 монет', reward: 50 },
    { id: 'skin_5', name: '🤖 Коллекционер', desc: 'Собери 5 скинов роботов', reward: 35 },
    { id: 'game_10', name: '🎮 Геймер', desc: 'Сыграй в 10 разных игр', reward: 30 },
    // Новые социальные
    { id: 'streak14', name: '🔥 Две недели', desc: 'Заходи 14 дней подряд', reward: 40 },
    { id: 'streak30', name: '👑 Месяц', desc: 'Заходи 30 дней подряд', reward: 60 },
    { id: 'daily_all_5', name: '📅 Планировщик', desc: 'Выполни все 3 задания дня 5 раз', reward: 25 },
    { id: 'harvest_5', name: '🍎 Садовод', desc: 'Собери урожай с растения 5 раз', reward: 20 },
    { id: 'early_bird', name: '🌅 Жаворонок', desc: 'Зайди в игру до 8 утра', reward: 15 },
    { id: 'night_owl', name: '🦉 Сова', desc: 'Зайди в игру после 10 вечера', reward: 15 },
    { id: 'mistakes_0_10', name: '🧠 Эрудит', desc: 'Пройди 10 тем без единой ошибки', reward: 45 },
    // Секретные
    { id: 'secret_clock', name: '🥚 Пасхалка', desc: 'Нажми на часы 10 раз', reward: 50, secret: true },
    { id: 'secret_mrx', name: '🦊 MRX', desc: 'Введи кодовое слово', reward: 100, secret: true }
];

const AVATARS_LIST = [
    { emoji: "🤖", name: "Робот", price: 0 },
    { emoji: "🧑‍🏫", name: "Робот-учитель", price: 30 },
    { emoji: "🧑‍🔬", name: "Робот-учёный", price: 30 },
    { emoji: "🧑‍🎨", name: "Робот-художник", price: 30 },
    { emoji: "🧑‍🍳", name: "Робот-повар", price: 30 },
    { emoji: "🧑‍🚀", name: "Робот-космонавт", price: 35 },
    { emoji: "🐻‍❄️", name: "Робот-мишка", price: 25 },
    { emoji: "🐉", name: "Робот-дракон", price: 40 }
];

const SHOP_GOODS = [
    { id: 'skip', name: '⤴️ Пропуск', price: 50, desc: 'Позволяет пропустить задание' },
    { id: 'revive', name: '♻️ Воскрешение', price: 60, desc: 'Восстанавливает 3 жизни' },
    { id: 'multiplier', name: '⚡ Удвоитель (3 задачи)', price: 40, desc: 'Удваивает монеты на 3 задачи' },
    { id: 'shield', name: '🛡️ Защита', price: 25, desc: 'Даёт +1 жизнь в уроке' },
    { id: 'luck', name: '🍀 Талисман удачи', price: 100, desc: '+10% ко всем монетам' },
    { id: 'chest', name: '🎁 Секретный сундук', price: 50, desc: 'Случайный бонус (10-100 монет)' }
];

// Глобальные переменные для уроков
let currentLessonSubject = null;
let currentLessonTopic = null;
let currentStep = 1;
let currentLives = 3;
let currentScore = 0;
let totalSteps = 5;
let hintShown = false;
let currentDifficulty = 10;
