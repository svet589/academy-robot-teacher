// ==================== 🧩 СУДОКУ 4×4 ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, board = [], solution = [], selectedCell = null;

export function renderScreen(container) {
    gameActive = true; selectedCell = null;
    solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
    board = solution.map(row => [...row]);
    const toRemove = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < toRemove; i++) { const r = Math.floor(Math.random()*4), c = Math.floor(Math.random()*4); board[r][c] = null; }
    renderGame(container);
}

function renderGame(container) {
    let html = '<div class="sudoku-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;background:#333;padding:15px;border-radius:20px;max-width:300px;margin:0 auto;">';
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const val = board[i][j];
            const isSelected = selectedCell && selectedCell.row === i && selectedCell.col === j;
            const isFixed = solution[i][j] === val || val === null;
            html += `<div class="sudoku-cell ${isSelected ? 'selected' : ''} ${!isFixed && val ? 'user-filled' : ''}" data-row="${i}" data-col="${j}" style="aspect-ratio:1;background:${isSelected?'#ffd966':'#fff'};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:bold;cursor:pointer;${!isFixed&&val?'color:#2196f3;':''}${isSelected?'border:3px solid #ffb347;':''}">${val !== null ? val : ''}</div>`;
        }
    }
    
    html += `</div><div class="number-pad" style="display:flex;gap:10px;justify-content:center;margin-top:20px;">`;
    for (let n = 1; n <= 4; n++) html += `<button class="sudoku-num" data-num="${n}" style="width:60px;height:60px;font-size:1.8rem;">${n}</button>`;
    html += `<button class="sudoku-num" data-num="clear" style="width:60px;height:60px;font-size:1.5rem;">🗑️</button>`;
    html += `</div><div style="text-align:center;margin-top:15px;"><button id="checkSudokuBtn">✅ Проверить</button> <button id="resetSudokuBtn">🔄 Новая</button></div>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.sudoku-cell').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive) return;
            const r = parseInt(cell.dataset.row), c = parseInt(cell.dataset.col);
            if (solution[r][c] === board[r][c] && board[r][c] !== null) { showNotification('Эту клетку нельзя изменить', 'warning'); return; }
            selectedCell = { row: r, col: c }; renderGame(container);
        };
    });
    
    container.querySelectorAll('.sudoku-num').forEach(btn => {
        btn.onclick = () => {
            if (!gameActive) return;
            if (btn.dataset.num === 'clear') { if (selectedCell) { board[selectedCell.row][selectedCell.col] = null; selectedCell = null; renderGame(container); } return; }
            if (!selectedCell) { showNotification('Выбери клетку!', 'warning'); return; }
            board[selectedCell.row][selectedCell.col] = parseInt(btn.dataset.num); selectedCell = null; renderGame(container);
        };
    });
    
    document.getElementById('checkSudokuBtn').onclick = () => checkSolution(container);
    document.getElementById('resetSudokuBtn').onclick = () => { solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]]; board = solution.map(row => [...row]); const tr = 6 + Math.floor(Math.random()*3); for (let i = 0; i < tr; i++) { const r = Math.floor(Math.random()*4), c = Math.floor(Math.random()*4); board[r][c] = null; } selectedCell = null; gameActive = true; renderGame(container); };
}

function checkSolution(container) {
    for (let i = 0; i < 4; i++) { for (let j = 0; j < 4; j++) { if (board[i][j] === null) { showNotification('❌ Заполни все клетки!', 'error'); return; } } }
    for (let i = 0; i < 4; i++) { const rs = new Set(), cs = new Set(); for (let j = 0; j < 4; j++) { rs.add(board[i][j]); cs.add(board[j][i]); } if (rs.size !== 4 || cs.size !== 4) { showNotification('❌ Неправильно!', 'error'); return; } }
    for (let br = 0; br < 2; br++) { for (let bc = 0; bc < 2; bc++) { const bs = new Set(); for (let i = 0; i < 2; i++) { for (let j = 0; j < 2; j++) { bs.add(board[br*2+i][bc*2+j]); } } if (bs.size !== 4) { showNotification('❌ Неправильно!', 'error'); return; } } }
    gameActive = false; updateCoins(35); updatePetHappiness(20); AppState.totalGames++;
    if (!AppState.achievements.includes('sudoku_master')) { AppState.achievements.push('sudoku_master'); showNotification('🏆 Достижение: Судоку-мастер!', 'success'); }
    saveState(AppState.currentChild?.id); showNotification('🎉 Судоку решено! +35 🪙', 'success');
    renderGame(container);
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
