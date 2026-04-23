// ==================== 🧩 СУДОКУ 4×4 ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false;
let board = [];
let solution = [];
let selectedCell = null;
let modalContainer = null;
let gameModal = null;

// ==================== ЗАПУСК ИГРЫ ====================
export function startSudoku() {
    gameActive = true;
    selectedCell = null;
    
    generateSudoku();
    createModal();
    renderBoard();
    
    document.getElementById('sudokuModal').classList.add('active');
}

// ==================== ГЕНЕРАЦИЯ СУДОКУ ====================
function generateSudoku() {
    solution = [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
    ];
    
    board = solution.map(row => [...row]);
    
    // Убираем 6-8 клеток
    const cellsToRemove = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < cellsToRemove; i++) {
        const row = Math.floor(Math.random() * 4);
        const col = Math.floor(Math.random() * 4);
        board[row][col] = null;
    }
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'sudokuModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-title">🧩 Судоку 4×4</div>
            <div class="game-container">
                <div id="sudokuBoard" class="sudoku-board"></div>
                <div class="sudoku-controls">
                    <div class="number-pad">
                        ${[1, 2, 3, 4].map(n => `<button class="sudoku-num" data-num="${n}">${n}</button>`).join('')}
                        <button class="sudoku-num" data-num="clear">🗑️</button>
                    </div>
                </div>
                <div id="sudokuStatus" class="game-status"></div>
                <div class="game-controls" style="margin-top: 15px;">
                    <button id="checkSudokuBtn">✅ Проверить</button>
                    <button id="resetSudokuBtn">🔄 Новая игра</button>
                </div>
            </div>
            <button class="close-btn" id="closeSudokuBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('checkSudokuBtn').onclick = checkSolution;
    document.getElementById('resetSudokuBtn').onclick = () => {
        generateSudoku();
        selectedCell = null;
        renderBoard();
        showNotification('🔄 Новая игра!', 'info');
    };
    document.getElementById('closeSudokuBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ОТРИСОВКА ====================
function renderBoard() {
    const container = document.getElementById('sudokuBoard');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const value = board[i][j];
            const isSelected = selectedCell && selectedCell.row === i && selectedCell.col === j;
            const isFixed = solution[i][j] === value || value === null;
            const cellClass = `sudoku-cell ${isSelected ? 'selected' : ''} ${!isFixed && value ? 'user-filled' : ''}`;
            
            html += `<div class="${cellClass}" data-row="${i}" data-col="${j}">${value !== null ? value : ''}</div>`;
        }
    }
    
    container.innerHTML = html;
    
    // Обработчики выбора клетки
    container.querySelectorAll('.sudoku-cell').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive) return;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            // Нельзя менять изначальные клетки
            if (solution[row][col] === board[row][col] && board[row][col] !== null) {
                showNotification('Эту клетку нельзя изменить', 'warning');
                return;
            }
            
            selectedCell = { row, col };
            renderBoard();
        };
    });
    
    // Кнопки цифр
    document.querySelectorAll('.sudoku-num').forEach(btn => {
        btn.onclick = () => {
            if (!gameActive) return;
            
            if (btn.dataset.num === 'clear') {
                if (selectedCell) {
                    board[selectedCell.row][selectedCell.col] = null;
                    selectedCell = null;
                    renderBoard();
                }
                return;
            }
            
            if (!selectedCell) {
                showNotification('Выбери клетку!', 'warning');
                return;
            }
            
            const num = parseInt(btn.dataset.num);
            board[selectedCell.row][selectedCell.col] = num;
            selectedCell = null;
            renderBoard();
        };
    });
}

// ==================== ПРОВЕРКА РЕШЕНИЯ ====================
function checkSolution() {
    // Проверка заполненности
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === null) {
                showNotification('❌ Заполни все клетки!', 'error');
                return;
            }
        }
    }
    
    // Проверка строк и столбцов
    for (let i = 0; i < 4; i++) {
        const rowSet = new Set();
        const colSet = new Set();
        for (let j = 0; j < 4; j++) {
            rowSet.add(board[i][j]);
            colSet.add(board[j][i]);
        }
        if (rowSet.size !== 4 || colSet.size !== 4) {
            showNotification('❌ Неправильное решение!', 'error');
            return;
        }
    }
    
    // Проверка квадрантов 2×2
    for (let blockRow = 0; blockRow < 2; blockRow++) {
        for (let blockCol = 0; blockCol < 2; blockCol++) {
            const blockSet = new Set();
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    blockSet.add(board[blockRow * 2 + i][blockCol * 2 + j]);
                }
            }
            if (blockSet.size !== 4) {
                showNotification('❌ Неправильное решение!', 'error');
                return;
            }
        }
    }
    
    winGame();
}

// ==================== ПОБЕДА ====================
function winGame() {
    gameActive = false;
    
    const reward = 35;
    updateCoins(reward);
    AppState.totalGames++;
    
    if (!AppState.achievements) AppState.achievements = [];
    if (!AppState.achievements.includes('sudoku_master')) {
        AppState.achievements.push('sudoku_master');
        showNotification('🏆 Достижение: Судоку-мастер!', 'success');
    }
    
    saveState();
    
    showNotification(`🎉 Судоку решено! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'sudoku', win: true, reward });
    
    renderBoard();
    document.getElementById('sudokuStatus').innerHTML = '<p style="text-align: center; color: green;">✅ Правильно!</p>';
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
    .sudoku-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        background: #333;
        padding: 15px;
        border-radius: 20px;
        max-width: 300px;
        margin: 0 auto;
    }
    .sudoku-cell {
        aspect-ratio: 1;
        background: #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.15s;
    }
    .sudoku-cell.selected {
        background: #ffd966;
        border: 3px solid #ffb347;
    }
    .sudoku-cell.user-filled {
        color: #2196f3;
    }
    .number-pad {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
    }
    .sudoku-num {
        width: 60px;
        height: 60px;
        font-size: 1.8rem;
        padding: 0;
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startSudoku };
