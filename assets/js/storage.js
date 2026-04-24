// ==================== ХРАНИЛИЩЕ (МУЛЬТИПРОФИЛЬ) ====================

const PROFILES_KEY = 'academy_profiles_v2';
const STATE_PREFIX = 'academy_child_v2_';

// ==================== ПРОФИЛИ ====================
function loadProfiles() {
    try {
        const saved = localStorage.getItem(PROFILES_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Ошибка загрузки профилей:', e);
        return [];
    }
}

function saveProfiles(profiles) {
    try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
        console.error('Ошибка сохранения профилей:', e);
    }
}

function addProfile(name, password = '') {
    const profiles = loadProfiles();
    const newProfile = {
        id: 'child_' + Date.now(),
        name,
        password,
        avatar: '🧑‍🎓',
        photo: null,
        createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    saveProfiles(profiles);
    return newProfile;
}

function removeProfile(id) {
    const profiles = loadProfiles().filter(p => p.id !== id);
    saveProfiles(profiles);
    localStorage.removeItem(STATE_PREFIX + id);
}

function verifyChildPassword(id, password) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === id);
    if (!profile) return false;
    return profile.password === '' || profile.password === password;
}

function updateChildAvatar(id, avatar) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === id);
    if (profile) {
        profile.avatar = avatar;
        saveProfiles(profiles);
    }
}

function updateChildName(id, name) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === id);
    if (profile) {
        profile.name = name;
        saveProfiles(profiles);
    }
}

// ==================== ФОТО ПРОФИЛЯ ====================
function saveProfilePhoto(childId, photoData) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === childId);
    if (profile) {
        profile.photo = photoData;
        saveProfiles(profiles);
        return true;
    }
    return false;
}

function getProfilePhoto(childId) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === childId);
    return profile?.photo || null;
}

// ==================== ЗАГРУЗКА ИЗОБРАЖЕНИЯ ====================
function uploadImage(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            if (typeof showNotification === 'function') {
                showNotification('❌ Фото слишком большое! Максимум 2 МБ', 'error');
            }
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            if (callback) callback(base64);
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// ==================== АЛЬБОМ ====================
function addToAlbum(photoData, caption = '', date = null) {
    if (!AppState.album) AppState.album = [];
    AppState.album.push({
        id: 'photo_' + Date.now(),
        data: photoData,
        caption: caption,
        date: date || new Date().toISOString()
    });
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    if (typeof EventBus !== 'undefined') EventBus.emit('album:updated', AppState.album);
    if (typeof checkAchievements === 'function') checkAchievements();
    return AppState.album.length - 1;
}

function removeFromAlbum(index) {
    if (!AppState.album) return;
    AppState.album.splice(index, 1);
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    if (typeof EventBus !== 'undefined') EventBus.emit('album:updated', AppState.album);
}

function getAlbum() {
    return AppState.album || [];
}

// ==================== СОХРАНЕНИЕ СОСТОЯНИЯ ====================
function saveState(childId) {
    if (!childId) return;
    try {
        const dataToSave = {
            coins: AppState.coins,
            gems: AppState.gems,
            totalSolved: AppState.totalSolved,
            totalGames: AppState.totalGames,
            streak: AppState.streak,
            lastLogin: AppState.lastLogin,
            perfectRounds: AppState.perfectRounds,
            marathonCompleted: AppState.marathonCompleted,
            dailyAllCount: AppState.dailyAllCount,
            fruitsHarvested: AppState.fruitsHarvested,
            purchasesCount: AppState.purchasesCount,
            progress: AppState.progress,
            inventory: AppState.inventory,
            pet: AppState.pet,
            ownedPets: AppState.ownedPets,
            currentRobotSkin: AppState.currentRobotSkin,
            achievements: AppState.achievements,
            dailyTasks: AppState.dailyTasks,
            lastDailyDate: AppState.lastDailyDate,
            dailyPlantStage: AppState.dailyPlantStage,
            settings: AppState.settings,
            parentControl: AppState.parentControl,
            album: AppState.album,
            gameStats: AppState.gameStats
        };
        localStorage.setItem(STATE_PREFIX + childId, JSON.stringify(dataToSave));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

function loadState(childId) {
    if (!childId) return false;
    try {
        const saved = localStorage.getItem(STATE_PREFIX + childId);
        if (saved) {
            const data = JSON.parse(saved);
            
            AppState.coins = data.coins ?? 500;
            AppState.gems = data.gems ?? 0;
            AppState.totalSolved = data.totalSolved ?? 0;
            AppState.totalGames = data.totalGames ?? 0;
            AppState.streak = data.streak ?? 0;
            AppState.lastLogin = data.lastLogin ?? null;
            AppState.perfectRounds = data.perfectRounds ?? 0;
            AppState.marathonCompleted = data.marathonCompleted ?? 0;
            AppState.dailyAllCount = data.dailyAllCount ?? 0;
            AppState.fruitsHarvested = data.fruitsHarvested ?? 0;
            AppState.purchasesCount = data.purchasesCount ?? 0;
            AppState.progress = data.progress || { math: { topics: {}, diplomas: [] }, russian: { topics: {}, diplomas: [] }, english: { topics: {}, diplomas: [] }, world: { topics: {}, diplomas: [] } };
            AppState.inventory = data.inventory || { food: [], accessories: [], themes: ['apartment'], skipTokens: 0, reviveTokens: 0, robotSkins: ['🤖'] };
            
            // Питомец с правильным именем по умолчанию
            const defaultPetType = data.pet?.type || 'cat';
            const defaultPetName = typeof getDefaultPetName === 'function' ? getDefaultPetName(defaultPetType) : 'Мурка';
            
            AppState.pet = data.pet || {
                type: 'cat',
                name: defaultPetName,
                hunger: 100,
                happiness: 100,
                energy: 100,
                age: 0,
                birthDate: new Date().toISOString(),
                isSleeping: false,
                outfit: { hat: null, glasses: null, scarf: null, bow: null },
                room: { vaseFlower: '🌻' },
                stats: { timesFed: 0, timesPetted: 0, timesPlayed: 0 }
            };
            if (!AppState.pet.birthDate) AppState.pet.birthDate = new Date().toISOString();
            if (!AppState.pet.stats) AppState.pet.stats = { timesFed: 0, timesPetted: 0, timesPlayed: 0 };
            if (!AppState.pet.name) AppState.pet.name = defaultPetName;
            
            AppState.ownedPets = data.ownedPets || ['cat'];
            AppState.currentRobotSkin = data.currentRobotSkin || '🤖';
            AppState.achievements = data.achievements || [];
            AppState.dailyTasks = data.dailyTasks || [];
            AppState.lastDailyDate = data.lastDailyDate || null;
            AppState.dailyPlantStage = data.dailyPlantStage ?? 0;
            AppState.settings = data.settings || { theme: 'apartment', soundEnabled: true, voiceEnabled: true };
            AppState.parentControl = data.parentControl || { enabled: false, password: '0000', dailyTimeLimit: 60, timePlayedToday: 0, restrictedGames: [], shopEnabled: true };
            AppState.album = data.album || [];
            AppState.gameStats = data.gameStats || { mazeCompleted: 0, wordWins: 0, checkersWins: 0, ticTacWins: 0, memoryCompleted: 0, battleshipWins: 0, sudokuCompleted: 0, shootTargets: 0, compareCorrect: 0, fingerCorrect: 0, compositionCorrect: 0, clockCorrect: 0, changeCorrect: 0 };
            
            updateAge();
            return true;
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
    return false;
}

// ==================== ВОЗРАСТ ПИТОМЦА ====================
function updateAge() {
    if (!AppState.pet || !AppState.pet.birthDate) return;
    const birth = new Date(AppState.pet.birthDate);
    const now = new Date();
    AppState.pet.age = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
}

// ==================== СБРОС ====================
function resetState(childId) {
    if (confirm('⚠️ Сбросить весь прогресс этого профиля? Это действие нельзя отменить!')) {
        localStorage.removeItem(STATE_PREFIX + childId);
        location.reload();
    }
}

// ==================== ЭКСПОРТ/ИМПОРТ ====================
function exportData(childId) {
    const data = localStorage.getItem(STATE_PREFIX + childId);
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academy_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showNotification === 'function') {
            showNotification('📤 Данные экспортированы', 'success');
        }
    }
}

function importData(childId, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem(STATE_PREFIX + childId, JSON.stringify(data));
            if (typeof showNotification === 'function') {
                showNotification('📥 Данные импортированы. Перезагрузка...', 'success');
            }
            setTimeout(() => location.reload(), 1500);
        } catch (err) {
            if (typeof showNotification === 'function') {
                showNotification('❌ Ошибка импорта', 'error');
            }
        }
    };
    reader.readAsText(file);
}
