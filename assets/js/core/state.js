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
        outfit: { hat: null, glasses: null, scarf: null, bow: null },
        room: {
            bed: null,
            bowl: null,
            toy: null,
            wallpaper: 'default',
            vaseFlower: '🌻'
        }
    },
    
    // Достижения
    achievements: [],
    
    // Ежедневные задания
    dailyTasks: [],
    lastDailyDate: null,
    
    // Сундуки (новое)
    chests: {
        available: 0,
        solvedCounter: 0 // счётчик до 20
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
    mistakes: []
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
export function updateCoins(amount) {
    AppState.coins = Math.max(0, AppState.coins + amount);
    EventBus.emit('coins:updated', AppState.coins);
}

export function updateSolved(amount = 1) {
    AppState.totalSolved += amount;
    AppState.totalSolvedToday += amount;
    EventBus.emit('solved:updated', AppState.totalSolved);
    
    // Проверка на сундуки (новое!)
    AppState.chests.solvedCounter += amount;
    if (AppState.chests.solvedCounter >= 20) {
        AppState.chests.available += 3;
        AppState.chests.solvedCounter = 0;
        EventBus.emit('chests:available', AppState.chests.available);
        EventBus.emit('notification:success', '🎁 У вас 3 новых сундука!');
    }
    
    checkAchievements();
}

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

export function updateGamesPlayed(amount = 1) {
    AppState.totalGames += amount;
    EventBus.emit('games:updated', AppState.totalGames);
    checkAchievements();
}

// ==================== ДОСТИЖЕНИЯ ====================
const ACHIEVEMENTS_LIST = [
    { id: 'first_steps', name: '📜 Первые шаги', desc: 'Реши 1 задачу', condition: (s) => s.totalSolved >= 1, reward: 10 },
    { id: 'ten_tasks', name: '🎯 Десятка', desc: 'Реши 10 задач', condition: (s) => s.totalSolved >= 10, reward: 20 },
    { id: 'fifty_tasks', name: '💪 Полтинник', desc: 'Реши 50 задач', condition: (s) => s.totalSolved >= 50, reward: 50 },
    { id: 'hundred_tasks', name: '🏆 Сотня', desc: 'Реши 100 задач', condition: (s) => s.totalSolved >= 100, reward: 100 },
    { id: 'streak_3', name: '📅 3 дня', desc: 'Заходи 3 дня подряд', condition: (s) => s.streak >= 3, reward: 30 },
    { id: 'streak_7', name: '⭐ Неделя', desc: 'Заходи 7 дней подряд', condition: (s) => s.streak >= 7, reward: 100 },
    { id: 'gamer', name: '🎮 Геймер', desc: 'Сыграй 10 игр', condition: (s) => s.totalGames >= 10, reward: 40 },
    { id: 'pro_gamer', name: '🏅 Про-геймер', desc: 'Сыграй 50 игр', condition: (s) => s.totalGames >= 50, reward: 100 },
    { id: 'rich', name: '💰 Богач', desc: 'Накопи 1000 монет', condition: (s) => s.coins >= 1000, reward: 50 },
    { id: 'millionaire', name: '💎 Миллионер', desc: 'Накопи 5000 монет', condition: (s) => s.coins >= 5000, reward: 200 },
    { id: 'collector', name: '🎁 Коллекционер', desc: 'Открой 10 сундуков', condition: (s) => (s.chests?.opened || 0) >= 10, reward: 100 }
];

function checkAchievements() {
    ACHIEVEMENTS_LIST.forEach(ach => {
        if (!AppState.achievements.includes(ach.id) && ach.condition(AppState)) {
            AppState.achievements.push(ach.id);
            updateCoins(ach.reward);
            EventBus.emit('achievement:unlocked', ach);
            EventBus.emit('notification:success', `🏆 ${ach.name}! +${ach.reward}🪙`);
        }
    });
}

export function getAchievements() {
    return ACHIEVEMENTS_LIST.map(ach => ({
        ...ach,
        unlocked: AppState.achievements.includes(ach.id)
    }));
}

// ==================== ПИТОМЕЦ ====================
export function updatePetHunger(amount) {
    if (!AppState.pet) return;
    AppState.pet.hunger = Math.max(0, Math.min(100, AppState.pet.hunger + amount));
    EventBus.emit('pet:updated', AppState.pet);
}

export function updatePetHappiness(amount) {
    if (!AppState.pet) return;
    AppState.pet.happiness = Math.max(0, Math.min(100, AppState.pet.happiness + amount));
    EventBus.emit('pet:updated', AppState.pet);
}

export function updatePetEnergy(amount) {
    if (!AppState.pet) return;
    AppState.pet.energy = Math.max(0, Math.min(100, AppState.pet.energy + amount));
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
