// ==================== СОСТОЯНИЕ ИГРЫ ====================
let data = {
    total_solved: 0,
    achievements: [],
    coins: 0,
    coins_earned_total: 0,
    purchases_count: 0,
    skip_token: 0,
    revive_token: 0,
    perfect_rounds: 0,
    skin_theme: "default",
    daily_tasks: [],
    last_daily_date: "",
    last_login_date: "",
    login_streak: 0,
    passwordHash: "",
    pet: null,
    purchase_log: [],
    lesson_log: [],
    current_avatar: "🤖",
    owned_avatars: ["🤖"],
    owned_themes: ["default"],
    daily_stats: [],
    mistakes: [],
    boosters: { multiplier: 0, multiplier_left: 0, shield: false, luck: false },
    games_unlocked: 0
};

let currentChild = null;
let childrenList = [];
let masterPasswordHash = "";

// Переменные уроков
let currentWorld = '+';
let currentSection = 'standard';
let currentDifficulty = 10;
let currentStep = 1;
let currentLives = 3;
let currentScore = 0;
let currentTask = null;
let totalSteps = 5;
let errorCount = 0;
let hintShown = false;

// Аудио и таймеры
let audioCtx = null;
let musicInterval = null;
let gameTimer = null;

// ==================== ДОСТИЖЕНИЯ ====================
const achievementsList = [
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
    { id: 'clockMaster', name: '🕐 Повелитель времени', desc: 'Правильно определи время 5 раз', reward: 20 }
];

// ==================== АВАТАРЫ РОБОТА ====================
const avatarsList = [
    { emoji: "🤖", name: "Робот", price: 0 },
    { emoji: "🧑‍🏫", name: "Робот-учитель", price: 30 },
    { emoji: "🧑‍🔬", name: "Робот-учёный", price: 30 },
    { emoji: "🧑‍🎨", name: "Робот-художник", price: 30 },
    { emoji: "🧑‍🍳", name: "Робот-повар", price: 30 },
    { emoji: "🧑‍🚀", name: "Робот-космонавт", price: 35 },
    { emoji: "🐻‍❄️", name: "Робот-мишка", price: 25 },
    { emoji: "🐉", name: "Робот-дракон", price: 40 }
];

// ==================== ПИТОМЦЫ ====================
const petsList = [
    { type: 'dog', emoji: '🐕', name: 'Собака', price: 50, ability: 'double_reward', abilityDesc: 'Удваивает монеты за идеальный раунд' },
    { type: 'cat', emoji: '🐈', name: 'Кошка', price: 50, ability: 'hint', abilityDesc: 'Один раз подскажет решение' },
    { type: 'hamster', emoji: '🐹', name: 'Хомяк', price: 50, ability: 'extra_life', abilityDesc: 'Даёт +1 жизнь в уроке' },
    { type: 'fox', emoji: '🦊', name: 'Лисёнок', price: 75, ability: 'daily_bonus', abilityDesc: 'Приносит 1 монету каждый день' },
    { type: 'penguin', emoji: '🐧', name: 'Пингвин', price: 75, ability: 'monday_bonus', abilityDesc: 'В понедельник +5 монет' },
    { type: 'koala', emoji: '🐨', name: 'Коала', price: 100, ability: 'double_round', abilityDesc: 'Удваивает награду за раунд' }
];

// ==================== ТОВАРЫ МАГАЗИНА ====================
const shopGoods = [
    { id: 'skip', name: '⤴️ Пропуск', price: 50, desc: 'Позволяет пропустить задание' },
    { id: 'revive', name: '♻️ Воскрешение', price: 60, desc: 'Восстанавливает 3 жизни' },
    { id: 'multiplier', name: '⚡ Удвоитель (3 задачи)', price: 40, desc: 'Удваивает монеты на 3 задачи' },
    { id: 'shield', name: '🛡️ Защита (1 жизнь)', price: 25, desc: 'Даёт +1 жизнь в уроке' },
    { id: 'luck', name: '🍀 Талисман удачи (+10%)', price: 100, desc: '+10% ко всем монетам' },
    { id: 'chest', name: '🎁 Секретный сундук', price: 50, desc: 'Случайный бонус (10-100 монет)' }
];

// ==================== ПИТОМЦЫ (ДАННЫЕ ДЛЯ МОДУЛЯ) ====================
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
    { id: 'hat_grad', emoji: '🎓', name: 'Выпускник', slot: 'hat', price: 80 }
];
