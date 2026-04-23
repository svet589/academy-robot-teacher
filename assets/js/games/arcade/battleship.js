// ==================== 🚢 МОРСКОЙ БОЙ ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false;
let playerBoard = [];
let botBoard = [];
let playerShips = 5;
let botShips = 5;
let gameOver = false;
let playerTurn = true;
let modalContainer = null;
let gameModal = null;

// ==================== ЗАПУСК ИГРЫ ====================
export function startBattleship() {
    gameActive = true;
    gameOver = false;
    playerTurn = true;
    
    initBoards();
    createModal();
    renderBoards();
    
    document.getElementById('battleshipModal').classList.add('active');
}

// ==================== ИНИЦИАЛИЗАЦИЯ ДОСОК ====================
function initBoards() {
    playerBoard = Array(8).fill().map(() => Array(8).fill(null));
    botBoard = Array(8).fill().map(() => Array(8).fill(null));
    
    playerShips = 5;
    botShips = 5;
    
    placeShips(playerBoard, 5);
    placeShips(botBoard, 5);
}

function placeShips(board, count) {
    let placed = 0;
    while (placed < count) {
        const row = Math.floor(Math.random() * 8);
        const col = Math.floor(Math.random() * 8);
        if (board[row][col] !== 'ship') {
            board[row][col] = 'ship';
            placed++;
        }
    }
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'battleshipModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-title">🚢 Морской бой</div>
            <div class="game-container">
                <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                    <div>
                        <h3 style="text-align: center;">🎯 Твои выстрелы</h3>
                        <div id="playerShotsBoard" class="battleship-board"></div>
                    </div>
                    <div>
                        <h3 style="text-align: center;">🤖 Выстрелы бота</h3>
                        <div id="botShotsBoard" class="battleship-board"></div>
                    </div>
                </div>
                <div id="battleshipStatus" class="game-status"></div>
                <div class="game-controls" style="margin-top: 15px;">
                    <button id="resetBattleshipBtn">🔄 Новая игра</button>
                </div>
            </div>
            <button class="close-btn" id="closeBattleshipBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('resetBattleshipBtn').onclick = () => {
        initBoards();
        gameOver = false;
        gameActive = true;
        playerTurn = true;
        renderBoards();
        showNotification('🔄 Новая игра!', 'info');
    };
    document.getElementById('closeBattleshipBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ОТРИСОВКА ДОСОК ====================
function renderBoards() {
    renderBoard('playerShotsBoard', playerBoard, true);
    renderBoard('botShotsBoard', botBoard, false);
    renderStatus();
}

function renderBoard(containerId, board, isPlayerBoard) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = board[i][j];
            let cellClass = 'battleship-cell';
            let content = '🌊';
            
            if (cell === 'hit') {
                cellClass += ' hit';
                content = '💥';
            } else if (cell === 'miss') {
                cellClass += ' miss';
                content = '❌';
            } else if (isPlayerBoard && cell === 'ship') {
                content = '🚢';
            }
            
            html += `<div class="${cellClass}" data-row="${i}" data-col="${j}" data-board="${isPlayerBoard ? 'player' : 'bot'}">${content}</div>`;
        }
    }
    
    container.innerHTML = html;
    container.style.gridTemplateColumns = 'repeat(8, 1fr)';
    
    if (isPlayerBoard) {
        container.querySelectorAll('[data-board="player"]').forEach(cell => {
            cell.onclick = () => {
                if (!gameActive || gameOver || !playerTurn) return;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                playerShoot(row, col);
            };
        });
    }
}

function renderStatus() {
    const status = document.getElementById('battleshipStatus');
    if (gameOver) {
        if (playerShips === 0) {
            status.innerHTML = '<p style="text-align: center; font-size: 1.3rem;">🎉 ПОБЕДА! Все корабли бота потоплены!</p>';
        } else {
            status.innerHTML = '<p style="text-align: center; font-size: 1.3rem;">😢 ПОРАЖЕНИЕ...</p>';
        }
    } else {
        status.innerHTML = `
            <p style="text-align: center; font-size: 1.1rem;">
                ${playerTurn ? '✅ ТВОЙ ХОД!' : '⏳ Бот думает...'}<br>
                🚢 Твои корабли: ${botShips} | 🤖 Корабли бота: ${playerShips}
            </p>
        `;
    }
}

// ==================== ВЫСТРЕЛ ИГРОКА ====================
function playerShoot(row, col) {
    if (!gameActive || gameOver || !playerTurn) return;
    
    const cell = playerBoard[row][col];
    if (cell === 'hit' || cell === 'miss') {
        showNotification('Ты уже стрелял сюда!', 'warning');
        return;
    }
    
    if (cell === 'ship') {
        playerBoard[row][col] = 'hit';
        playerShips--;
        showNotification('💥 Попадание!', 'success');
    } else {
        playerBoard[row][col] = 'miss';
        showNotification('❌ Мимо!', 'info');
    }
    
    renderBoards();
    
    if (playerShips === 0) {
        gameOver = true;
        gameActive = false;
        winGame();
        return;
    }
    
    playerTurn = false;
    renderBoards();
    
    setTimeout(() => botShoot(), 800);
}

// ==================== ВЫСТРЕЛ БОТА ====================
function botShoot() {
    if (!gameActive || gameOver || playerTurn) return;
    
    const available = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = botBoard[i][j];
            if (cell !== 'hit' && cell !== 'miss') {
                available.push({ row: i, col: j });
            }
        }
    }
    
    if (available.length === 0) {
        gameOver = true;
        gameActive = false;
        renderBoards();
        return;
    }
    
    const shot = available[Math.floor(Math.random() * available.length)];
    
    if (botBoard[shot.row][shot.col] === 'ship') {
        botBoard[shot.row][shot.col] = 'hit';
        botShips--;
        showNotification('🤖 Бот попал!', 'error');
    } else {
        botBoard[shot.row][shot.col] = 'miss';
        showNotification('🤖 Бот промахнулся!', 'success');
    }
    
    renderBoards();
    
    if (botShips === 0) {
        gameOver = true;
        gameActive = false;
        loseGame();
        return;
    }
    
    playerTurn = true;
    renderBoards();
}

// ==================== ПОБЕДА ====================
function winGame() {
    const reward = 40;
    updateCoins(reward);
    AppState.totalGames++;
    
    if (!AppState.achievements) AppState.achievements = [];
    if (!AppState.achievements.includes('battleship_master')) {
        AppState.achievements.push('battleship_master');
        showNotification('🏆 Достижение: Адмирал!', 'success');
    }
    
    saveState();
    
    showNotification(`🎉 Победа! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'battleship', win: true, reward });
    
    renderBoards();
}

// ==================== ПРОИГРЫШ ====================
function loseGame() {
    showNotification('😢 Поражение...', 'error');
    EventBus.emit('game:ended', { game: 'battleship', win: false });
    renderBoards();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    gameActive = false;
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== СТИЛИ ====================
const style = document.createElement('style');
style.textContent = `
    .battleship-board {
        display: grid;
        gap: 3px;
        background: #2c3e50;
        padding: 10px;
        border-radius: 15px;
        width: 280px;
        height: 280px;
    }
    .battleship-cell {
        aspect-ratio: 1;
        background: #3498db;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.15s;
    }
    .battleship-cell:hover {
        background: #5faee3;
    }
    .battleship-cell.hit {
        background: #e74c3c;
    }
    .battleship-cell.miss {
        background: #95a5a6;
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startBattleship };
