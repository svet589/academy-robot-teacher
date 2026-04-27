// ==================== РОУТЕР ====================
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
    PET_ROOM: 'petRoom',
    SHOP: 'shop',
    ACHIEVEMENTS: 'achievements',
    DAILY_TASKS: 'dailyTasks',
    ENCYCLOPEDIA: 'encyclopedia',
    ALBUM: 'album',
    MIRROR: 'mirror',
    SETTINGS: 'settings',
    PARENT: 'parent',
    GAME_MAZE: 'gameMaze',
    GAME_WORD: 'gameWord',
    GAME_CHECKERS: 'gameCheckers',
    GAME_TIC_TAC: 'gameTicTac',
    GAME_MEMORY: 'gameMemory',
    GAME_BATTLESHIP: 'gameBattleship',
    GAME_SUDOKU: 'gameSudoku',
    GAME_SHOOT: 'gameShoot',
    GAME_COMPARE: 'gameCompare',
    GAME_DRAWING: 'gameDrawing',
    GAME_COMPOSITION: 'gameComposition',
    GAME_CLOCK: 'gameClock',
    GAME_CHANGE: 'gameChange'
};

let currentScreen = Screens.LOADING;

function initApp() {
    console.log('🚀 Академия запускается...');
    
    // Инициализация систем
    try { if (typeof initNotifications === 'function') initNotifications(); } catch(e) {}
    try { if (typeof initAchievements === 'function') initAchievements(); } catch(e) {}
    try { if (typeof initDailyTasks === 'function') initDailyTasks(); } catch(e) {}
    
    navigateTo(Screens.LOADING);
    
    setTimeout(() => {
        navigateTo(Screens.CHILD_SELECT);
    }, 2000);
    
    console.log('✅ Роутер готов');
}

function navigateTo(screen, params = {}) {
    const app = document.getElementById('app');
    if (!app) { console.error('❌ #app не найден!'); return; }
    
    // Очистка таймеров
    if (window.petSpeechTimer) { clearTimeout(window.petSpeechTimer); window.petSpeechTimer = null; }
    if (window.robotIdleTimer) { clearTimeout(window.robotIdleTimer); window.robotIdleTimer = null; }
    if (typeof gameTimer !== 'undefined' && gameTimer) { clearInterval(gameTimer); gameTimer = null; }
    
    currentScreen = screen;
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
                </div>
                <style>
                    @keyframes loadingBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
                    @keyframes starTwinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
                </style>
            `;
        },
        
        [Screens.CHILD_SELECT]: () => {
            if (typeof renderChildSelect === 'function') renderChildSelect();
            else app.innerHTML = '<h2>Ошибка загрузки выбора аккаунта</h2>';
        },
        
        [Screens.APARTMENT]: () => {
            if (typeof renderApartment === 'function') renderApartment();
            else app.innerHTML = '<h2>Ошибка загрузки квартиры</h2>';
        },
        
        [Screens.SUBJECT_SELECTION]: () => {
            if (typeof renderSubjectSelection === 'function') renderSubjectSelection(app);
        },
        
        [Screens.WORLDS]: () => {
            if (typeof renderWorlds === 'function') renderWorlds(app, params.subject);
        },
        
        [Screens.LIFE_MAP]: () => {
            if (typeof renderLifeMap === 'function') renderLifeMap(app, params.subject);
        },
        
        [Screens.LEARNING]: () => {
            if (typeof renderLearning === 'function') renderLearning(app, params.topic);
        },
        
        [Screens.MARATHON]: () => {
            if (typeof renderMarathon === 'function') renderMarathon(app);
        },
        
        [Screens.ARCADE_HUB]: () => {
            if (typeof renderArcadeHub === 'function') renderArcadeHub(app);
        },
        
        [Screens.PET_ROOM]: () => {
            if (typeof renderFullPetRoom === 'function') renderFullPetRoom(app);
            else app.innerHTML = '<h2>🐾 Питомец загружается...</h2><button onclick="navigateTo(\'apartment\')">↩️ В квартиру</button>';
        },
        
        [Screens.SHOP]: () => {
            if (typeof renderShop === 'function') renderShop(app);
        },
        
        [Screens.ACHIEVEMENTS]: () => {
            if (typeof renderAchievements === 'function') renderAchievements(app);
        },
        
        [Screens.DAILY_TASKS]: () => {
            if (typeof renderDailyTasks === 'function') renderDailyTasks(app);
        },
        
        [Screens.ENCYCLOPEDIA]: () => {
            if (typeof renderEncyclopedia === 'function') renderEncyclopedia(app);
        },
        
        [Screens.ALBUM]: () => {
            if (typeof renderAlbum === 'function') renderAlbum(app);
        },
        
        [Screens.MIRROR]: () => {
            if (typeof renderMirror === 'function') renderMirror(app);
        },
        
        [Screens.SETTINGS]: () => {
            if (typeof renderSettings === 'function') renderSettings(app);
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
        // Для игр
        const gameContainers = {
            [Screens.GAME_MAZE]: 'MazeGame',
            [Screens.GAME_WORD]: 'WordGame',
            [Screens.GAME_CHECKERS]: 'CheckersGame',
            [Screens.GAME_TIC_TAC]: 'TicTacGame',
            [Screens.GAME_MEMORY]: 'MemoryGame',
            [Screens.GAME_BATTLESHIP]: 'BattleshipGame',
            [Screens.GAME_SUDOKU]: 'SudokuGame',
            [Screens.GAME_SHOOT]: 'ShootGame',
            [Screens.GAME_COMPARE]: 'CompareGame',
            [Screens.GAME_DRAWING]: 'DrawingGame',
            [Screens.GAME_COMPOSITION]: 'CompositionGame',
            [Screens.GAME_CLOCK]: 'ClockGame',
            [Screens.GAME_CHANGE]: 'ChangeGame'
        };
        
        if (gameContainers[screen]) {
            app.innerHTML = `<div id="gameContainer" style="padding:20px;"></div><button onclick="navigateTo('arcadeHub')" class="back-btn" style="margin:10px;">↩️ В игротеку</button>`;
            setTimeout(() => {
                const game = window[gameContainers[screen]];
                if (game && typeof game.start === 'function') {
                    game.start(document.getElementById('gameContainer'));
                }
            }, 100);
        } else {
            console.warn(`Нет обработчика для экрана: ${screen}`);
            navigateTo(Screens.APARTMENT);
        }
    }
    
    // Сохранение состояния
    if (AppState.currentChild && typeof saveState === 'function') {
        try { saveState(AppState.currentChild.id, AppState); } catch(e) {}
    }
    
    console.log(`📍 Экран: ${screen}`);
}

document.addEventListener('DOMContentLoaded', initApp);
