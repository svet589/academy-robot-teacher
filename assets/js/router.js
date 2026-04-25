// ==================== ПОЛНЫЙ РОУТЕР ====================

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
    IGROTEKA: 'igroteka',
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

    // Инициализация систем (если функции существуют)
    try { if (typeof initNotifications === 'function') initNotifications(); } catch(e) { console.warn('notifications:', e); }
    try { if (typeof initSounds === 'function') initSounds(); } catch(e) { console.warn('sounds:', e); }
    try { if (typeof initAchievements === 'function') initAchievements(); } catch(e) { console.warn('achievements:', e); }
    try { if (typeof initDailyTasks === 'function') initDailyTasks(); } catch(e) { console.warn('daily:', e); }

    // Показываем загрузку
    navigateTo(Screens.LOADING);

    // Через 2.5 секунды ВСЕГДА показываем выбор аккаунта
    setTimeout(() => {
        navigateTo(Screens.CHILD_SELECT);
    }, 2500);

    console.log('✅ Роутер готов');
}

// ==================== НАВИГАЦИЯ ====================
function navigateTo(screen, params = {}) {
    const app = document.getElementById('app');
    if (!app) { console.error('❌ #app не найден!'); return; }

    currentScreen = screen;
    
    // Очищаем таймеры при переходе
    if (window.petSpeechTimer) {
        clearTimeout(window.petSpeechTimer);
        window.petSpeechTimer = null;
    }
    if (window.robotIdleTimer) {
        clearTimeout(window.robotIdleTimer);
        window.robotIdleTimer = null;
    }
    
    app.innerHTML = '';

    const handlers = {
        [Screens.LOADING]: () => {
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
            setTimeout(() => { const bar = document.getElementById('loadingBar'); if (bar) bar.style.width = '100%'; }, 100);
        },

        [Screens.CHILD_SELECT]: () => {
            if (typeof renderChildSelect === 'function') {
                renderChildSelect();
            } else {
                // Заглушка, если ui.js ещё не загрузился
                app.innerHTML = `
                    <div style="text-align:center;padding:40px;">
                        <div style="font-size:5rem;margin-bottom:20px;">👨‍👩‍👧</div>
                        <h2>Выбери ученика</h2>
                        <p style="margin:20px 0;">Создай профиль чтобы начать обучение!</p>
                        <button onclick="createDefaultProfile()" style="
                            background:#4caf50;color:white;border:none;
                            border-radius:50px;padding:15px 30px;
                            font-size:1.3rem;cursor:pointer;
                            box-shadow:0 5px 0 #2e7d32;
                        ">🧑‍🎓 Новый ученик</button>
                    </div>
                `;
            }
        },

        [Screens.APARTMENT]: () => {
            if (typeof renderApartment === 'function') renderApartment();
            else app.innerHTML = '<h2>Ошибка: renderApartment не найдена</h2>';
        },

        [Screens.SUBJECT_SELECTION]: () => {
            if (typeof renderSubjectSelection === 'function') renderSubjectSelection(app);
        },

        [Screens.WORLDS]: () => {
            if (typeof renderWorldsScreen === 'function') renderWorldsScreen(app, params.subject);
            else app.innerHTML = '<h2>Миры загружаются...</h2>';
        },

        [Screens.LIFE_MAP]: () => {
            if (typeof renderLifeMap === 'function') renderLifeMap(app, params.subject, params.worldId);
        },

        [Screens.LEARNING]: () => {
            if (typeof renderLearningScreen === 'function') renderLearningScreen(app, params.topic);
        },

        [Screens.MARATHON]: () => {
            if (typeof renderMarathon === 'function') renderMarathon(app);
        },

        [Screens.ARCADE_HUB]: () => {
            if (typeof renderArcadeHub === 'function') renderArcadeHub();
        },

        [Screens.IGROTEKA]: () => {
            if (typeof renderArcadeHub === 'function') renderArcadeHub();
        },

        [Screens.GAME_MAZE]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof MazeGame !== 'undefined') MazeGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_WORD]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof WordGame !== 'undefined') WordGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_CHECKERS]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof CheckersGame !== 'undefined') CheckersGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_TIC_TAC]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof TicTacGame !== 'undefined') TicTacGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_MEMORY]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof MemoryGame !== 'undefined') MemoryGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_BATTLESHIP]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof BattleshipGame !== 'undefined') BattleshipGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_SUDOKU]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof SudokuGame !== 'undefined') SudokuGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_SHOOT]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof ShootGame !== 'undefined') ShootGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_COMPARE]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof CompareGame !== 'undefined') CompareGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_FINGER]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof FingerGame !== 'undefined') FingerGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_COMPOSITION]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof CompositionGame !== 'undefined') CompositionGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_CLOCK]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof ClockGame !== 'undefined') ClockGame.start(document.getElementById('gameContainer')); },
        [Screens.GAME_CHANGE]: () => { app.innerHTML = '<div id="gameContainer" style="padding:20px;"></div>'; if (typeof ChangeGame !== 'undefined') ChangeGame.start(document.getElementById('gameContainer')); },

        [Screens.PET_ROOM]: () => {
            if (typeof renderFullPetRoom === 'function') renderFullPetRoom(app);
            else app.innerHTML = '<h2>Питомец загружается...</h2>';
        },

        [Screens.SHOP]: () => {
            if (typeof renderShop === 'function') renderShop();
        },

        [Screens.ACHIEVEMENTS]: () => {
            if (typeof renderAchievementsScreen === 'function') renderAchievementsScreen(app);
        },

        [Screens.DAILY_TASKS]: () => {
            if (typeof renderDailyTasksScreen === 'function') renderDailyTasksScreen(app);
        },

        [Screens.ENCYCLOPEDIA]: () => {
            if (typeof renderEncyclopediaModule === 'function') renderEncyclopediaModule(app);
        },

        [Screens.ALBUM]: () => {
            if (typeof renderAlbum === 'function') renderAlbum(app);
        },

        [Screens.MIRROR]: () => {
            if (typeof renderMirror === 'function') renderMirror(app);
        },

        [Screens.SETTINGS]: () => {
            if (typeof renderSettingsScreen === 'function') renderSettingsScreen(app);
        },

        [Screens.PARENT]: () => {
            if (typeof renderParentCabinet === 'function') renderParentCabinet(app);
        }
    };

    const handler = handlers[screen];
    if (handler) {
        try {
            handler(params);
        } catch (e) {
            console.error(`Ошибка при загрузке экрана ${screen}:`, e);
            app.innerHTML = `<div style="padding:40px;text-align:center;"><h2>Ошибка загрузки</h2><p>${e.message}</p><button onclick="navigateTo('apartment')">🏠 В квартиру</button></div>`;
        }
    } else {
        console.warn(`Нет обработчика для экрана: ${screen}`);
        navigateTo(Screens.APARTMENT);
    }

    // Сохранение состояния
    if (AppState.currentChild && typeof saveState === 'function') {
        try { saveState(AppState.currentChild.id); } catch(e) {}
    }

    console.log(`📍 Экран: ${screen}`);
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', initApp);
