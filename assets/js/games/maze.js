// ==================== 🗺️ ЛАБИРИНТ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let mazeActive = false, currentLevel = 1, mazeMap = [], mazePlayer = { x: 1, y: 1 }, mazeExit = { x: 7, y: 7 };
let totalLevels = 5;

const MAZE_LEVELS = [
    { map: [['#','#','#','#','#','#','#','#','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#'],['#',' ','#',' ',' ',' ','#',' ','#'],['#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#']], player: { x: 1, y: 1 }, exit: { x: 5, y: 7 }, name: '🌱 Начало' },
    { map: [['#','#','#','#','#','#','#','#','#'],['#',' ','#',' ',' ',' ','#',' ','#'],['#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#'],['#',' ',' ',' ',' ',' ','#',' ','#'],['#',' ','#','#','#','#','#',' ','#'],['#',' ',' ',' ',' ',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#']], player: { x: 1, y: 1 }, exit: { x: 7, y: 7 }, name: '🌿 Извилистый' },
    { map: [['#','#','#','#','#','#','#','#','#'],['#',' ',' ','#',' ',' ',' ',' ','#'],['#','#',' ','#',' ','#','#',' ','#'],['#',' ',' ',' ',' ','#',' ',' ','#'],['#',' ','#','#','#','#',' ','#','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#',' ','#',' ','#',' ','#'],['#',' ',' ',' ',' ',' ','#',' ','#'],['#','#','#','#','#','#','#','#','#']], player: { x: 1, y: 1 }, exit: { x: 7, y: 7 }, name: '🍂 Запутанный' },
    { map: [['#','#','#','#','#','#','#','#','#','#','#'],['#',' ',' ',' ','#',' ',' ',' ','#',' ','#'],['#','#','#',' ',' ',' ','#',' ',' ',' ','#'],['#',' ','#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ','#',' ','#'],['#','#','#',' ','#',' ','#','#','#',' ','#'],['#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#'],['#',' ','#','#','#',' ','#','#','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#','#','#']], player: { x: 1, y: 1 }, exit: { x: 8, y: 9 }, name: '🌲 Дремучий лес' },
    { map: [['#','#','#','#','#','#','#','#','#','#','#'],['#',' ',' ','#',' ',' ',' ','#',' ',' ','#'],['#',' ','#','#','#',' ','#','#',' ','#','#'],['#',' ',' ',' ','#',' ',' ',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ',' ',' ','#',' ',' ',' ','#'],['#',' ','#','#','#',' ','#','#','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#','#','#'],['#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#','#','#']], player: { x: 1, y: 1 }, exit: { x: 9, y: 9 }, name: '🏆 Финальный' }
];

export function renderScreen(container) {
    mazeActive = true; currentLevel = 1;
    loadLevel(currentLevel);
    renderGame(container);
}

function loadLevel(level) {
    const data = MAZE_LEVELS[level - 1];
    mazeMap = data.map.map(row => [...row]);
    mazePlayer = { ...data.player };
    mazeExit = { ...data.exit };
}

function renderGame(container) {
    const levelData = MAZE_LEVELS[currentLevel - 1];
    let html = `<p style="text-align:center;margin-bottom:10px;"><strong>${levelData.name}</strong> — Уровень ${currentLevel}/${totalLevels}</p>`;
    html += '<div class="maze-grid" style="display:grid;gap:3px;background:#654321;padding:10px;border-radius:20px;max-width:450px;margin:0 auto;">';
    
    for (let i = 0; i < mazeMap.length; i++) {
        for (let j = 0; j < mazeMap[0].length; j++) {
            let cellClass = 'maze-cell'; let content = '';
            if (mazeMap[i][j] === '#') { cellClass += ' wall'; content = '🧱'; }
            else if (i === mazePlayer.x && j === mazePlayer.y) { cellClass += ' player'; content = AppState.pet?.emoji || '🐱'; }
            else if (i === mazeExit.x && j === mazeExit.y) { cellClass += ' exit'; content = '🎁'; }
            else { content = '⬜'; }
            html += `<div class="${cellClass}" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:1.3rem;background:#a9d6e5;border-radius:4px;${mazeMap[i][j]==='#'?'background:#8b5a2b':''}${i===mazePlayer.x&&j===mazePlayer.y?'background:#ffd966':''}${i===mazeExit.x&&j===mazeExit.y?'background:#4caf50;animation:pulse 1.5s infinite':''}">${content}</div>`;
        }
    }
    html += `</div>`;
    html += `<div class="game-controls" style="margin-top:20px;display:flex;gap:10px;justify-content:center;">
        <button class="game-btn" id="mazeUp">⬆️</button>
        <button class="game-btn" id="mazeDown">⬇️</button>
        <button class="game-btn" id="mazeLeft">⬅️</button>
        <button class="game-btn" id="mazeRight">➡️</button>
    </div>`;
    html += `<div style="margin-top:15px;text-align:center;"><button id="resetMazeBtn">🔄 Заново</button></div>`;
    
    container.innerHTML = html;
    container.querySelector('.maze-grid').style.gridTemplateColumns = `repeat(${mazeMap[0].length}, 1fr)`;
    
    document.getElementById('mazeUp').onclick = () => movePlayer(-1, 0, container);
    document.getElementById('mazeDown').onclick = () => movePlayer(1, 0, container);
    document.getElementById('mazeLeft').onclick = () => movePlayer(0, -1, container);
    document.getElementById('mazeRight').onclick = () => movePlayer(0, 1, container);
    document.getElementById('resetMazeBtn').onclick = () => { loadLevel(currentLevel); renderGame(container); };
    
    document.addEventListener('keydown', function handler(e) {
        if (!mazeActive) { document.removeEventListener('keydown', handler); return; }
        switch (e.key) { case 'ArrowUp': e.preventDefault(); movePlayer(-1, 0, container); break; case 'ArrowDown': e.preventDefault(); movePlayer(1, 0, container); break; case 'ArrowLeft': e.preventDefault(); movePlayer(0, -1, container); break; case 'ArrowRight': e.preventDefault(); movePlayer(0, 1, container); break; }
    });
}

function movePlayer(dx, dy, container) {
    if (!mazeActive) return;
    const nx = mazePlayer.x + dx, ny = mazePlayer.y + dy;
    if (nx < 0 || nx >= mazeMap.length || ny < 0 || ny >= mazeMap[0].length || mazeMap[nx][ny] === '#') { showNotification('🚫 Там стена!', 'warning'); return; }
    mazePlayer.x = nx; mazePlayer.y = ny;
    if (mazePlayer.x === mazeExit.x && mazePlayer.y === mazeExit.y) {
        if (currentLevel < totalLevels) { currentLevel++; loadLevel(currentLevel); updateCoins(5 * currentLevel); showNotification(`🎉 Уровень ${currentLevel-1} пройден!`, 'success'); }
        else { mazeActive = false; updateCoins(50); updatePetHappiness(20); AppState.totalGames++; if (!AppState.achievements.includes('maze_master')) { AppState.achievements.push('maze_master'); showNotification('🏆 Достижение: Исследователь!', 'success'); } saveState(AppState.currentChild?.id); showNotification('🏆 Все уровни пройдены! +50 🪙', 'success'); }
    }
    renderGame(container);
}

export default { start: () => { const c = document.getElementById('modal-container') || document.body; const d = document.createElement('div'); d.id = 'mazeGame'; c.appendChild(d); renderScreen(d); } };
