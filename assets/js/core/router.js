// ==================== РОУТЕР ====================
import { AppState, EventBus, updateStreak } from './state.js';
import { loadState, saveState } from './storage.js';
import { initNotifications, showNotification } from './notifications.js';
import { renderMainMenu, renderLifeMap, renderLearningScreen, renderPetModule, renderParentCabinet, renderAchievements, renderSettings } from './ui.js';
import { renderArcade } from '../modules/arcade.js';
import { renderWorldsScreen, loadWorlds } from '../modules/worlds.js';

// Доступные экраны
export const Screens = {
    MAIN: 'main',
    WORLDS: 'worlds',
    LIFE_MAP: 'lifeMap',
    LEARNING: 'learning',
    PET_MODULE: 'petModule',
    ARCADE: 'arcade',
    SETTINGS: 'settings',
    PARENT: 'parent',
    ACHIEVEMENTS: 'achievements'
};

let currentScreen = Screens.MAIN;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
export function initApp() {
    console.log('🚀 Инициализация Академии Робота-Учителя...');
    
    loadState();
    initNotifications();
    updateStreak();
    
    navigateTo(Screens.MAIN);
    
    EventBus.on('navigate', (screen, params) => navigateTo(screen, params));
    EventBus.on('subject:selected', (subject) => selectSubject(subject));
    EventBus.on('world:selected', ({ subject, world }) => selectWorld(subject, world));
    EventBus.on('topic:selected', (topic) => startTopic(topic));
    
    console.log('✅ Приложение готово!');
}

// ==================== НАВИГАЦИЯ ====================
export function navigateTo(screen, params = {}) {
    const app = document.getElementById('app');
    currentScreen = screen;
    AppState.currentScreen = screen;
    
    app.innerHTML = '';
    
    switch (screen) {
        case Screens.MAIN:
            renderMainMenu(app);
            break;
        case Screens.WORLDS:
            renderWorldsScreen(app, params.subject);
            break;
        case Screens.LIFE_MAP:
            renderLifeMap(app, params.subject, params.worldId);
            break;
        case Screens.LEARNING:
            renderLearningScreen(app, params.topic);
            break;
        case Screens.PET_MODULE:
            renderPetModule(app);
            break;
        case Screens.ARCADE:
            renderArcade(app);
            break;
        case Screens.SETTINGS:
            renderSettings(app);
            break;
        case Screens.PARENT:
            renderParentCabinet(app);
            break;
        case Screens.ACHIEVEMENTS:
            renderAchievements(app);
            break;
        default:
            renderMainMenu(app);
    }
    
    saveState();
    console.log(`📍 Навигация: ${screen}`);
}

// ==================== ВЫБОР ПРЕДМЕТА ====================
async function selectSubject(subject) {
    AppState.currentSubject = subject;
    await loadWorlds(subject);
    navigateTo(Screens.WORLDS, { subject });
}

// ==================== ВЫБОР МИРА ====================
function selectWorld(subject, world) {
    AppState.currentSubject = subject;
    AppState.currentWorld = world;
    navigateTo(Screens.LIFE_MAP, { subject, worldId: world.id });
}

// ==================== ЗАПУСК ТЕМЫ ====================
function startTopic(topic) {
    navigateTo(Screens.LEARNING, { topic });
}

// Экспорт для использования
export { currentScreen };
