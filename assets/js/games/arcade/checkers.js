// ==================== ⚫ ШАШКИ ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false;
let board = [];
let currentPlayer = 'black';
let selectedPiece = null;
let modalContainer = null;
let gameModal = null;
let gameOver = false;

// ==================== ЗАПУСК ИГРЫ ====================
export function startCheckers() {
    gameActive = true;
    gameOver = false;
    currentPlayer = 'black';
    selectedPiece = null;
    
    initBoard();
    createModal();
    renderBoard();
    
    document.getElementById('checkersModal').classList.add('active');
}

// ==================== ИНИЦИАЛИЗАЦИЯ ДОСКИ ====================
function initBoard() {
    board = [];
    for (let r = 0; r < 8; r++) {
        let row = [];
        for (let c = 0; c < 8; c++) {
            if (r < 3 && (r + c) % 2 === 1) {
                row.push({ color: 'black', king: false });
            } else if (r > 4 && (r + c) % 2 === 1) {
                row.push({ color: 'white', king: false });
            } else {
                row.push(null);
            }
        }
        board.push(row);
    }
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'checkersModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-title">⚫ Шашки</div>
            <div class="game-container">
                <div id="checkersBoard" class="checkers-board"></div>
                <div id="gameStatus" class="game-status"></div>
                <div class="game-controls" style="margin-top: 15px;">
                    <button id="resetCheckersBtn">🔄 Новая игра</button>
                </div>
            </div>
            <button class="close-btn" id="closeCheckersBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('resetCheckersBtn').onclick = () => {
        initBoard();
        currentPlayer = 'black';
        selectedPiece = null;
        gameOver = false;
        gameActive = true;
        renderBoard();
        showNotification('🔄 Новая игра!', 'info');
    };
    document.getElementById('closeCheckersBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ОТРИСОВКА ДОСКИ ====================
function renderBoard() {
    const container = document.getElementById('checkersBoard');
    if (!container) return;
    
    let html = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cellColor = (r + c) % 2 === 0 ? 'white' : 'black';
            const piece = board[r][c];
            const isSelected = selectedPiece && selectedPiece.r === r && selectedPiece.c === c;
            
            let pieceHtml = '';
            if (piece) {
                const pieceClass = piece.color === 'black' ? 'piece-black' : 'piece-white';
                const symbol = piece.king ? '♔' : '●';
                pieceHtml = `<div class="checkers-piece ${pieceClass}">${symbol}</div>`;
            }
            
            const selectedClass = isSelected ? 'selected' : '';
            html += `<div class="checkers-cell ${cellColor} ${selectedClass}" data-row="${r}" data-col="${c}">${pieceHtml}</div>`;
        }
    }
    
    container.innerHTML = html;
    
    const status = document.getElementById('gameStatus');
    if (gameOver) {
        const winner = currentPlayer === 'black' ? '⚪ Белые' : '⚫ Чёрные';
        status.innerHTML = `<p style="text-align: center; font-size: 1.3rem;">🏆 Победили ${winner}!</p>`;
    } else {
        status.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">Ходят: ${currentPlayer === 'black' ? '⚫ Чёрные' : '⚪ Белые'}</p>`;
    }
    
    // Обработчики кликов
    container.querySelectorAll('.checkers-cell').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive || gameOver) return;
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            handleCellClick(r, c);
        };
    });
}

// ==================== ОБРАБОТКА КЛИКА ====================
function handleCellClick(r, c) {
    const piece = board[r][c];
    
    // Если фигура не выбрана
    if (!selectedPiece) {
        if (piece && piece.color === currentPlayer) {
            selectedPiece = { r, c };
            renderBoard();
        }
        return;
    }
    
    const fromR = selectedPiece.r;
    const fromC = selectedPiece.c;
    const fromPiece = board[fromR][fromC];
    
    // Клик на ту же фигуру - отмена выбора
    if (fromR === r && fromC === c) {
        selectedPiece = null;
        renderBoard();
        return;
    }
    
    const dr = r - fromR;
    const dc = c - fromC;
    
    // Обычный ход (на 1 клетку по диагонали)
    if (Math.abs(dr) === 1 && Math.abs(dc) === 1) {
        if (board[r][c] !== null) {
            selectedPiece = null;
            renderBoard();
            return;
        }
        
        // Проверка направления для не-дамок
        if (!fromPiece.king) {
            if (currentPlayer === 'black' && dr !== 1) return;
            if (currentPlayer === 'white' && dr !== -1) return;
        }
        
        // Выполняем ход
        board[r][c] = { ...fromPiece };
        board[fromR][fromC] = null;
        
        // Проверка на дамку
        if (currentPlayer === 'black' && r === 7) board[r][c].king = true;
        if (currentPlayer === 'white' && r === 0) board[r][c].king = true;
        
        selectedPiece = null;
        switchPlayer();
        renderBoard();
        checkWinCondition();
        return;
    }
    
    // Ход с взятием (на 2 клетки)
    if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
        const midR = fromR + dr / 2;
        const midC = fromC + dc / 2;
        const midPiece = board[midR][midC];
        
        if (!midPiece || midPiece.color === currentPlayer) return;
        if (board[r][c] !== null) return;
        
        // Выполняем взятие
        board[r][c] = { ...fromPiece };
        board[fromR][fromC] = null;
        board[midR][midC] = null;
        
        // Проверка на дамку
        if (currentPlayer === 'black' && r === 7) board[r][c].king = true;
        if (currentPlayer === 'white' && r === 0) board[r][c].king = true;
        
        selectedPiece = null;
        switchPlayer();
        renderBoard();
        checkWinCondition();
        return;
    }
    
    // Неверный ход
    selectedPiece = null;
    renderBoard();
}

// ==================== СМЕНА ИГРОКА ====================
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

// ==================== ПРОВЕРКА ПОБЕДЫ ====================
function checkWinCondition() {
    let hasBlack = false;
    let hasWhite = false;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                if (piece.color === 'black') hasBlack = true;
                if (piece.color === 'white') hasWhite = true;
            }
        }
    }
    
    if (!hasBlack || !hasWhite) {
        gameOver = true;
        gameActive = false;
        
        const winner = !hasBlack ? 'white' : 'black';
        const isPlayerWin = (winner === 'black'); // Игрок играет за чёрных
        
        if (isPlayerWin) {
            const reward = 35;
            updateCoins(reward);
            AppState.totalGames++;
            
            if (!AppState.achievements) AppState.achievements = [];
            if (!AppState.achievements.includes('checkers_win')) {
                AppState.achievements.push('checkers_win');
                showNotification('🏆 Достижение: Шашист!', 'success');
            }
            
            saveState();
            showNotification(`🎉 Победа! +${reward} 🪙`, 'success');
            EventBus.emit('game:ended', { game: 'checkers', win: true, reward });
        } else {
            showNotification('😢 Поражение...', 'error');
            EventBus.emit('game:ended', { game: 'checkers', win: false });
        }
        
        renderBoard();
    }
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
    .checkers-board {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 2px;
        background: #8b5a2b;
        padding: 10px;
        border-radius: 20px;
        max-width: 400px;
        margin: 0 auto;
    }
    .checkers-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        border-radius: 6px;
        cursor: pointer;
    }
    .checkers-cell.black {
        background: #b58863;
    }
    .checkers-cell.white {
        background: #f0d9b5;
    }
    .checkers-cell.selected {
        border: 4px solid #ff4444;
    }
    .checkers-piece {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        box-shadow: 0 3px 5px rgba(0,0,0,0.3);
    }
    .piece-black {
        background: #2c3e50;
        color: white;
    }
    .piece-white {
        background: #ecf0f1;
        color: black;
    }
    .game-status {
        margin-top: 15px;
        padding: 10px;
        background: #ffe0b0;
        border-radius: 20px;
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startCheckers };
