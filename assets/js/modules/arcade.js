// ==================== ИГРОТЕКА (ХАБ) ====================
import { AppState, EventBus, checkTimeLimit, canPlayGame } from '../core/state.js';
import { Screens, navigateTo } from '../core/router.js';

const GAMES = [
    { id: 'maze', name: '🗺️ Лабиринт', emoji: '🗺️', screen: Screens.GAME_MAZE, description: 'Найди выход из лабиринта! 5 уровней' },
    { id: 'word', name: '❓ Слово', emoji: '❓', screen: Screens.GAME_WORD, description: 'Отгадай слово по буквам! 7 попыток' },
    { id: 'checkers', name: '⚫ Шашки', emoji: '⚫', screen: Screens.GAME_CHECKERS, description: 'Классические шашки против бота' },
    { id: 'ticTac', name: '❌ Крестики-нолики', emoji: '❌', screen: Screens.GAME_TIC_TAC, description: 'Сыграй против умного бота' },
    { id: 'memory', name: '🧠 Найди пару', emoji: '🧠', screen: Screens.GAME_MEMORY, description: 'Тренируй память! 8 пар' },
    { id: 'battleship', name: '🚢 Морской бой', emoji: '🚢', screen: Screens.GAME_BATTLESHIP, description: 'Потопи корабли бота!' },
    { id: 'sudoku', name: '🧩 Судоку 4×4', emoji: '🧩', screen: Screens.GAME_SUDOKU, description: 'Заполни сетку числами' },
    { id: 'shootGame', name: '🎯 Попади в цель', emoji: '🎯', screen: Screens.GAME_SHOOT, description: 'Реши примеры и попади в цель!' },
    { id: 'compareFast', name: '⚡ Сравни числа', emoji: '⚡', screen: Screens.GAME_COMPARE, description: 'Сравнивай числа на скорость!' },
    { id: 'fingerCount', name: '🖐️ Счёт на пальцах', emoji: '🖐️', screen: Screens.GAME_FINGER, description: 'Посчитай пальцы!' },
    { id: 'numberComposition', name: '🔢 Состав числа', emoji: '🔢', screen: Screens.GAME_COMPOSITION, description: 'Разложи число на части' },
    { id: 'clockGame', name: '⏰ Который час?', emoji: '⏰', screen: Screens.GAME_CLOCK, description: 'Определи время на часах' },
    { id: 'changeGame', name: '💰 Сдача в магазине', emoji: '💰', screen: Screens.GAME_CHANGE, description: 'Посчитай сдачу правильно!' }
];

export function renderArcadeHub(app) {
    const canPlay = checkTimeLimit();
    
    app.innerHTML = `
        <div class="card">
            <div class="screen-header">
                <button class="back-btn" id="backFromArcadeBtn">↩️ Назад</button>
                <h2>🎮 ИГРОТЕКА</h2>
                <div></div>
            </div>
            ${!canPlay ? '<div class="time-limit-warning"><span>⏰</span><p>Лимит времени исчерпан.</p></div>' : ''}
            <p style="text-align:center;margin-bottom:20px;">Всего игр: <strong>${AppState.totalGames}</strong></p>
            <div class="games-grid">
                ${GAMES.map(game => {
                    const restricted = !canPlayGame(game.id);
                    const locked = !canPlay || restricted;
                    return `
                        <div class="game-card ${locked ? 'locked' : ''}" data-screen="${game.screen}">
                            <div class="game-emoji">${game.emoji}</div>
                            <div class="game-name">${game.name}</div>
                            <div class="game-desc">${game.description}</div>
                            ${locked ? '<div class="game-lock">🚫</div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('backFromArcadeBtn').onclick = () => navigateTo(Screens.MAIN);
    document.querySelectorAll('.game-card:not(.locked)').forEach(card => {
        card.onclick = () => {
            const screen = card.dataset.screen;
            if (screen) navigateTo(screen);
        };
    });
}

export { GAMES };
