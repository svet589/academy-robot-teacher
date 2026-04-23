// ==================== 🗺️ ЛАБИРИНТ (ПОЛНАЯ ВЕРСИЯ) ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let mazeActive = false;
let currentLevel = 1;
let mazeMap = [];
let mazePlayer = { x: 1, y: 1 };
let mazeExit = { x: 7, y: 7 };
let modalContainer = null;
let gameModal = null;
let totalLevels = 5;

// ==================== КАРТЫ ЛАБИРИНТОВ ====================
const MAZE_LEVELS = [
    // Уровень 1 - простой
    {
        map: [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
            ['#', '#', '#', ' ', '#', '#', '#', ' ', '#'],
            ['#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#'],
            ['#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#']
        ],
        player: { x: 1, y: 1 },
        exit: { x: 5, y: 7 },
        name: '🌱 Начало'
    },
    // Уровень 2 - посложнее
    {
        map: [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', ' ', '#', ' ', ' ', ' ', '#', ' ', '#'],
            ['#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
            ['#', '#', '#', ' ', '#', '#', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#'],
            ['#', ' ', '#', '#', '#', '#', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#']
        ],
        player: { x: 1, y: 1 },
        exit: { x: 7, y: 7 },
        name: '🌿 Извилистый'
    },
    // Уровень 3 - ещё сложнее
    {
        map: [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', ' ', ' ', '#', ' ', ' ', ' ', ' ', '#'],
            ['#', '#', ' ', '#', ' ', '#', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', ' ', '#', ' ', ' ', '#'],
            ['#', ' ', '#', '#', '#', '#', ' ', '#', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
            ['#', '#', '#', ' ', '#', ' ', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#']
        ],
        player: { x: 1, y: 1 },
        exit: { x: 7, y: 7 },
        name: '🍂 Запутанный'
    },
    // Уровень 4 - с ловушками (дополнительные стены)
    {
        map: [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', '#'],
            ['#', '#', '#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
            ['#', ' ', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', '#'],
            ['#', '#', '#', ' ', '#', ' ', '#', '#', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
            ['#', ' ', '#', '#', '#', ' ', '#', '#', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
        ],
        player: { x: 1, y: 1 },
        exit: { x: 8, y: 9 },
        name: '🌲 Дремучий лес'
    },
    // Уровень 5 - финальный
    {
        map: [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', '#'],
            ['#', ' ', '#', '#', '#', ' ', '#', '#', ' ', '#', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
            ['#', '#', '#', ' ', '#', '#', '#', ' ', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', ' ', ' ', '#', ' ', ' ', ' ', '#'],
            ['#', ' ', '#', '#', '#', ' ', '#', '#', '#', ' ', '#'],
            ['#', ' ', ' ', ' ', '#', ' ', ' ', ' ', ' ', ' ', '#'],
            ['#', '#', '#', ' ', '#', '#', '#', ' ', '#', '#', '#'],
            ['#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
        ],
        player: { x: 1, y: 1 },
        exit: { x: 9, y: 9 },
        name: '🏆 Финальный'
    }
];

// ==================== ЗАПУСК ИГРЫ ====================
export function startMaze() {
    mazeActive = true;
    currentLevel = 1;
    
    loadLevel(currentLevel);
    createModal();
    renderMaze();
    
    document.getElementById('mazeModal').classList.add('active');
}

// ==================== ЗАГРУЗКА УРОВНЯ ====================
function loadLevel(level) {
    const levelData = MAZE_LEVELS[level - 1];
    mazeMap = levelData.map.map(row => [...row]);
    mazePlayer = { ...levelData.player };
    mazeExit = { ...levelData.exit };
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'mazeModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-title">
                🗺️ Лабиринт — Уровень <span id="mazeLevel">1</span>/5
            </div>
            <div class="game-container">
                <p id="mazeLevelName" style="text-align: center; margin-bottom: 10px; color: var(--text-secondary);"></p>
                <div id="mazeGrid" class="maze-grid"></div>
                <div class="game-controls" style="margin-top: 20px;">
                    <button class="game-btn" id="mazeUp">⬆️</button>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="game-btn" id="mazeLeft">⬅️</button>
                        <button class="game-btn" id="mazeDown">⬇️</button>
                        <button class="game-btn" id="mazeRight">➡️</button>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 15px;">
                    Найди выход 🎁 из лабиринта!
                </p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="resetMazeBtn" style="flex: 1;">🔄 Заново</button>
                </div>
            </div>
            <button class="close-btn" id="closeMazeBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    // Обработчики
    document.getElementById('mazeUp').onclick = () => movePlayer(-1, 0);
    document.getElementById('mazeDown').onclick = () => movePlayer(1, 0);
    document.getElementById('mazeLeft').onclick = () => movePlayer(0, -1);
    document.getElementById('mazeRight').onclick = () => movePlayer(0, 1);
    document.getElementById('resetMazeBtn').onclick = () => {
        loadLevel(currentLevel);
        renderMaze();
        showNotification('🔄 Уровень сброшен', 'info');
    };
    document.getElementById('closeMazeBtn').onclick = closeGame;
    
    document.addEventListener('keydown', handleKeydown);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== УПРАВЛЕНИЕ С КЛАВИАТУРЫ ====================
function handleKeydown(e) {
    if (!mazeActive) return;
    
    switch (e.key) {
        case 'ArrowUp': e.preventDefault(); movePlayer(-1, 0); break;
        case 'ArrowDown': e.preventDefault(); movePlayer(1, 0); break;
        case 'ArrowLeft': e.preventDefault(); movePlayer(0, -1); break;
        case 'ArrowRight': e.preventDefault(); movePlayer(0, 1); break;
    }
}

// ==================== ДВИЖЕНИЕ ИГРОКА ====================
function movePlayer(dx, dy) {
    if (!mazeActive) return;
    
    const newX = mazePlayer.x + dx;
    const newY = mazePlayer.y + dy;
    
    if (newX < 0 || newX >= mazeMap.length || newY < 0 || newY >= mazeMap[0].length) return;
    if (mazeMap[newX][newY] === '#') {
        showNotification('🚫 Там стена!', 'warning');
        return;
    }
    
    mazePlayer.x = newX;
    mazePlayer.y = newY;
    
    renderMaze();
    
    if (mazePlayer.x === mazeExit.x && mazePlayer.y === mazeExit.y) {
        levelComplete();
    }
}

// ==================== ОТРИСОВКА ====================
function renderMaze() {
    const container = document.getElementById('mazeGrid');
    const levelName = document.getElementById('mazeLevelName');
    const levelDisplay = document.getElementById('mazeLevel');
    
    if (!container) return;
    
    const levelData = MAZE_LEVELS[currentLevel - 1];
    levelName.textContent = levelData.name;
    levelDisplay.textContent = currentLevel;
    
    let html = '';
    for (let i = 0; i < mazeMap.length; i++) {
        for (let j = 0; j < mazeMap[0].length; j++) {
            let cellClass = 'maze-cell';
            let content = '';
            
            if (mazeMap[i][j] === '#') {
                cellClass += ' wall';
                content = '🧱';
            } else if (i === mazePlayer.x && j === mazePlayer.y) {
                cellClass += ' player';
                content = AppState.pet?.emoji || '🐱';
            } else if (i === mazeExit.x && j === mazeExit.y) {
                cellClass += ' exit';
                content = '🎁';
            } else {
                content = '⬜';
            }
            
            html += `<div class="${cellClass}">${content}</div>`;
        }
    }
    
    container.innerHTML = html;
    container.style.gridTemplateColumns = `repeat(${mazeMap[0].length}, 1fr)`;
}

// ==================== ЗАВЕРШЕНИЕ УРОВНЯ ====================
function levelComplete() {
    if (currentLevel < totalLevels) {
        currentLevel++;
        loadLevel(currentLevel);
        renderMaze();
        
        const reward = 5 * currentLevel;
        updateCoins(reward);
        showNotification(`🎉 Уровень ${currentLevel - 1} пройден! +${reward} 🪙`, 'success');
    } else {
        winGame();
    }
}

// ==================== ПОБЕДА ====================
function winGame() {
    mazeActive = false;
    
    const reward = 50;
    updateCoins(reward);
    AppState.totalGames++;
    
    if (!AppState.achievements) AppState.achievements = [];
    if (!AppState.achievements.includes('maze_master')) {
        AppState.achievements.push('maze_master');
        showNotification('🏆 Достижение: Исследователь!', 'success');
    }
    
    saveState();
    
    showNotification(`🏆 Все уровни пройдены! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'maze', win: true, reward, levels: currentLevel });
    
    closeGame();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    mazeActive = false;
    document.removeEventListener('keydown', handleKeydown);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== СТИЛИ ====================
const style = document.createElement('style');
style.textContent = `
    .maze-grid {
        display: grid;
        gap: 3px;
        background: #654321;
        padding: 10px;
        border-radius: 20px;
        max-width: 400px;
        margin: 0 auto;
    }
    .maze-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        background: #a9d6e5;
        border-radius: 4px;
    }
    .maze-cell.wall {
        background: #8b5a2b;
    }
    .maze-cell.player {
        background: #ffd966;
    }
    .maze-cell.exit {
        background: #4caf50;
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startMaze };
