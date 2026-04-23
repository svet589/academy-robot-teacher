// ==================== ПОЛНЫЙ РОУТЕР ====================
import { AppState, EventBus, updateStreak } from './state.js';
import { loadState, saveState, loadProfiles, saveProfiles } from './storage.js';
import { initNotifications } from './notifications.js';
import { initSounds } from './sounds.js';
import { initAchievements } from './achievements.js';
import { initDailyTasks } from './daily.js';

// ==================== ВСЕ ЭКРАНЫ ====================
export const Screens = {
    // Системные
    LOADING: 'loading',
    CHILD_SELECT: 'childSelect',
    MAIN: 'main',
    
    // Уроки
    SUBJECT_SELECTION: 'subjectSelection',
    WORLDS: 'worlds',
    LIFE_MAP: 'lifeMap',
    LEARNING: 'learning',
    
    // Игротека (13 игр)
    ARCADE_HUB: 'arcadeHub',
    GAME_MAZE: 'gameMaze',
    GAME_WORD: 'gameWord',
    GAME_CHECKERS: 'gameCheckers',
    GAME_TIC_TAC: 'gameTicTac',
    GAME_MEMORY: 'gameMemory',
    GAME_BATTLESHIP: 'gameBattleship',
    GAME_SUDOKU: 'gameSudoku',
    GAME_SHOOT: 'gameShoot',
    GAME_COMPARE: 'gameCompare',
    GAME_FINGER: 'gameFinger',
    GAME_COMPOSITION: 'gameComposition',
    GAME_CLOCK: 'gameClock',
    GAME_CHANGE: 'gameChange',
    
    // Питомец
    PET_MODULE: 'petModule',
    PET_BEDROOM: 'petBedroom',
    PET_KITCHEN: 'petKitchen',
    PET_LIVING: 'petLiving',
    PET_STREET: 'petStreet',
    
    // Магазин
    SHOP: 'shop',
    SHOP_FOOD: 'shopFood',
    SHOP_ACCESSORIES: 'shopAccessories',
    SHOP_FURNITURE: 'shopFurniture',
    SHOP_THEMES: 'shopThemes',
    INVENTORY: 'inventory',
    
    // Остальное
    ACHIEVEMENTS: 'achievements',
    DAILY_TASKS: 'dailyTasks',
    REFERENCE: 'reference',
    SETTINGS: 'settings',
    PARENT: 'parent',
    
    // Новое
    CHESTS: 'chests'
};

let currentScreen = Screens.LOADING;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
export function initApp() {
    console.log('🚀 Инициализация Академии...');
    
    // Инициализация всех систем
    initNotifications();
    initSounds();
    initAchievements();
    initDailyTasks();
    
    // Загрузка профилей
    const profiles = loadProfiles();
    
    if (profiles.length === 0) {
        // Первый запуск - создаём профиль по умолчанию
        const defaultProfile = {
            id: 'child_1',
            name: 'Ученик',
            password: '',
            createdAt: new Date().toISOString()
        };
        profiles.push(defaultProfile);
        saveProfiles(profiles);
        AppState.currentChild = defaultProfile;
        loadState(defaultProfile.id);
        navigateTo(Screens.MAIN);
    } else if (profiles.length === 1 && !profiles[0].password) {
        // Один профиль без пароля - сразу входим
        AppState.currentChild = profiles[0];
        loadState(profiles[0].id);
        navigateTo(Screens.MAIN);
    } else {
        // Несколько профилей или есть пароль - показываем выбор
        navigateTo(Screens.CHILD_SELECT);
    }
    
    // Обновляем стрик
    updateStreak();
    
    // Подписываемся на события
    EventBus.on('navigate', (screen, params) => navigateTo(screen, params));
    EventBus.on('child:selected', (child) => selectChild(child));
    EventBus.on('screen:back', () => goBack());
    
    console.log('✅ Приложение готово!');
}

// ==================== НАВИГАЦИЯ ====================
export function navigateTo(screen, params = {}) {
    const app = document.getElementById('app');
    currentScreen = screen;
    AppState.currentScreen = screen;
    
    app.innerHTML = '';
    
    // Динамический импорт для больших экранов
    const screenHandlers = {
        [Screens.CHILD_SELECT]: () => import('./ui.js').then(m => m.renderChildSelect(app)),
        [Screens.MAIN]: () => import('./ui.js').then(m => m.renderMainMenu(app)),
        [Screens.SUBJECT_SELECTION]: () => import('./ui.js').then(m => m.renderSubjectSelection(app)),
        [Screens.WORLDS]: () => import('../modules/worlds.js').then(m => m.renderWorldsScreen(app, params.subject)),
        [Screens.LIFE_MAP]: () => import('./ui.js').then(m => m.renderLifeMap(app, params.subject, params.worldId)),
        [Screens.LEARNING]: () => import('./ui.js').then(m => m.renderLearningScreen(app, params.topic)),
        
        // Игротека
        [Screens.ARCADE_HUB]: () => import('../modules/arcade.js').then(m => m.renderArcadeHub(app)),
        [Screens.GAME_MAZE]: () => import('../games/maze.js').then(m => m.renderScreen(app)),
        [Screens.GAME_WORD]: () => import('../games/word.js').then(m => m.renderScreen(app)),
        [Screens.GAME_CHECKERS]: () => import('../games/checkers.js').then(m => m.renderScreen(app)),
        [Screens.GAME_TIC_TAC]: () => import('../games/tic-tac.js').then(m => m.renderScreen(app)),
        [Screens.GAME_MEMORY]: () => import('../games/memory.js').then(m => m.renderScreen(app)),
        [Screens.GAME_BATTLESHIP]: () => import('../games/battleship.js').then(m => m.renderScreen(app)),
        [Screens.GAME_SUDOKU]: () => import('../games/sudoku.js').then(m => m.renderScreen(app)),
        [Screens.GAME_SHOOT]: () => import('../games/shoot-game.js').then(m => m.renderScreen(app)),
        [Screens.GAME_COMPARE]: () => import('../games/compare-fast.js').then(m => m.renderScreen(app)),
        [Screens.GAME_FINGER]: () => import('../games/finger-count.js').then(m => m.renderScreen(app)),
        [Screens.GAME_COMPOSITION]: () => import('../games/number-composition.js').then(m => m.renderScreen(app)),
        [Screens.GAME_CLOCK]: () => import('../games/clock-game.js').then(m => m.renderScreen(app)),
        [Screens.GAME_CHANGE]: () => import('../games/change-game.js').then(m => m.renderScreen(app)),
        
        // Питомец
        [Screens.PET_MODULE]: () => import('../modules/pet-module.js').then(m => m.renderPetModule(app)),
        
        // Магазин
        [Screens.SHOP]: () => import('../modules/shop.js').then(m => m.renderShop(app)),
        
        // Справочник
        [Screens.REFERENCE]: () => import('../modules/reference.js').then(m => m.renderReference(app)),
        
        // Достижения
        [Screens.ACHIEVEMENTS]: () => import('./ui.js').then(m => m.renderAchievements(app)),
        
        // Ежедневные задания
        [Screens.DAILY_TASKS]: () => import('./daily.js').then(m => m.renderDailyTasks(app)),
        
        // Сундуки (новое)
        [Screens.CHESTS]: () => import('./ui.js').then(m => m.renderChests(app)),
        
        // Настройки
        [Screens.SETTINGS]: () => import('./ui.js').then(m => m.renderSettings(app)),
        
        // Родительский кабинет
        [Screens.PARENT]: () => import('../modules/parent-control.js').then(m => m.renderParentCabinet(app))
    };
    
    const handler = screenHandlers[screen];
    if (handler) {
        handler();
    } else {
        // По умолчанию - главное меню
        import('./ui.js').then(m => m.renderMainMenu(app));
    }
    
    // Сохраняем состояние при смене экрана
    if (AppState.currentChild) {
        saveState(AppState.currentChild.id);
    }
    
    console.log(`📍 Навигация: ${screen}`);
}

// ==================== ВЫБОР РЕБЁНКА ====================
function selectChild(child) {
    AppState.currentChild = child;
    loadState(child.id);
    navigateTo(Screens.MAIN);
}

// ==================== НАЗАД ====================
function goBack() {
    // История навигации (можно расширить)
    navigateTo(Screens.MAIN);
}

// ==================== ЭКСПОРТ ====================
export { currentScreen };
