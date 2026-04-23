// ==================== ПОЛНОЕ ГЛОБАЛЬНОЕ СОСТОЯНИЕ ====================

export const AppState = {
    // Текущий профиль
    currentChild: null,
    
    // Данные текущего ребёнка
    user: {
        name: 'Ученик',
        avatar: '🧑‍🎓',
        level: 1,
        xp: 0
    },
    
    // Ресурсы
    coins: 500,
    gems: 0,
    
    // Статистика
    totalSolved: 0,
    totalSolvedToday: 0,
    totalGames: 0,
    totalWins: 0,
    streak: 0,
    lastLogin: null,
    
    // Прогресс по предметам
    progress: {
        math: { topics: {}, diplomas: [] },
        russian: { topics: {}, diplomas: [] },
        english: { topics: {}, diplomas: [] },
        world: { topics: {}, diplomas: [] }
    },
    
    // Инвентарь
    inventory: {
        food: [],
        accessories: [],
        furniture: [],
        themes: ['default'],
        skipTokens: 0,
        reviveTokens: 0
    },
    
    // Питомец
    pet: {
        type: 'cat',
        name: 'Мурка',
        hunger: 100,
        happiness: 100,
        energy: 100,
        age: 0,
        birthDate: new Date().toISOString(),
        isSleeping: false,
        sleepStartTime: null,
        outfit: { hat: null, glasses: null, scarf: null, bow: null },
        room: {
            bed: null,
            bowl: null,
            toy: null,
            wallpaper: 'default',
            vaseFlower: '🌻'
        },
        stats: {
            timesFed: 0,
            timesPetted: 0,
            timesPlayed: 0
        }
    },
    
    // Достижения
    achievements: [],
    
    // Ежедневные задания (генерируются)
    dailyTasks: [],
    lastDailyDate: null,
    
    // Сундуки
    chests: {
        available: 0,
        solvedCounter: 0,
        opened: 0,
        history: []
    },
    
    // Настройки
    settings: {
        theme: 'default',
        soundEnabled: true,
        musicEnabled: true,
        voiceEnabled: true,
        notificationsEnabled: true
    },
    
    // Родительский контроль
    parentControl: {
        enabled: false,
        password: '0000',
        dailyTimeLimit: 60,
        timePlayedToday: 0,
        lastPlayDate: null,
        restrictedGames: [],
        shopEnabled: true
    },
    
    // Текущий экран
    currentScreen: 'loading',
    currentSubject: null,
    currentWorld: null,
    currentTopic: null,
    
    // История ошибок
    mistakes: [],
    
    // Игровые рекорды
    gameRecords: {
        racing: 0,
        arcade: 0,
        shooting: 0
    }
};

// ==================== СОБЫТИЯ ====================
export const EventBus = {
    events: {},
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    
    once(event, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    },
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(data));
        }
    },
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
};

// ==================== МЕТОДЫ СОСТОЯНИЯ ====================

// Монеты
export function updateCoins(amount) {
    AppState.coins = Math.max(0, AppState.coins + amount);
    EventBus.emit('coins:updated', AppState.coins);
    checkAchievements();
}

// Решённые примеры
export function updateSolved(amount = 1) {
    AppState.totalSolved += amount;
    AppState.totalSolvedToday += amount;
    EventBus.emit('solved:updated', AppState.totalSolved);
    
    // Проверка на сундуки
    AppState.chests.solvedCounter += amount;
    if (AppState.chests.solvedCounter >= 20) {
        const chestsEarned = Math.floor(AppState.chests.solvedCounter / 20) * 3;
        AppState.chests.available += chestsEarned;
        AppState.chests.solvedCounter = AppState.chests.solvedCounter % 20;
        
        EventBus.emit('chests:available', AppState.chests.available);
        EventBus.emit('sound:achievement');
        EventBus.emit('notification:success', `🎁 Получено ${chestsEarned} сундуков! Открой их!`);
    }
    
    checkAchievements();
}

// Игры
export function updateGamesPlayed(amount = 1, win = false) {
    AppState.totalGames += amount;
    if (win) AppState.totalWins += amount;
    EventBus.emit('games:updated', AppState.totalGames);
    checkAchievements();
}

// Стрик
export function updateStreak() {
    const today = new Date().toDateString();
    if (AppState.lastLogin === today) return;
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (AppState.lastLogin === yesterday) {
        AppState.streak++;
    } else {
        AppState.streak = 1;
    }
    AppState.lastLogin = today;
    EventBus.emit('streak:updated', AppState.streak);
    checkAchievements();
}

// Прогресс по темам
export function updateTopicProgress(subject, topicId, stars, completed) {
    if (!AppState.progress[subject]) {
        AppState.progress[subject] = { topics: {}, diplomas: [] };
    }
    AppState.progress[subject].topics[topicId] = { stars, completed };
    EventBus.emit('progress:updated', { subject, topicId, stars, completed });
    EventBus.emit('topic:completed', { subject, topicId, stars });
}

export function addDiploma(subject, diploma) {
    if (!AppState.progress[subject]) {
        AppState.progress[subject] = { topics: {}, diplomas: [] };
    }
    AppState.progress[subject].diplomas.push(diploma);
    EventBus.emit('diploma:added', { subject, diploma });
}

// ==================== СУНДУКИ ====================
export function openChest() {
    if (AppState.chests.available <= 0) return null;
    
    AppState.chests.available--;
    AppState.chests.opened++;
    
    // Рандомная награда
    const roll = Math.random();
    let reward, type, emoji;
    
    if (roll < 0.60) {
        // Обычный сундук
        reward = Math.floor(Math.random() * 41) + 10; // 10-50
        type = 'normal';
        emoji = '🪎';
    } else if (roll < 0.90) {
        // Редкий сундук
        reward = Math.floor(Math.random() * 150) + 51; // 51-200
        type = 'rare';
        emoji = '🪎✨';
    } else {
        // Легендарный сундук
        reward = Math.floor(Math.random() * 800) + 201; // 201-1000
        type = 'legendary';
        emoji = '🪎💎';
    }
    
    updateCoins(reward);
    
    const result = { type, emoji, reward, timestamp: new Date().toISOString() };
    AppState.chests.history.push(result);
    
    EventBus.emit('chest:opened', result);
    EventBus.emit('sound:coin');
    
    if (type === 'legendary') {
        EventBus.emit('sound:achievement');
        EventBus.emit('notification:success', `💎 ЛЕГЕНДАРНЫЙ СУНДУК! +${reward} 🪙`);
    }
    
    checkAchievements();
    
    return result;
}

// ==================== ПИТОМЕЦ ====================
export function updatePetHunger(amount) {
    if (!AppState.pet) return;
    AppState.pet.hunger = Math.max(0, Math.min(100, AppState.pet.hunger + amount));
    if (amount > 0) {
        AppState.pet.stats.timesFed++;
        EventBus.emit('pet:fed');
    }
    EventBus.emit('pet:updated', AppState.pet);
}

export function updatePetHappiness(amount) {
    if (!AppState.pet) return;
    AppState.pet.happiness = Math.max(0, Math.min(100, AppState.pet.happiness + amount));
    if (amount > 0) {
        AppState.pet.stats.timesPetted++;
        EventBus.emit('pet:petted');
    }
    EventBus.emit('pet:updated', AppState.pet);
}

export function updatePetEnergy(amount) {
    if (!AppState.pet) return;
    AppState.pet.energy = Math.max(0, Math.min(100, AppState.pet.energy + amount));
    EventBus.emit('pet:updated', AppState.pet);
}

export function petGoToSleep() {
    if (!AppState.pet) return;
    AppState.pet.isSleeping = true;
    AppState.pet.sleepStartTime = Date.now();
    EventBus.emit('pet:slept');
    EventBus.emit('pet:updated', AppState.pet);
}

export function petWakeUp() {
    if (!AppState.pet) return;
    AppState.pet.isSleeping = false;
    AppState.pet.sleepStartTime = null;
    AppState.pet.energy = 100;
    AppState.pet.happiness = Math.min(100, AppState.pet.happiness + 20);
    EventBus.emit('pet:updated', AppState.pet);
}

// ==================== ТЕМЫ ====================
export function setTheme(theme) {
    AppState.settings.theme = theme;
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    EventBus.emit('theme:changed', theme);
}

// ==================== ПРОВЕРКА ЛИМИТА ВРЕМЕНИ ====================
export function checkTimeLimit() {
    const pc = AppState.parentControl;
    if (!pc.enabled) return true;
    
    const today = new Date().toDateString();
    if (pc.lastPlayDate !== today) {
        pc.timePlayedToday = 0;
        pc.lastPlayDate = today;
    }
    
    return pc.timePlayedToday < pc.dailyTimeLimit;
}

export function addPlayTime(minutes) {
    const pc = AppState.parentControl;
    if (!pc.enabled) return;
    
    pc.timePlayedToday += minutes;
    EventBus.emit('timeLimit:updated', pc.timePlayedToday);
    
    if (pc.timePlayedToday >= pc.dailyTimeLimit) {
        EventBus.emit('notification:warning', '⏰ Лимит времени на сегодня исчерпан!');
        EventBus.emit('timeLimit:reached');
    }
}

export function canPlayGame(gameId) {
    const pc = AppState.parentControl;
    if (!pc.enabled) return true;
    return !pc.restrictedGames.includes(gameId);
}

export function isShopEnabled() {
    return !AppState.parentControl.enabled || AppState.parentControl.shopEnabled;
}

// ==================== ДОСТИЖЕНИЯ ====================
const ACHIEVEMENTS_LIST = [
    { id: 'first_steps', name: '📜 Первые шаги', desc: 'Реши 1 задачу', condition: (s) => s.totalSolved >= 1, reward: 10 },
    { id: 'ten_tasks', name: '🎯 Десятка', desc: 'Реши 10 задач', condition: (s) => s.totalSolved >= 10, reward: 20 },
    { id: 'fifty_tasks', name: '💪 Полтинник', desc: 'Реши 50 задач', condition: (s) => s.totalSolved >= 50, reward: 50 },
    { id: 'hundred_tasks', name: '🏆 Сотня', desc: 'Реши 100 задач', condition: (s) => s.totalSolved >= 100, reward: 100 },
    { id: 'five_hundred_tasks', name: '👑 Мудрец', desc: 'Реши 500 задач', condition: (s) => s.totalSolved >= 500, reward: 500 },
    { id: 'streak_3', name: '📅 3 дня', desc: 'Заходи 3 дня подряд', condition: (s) => s.streak >= 3, reward: 30 },
    { id: 'streak_7', name: '⭐ Неделя', desc: 'Заходи 7 дней подряд', condition: (s) => s.streak >= 7, reward: 100 },
    { id: 'streak_30', name: '🌟 Месяц', desc: 'Заходи 30 дней подряд', condition: (s) => s.streak >= 30, reward: 500 },
    { id: 'gamer', name: '🎮 Геймер', desc: 'Сыграй 10 игр', condition: (s) => s.totalGames >= 10, reward: 40 },
    { id: 'pro_gamer', name: '🏅 Про-геймер', desc: 'Сыграй 50 игр', condition: (s) => s.totalGames >= 50, reward: 100 },
    { id: 'rich', name: '💰 Богач', desc: 'Накопи 1000 монет', condition: (s) => s.coins >= 1000, reward: 50 },
    { id: 'millionaire', name: '💎 Миллионер', desc: 'Накопи 5000 монет', condition: (s) => s.coins >= 5000, reward: 200 },
    { id: 'collector', name: '🎁 Коллекционер', desc: 'Открой 10 сундуков', condition: (s) => (s.chests?.opened || 0) >= 10, reward: 100 },
    { id: 'pet_lover', name: '🐾 Любитель питомцев', desc: 'Погладь питомца 50 раз', condition: (s) => (s.pet?.stats?.timesPetted || 0) >= 50, reward: 50 },
    { id: 'chef', name: '🍳 Шеф-повар', desc: 'Покорми питомца 30 раз', condition: (s) => (s.pet?.stats?.timesFed || 0) >= 30, reward: 50 }
];

function checkAchievements() {
    ACHIEVEMENTS_LIST.forEach(ach => {
        if (!AppState.achievements.includes(ach.id) && ach.condition(AppState)) {
            AppState.achievements.push(ach.id);
            EventBus.emit('achievement:unlocked', ach);
            EventBus.emit('sound:achievement');
        }
    });
}

export function getAchievements() {
    return ACHIEVEMENTS_LIST.map(ach => ({
        ...ach,
        unlocked: AppState.achievements.includes(ach.id)
    }));
}

// ==================== ГЕНЕРАЦИЯ ЗАДАНИЙ ====================
export function generateTasks(topic, count = 5) {
    // Импорт из task-generator.js через динамический импорт
    // (основная логика в отдельном файле)
    return import('./task-generator.js').then(module => module.generateTasks(topic, count));
}

// ==================== ОБНОВЛЕНИЕ ПИТОМЦА (АВТО) ====================
export function autoUpdatePet() {
    const pet = AppState.pet;
    if (!pet) return;
    
    if (pet.isSleeping) {
        pet.energy = Math.min(100, pet.energy + 5);
        if (pet.sleepStartTime && (Date.now() - pet.sleepStartTime) > 5 * 60 * 1000) {
            petWakeUp();
        }
    } else {
        pet.energy = Math.max(0, pet.energy - 2);
        pet.hunger = Math.max(0, pet.hunger - 3);
        if (pet.hunger < 30 || pet.energy < 20) {
            pet.happiness = Math.max(0, pet.happiness - 2);
        }
        if (pet.energy <= 0) {
            petGoToSleep();
        }
    }
    
    EventBus.emit('pet:updated', pet);
}

// Запуск автообновления
setInterval(autoUpdatePet, 15000);
