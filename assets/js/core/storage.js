// ==================== ХРАНИЛИЩЕ (МУЛЬТИПРОФИЛЬ) ====================
import { AppState, EventBus, setTheme } from './state.js';

const PROFILES_KEY = 'academy_profiles';
const STATE_PREFIX = 'academy_child_';

// ==================== РАБОТА С ПРОФИЛЯМИ ====================
export function loadProfiles() {
    try {
        const saved = localStorage.getItem(PROFILES_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('❌ Ошибка загрузки профилей:', e);
    }
    return [];
}

export function saveProfiles(profiles) {
    try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
        console.error('❌ Ошибка сохранения профилей:', e);
    }
}

export function addProfile(name, password = '') {
    const profiles = loadProfiles();
    const newProfile = {
        id: 'child_' + Date.now(),
        name,
        password,
        createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    saveProfiles(profiles);
    return newProfile;
}

export function removeProfile(id) {
    const profiles = loadProfiles().filter(p => p.id !== id);
    saveProfiles(profiles);
    localStorage.removeItem(STATE_PREFIX + id);
}

export function verifyChildPassword(id, password) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === id);
    if (!profile) return false;
    return profile.password === '' || profile.password === password;
}

// ==================== СОХРАНЕНИЕ СОСТОЯНИЯ ====================
export function saveState(childId) {
    if (!childId) return;
    
    try {
        const dataToSave = {
            user: AppState.user,
            coins: AppState.coins,
            gems: AppState.gems,
            totalSolved: AppState.totalSolved,
            totalGames: AppState.totalGames,
            streak: AppState.streak,
            lastLogin: AppState.lastLogin,
            progress: AppState.progress,
            inventory: AppState.inventory,
            pet: AppState.pet,
            achievements: AppState.achievements,
            dailyTasks: AppState.dailyTasks,
            lastDailyDate: AppState.lastDailyDate,
            chests: AppState.chests,
            settings: AppState.settings,
            parentControl: AppState.parentControl,
            mistakes: AppState.mistakes
        };
        
        localStorage.setItem(STATE_PREFIX + childId, JSON.stringify(dataToSave));
        EventBus.emit('storage:saved');
    } catch (e) {
        console.error('❌ Ошибка сохранения:', e);
    }
}

// ==================== ЗАГРУЗКА СОСТОЯНИЯ ====================
export function loadState(childId) {
    if (!childId) return false;
    
    try {
        const saved = localStorage.getItem(STATE_PREFIX + childId);
        if (saved) {
            const data = JSON.parse(saved);
            
            // Восстановление данных
            AppState.user = data.user || { name: 'Ученик', avatar: '🧑‍🎓', level: 1, xp: 0 };
            AppState.coins = data.coins || 500;
            AppState.gems = data.gems || 0;
            AppState.totalSolved = data.totalSolved || 0;
            AppState.totalGames = data.totalGames || 0;
            AppState.streak = data.streak || 0;
            AppState.lastLogin = data.lastLogin || null;
            AppState.progress = data.progress || { math: { topics: {}, diplomas: [] }, russian: { topics: {}, diplomas: [] }, english: { topics: {}, diplomas: [] }, world: { topics: {}, diplomas: [] } };
            AppState.inventory = data.inventory || { food: [], accessories: [], furniture: [], themes: ['default'], skipTokens: 0, reviveTokens: 0 };
            AppState.pet = data.pet || { type: 'cat', name: 'Мурка', hunger: 100, happiness: 100, energy: 100, age: 0, isSleeping: false, outfit: {} };
            AppState.achievements = data.achievements || [];
            AppState.dailyTasks = data.dailyTasks || [];
            AppState.lastDailyDate = data.lastDailyDate || null;
            AppState.chests = data.chests || { available: 0, solvedCounter: 0 };
            AppState.settings = data.settings || { theme: 'default', soundEnabled: true, musicEnabled: true, voiceEnabled: true };
            AppState.parentControl = data.parentControl || { enabled: false, password: '0000', dailyTimeLimit: 60, timePlayedToday: 0, restrictedGames: [], shopEnabled: true };
            AppState.mistakes = data.mistakes || [];
            
            // Применяем тему
            setTheme(AppState.settings.theme);
            
            EventBus.emit('storage:loaded');
            return true;
        }
    } catch (e) {
        console.error('❌ Ошибка загрузки:', e);
    }
    return false;
}

// ==================== СБРОС ====================
export function resetState(childId) {
    if (confirm('⚠️ Сбросить весь прогресс этого профиля?')) {
        localStorage.removeItem(STATE_PREFIX + childId);
        location.reload();
    }
}

// ==================== ЭКСПОРТ/ИМПОРТ ====================
export function exportData(childId) {
    const data = localStorage.getItem(STATE_PREFIX + childId);
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academy_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        EventBus.emit('notification:success', '📤 Данные экспортированы');
    }
}

export function importData(childId, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem(STATE_PREFIX + childId, JSON.stringify(data));
            EventBus.emit('notification:success', '📥 Данные импортированы. Перезагрузка...');
            setTimeout(() => location.reload(), 1500);
        } catch (err) {
            EventBus.emit('notification:error', '❌ Ошибка импорта');
        }
    };
    reader.readAsText(file);
        }
