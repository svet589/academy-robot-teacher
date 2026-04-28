// ==================== РОУТЕР ====================

// Список всех экранов
const Screens = {
    LOADING: 'loading',
    CHILD_SELECT: 'childSelect',
    MAIN_MENU: 'mainMenu',
    APARTMENT: 'apartment',
    SUBJECT_SELECTION: 'subjectSelection',
    LESSON_TYPE: 'lessonType',
    LESSON_SECTION: 'lessonSection',
    LESSON_SCREEN: 'lessonScreen',
    ARCADE: 'arcade',
    SHOP_MENU: 'shopMenu',
    SHOP: 'shop',
    AVATAR_SHOP: 'avatarShop',
    THEMES_SHOP: 'themesShop',
    INVENTORY: 'inventory',
    ACHIEVEMENTS: 'achievements',
    DAILY: 'daily',
    REFERENCE: 'reference',
    SETTINGS: 'settings',
    PARENT: 'parent',
    PET_ROOM: 'petScreen',
    // Игры
    GAME_MAZE: 'gameMazeScreen',
    GAME_WORD: 'gameWordScreen',
    GAME_CHECKERS: 'gameCheckersScreen',
    GAME_TIC_TAC: 'gameTicTacScreen',
    GAME_MEMORY: 'gameMemoryScreen',
    GAME_BATTLESHIP: 'gameBattleshipScreen',
    GAME_SUDOKU: 'gameSudokuScreen',
    GAME_SHOOT: 'gameShootScreen',
    GAME_COMPARE: 'gameCompareFastScreen',
    GAME_FINGER: 'gameFingerScreen',
    GAME_COMPOSITION: 'gameCompositionScreen',
    GAME_CLOCK: 'gameClockScreen',
    GAME_CHANGE: 'gameChangeScreen',
    GAME_DRAWING: 'gameDrawingScreen'
};

let currentScreen = Screens.LOADING;

function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    
    // Обновляем заголовки
    if (screenId === 'mainMenu' || screenId === 'apartment') {
        document.getElementById('robotHeader').style.display = 'flex';
        document.getElementById('statsHeader').style.display = 'flex';
        updateStatsUI();
    }
    
    if (screenId === 'childSelect') {
        document.getElementById('robotHeader').style.display = 'none';
        document.getElementById('statsHeader').style.display = 'none';
        renderChildList();
    }
    
    // Обновляем содержимое экранов при переходе
    if (screenId === 'achievements') refreshAchievements();
    if (screenId === 'daily') renderDailyTasks();
    if (screenId === 'reference') showRefTab('tab1');
    if (screenId === 'inventory') renderInventory();
    if (screenId === 'petScreen') renderPetScreen();
    if (screenId === 'avatarShop') renderAvatarShop();
    if (screenId === 'shop') renderShop();
    if (screenId === 'themesShop') renderThemesShop();
    if (screenId === 'shopMenu') updateStatsUI();
    
    currentScreen = screenId;
    
    // Сохранение состояния
    if (currentChild) saveData();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function initApp() {
    console.log('🚀 Академия запускается...');
    
    loadMasterPassword();
    loadChildrenList();
    
    // Показываем выбор аккаунта
    if (childrenList.length > 0) {
        showScreen('childSelect');
    } else {
        // Создаём первого ученика
        resetData();
        data.owned_avatars = ["🤖"];
        data.current_avatar = "🤖";
        data.owned_themes = ["default"];
        saveChildData('Ученик', data);
        childrenList = ['Ученик'];
        saveChildrenList();
        showScreen('childSelect');
    }
    
    // Активируем аудио при первом клике
    document.addEventListener('click', function initAudioOnce() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume();
        document.removeEventListener('click', initAudioOnce);
    });
    
    console.log('✅ Роутер готов');
}

document.addEventListener('DOMContentLoaded', initApp);
