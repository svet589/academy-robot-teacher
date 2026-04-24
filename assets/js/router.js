// ==================== РОУТЕР (СТАТИЧЕСКИЙ, ПОЛНЫЙ ОФЛАЙН) ====================

// Все экраны
const Screens = {
    LOADING: 'loading',
    CHILD_SELECT: 'childSelect',
    APARTMENT: 'apartment',
    SUBJECT_SELECTION: 'subjectSelection',
    WORLDS: 'worlds',
    LIFE_MAP: 'lifeMap',
    LEARNING: 'learning',
    MARATHON: 'marathon',
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
    PET_ROOM: 'petRoom',
    SHOP: 'shop',
    INVENTORY: 'inventory',
    ACHIEVEMENTS: 'achievements',
    DAILY_TASKS: 'dailyTasks',
    ENCYCLOPEDIA: 'encyclopedia',
    ALBUM: 'album',
    MIRROR: 'mirror',
    SETTINGS: 'settings',
    PARENT: 'parent'
};

let currentScreen = Screens.LOADING;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function initApp() {
    console.log('🚀 Академия запускается...');
    
    // Инициализация систем
    if (typeof initNotifications === 'function') initNotifications();
    if (typeof initSounds === 'function') initSounds();
    if (typeof initAchievements === 'function') initAchievements();
    if (typeof initDailyTasks === 'function') initDailyTasks();
    
    // Загрузка профилей
    const profiles = typeof loadProfiles === 'function' ? loadProfiles() : [];
    
    // Показываем загрузку
    navigateTo(Screens.LOADING);
    
    // Через 2.5 секунды — выбор профиля или квартира
    setTimeout(() => {
        if (profiles.length === 0) {
            // Первый запуск — создаём профиль
            const defaultProfile = typeof addProfile === 'function' ? 
                addProfile('Ученик', '') : 
                { id: 'child_1', name: 'Ученик', password: '', avatar: '🧑‍🎓', photo: null, createdAt: new Date().toISOString() };
            
            if (!AppState.currentChild) AppState.currentChild = defaultProfile;
            if (typeof loadState === 'function') loadState(defaultProfile.id);
            if (typeof updateStreak === 'function') updateStreak();
            navigateTo(Screens.APARTMENT);
        } else if (profiles.length === 1 && !profiles[0].password) {
            // Один профиль без пароля
            AppState.currentChild = profiles[0];
            if (typeof loadState === 'function') loadState(profiles[0].id);
            if (typeof updateStreak === 'function') updateStreak();
            navigateTo(Screens.APARTMENT);
        } else {
            // Несколько профилей или пароль
            navigateTo(Screens.CHILD_SELECT);
        }
    }, 2500);
    
    // Подписка на события
    EventBus.on('navigate', (screen, params) => navigateTo(screen, params));
    
    console.log('✅ Приложение готово!');
}

// ==================== НАВИГАЦИЯ ====================
function navigateTo(screen, params = {}) {
    const app = document.getElementById('app');
    if (!app) return;
    
    currentScreen = screen;
    AppState.currentScreen = screen;
    app.innerHTML = '';
    
    const handlers = {
        [Screens.LOADING]: renderLoadingScreen,
        [Screens.CHILD_SELECT]: renderChildSelect,
        [Screens.APARTMENT]: renderApartment,
        [Screens.SUBJECT_SELECTION]: () => renderSubjectSelection(app),
        [Screens.WORLDS]: () => renderWorldsScreen(app, params.subject),
        [Screens.LIFE_MAP]: () => renderLifeMap(app, params.subject),
        [Screens.LEARNING]: () => renderLearningScreen(app, params.topic),
        [Screens.MARATHON]: () => renderMarathon(app),
        [Screens.ARCADE_HUB]: renderArcadeHub,
        [Screens.GAME_MAZE]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof MazeGame !== 'undefined' && MazeGame.start) MazeGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_WORD]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof WordGame !== 'undefined' && WordGame.start) WordGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_CHECKERS]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof CheckersGame !== 'undefined' && CheckersGame.start) CheckersGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_TIC_TAC]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof TicTacGame !== 'undefined' && TicTacGame.start) TicTacGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_MEMORY]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof MemoryGame !== 'undefined' && MemoryGame.start) MemoryGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_BATTLESHIP]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof BattleshipGame !== 'undefined' && BattleshipGame.start) BattleshipGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_SUDOKU]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof SudokuGame !== 'undefined' && SudokuGame.start) SudokuGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_SHOOT]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof ShootGame !== 'undefined' && ShootGame.start) ShootGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_COMPARE]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof CompareGame !== 'undefined' && CompareGame.start) CompareGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_FINGER]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof FingerGame !== 'undefined' && FingerGame.start) FingerGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_COMPOSITION]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof CompositionGame !== 'undefined' && CompositionGame.start) CompositionGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_CLOCK]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof ClockGame !== 'undefined' && ClockGame.start) ClockGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_CHANGE]: () => { app.innerHTML = '<div id="gameContainer"></div>'; if (typeof ChangeGame !== 'undefined' && ChangeGame.start) ChangeGame.start(document.getElementById('gameContainer')); },
        [Screens.PET_ROOM]: renderPetRoom,
        [Screens.SHOP]: renderShop,
        [Screens.ACHIEVEMENTS]: () => renderAchievementsScreen(app),
        [Screens.DAILY_TASKS]: () => renderDailyTasksScreen(app),
        [Screens.ENCYCLOPEDIA]: () => renderEncyclopedia(app),
        [Screens.ALBUM]: () => renderAlbum(app),
        [Screens.MIRROR]: () => renderMirror(app),
        [Screens.SETTINGS]: () => renderSettingsScreen(app),
        [Screens.PARENT]: () => renderParentCabinet(app)
    };
    
    const handler = handlers[screen];
    if (handler) {
        handler(params);
    } else {
        // По умолчанию — квартира
        renderApartment();
    }
    
    // Сохранение
    if (AppState.currentChild && typeof saveState === 'function') {
        saveState(AppState.currentChild.id);
    }
    
    console.log(`📍 Экран: ${screen}`);
}

// ==================== ЭКРАН ЗАГРУЗКИ ====================
function renderLoadingScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;">
            <div style="font-size:6rem;animation:loadingBounce 1s infinite;">🤖</div>
            <div style="font-size:1.5rem;margin:20px 0;color:#5a2d0c;">Академия Робота-Учителя</div>
            <div style="display:flex;gap:10px;font-size:2rem;">
                <span style="animation:starTwinkle 1.5s infinite;">✨</span>
                <span style="animation:starTwinkle 1.5s infinite 0.3s;">🌟</span>
                <span style="animation:starTwinkle 1.5s infinite 0.6s;">✨</span>
            </div>
            <div style="width:200px;height:10px;background:#ddd;border-radius:10px;margin-top:30px;overflow:hidden;">
                <div id="loadingBar" style="height:100%;background:#4caf50;width:0%;transition:width 2.5s;"></div>
            </div>
        </div>
        <style>
            @keyframes loadingBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
            @keyframes starTwinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
        </style>
    `;
    
    setTimeout(() => {
        const bar = document.getElementById('loadingBar');
        if (bar) bar.style.width = '100%';
    }, 100);
}

// ==================== ЭКРАН ВЫБОРА РЕБЁНКА ====================
function renderChildSelect() {
    const app = document.getElementById('app');
    const profiles = typeof loadProfiles === 'function' ? loadProfiles() : [];
    
    app.innerHTML = `
        <div style="max-width:600px;margin:0 auto;padding:30px;text-align:center;">
            <h1 style="color:#5a2d0c;margin-bottom:10px;">🏠 Кто сегодня играет?</h1>
            <p style="color:#888;margin-bottom:30px;">Выбери свой профиль</p>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:20px;margin-bottom:30px;">
                ${profiles.map(p => `
                    <div class="child-card" data-id="${p.id}" style="
                        background:linear-gradient(135deg,#ffe0b0,#ffd699);
                        border-radius:25px;
                        padding:25px 15px;
                        cursor:pointer;
                        border:4px solid #d4a259;
                        box-shadow:0 8px 0 #b47c2e;
                        text-align:center;
                    ">
                        <div style="font-size:4rem;margin-bottom:10px;">${p.photo ? `<img src="${p.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">` : (p.avatar || '🧑‍🎓')}</div>
                        <div style="font-size:1.4rem;font-weight:bold;">${p.name}</div>
                        ${p.password ? '<div style="color:#888;font-size:0.9rem;">🔒 Защищён</div>' : '<div style="color:#888;font-size:0.9rem;">🔓 Без пароля</div>'}
                    </div>
                `).join('')}
            </div>
            
            <button onclick="addNewChild()" style="width:100%;margin-bottom:10px;">➕ Новый ученик</button>
            <button onclick="navigateTo('parent')" class="btn-secondary" style="width:100%;">👨‍👩‍👧 Родителям</button>
        </div>
    `;
    
    // Обработчики
    document.querySelectorAll('.child-card').forEach(card => {
        card.onclick = () => {
            const id = card.dataset.id;
            const profile = profiles.find(p => p.id === id);
            if (!profile) return;
            
            if (profile.password) {
                showPasswordPrompt(id, profile.name);
            } else {
                AppState.currentChild = profile;
                if (typeof loadState === 'function') loadState(id);
                if (typeof updateStreak === 'function') updateStreak();
                navigateTo(Screens.APARTMENT);
            }
        };
    });
}

function showPasswordPrompt(childId, childName) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="max-width:400px;margin:50px auto;text-align:center;padding:30px;background:#f5e6d3;border-radius:30px;border:5px solid #8B4513;">
            <h3>🔐 Введи пароль</h3>
            <p>Профиль: <strong>${childName}</strong></p>
            <input type="password" id="childPwdInput" placeholder="Пароль" autofocus style="width:100%;padding:15px;border-radius:40px;border:3px solid #8B4513;text-align:center;font-size:1.2rem;margin:20px 0;">
            <button id="submitPwdBtn" style="width:100%;">✅ Войти</button>
            <button id="cancelPwdBtn" class="btn-secondary" style="width:100%;margin-top:10px;">↩️ Назад</button>
        </div>
    `;
    
    document.getElementById('submitPwdBtn').onclick = () => {
        const pwd = document.getElementById('childPwdInput').value;
        if (typeof verifyChildPassword === 'function' && verifyChildPassword(childId, pwd)) {
            const profiles = typeof loadProfiles === 'function' ? loadProfiles() : [];
            AppState.currentChild = profiles.find(p => p.id === childId);
            if (typeof loadState === 'function') loadState(childId);
            navigateTo(Screens.APARTMENT);
        } else {
            if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error');
        }
    };
    
    document.getElementById('cancelPwdBtn').onclick = () => renderChildSelect();
}

function addNewChild() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="max-width:400px;margin:50px auto;text-align:center;padding:30px;background:#f5e6d3;border-radius:30px;border:5px solid #8B4513;">
            <h3>👶 Новый ученик</h3>
            <input type="text" id="newChildName" placeholder="Имя" autofocus style="width:100%;padding:15px;border-radius:40px;border:3px solid #8B4513;text-align:center;font-size:1.2rem;margin:15px 0;">
            <input type="password" id="newChildPwd" placeholder="Пароль (необязательно)" style="width:100%;padding:15px;border-radius:40px;border:3px solid #8B4513;text-align:center;font-size:1.2rem;margin:15px 0;">
            <p style="font-size:0.9rem;color:#888;">📸 Фото можно добавить позже в зеркале 🪞</p>
            <button id="createChildBtn" style="width:100%;">✅ Создать</button>
            <button id="cancelCreateBtn" class="btn-secondary" style="width:100%;margin-top:10px;">↩️ Назад</button>
        </div>
    `;
    
    document.getElementById('createChildBtn').onclick = () => {
        const name = document.getElementById('newChildName').value.trim();
        const pwd = document.getElementById('newChildPwd').value;
        if (!name) {
            if (typeof showNotification === 'function') showNotification('❌ Введи имя!', 'error');
            return;
        }
        const profile = typeof addProfile === 'function' ? addProfile(name, pwd) : { id: 'child_1', name, password: pwd };
        AppState.currentChild = profile;
        if (typeof saveState === 'function') saveState(profile.id);
        navigateTo(Screens.APARTMENT);
    };
    
    document.getElementById('cancelCreateBtn').onclick = () => renderChildSelect();
}
