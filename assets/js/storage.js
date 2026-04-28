// ==================== ХРАНИЛИЩЕ (STORAGE) ====================

function hashPassword(pwd) { return btoa(pwd); }
function verifyPassword(input, hash) { return btoa(input) === hash; }

// ==================== ДЕТИ (ПРОФИЛИ) ====================
function loadChildrenList() {
    const saved = localStorage.getItem('math_academy_children');
    childrenList = saved ? JSON.parse(saved) : ['Ученик'];
}

function saveChildrenList() {
    localStorage.setItem('math_academy_children', JSON.stringify(childrenList));
}

// ==================== ДАННЫЕ РЕБЁНКА ====================
function loadChildData(name) {
    const saved = localStorage.getItem('math_academy_child_' + name);
    if (saved) {
        const loaded = JSON.parse(saved);
        for (let key in data) {
            if (loaded[key] !== undefined) data[key] = loaded[key];
        }
    } else {
        resetData();
    }
    if (!data.owned_avatars) data.owned_avatars = ["🤖"];
    if (!data.current_avatar) data.current_avatar = "🤖";
    if (!data.owned_themes) data.owned_themes = ["default"];
    if (!data.daily_stats) data.daily_stats = [];
    if (!data.mistakes) data.mistakes = [];
    if (!data.boosters) data.boosters = { multiplier: 0, multiplier_left: 0, shield: false, luck: false };
    if (!data.pet) data.pet = null;
}

function saveChildData(name, d) {
    localStorage.setItem('math_academy_child_' + name, JSON.stringify(d));
}

function saveData() {
    if (currentChild) saveChildData(currentChild, data);
}

function resetData() {
    data = {
        total_solved: 0, achievements: [], coins: 0, coins_earned_total: 0,
        purchases_count: 0, skip_token: 0, revive_token: 0, perfect_rounds: 0,
        skin_theme: "default", daily_tasks: [], last_daily_date: "", last_login_date: "",
        login_streak: 0, passwordHash: "", pet: null, purchase_log: [],
        lesson_log: [], current_avatar: "🤖", owned_avatars: ["🤖"], owned_themes: ["default"],
        daily_stats: [], mistakes: [], boosters: { multiplier: 0, multiplier_left: 0, shield: false, luck: false },
        games_unlocked: 0
    };
}

// ==================== МАСТЕР-ПАРОЛЬ ====================
function loadMasterPassword() {
    const saved = localStorage.getItem('math_academy_master_password');
    masterPasswordHash = saved || hashPassword('0000');
    if (!saved) localStorage.setItem('math_academy_master_password', masterPasswordHash);
}

function setMasterPassword(pwd) {
    masterPasswordHash = hashPassword(pwd);
    localStorage.setItem('math_academy_master_password', masterPasswordHash);
}

function verifyMasterPassword(input) {
    return verifyPassword(input, masterPasswordHash);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ====================
function enterChildMode(name) {
    currentChild = name;
    loadChildData(name);
    updateStatsUI();
    updateRobotAvatar();
    showScreen('mainMenu');
}
