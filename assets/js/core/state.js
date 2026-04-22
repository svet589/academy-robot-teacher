// ==================== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ====================
export const AppState = {
    // Пользователь
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
    
    // Настройки
    settings: {
        theme: 'default', // default, dark, forest, ocean
        soundEnabled: true,
        musicEnabled: true,
        notificationsEnabled: true
    },
    
    // Питомец (ссылка на модуль)
    pet: null,
    
    // Текущий экран
    currentScreen: 'main',
    currentSubject: null
};

// ==================== СОБЫТИЯ ====================
export const EventBus = {
    events: {},
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
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

// ==================== МЕТОДЫ РАБОТЫ С СОСТОЯНИЕМ ====================
export function updateCoins(amount) {
    AppState.coins += amount;
    EventBus.emit('coins:updated', AppState.coins);
    EventBus.emit('state:changed', { coins: AppState.coins });
}

export function updateSolved(amount = 1) {
    AppState.totalSolved += amount;
    EventBus.emit('solved:updated', AppState.totalSolved);
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
}

export function getSubjectProgress(subject) {
    return AppState.progress[subject] || { topics: {}, diplomas: [] };
}

export function updateTopicProgress(subject, topicId, stars, completed) {
    if (!AppState.progress[subject]) {
        AppState.progress[subject] = { topics: {}, diplomas: [] };
    }
    
    AppState.progress[subject].topics[topicId] = { stars, completed };
    EventBus.emit('progress:updated', { subject, topicId, stars, completed });
}

export function addDiploma(subject, diploma) {
    if (!AppState.progress[subject]) {
        AppState.progress[subject] = { topics: {}, diplomas: [] };
    }
    
    AppState.progress[subject].diplomas.push(diploma);
    EventBus.emit('diploma:added', { subject, diploma });
               }
