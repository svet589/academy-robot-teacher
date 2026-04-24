// ==================== 🚢 МОРСКОЙ БОЙ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, playerBoard = [], botBoard = [], playerShips = 5, botShips = 5, gameOver = false, playerTurn = true;

export function renderScreen(container) {
    gameActive = true; gameOver = false; playerTurn = true;
    playerBoard = Array(8).fill().map(() => Array(8).fill(null));
    botBoard = Array(8).fill().map(() => Array(8).fill(null));
    playerShips = 5; botShips = 5;
    placeShips(playerBoard, 5); placeShips(botBoard, 5);
    renderGame(container);
}

function placeShips(b, count) { let p = 0; while (p < count) { const r = Math.floor(Math.random()*8), c = Math.floor(Math.random()*8); if (b[r][c] !== 'ship') { b[r][c] = 'ship'; p++; } } }

function renderGame(container) {
    let html = '<div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;">';
    html += '<div><h3>🎯 Твои выстрелы</h3><div class="battleship-board" style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;background:#2c3e50;padding:10px;border-radius:15px;width:280px;">';
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        const cell = playerBoard[i][j]; let content = '🌊', cls = 'battleship-cell';
        if (cell === 'hit') { cls += ' hit'; content = '💥'; } else if (cell === 'miss') { cls += ' miss'; content = '❌'; }
        html += `<div class="${cls}" data-row="${i}" data-col="${j}" data-board="player" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;cursor:pointer;background:${cell==='hit'?'#e74c3c':cell==='miss'?'#95a5a6':'#3498db'};border-radius:5px;">${content}</div>`;
    }
    html += '</div></div><div><h3>🤖 Выстрелы бота</h3><div class="battleship-board" style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;background:#2c3e50;padding:10px;border-radius:15px;width:280px;">';
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        const cell = botBoard[i][j]; let content = '🌊', cls = 'battleship-cell';
        if (cell === 'hit') { cls += ' hit'; content = '💥'; } else if (cell === 'miss') { cls += ' miss'; content = '❌'; }
        html += `<div class="${cls}" data-row="${i}" data-col="${j}" data-board="bot" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:${cell==='hit'?'#e74c3c':cell==='miss'?'#95a5a6':'#3498db'};border-radius:5px;">${content}</div>`;
    }
    html += '</div></div></div>';
    const status = gameOver ? (playerShips === 0 ? '🎉 ПОБЕДА!' : '😢 ПОРАЖЕНИЕ...') : (playerTurn ? '✅ ТВОЙ ХОД!' : '⏳ Бот думает...');
    html += `<p style="text-align:center;font-size:1.2rem;margin-top:15px;">${status} | 🚢 Твои: ${botShips} | 🤖 Бота: ${playerShips}</p>`;
    html += `<div style="text-align:center;margin-top:10px;"><button id="resetBattleshipBtn">🔄 Новая игра</button></div>`;
    
    container.innerHTML = html;
    document.getElementById('resetBattleshipBtn').onclick = () => { initNewGame(container); };
    
    container.querySelectorAll('[data-board="player"]').forEach(cell => {
        cell.onclick = () => {
            if (!gameActive || gameOver || !playerTurn) return;
            const r = parseInt(cell.dataset.row), c = parseInt(cell.dataset.col);
            if (playerBoard[r][c] === 'hit' || playerBoard[r][c] === 'miss') { showNotification('Уже стрелял!', 'warning'); return; }
            if (playerBoard[r][c] === 'ship') { playerBoard[r][c] = 'hit'; playerShips--; showNotification('💥 Попадание!', 'success'); }
            else { playerBoard[r][c] = 'miss'; showNotification('❌ Мимо!', 'info'); }
            if (playerShips === 0) { gameOver = true; gameActive = false; updateCoins(40); updatePetHappiness(25); AppState.totalGames++; if (!AppState.achievements.includes('battleship_master')) { AppState.achievements.push('battleship_master'); showNotification('🏆 Достижение: Адмирал!', 'success'); } saveState(AppState.currentChild?.id); showNotification('🎉 Победа! +40 🪙', 'success'); }
            else { playerTurn = false; renderGame(container); setTimeout(() => botTurn(container), 800); return; }
            renderGame(container);
        };
    });
}

function botTurn(container) {
    if (!gameActive || gameOver || playerTurn) return;
    const available = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { if (botBoard[i][j] !== 'hit' && botBoard[i][j] !== 'miss') available.push({r:i,c:j}); }
    if (available.length === 0) { gameOver = true; gameActive = false; renderGame(container); return; }
    const shot = available[Math.floor(Math.random()*available.length)];
    if (botBoard[shot.r][shot.c] === 'ship') { botBoard[shot.r][shot.c] = 'hit'; botShips--; showNotification('🤖 Бот попал!', 'error'); }
    else { botBoard[shot.r][shot.c] = 'miss'; showNotification('🤖 Бот промахнулся!', 'success'); }
    if (botShips === 0) { gameOver = true; gameActive = false; showNotification('😢 Поражение...', 'error'); }
    else { playerTurn = true; }
    renderGame(container);
}

function initNewGame(container) { gameActive = true; gameOver = false; playerTurn = true; playerBoard = Array(8).fill().map(() => Array(8).fill(null)); botBoard = Array(8).fill().map(() => Array(8).fill(null)); playerShips = 5; botShips = 5; placeShips(playerBoard, 5); placeShips(botBoard, 5); renderGame(container); }

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
