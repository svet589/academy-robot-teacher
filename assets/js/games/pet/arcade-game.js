// ==================== 🎮 АРКАДА ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let arcadeActive = false;
let arcadeScore = 0;
let arcadeTime = 30;
let arcadeTimerInterval = null;
let arcadeSpawnInterval = null;
let modalContainer = null;
let gameModal = null;

const TARGETS = ['🎈', '🎯', '👾', '⭐', '🌟', '💎'];

// ==================== ЗАПУСК ИГРЫ ====================
export function startArcadeGame() {
    arcadeActive = true;
    arcadeScore = 0;
    arcadeTime = 30;
    
    createModal();
    
    document.getElementById('arcadeScore').textContent = '0';
    document.getElementById('arcadeTimer').textContent = '30';
    
    document.getElementById('arcadeModal').classList.add('active');
    
    startTimers();
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'arcadeModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">🎮 Аркада</div>
            <div class="game-container">
                <div class="game-area" id="arcadeArea" style="position: relative; height: 300px; background: #1a1a2e; border-radius: 20px; overflow: hidden;">
                    <p style="color: white; text-align: center; padding-top: 10px;">
                        Счёт: <span id="arcadeScore">0</span> | 
                        Время: <span id="arcadeTimer">30</span>с
                    </p>
                </div>
                <p style="text-align: center; margin-top: 15px; color: #888;">
                    Кликай по целям как можно быстрее!
                </p>
            </div>
            <button class="close-btn" id="closeArcadeBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('closeArcadeBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ТАЙМЕРЫ ====================
function startTimers() {
    const area = document.getElementById('arcadeArea');
    
    // Очищаем старые цели
    area.querySelectorAll('.arcade-target').forEach(t => t.remove());
    
    // Таймер игры
    arcadeTimerInterval = setInterval(() => {
        if (!arcadeActive) return;
        arcadeTime--;
        document.getElementById('arcadeTimer').textContent = arcadeTime;
        
        if (arcadeTime <= 0) {
            endGame();
        }
    }, 1000);
    
    // Спавн целей
    arcadeSpawnInterval = setInterval(() => {
        if (!arcadeActive) return;
        spawnTarget();
    }, 600);
}

// ==================== СПАВН ЦЕЛИ ====================
function spawnTarget() {
    const area = document.getElementById('arcadeArea');
    if (!area) return;
    
    const target = document.createElement('div');
    target.className = 'arcade-target';
    target.textContent = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    target.style.cssText = `
        position: absolute;
        font-size: 2.5rem;
        cursor: pointer;
        animation: targetPop 0.3s ease;
        left: ${Math.random() * 80 + 10}%;
        top: ${Math.random() * 60 + 40}px;
    `;
    
    target.onclick = () => {
        if (!arcadeActive) return;
        arcadeScore++;
        document.getElementById('arcadeScore').textContent = arcadeScore;
        target.remove();
        showNotification('+1!', 'success');
    };
    
    area.appendChild(target);
    
    // Цель исчезает через 1.5 секунды
    setTimeout(() => {
        if (target.parentNode) target.remove();
    }, 1500);
}

// ==================== ЗАВЕРШЕНИЕ ====================
function endGame() {
    arcadeActive = false;
    clearInterval(arcadeTimerInterval);
    clearInterval(arcadeSpawnInterval);
    
    const reward = arcadeScore * 2;
    const happiness = Math.min(25, arcadeScore);
    
    updateCoins(reward);
    updatePetHappiness(happiness);
    
    AppState.totalGames++;
    
    // Сохраняем рекорд
    if (!AppState.gameRecords) AppState.gameRecords = {};
    if (arcadeScore > (AppState.gameRecords.arcade || 0)) {
        AppState.gameRecords.arcade = arcadeScore;
        showNotification(`🏆 Новый рекорд: ${arcadeScore}!`, 'success');
    }
    
    saveState();
    
    showNotification(`🎮 Игра окончена! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'arcade', score: arcadeScore, reward });
    
    closeGame();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    arcadeActive = false;
    clearInterval(arcadeTimerInterval);
    clearInterval(arcadeSpawnInterval);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== ЭКСПОРТ ====================
export default { start: startArcadeGame };
