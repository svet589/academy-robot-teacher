// ==================== 🏁 ГОНКИ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let raceActive = false;
let raceTime = 0;
let raceCarPos = 50;
let raceTimerInterval = null;
let obstacleInterval = null;
let modalContainer = null;
let gameModal = null;
let currentCar = '🚗';

// ==================== ЗАПУСК ИГРЫ ====================
export function startRacing(carEmoji = '🚗') {
    raceActive = true;
    raceTime = 0;
    raceCarPos = 50;
    currentCar = carEmoji;
    
    createModal();
    
    document.getElementById('raceTimer').textContent = '0.0';
    document.getElementById('raceCar').textContent = currentCar;
    document.getElementById('raceCar').style.left = '50%';
    
    const record = AppState.carRecords?.[AppState.currentCar] || AppState.gameRecords?.racing || 0;
    document.getElementById('raceRecord').textContent = record.toFixed(1);
    
    document.getElementById('racingModal').classList.add('active');
    
    startTimers();
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'racingModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">🏁 Гонки</div>
            <div class="game-container">
                <div class="game-area" id="racingArea" style="position: relative; height: 320px; background: #2c3e50; border-radius: 20px; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 100%;">
                        <div style="position: absolute; left: 20%; width: 2px; height: 100%; background: rgba(255,255,255,0.3);"></div>
                        <div style="position: absolute; left: 40%; width: 2px; height: 100%; background: rgba(255,255,255,0.3);"></div>
                        <div style="position: absolute; left: 60%; width: 2px; height: 100%; background: rgba(255,255,255,0.3);"></div>
                        <div style="position: absolute; left: 80%; width: 2px; height: 100%; background: rgba(255,255,255,0.3);"></div>
                    </div>
                    <div id="obstacle" style="font-size: 3rem; position: absolute; top: 0; left: 50%; transform: translateX(-50%); display: none;">🚧</div>
                    <div id="raceCar" style="font-size: 3.5rem; position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); transition: left 0.05s;">🚗</div>
                </div>
                <div class="game-controls">
                    <button class="game-btn" id="raceLeft">⬅️</button>
                    <button class="game-btn" id="raceRight">➡️</button>
                </div>
                <p style="text-align: center; font-size: 1.2rem; margin-top: 15px;">
                    Время: <span id="raceTimer">0.0</span>с | 
                    🏆 Рекорд: <span id="raceRecord">0.0</span>с
                </p>
                <p style="text-align: center; font-size: 0.9rem; color: #888;">
                    Уворачивайся от препятствий! ⬅️➡️
                </p>
            </div>
            <button class="close-btn" id="closeRacingBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('raceLeft').onclick = () => moveCar(-8);
    document.getElementById('raceRight').onclick = () => moveCar(8);
    document.getElementById('closeRacingBtn').onclick = closeGame;
    
    document.addEventListener('keydown', handleKeydown);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== УПРАВЛЕНИЕ ====================
function handleKeydown(e) {
    if (!raceActive) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveCar(-8);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveCar(8);
    }
}

function moveCar(delta) {
    if (!raceActive) return;
    raceCarPos = Math.max(10, Math.min(90, raceCarPos + delta));
    document.getElementById('raceCar').style.left = raceCarPos + '%';
}

// ==================== ТАЙМЕРЫ ====================
function startTimers() {
    raceTimerInterval = setInterval(() => {
        if (!raceActive) return;
        raceTime += 0.1;
        document.getElementById('raceTimer').textContent = raceTime.toFixed(1);
    }, 100);
    
    setTimeout(() => spawnObstacle(), 500);
}

// ==================== СПАВН ПРЕПЯТСТВИЯ ====================
function spawnObstacle() {
    if (!raceActive) return;
    
    const obstacle = document.getElementById('obstacle');
    obstacle.style.left = Math.random() * 80 + 10 + '%';
    obstacle.style.top = '0px';
    obstacle.style.display = 'block';
    
    const fallInterval = setInterval(() => {
        if (!raceActive) {
            clearInterval(fallInterval);
            return;
        }
        
        const top = parseFloat(obstacle.style.top) || 0;
        obstacle.style.top = (top + 4) + 'px';
        
        if (top > 250) {
            const obsLeft = parseFloat(obstacle.style.left) || 50;
            const carLeft = raceCarPos;
            
            if (Math.abs(obsLeft - carLeft) < 15) {
                // Столкновение
                endGame(false);
                clearInterval(fallInterval);
            } else {
                // Промахнулся
                obstacle.style.display = 'none';
                clearInterval(fallInterval);
                if (raceActive) spawnObstacle();
            }
        }
    }, 25);
}

// ==================== ЗАВЕРШЕНИЕ ====================
function endGame(crashed = true) {
    if (!raceActive) return;
    raceActive = false;
    clearInterval(raceTimerInterval);
    document.removeEventListener('keydown', handleKeydown);
    
    const record = AppState.gameRecords?.racing || 0;
    const isRecord = raceTime > record;
    
    if (isRecord) {
        if (!AppState.gameRecords) AppState.gameRecords = {};
        AppState.gameRecords.racing = raceTime;
        showNotification(`🏆 Новый рекорд: ${raceTime.toFixed(1)}с!`, 'success');
    }
    
    const reward = Math.floor(raceTime * 2);
    const happiness = Math.floor(raceTime / 2);
    
    updateCoins(reward);
    updatePetHappiness(happiness);
    
    AppState.totalGames++;
    saveState();
    
    if (crashed) {
        showNotification(`💥 Авария! +${reward} 🪙`, 'error');
    } else {
        showNotification(`🏁 Финиш! +${reward} 🪙`, 'success');
    }
    
    EventBus.emit('game:ended', { game: 'racing', time: raceTime, record: isRecord, reward });
    
    closeGame();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    raceActive = false;
    clearInterval(raceTimerInterval);
    document.removeEventListener('keydown', handleKeydown);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== ЭКСПОРТ ====================
export default { start: startRacing };
