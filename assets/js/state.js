// ==================== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ====================
const AppState = {
    // Профиль
    currentChild: null,
    
    // Ресурсы
    coins: 500,
    gems: 0,
    
    // Статистика
    totalSolved: 0,
    totalGames: 0,
    streak: 0,
    lastLogin: null,
    perfectRounds: 0,
    marathonCompleted: 0,
    dailyAllCount: 0,
    fruitsHarvested: 0,
    purchasesCount: 0,
    
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
        themes: ['apartment'],
        skipTokens: 0,
        reviveTokens: 0,
        robotSkins: ['🤖']
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
        room: { vaseFlower: '🌻' },
        stats: { timesFed: 0, timesPetted: 0, timesPlayed: 0 }
    },
    
    // Владение питомцами
    ownedPets: ['cat'],
    currentRobotSkin: '🤖',
    
    // Достижения
    achievements: [],
    
    // Ежедневные задания
    dailyTasks: [],
    lastDailyDate: null,
    dailyPlantStage: 0,
    
    // Настройки
    settings: {
        theme: 'apartment',
        soundEnabled: true,
        voiceEnabled: true
    },
    
    // Родительский контроль
    parentControl: {
        enabled: false,
        password: '0000',
        dailyTimeLimit: 60,
        timePlayedToday: 0,
        restrictedGames: [],
        shopEnabled: true
    },
    
    // Альбом
    album: [],
    
    // Текущее состояние
    currentScreen: 'loading',
    currentSubject: null,
    currentWorld: null,
    
    // Статистика по играм
    gameStats: {
        mazeCompleted: 0, wordWins: 0, checkersWins: 0, ticTacWins: 0,
        memoryCompleted: 0, battleshipWins: 0, sudokuCompleted: 0,
        shootTargets: 0, compareCorrect: 0, fingerCorrect: 0,
        compositionCorrect: 0, clockCorrect: 0, changeCorrect: 0
    }
};

// ==================== СОБЫТИЯ ====================
const EventBus = {
    events: {},
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    emit(event, data) {
        if (this.events[event]) this.events[event].forEach(cb => cb(data));
    }
};

// ==================== МЕТОДЫ СОСТОЯНИЯ ====================
function updateCoins(amount) {
    AppState.coins = Math.max(0, AppState.coins + amount);
    EventBus.emit('coins:updated', AppState.coins);
    checkAchievements();
}

function updateSolved(amount = 1) {
    AppState.totalSolved += amount;
    EventBus.emit('solved:updated', AppState.totalSolved);
    checkAchievements();
}

function updateGamesPlayed() {
    AppState.totalGames++;
    EventBus.emit('games:updated', AppState.totalGames);
    checkAchievements();
}

function updateStreak() {
    const today = new Date().toDateString();
    if (AppState.lastLogin === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (AppState.lastLogin === yesterday) AppState.streak++;
    else AppState.streak = 1;
    AppState.lastLogin = today;
    EventBus.emit('streak:updated', AppState.streak);
    checkAchievements();
}

function updatePetHunger(amount) {
    if (!AppState.pet) return;
    AppState.pet.hunger = Math.max(0, Math.min(100, AppState.pet.hunger + amount));
    if (amount > 0) AppState.pet.stats.timesFed++;
    EventBus.emit('pet:updated', AppState.pet);
}

function updatePetHappiness(amount) {
    if (!AppState.pet) return;
    AppState.pet.happiness = Math.max(0, Math.min(100, AppState.pet.happiness + amount));
    if (amount > 0) AppState.pet.stats.timesPetted++;
    EventBus.emit('pet:updated', AppState.pet);
}

function updatePetEnergy(amount) {
    if (!AppState.pet) return;
    AppState.pet.energy = Math.max(0, Math.min(100, AppState.pet.energy + amount));
    EventBus.emit('pet:updated', AppState.pet);
}

function petGoToSleep() {
    if (!AppState.pet) return;
    AppState.pet.isSleeping = true;
    EventBus.emit('pet:updated', AppState.pet);
}

function petWakeUp() {
    if (!AppState.pet) return;
    AppState.pet.isSleeping = false;
    AppState.pet.energy = 100;
    AppState.pet.happiness = Math.min(100, AppState.pet.happiness + 20);
    EventBus.emit('pet:updated', AppState.pet);
}

// ==================== СМЕНА ПИТОМЦА ====================
function getDefaultPetName(type) {
    const names = { cat: 'Мурка', dog: 'Бобик', rabbit: 'Пушок', fox: 'Рыжик', koala: 'Эвкалипт', pig: 'Хрюша' };
    return names[type] || 'Питомец';
}

function switchPetType(newType) {
    if (!AppState.ownedPets.includes(newType)) return false;
    const defaultNames = Object.values(getDefaultPetName);
    if (Object.values(getDefaultPetName).includes(AppState.pet.name)) {
        AppState.pet.name = getDefaultPetName(newType);
    }
    AppState.pet.type = newType;
    AppState.pet.outfit = { hat: null, glasses: null, scarf: null, bow: null };
    EventBus.emit('pet:updated', AppState.pet);
    if (typeof saveState === 'function') saveState();
    return true;
}

function changePetName(newName) {
    if (!newName || newName.trim().length === 0) return false;
    if (AppState.coins < 1000) return false;
    AppState.coins -= 1000;
    AppState.pet.name = newName.trim();
    EventBus.emit('pet:updated', AppState.pet);
    EventBus.emit('coins:updated', AppState.coins);
    if (typeof saveState === 'function') saveState();
    return true;
}

// ==================== РАСТЕНИЕ (ПЛОДЫ) ====================
function updateDailyPlant() {
    const completed = (AppState.dailyTasks || []).filter(t => t.completed).length;
    AppState.dailyPlantStage = Math.min(3, completed);
    EventBus.emit('plant:updated', AppState.dailyPlantStage);
}

function harvestFruit() {
    if (AppState.dailyPlantStage < 3) return null;
    AppState.dailyPlantStage = 0;
    AppState.fruitsHarvested = (AppState.fruitsHarvested || 0) + 1;
    const roll = Math.random();
    let reward, type;
    if (roll < 0.5) { reward = Math.floor(Math.random()*50)+20; type = 'coins'; }
    else if (roll < 0.8) { reward = Math.floor(Math.random()*150)+50; type = 'coins'; }
    else if (roll < 0.95) { reward = {type:'skip',amount:1}; type = 'token'; }
    else { reward = Math.floor(Math.random()*500)+200; type = 'jackpot'; }
    if (type === 'coins') updateCoins(reward);
    else if (type === 'token') { AppState.inventory.skipTokens++; reward = '⏭️ Пропуск'; }
    else if (type === 'jackpot') updateCoins(reward);
    EventBus.emit('plant:updated', AppState.dailyPlantStage);
    checkAchievements();
    return { type, reward };
}

// ==================== ДОСТИЖЕНИЯ (50+) ====================
const ACHIEVEMENTS_LIST = [
    { id:'first', name:'📜 Первые шаги', desc:'Реши 1 задачу', condition:s=>s.totalSolved>=1, reward:10 },
    { id:'ten', name:'🎯 Десятка', desc:'Реши 10 задач', condition:s=>s.totalSolved>=10, reward:20 },
    { id:'twenty', name:'🌟 20 задач', desc:'Реши 20 задач', condition:s=>s.totalSolved>=20, reward:25 },
    { id:'fifty', name:'💪 Полтинник', desc:'Реши 50 задач', condition:s=>s.totalSolved>=50, reward:50 },
    { id:'hundred', name:'🎉 Сотня', desc:'Реши 100 задач', condition:s=>s.totalSolved>=100, reward:100 },
    { id:'five_hundred', name:'👑 Мудрец', desc:'Реши 500 задач', condition:s=>s.totalSolved>=500, reward:500 },
    { id:'streak3', name:'📅 3 дня', desc:'Заходи 3 дня подряд', condition:s=>s.streak>=3, reward:30 },
    { id:'streak7', name:'⭐ Неделя', desc:'Заходи 7 дней', condition:s=>s.streak>=7, reward:100 },
    { id:'streak30', name:'🌟 Месяц', desc:'Заходи 30 дней', condition:s=>s.streak>=30, reward:500 },
    { id:'coin50', name:'🪙 50 монет', desc:'Накопи 50 монет', condition:s=>s.coins>=50, reward:5 },
    { id:'coin100', name:'💰 100 монет', desc:'Накопи 100 монет', condition:s=>s.coins>=100, reward:10 },
    { id:'coin500', name:'💎 500 монет', desc:'Накопи 500 монет', condition:s=>s.coins>=500, reward:25 },
    { id:'coin1000', name:'🏦 1000 монет', desc:'Накопи 1000 монет', condition:s=>s.coins>=1000, reward:50 },
    { id:'coin5000', name:'👑 5000 монет', desc:'Накопи 5000 монет', condition:s=>s.coins>=5000, reward:200 },
    { id:'gamer', name:'🎮 Геймер', desc:'Сыграй 10 игр', condition:s=>s.totalGames>=10, reward:40 },
    { id:'pro_gamer', name:'🏅 Про-геймер', desc:'Сыграй 50 игр', condition:s=>s.totalGames>=50, reward:100 },
    { id:'legend_gamer', name:'🎖️ Легенда', desc:'Сыграй 100 игр', condition:s=>s.totalGames>=100, reward:200 },
    { id:'maze_master', name:'🗺️ Исследователь', desc:'Пройди лабиринт', condition:s=>(s.gameStats?.mazeCompleted||0)>=1, reward:20 },
    { id:'word_master', name:'❓ Словесник', desc:'Выиграй в Слово', condition:s=>(s.gameStats?.wordWins||0)>=1, reward:20 },
    { id:'checkers_win', name:'⚫ Шашист', desc:'Выиграй в шашки', condition:s=>(s.gameStats?.checkersWins||0)>=1, reward:25 },
    { id:'tic_tac_win', name:'❌ Крестик', desc:'Выиграй в крестики-нолики', condition:s=>(s.gameStats?.ticTacWins||0)>=1, reward:20 },
    { id:'memory_master', name:'🧠 Мастер памяти', desc:'Пройди Найди пару', condition:s=>(s.gameStats?.memoryCompleted||0)>=1, reward:25 },
    { id:'battleship_master', name:'🚢 Адмирал', desc:'Победи в морском бое', condition:s=>(s.gameStats?.battleshipWins||0)>=1, reward:30 },
    { id:'sudoku_master', name:'🧩 Судоку-мастер', desc:'Реши судоку', condition:s=>(s.gameStats?.sudokuCompleted||0)>=1, reward:25 },
    { id:'shoot_master', name:'🎯 Снайпер', desc:'Попади в 10 целей', condition:s=>(s.gameStats?.shootTargets||0)>=10, reward:25 },
    { id:'fast_compare', name:'⚡ Быстрый ум', desc:'Сравни 20 чисел', condition:s=>(s.gameStats?.compareCorrect||0)>=20, reward:25 },
    { id:'clock_master', name:'🕐 Повелитель времени', desc:'Определи время 5 раз', condition:s=>(s.gameStats?.clockCorrect||0)>=5, reward:20 },
    { id:'pet_fed_10', name:'🍖 Кормилец', desc:'Покорми питомца 10 раз', condition:s=>(s.pet?.stats?.timesFed||0)>=10, reward:30 },
    { id:'pet_pet_50', name:'🤗 Ласковый', desc:'Погладь питомца 50 раз', condition:s=>(s.pet?.stats?.timesPetted||0)>=50, reward:40 },
    { id:'pet_play_20', name:'🎾 Игрок', desc:'Поиграй с питомцем 20 раз', condition:s=>(s.pet?.stats?.timesPlayed||0)>=20, reward:35 },
    { id:'pet_outfit', name:'👕 Модник', desc:'Надень 3 предмета на питомца', condition:s=>Object.values(s.pet?.outfit||{}).filter(Boolean).length>=3, reward:30 },
    { id:'pet_age_30', name:'🎂 Месячный', desc:'Питомцу 30 дней', condition:s=>(s.pet?.age||0)>=30, reward:100 },
    { id:'daily_all_1', name:'📋 Планировщик', desc:'Выполни все задания дня', condition:s=>s.dailyPlantStage>=3, reward:25 },
    { id:'daily_all_7', name:'🎯 Недельный план', desc:'Выполни все задания 7 раз', condition:s=>(s.dailyAllCount||0)>=7, reward:100 },
    { id:'buy_first', name:'🛍️ Первая покупка', desc:'Купи что-нибудь', condition:s=>(s.purchasesCount||0)>=1, reward:10 },
    { id:'buy_skin', name:'🤖 Коллекционер', desc:'Купи скин робота', condition:s=>(s.inventory?.robotSkins?.length||0)>=2, reward:25 },
    { id:'buy_pet', name:'🐾 Друг питомцев', desc:'Купи нового питомца', condition:s=>(s.ownedPets?.length||0)>=2, reward:50 },
    { id:'math_10', name:'📐 Математик', desc:'Пройди 10 тем по математике', condition:s=>Object.values(s.progress?.math?.topics||{}).filter(t=>t.completed).length>=10, reward:30 },
    { id:'russian_10', name:'📖 Грамотей', desc:'Пройди 10 тем по русскому', condition:s=>Object.values(s.progress?.russian?.topics||{}).filter(t=>t.completed).length>=10, reward:30 },
    { id:'english_10', name:'🇬🇧 Полиглот', desc:'Пройди 10 тем по английскому', condition:s=>Object.values(s.progress?.english?.topics||{}).filter(t=>t.completed).length>=10, reward:30 },
    { id:'world_10', name:'🌍 Эрудит', desc:'Пройди 10 тем по окр. миру', condition:s=>Object.values(s.progress?.world?.topics||{}).filter(t=>t.completed).length>=10, reward:30 },
    { id:'stars_50', name:'⭐ Звёздный', desc:'Собери 50 звёзд', condition:s=>getTotalStars(s)>=50, reward:50 },
    { id:'stars_100', name:'🌟 Созвездие', desc:'Собери 100 звёзд', condition:s=>getTotalStars(s)>=100, reward:100 },
    { id:'perfect_round', name:'🎯 Идеальный раунд', desc:'Пройди урок без ошибок', condition:s=>(s.perfectRounds||0)>=1, reward:30 },
    { id:'marathon', name:'🏃 Марафонец', desc:'Пройди марафон', condition:s=>(s.marathonCompleted||0)>=1, reward:50 },
    { id:'fruit_5', name:'🍎 Садовод', desc:'Собери 5 плодов', condition:s=>(s.fruitsHarvested||0)>=5, reward:40 },
    { id:'album_photo', name:'📷 Фотограф', desc:'Добавь фото в альбом', condition:s=>(s.album?.length||0)>=1, reward:15 },
    { id:'album_10', name:'🖼️ Художник', desc:'Добавь 10 фото в альбом', condition:s=>(s.album?.length||0)>=10, reward:50 },
    { id:'change_name', name:'✏️ Творец', desc:'Смени имя питомца', condition:s=>s.pet?.name!==getDefaultPetName(s.pet?.type), reward:20 }
];

function getTotalStars(state) {
    let total = 0;
    ['math','russian','english','world'].forEach(subj => {
        if (state.progress[subj]) {
            total += Object.values(state.progress[subj].topics).reduce((sum, t) => sum + (t.stars||0), 0);
        }
    });
    return total;
}

function checkAchievements() {
    ACHIEVEMENTS_LIST.forEach(ach => {
        if (!AppState.achievements.includes(ach.id) && ach.condition(AppState)) {
            AppState.achievements.push(ach.id);
            updateCoins(ach.reward);
            EventBus.emit('achievement:unlocked', ach);
            if (typeof showNotification === 'function') {
                showNotification(`🏆 ${ach.name}! +${ach.reward}🪙`, 'success');
            }
            if (typeof showConfetti === 'function') {
                showConfetti('achievement');
            }
        }
    });
}

function getAchievements() {
    return ACHIEVEMENTS_LIST.map(ach => ({
        ...ach,
        unlocked: AppState.achievements.includes(ach.id)
    }));
}
