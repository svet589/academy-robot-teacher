// ==================== ❌ КРЕСТИКИ-НОЛИКИ ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false;
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let modalContainer = null;
let gameModal = null;
let isAITurn = false;

// ==================== ЗАПУСК ИГРЫ ====================
export function startTicTac() {
    gameActive = true;
    gameOver = false;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isAITurn = false;
    
    createModal();
    renderBoard();
    
    document.getElementById('ticTacModal').classList.add('active');
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'ticTacModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-title">❌ Крестики-нолики</div>
            <div class="game-container">
                <div id="ticTacBoard" class="tic-tac-board"></div>
                <div id="ticTacStatus" class="game-status"></div>
                <div class="game-controls" style="margin-top: 15px;">
                    <button id="resetTicTacBtn">🔄 Новая игра</button>
                </div>
            </div>
            <button class="close-btn" id="closeTicTacBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('resetTicTacBtn').onclick = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameOver = false;
        gameActive = true;
        isAITurn = false;
        renderBoard();
        showNotification('🔄 Новая игра!', 'info');
    };
    document.getElementById('closeTicTacBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ОТРИСОВКА ДОСКИ ====================
function renderBoard() {
    const container = document.getElementById('ticTacBoard');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < 9; i++) {
        html += `<div class="tic-tac-cell" data-index="${i}">${board[i]}</div>`;
    }
    container.innerHTML = html;
    
    const status = document.getElementById('ticTacStatus');
    const winner = checkWinner();
    
    if (winner) {
        gameOver = true;
        gameActive = false;
        if (winner === 'draw') {
            status.innerHTML = '<p style="text-align: center; font-size: 1.3rem;">🤝 Ничья!</p>';
            showNotification('🤝 Ничья!', 'info');
        } else {
            status.innerHTML = `<p style="text-align: center; font-size: 1.3rem;">🎉 Победил ${winner}!</p>`;
            
            if (winner === 'X') {
                const reward = 20;
                updateCoins(reward);
                AppState.totalGames++;
                
                if (!AppState.achievements) AppState.achievements = [];
                if (!AppState.achievements.includes('tic_tac_win')) {
                    AppState.achievements.push('tic_tac_win');
                    showNotification('🏆 Достижение: Крестик!', 'success');
                }
                
                saveState();
                showNotification(`🎉 Победа! +${reward} 🪙`, 'success');
                EventBus.emit('game:ended', { game: 'ticTac', win: true, reward });
            } else {
                showNotification('😢 Поражение...', 'error');
                EventBus.emit('game:ended', { game: 'ticTac', win: false });
            }
        }
    } else {
        status.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Ходит: ${currentPlayer}</p>`;
    }
    
    // Обработчики кликов
    container.querySelectorAll('.tic-tac-cell').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive || gameOver || isAITurn) return;
            const idx = parseInt(cell.dataset.index);
            if (board[idx] !== '') return;
            
            makeMove(idx);
        };
    });
}

// ==================== СДЕЛАТЬ ХОД ====================
function makeMove(idx) {
    if (!gameActive || gameOver) return;
    if (board[idx] !== '') return;
    
    board[idx] = currentPlayer;
    renderBoard();
    
    const winner = checkWinner();
    if (winner) {
        renderBoard();
        return;
    }
    
    // Смена игрока
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Ход компьютера
    if (currentPlayer === 'O' && gameActive && !gameOver) {
        isAITurn = true;
        setTimeout(() => {
            if (gameActive && !gameOver && currentPlayer === 'O') {
                aiMove();
            }
            isAITurn = false;
        }, 500);
    }
}

// ==================== ХОД КОМПЬЮТЕРА ====================
function aiMove() {
    if (!gameActive || gameOver || currentPlayer !== 'O') return;
    
    // Простой ИИ: сначала пытается выиграть, потом блокировать, потом случайно
    const emptyCells = board.reduce((arr, cell, i) => cell === '' ? [...arr, i] : arr, []);
    if (emptyCells.length === 0) return;
    
    // Поиск выигрышного хода
    for (let idx of emptyCells) {
        board[idx] = 'O';
        if (checkWinner() === 'O') {
            board[idx] = 'O';
            renderBoard();
            currentPlayer = 'X';
            return;
        }
        board[idx] = '';
    }
    
    // Блокировка игрока
    for (let idx of emptyCells) {
        board[idx] = 'X';
        if (checkWinner() === 'X') {
            board[idx] = 'O';
            renderBoard();
            currentPlayer = 'X';
            return;
        }
        board[idx] = '';
    }
    
    // Центр или случайная клетка
    let move;
    if (emptyCells.includes(4)) {
        move = 4;
    } else {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    board[move] = 'O';
    renderBoard();
    currentPlayer = 'X';
}

// ==================== ПРОВЕРКА ПОБЕДИТЕЛЯ ====================
function checkWinner() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    
    if (board.every(cell => cell !== '')) {
        return 'draw';
    }
    
    return null;
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
    .tic-tac-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        background: #333;
        padding: 15px;
        border-radius: 20px;
        max-width: 300px;
        margin: 0 auto;
    }
    .tic-tac-cell {
        aspect-ratio: 1;
        background: #fff;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3.5rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }
    .tic-tac-cell:hover {
        background: #e0e0e0;
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startTicTac };
