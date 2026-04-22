import { AppState, EventBus } from './state.js';

const STORAGE_KEY = 'academy_robot_teacher_v1';

// ==================== СОХРАНЕНИЕ ====================
export function saveState() {
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
            settings: AppState.settings
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('✅ Состояние сохранено');
        EventBus.emit('storage:saved');
    } catch (e) {
        console.error('❌ Ошибка сохранения:', e);
    }
}

// ==================== ЗАГРУЗКА ====================
export function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            // Восстановление данных
            Object.assign(AppState.user, data.user || {});
            AppState.coins = data.coins || 500;
            AppState.gems = data.gems || 0;
            AppState.totalSolved = data.totalSolved || 0;
            AppState.totalGames = data.totalGames || 0;
            AppState.streak = data.streak || 0;
            AppState.lastLogin = data.lastLogin || null;
            AppState.progress = data.progress || { math: {}, russian: {}, english: {}, world: {} };
            AppState.settings = data.settings || { theme: 'default', soundEnabled: true, musicEnabled: true };
            
            console.log('✅ Состояние загружено');
            EventBus.emit('storage:loaded', AppState);
            return true;
        }
    } catch (e) {
        console.error('❌ Ошибка загрузки:', e);
    }
    return false;
}

// ==================== СБРОС ====================
export function resetState() {
    if (confirm('Сбросить весь прогресс? Это действие нельзя отменить!')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// ==================== ЭКСПОРТ/ИМПОРТ ====================
export function exportData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academy_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

export function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            location.reload();
        } catch (err) {
            alert('Ошибка импорта: неверный формат файла');
        }
    };
    reader.readAsText(file);
              }
