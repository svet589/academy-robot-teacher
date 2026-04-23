// ==================== ПОЛНЫЙ РОУТЕР ====================
import { AppState, EventBus, updateStreak } from './state.js';
import { loadState, saveState, loadProfiles } from './storage.js';
import { initNotifications } from './notifications.js';
import { initSounds } from './sounds.js';
import { initDailyTasks } from './daily.js';

// Все экраны
export const Screens = {
    LOADING: 'loading',
    CHILD_SELECT: 'childSelect',
    MAIN: 'main',
    SUBJECT_SELECTION: 'subjectSelection',
    WORLDS: 'worlds',
    LIFE_MAP: 'lifeMap',
    LEARNING: 'learning',
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
    PET_MODULE: 'petModule',
    SHOP: 'shop',
    INVENTORY: 'inventory',
    CHESTS: 'chests',
    ACHIEVEMENTS: 'achievements',
    DAILY_TASKS: 'dailyTasks',
    REFERENCE: 'reference',
    SETTINGS: 'settings',
    PARENT: 'parent'
};

let currentScreen = Screens.LOADING;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
export function initApp() {
    console.log('🚀 Академия запускается...');
    
    initNotifications();
    initSounds();
    initDailyTasks();
    
    const profiles = loadProfiles();
    
    if (profiles.length === 0) {
        const defaultProfile = { id: 'child_1', name: 'Ученик', password: '', createdAt: new Date().toISOString() };
        profiles.push(defaultProfile);
        saveProfiles(profiles);
        AppState.currentChild = defaultProfile;
        loadState(defaultProfile.id);
        navigateTo(Screens.MAIN);
    } else if (profiles.length === 1 && !profiles[0].password) {
        AppState.currentChild = profiles[0];
        loadState(profiles[0].id);
        navigateTo(Screens.MAIN);
    } else {
        navigateTo(Screens.CHILD_SELECT);
    }
    
    updateStreak();
    
    EventBus.on('navigate', (screen, params) => navigateTo(screen, params));
    
    console.log('✅ Приложение готово!');
}

// ==================== СОХРАНЕНИЕ ПРОФИЛЕЙ ====================
function saveProfiles(profiles) {
    import('./storage.js').then(m => m.saveProfiles(profiles));
}

// ==================== НАВИГАЦИЯ ====================
export function navigateTo(screen, params = {}) {
    const app = document.getElementById('app');
    currentScreen = screen;
    AppState.currentScreen = screen;
    
    app.innerHTML = '';
    
    const handlers = {
        [Screens.CHILD_SELECT]: () => import('./ui.js').then(m => m.renderChildSelect(app)),
        [Screens.MAIN]: () => import('./ui.js').then(m => m.renderMainMenu(app)),
        [Screens.SUBJECT_SELECTION]: () => import('./ui.js').then(m => m.renderSubjectSelection(app)),
        [Screens.WORLDS]: () => import('../modules/worlds.js').then(m => m.renderWorldsScreen(app, params.subject)),
        [Screens.LIFE_MAP]: () => import('./ui.js').then(m => m.renderLifeMap(app, params.subject, params.worldId)),
        [Screens.LEARNING]: () => import('./ui.js').then(m => m.renderLearningScreen(app, params.topic)),
        
        [Screens.ARCADE_HUB]: () => import('./ui.js').then(m => m.renderArcadeHub(app)),
        [Screens.GAME_MAZE]: () => import('./ui.js').then(m => m.renderMazeScreen(app)),
        [Screens.GAME_WORD]: () => import('./ui.js').then(m => m.renderWordScreen(app)),
        [Screens.GAME_CHECKERS]: () => import('./ui.js').then(m => m.renderCheckersScreen(app)),
        [Screens.GAME_TIC_TAC]: () => import('./ui.js').then(m => m.renderTicTacScreen(app)),
        [Screens.GAME_MEMORY]: () => import('./ui.js').then(m => m.renderMemoryScreen(app)),
        [Screens.GAME_BATTLESHIP]: () => import('./ui.js').then(m => m.renderBattleshipScreen(app)),
        [Screens.GAME_SUDOKU]: () => import('./ui.js').then(m => m.renderSudokuScreen(app)),
        [Screens.GAME_SHOOT]: () => import('./ui.js').then(m => m.renderShootScreen(app)),
        [Screens.GAME_COMPARE]: () => import('./ui.js').then(m => m.renderCompareScreen(app)),
        [Screens.GAME_FINGER]: () => import('./ui.js').then(m => m.renderFingerScreen(app)),
        [Screens.GAME_COMPOSITION]: () => import('./ui.js').then(m => m.renderCompositionScreen(app)),
        [Screens.GAME_CLOCK]: () => import('./ui.js').then(m => m.renderClockScreen(app)),
        [Screens.GAME_CHANGE]: () => import('./ui.js').then(m => m.renderChangeScreen(app)),
        
        [Screens.PET_MODULE]: () => import('./ui.js').then(m => m.renderPetModule(app)),
        [Screens.SHOP]: () => import('./ui.js').then(m => m.renderShop(app)),
        [Screens.CHESTS]: () => import('./ui.js').then(m => m.renderChests(app)),
        [Screens.ACHIEVEMENTS]: () => import('./ui.js').then(m => m.renderAchievements(app)),
        [Screens.DAILY_TASKS]: () => import('./daily.js').then(m => m.renderDailyTasksScreen(app)),
        [Screens.REFERENCE]: () => import('../modules/reference.js').then(m => m.renderReference(app)),
        [Screens.SETTINGS]: () => import('./ui.js').then(m => m.renderSettings(app)),
        [Screens.PARENT]: () => import('../modules/parent-control.js').then(m => m.renderParentCabinet(app))
    };
    
    const handler = handlers[screen];
    if (handler) {
        handler();
    } else {
        import('./ui.js').then(m => m.renderMainMenu(app));
    }
    
    if (AppState.currentChild) {
        saveState(AppState.currentChild.id);
    }
    
    console.log(`📍 ${screen}`);
}

export { currentScreen };
