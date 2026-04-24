// ==================== ❌ КРЕСТИКИ-НОЛИКИ (с ботом и для двоих) ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, board = ['', '', '', '', '', '', '', '', ''], currentPlayer = 'X', gameOver = false, gameMode = 'bot';

export function renderScreen(container) {
    gameActive = true; gameOver = false; board = ['', '', '', '', '', '', '', '', '']; currentPlayer = 'X';
    renderGame(container);
}

function renderGame(container) {
    const winner = checkWinner();
    if (winner) { gameOver = true; gameActive = false; }
    
    let html = `
        <div style="margin-bottom:15px;display:flex;gap:10px;justify-content:center;">
            <button id="modeBotBtn2" style="background:${gameMode==='bot'?'#f9d342':'#b3c7e5'}">🤖 С ботом</button>
            <button id="modeFriendBtn2" style="background:${gameMode==='friend'?'#f9d342':'#b3c7e5'}">👫 С другом</button>
        </div>
        <div class="tic-tac-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#333;padding:15px;border-radius:20px;max-width:300px;margin:0 auto;">
    `;
    
    for (let i = 0; i < 9; i++) {
        html += `<div class="tic-tac-cell" data-index="${i}" style="aspect-ratio:1;background:#fff;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;font-weight:bold;cursor:pointer;">${board[i]}</div>`;
    }
    
    html += `</div>`;
    const status = winner ? (winner === 'draw' ? '🤝 Ничья!' : `🎉 Победил ${winner}!`) : `Ходит: ${currentPlayer}`;
    html += `<p style="text-align:center;font-size:1.3rem;margin-top:15px;">${status}</p>`;
    html += `<div style="text-align:center;margin-top:10px;"><button id="resetTicTacBtn">🔄 Новая игра</button></div>`;
    
    container.innerHTML = html;
    
    document.getElementById('modeBotBtn2').onclick = () => { gameMode = 'bot'; board = ['', '', '', '', '', '', '', '', '']; currentPlayer = 'X'; gameOver = false; gameActive = true; renderGame(container); };
    document.getElementById('modeFriendBtn2').onclick = () => { gameMode = 'friend'; board = ['', '', '', '', '', '', '', '', '']; currentPlayer = 'X'; gameOver = false; gameActive = true; renderGame(container); };
    document.getElementById('resetTicTacBtn').onclick = () => { board = ['', '', '', '', '', '', '', '', '']; currentPlayer = 'X'; gameOver = false; gameActive = true; renderGame(container); };
    
    container.querySelectorAll('.tic-tac-cell').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive || gameOver) return;
            const idx = parseInt(cell.dataset.index);
            if (board[idx] !== '') return;
            board[idx] = currentPlayer;
            const w = checkWinner();
            if (w) {
                gameOver = true; gameActive = false;
                if (w === 'X') { updateCoins(20); updatePetHappiness(15); AppState.totalGames++; if (!AppState.achievements.includes('tic_tac_win')) { AppState.achievements.push('tic_tac_win'); showNotification('🏆 Достижение: Крестик!', 'success'); } saveState(AppState.currentChild?.id); showNotification('🎉 Победа! +20 🪙', 'success'); }
                else if (w === 'O' && gameMode === 'bot') { showNotification('😢 Поражение...', 'error'); }
                EventBus.emit('game:ended', { game: 'ticTac', win: w === 'X' });
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (gameMode === 'bot' && currentPlayer === 'O' && gameActive) {
                    setTimeout(() => { aiMove(container); }, 400);
                }
            }
            renderGame(container);
        };
    });
}

function checkWinner() {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a,b,c] of lines) { if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]; }
    if (board.every(cell => cell !== '')) return 'draw';
    return null;
}

function aiMove(container) {
    if (!gameActive || gameOver || currentPlayer !== 'O') return;
    const empty = board.reduce((arr, c, i) => c === '' ? [...arr, i] : arr, []);
    
    for (let i of empty) { board[i] = 'O'; if (checkWinner() === 'O') { currentPlayer = 'X'; renderGame(container); return; } board[i] = ''; }
    for (let i of empty) { board[i] = 'X'; if (checkWinner() === 'X') { board[i] = 'O'; currentPlayer = 'X'; renderGame(container); return; } board[i] = ''; }
    
    const move = empty.includes(4) ? 4 : empty[Math.floor(Math.random() * empty.length)];
    board[move] = 'O'; currentPlayer = 'X';
    renderGame(container);
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
