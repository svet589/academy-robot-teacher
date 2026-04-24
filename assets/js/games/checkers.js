// ==================== ⚫ ШАШКИ (с ботом и для двоих) ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, board = [], currentPlayer = 'black', selectedPiece = null, gameOver = false;
let gameMode = 'bot'; // 'bot' или 'friend'

export function renderScreen(container) {
    gameActive = true; gameOver = false; currentPlayer = 'black'; selectedPiece = null;
    initBoard();
    renderGame(container);
}

function initBoard() {
    board = [];
    for (let r = 0; r < 8; r++) {
        let row = [];
        for (let c = 0; c < 8; c++) {
            if (r < 3 && (r + c) % 2 === 1) row.push({ color: 'black', king: false });
            else if (r > 4 && (r + c) % 2 === 1) row.push({ color: 'white', king: false });
            else row.push(null);
        }
        board.push(row);
    }
}

function renderGame(container) {
    let html = `
        <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
            <button id="modeBotBtn" style="background:${gameMode==='bot'?'#f9d342':'#b3c7e5'}">🤖 С ботом</button>
            <button id="modeFriendBtn" style="background:${gameMode==='friend'?'#f9d342':'#b3c7e5'}">👫 С другом</button>
        </div>
        <div class="checkers-board" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;background:#8b5a2b;padding:10px;border-radius:20px;max-width:400px;margin:0 auto;">
    `;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cellColor = (r + c) % 2 === 0 ? 'white' : 'black';
            const piece = board[r][c];
            const isSelected = selectedPiece && selectedPiece.r === r && selectedPiece.c === c;
            let pieceHtml = '';
            if (piece) {
                const pieceClass = piece.color === 'black' ? 'piece-black' : 'piece-white';
                const symbol = piece.king ? '♔' : '●';
                pieceHtml = `<div class="checkers-piece ${pieceClass}" style="width:80%;height:80%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8rem;box-shadow:0 3px 5px rgba(0,0,0,0.3);${piece.color==='black'?'background:#2c3e50;color:white;':'background:#ecf0f1;color:black;'}">${symbol}</div>`;
            }
            html += `<div class="checkers-cell ${cellColor} ${isSelected ? 'selected' : ''}" data-row="${r}" data-col="${c}" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;${cellColor==='black'?'background:#b58863;':'background:#f0d9b5;'}${isSelected?'border:4px solid #ff4444;':''}">${pieceHtml}</div>`;
        }
    }
    
    html += `</div>`;
    const status = gameOver ? `🏆 Победили ${currentPlayer === 'black' ? '⚪ Белые' : '⚫ Чёрные'}!` : `Ходят: ${currentPlayer === 'black' ? '⚫ Чёрные' : '⚪ Белые'}`;
    html += `<p style="text-align:center;font-size:1.2rem;margin-top:15px;">${status}</p>`;
    html += `<div style="text-align:center;margin-top:10px;"><button id="resetCheckersBtn">🔄 Новая игра</button></div>`;
    
    container.innerHTML = html;
    
    document.getElementById('modeBotBtn').onclick = () => { gameMode = 'bot'; initBoard(); currentPlayer = 'black'; gameOver = false; gameActive = true; renderGame(container); };
    document.getElementById('modeFriendBtn').onclick = () => { gameMode = 'friend'; initBoard(); currentPlayer = 'black'; gameOver = false; gameActive = true; renderGame(container); };
    document.getElementById('resetCheckersBtn').onclick = () => { initBoard(); currentPlayer = 'black'; gameOver = false; gameActive = true; selectedPiece = null; renderGame(container); };
    
    container.querySelectorAll('.checkers-cell').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive || gameOver) return;
            const r = parseInt(cell.dataset.row), c = parseInt(cell.dataset.col);
            handleClick(r, c, container);
        };
    });
}

function handleClick(r, c, container) {
    const piece = board[r][c];
    
    if (!selectedPiece) {
        if (piece && piece.color === currentPlayer) { selectedPiece = { r, c }; renderGame(container); }
        return;
    }
    
    const fromR = selectedPiece.r, fromC = selectedPiece.c;
    if (fromR === r && fromC === c) { selectedPiece = null; renderGame(container); return; }
    
    const dr = r - fromR, dc = c - fromC;
    
    if (Math.abs(dr) === 1 && Math.abs(dc) === 1 && !board[r][c]) {
        if (!board[fromR][fromC].king && ((currentPlayer === 'black' && dr !== 1) || (currentPlayer === 'white' && dr !== -1))) { selectedPiece = null; renderGame(container); return; }
        board[r][c] = { ...board[fromR][fromC] }; board[fromR][fromC] = null;
        if (currentPlayer === 'black' && r === 7) board[r][c].king = true;
        if (currentPlayer === 'white' && r === 0) board[r][c].king = true;
        selectedPiece = null; switchPlayer(); renderGame(container); checkWin(container);
    } else if (Math.abs(dr) === 2 && Math.abs(dc) === 2 && !board[r][c]) {
        const midR = fromR + dr/2, midC = fromC + dc/2;
        if (!board[midR][midC] || board[midR][midC].color === currentPlayer) { selectedPiece = null; renderGame(container); return; }
        board[r][c] = { ...board[fromR][fromC] }; board[fromR][fromC] = null; board[midR][midC] = null;
        if (currentPlayer === 'black' && r === 7) board[r][c].king = true;
        if (currentPlayer === 'white' && r === 0) board[r][c].king = true;
        selectedPiece = null; switchPlayer(); renderGame(container); checkWin(container);
    } else { selectedPiece = null; renderGame(container); }
}

function switchPlayer() { currentPlayer = currentPlayer === 'black' ? 'white' : 'black'; }

function checkWin(container) {
    let hasBlack = false, hasWhite = false;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        if (board[r][c]?.color === 'black') hasBlack = true;
        if (board[r][c]?.color === 'white') hasWhite = true;
    }
    if (!hasBlack || !hasWhite) {
        gameOver = true; gameActive = false;
        if ((!hasBlack && currentPlayer === 'white') || (!hasWhite && currentPlayer === 'black')) {
            updateCoins(35); updatePetHappiness(20); AppState.totalGames++;
            if (!AppState.achievements.includes('checkers_win')) { AppState.achievements.push('checkers_win'); showNotification('🏆 Достижение: Шашист!', 'success'); }
            saveState(AppState.currentChild?.id);
            showNotification('🎉 Победа! +35 🪙', 'success');
        }
        renderGame(container);
    }
    // Ход бота
    if (gameMode === 'bot' && currentPlayer === 'white' && !gameOver && gameActive) {
        setTimeout(() => { botMove(container); }, 500);
    }
}

function botMove(container) {
    if (!gameActive || gameOver || currentPlayer !== 'white') return;
    const allMoves = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        if (board[r][c]?.color === 'white') {
            for (let dr = -1; dr <= 1; dr += 2) for (let dc = -1; dc <= 1; dc += 2) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !board[nr][nc]) {
                    if (!board[r][c].king && dr !== -1) continue;
                    allMoves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
                }
                const cr = r + dr*2, cc = c + dc*2;
                if (cr >= 0 && cr < 8 && cc >= 0 && cc < 8 && !board[cr][cc] && board[r+dr]?.[c+dc]?.color === 'black') {
                    allMoves.push({ fromR: r, fromC: c, toR: cr, toC: cc, capture: true });
                }
            }
        }
    }
    
    if (allMoves.length === 0) { gameOver = true; gameActive = false; renderGame(container); return; }
    
    const captures = allMoves.filter(m => m.capture);
    const move = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : allMoves[Math.floor(Math.random() * allMoves.length)];
    
    selectedPiece = { r: move.fromR, c: move.fromC };
    handleClick(move.toR, move.toC, container);
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
