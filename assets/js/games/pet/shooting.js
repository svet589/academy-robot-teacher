// ==================== 🎯 СТРЕЛЯЛКА ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let shootingActive = false;
let shootingScore = 0;
let shootingAmmo = 15;
let shootingTime = 30;
let shootingTimerInterval = null;
let shootingSpawnInterval = null;
let modalContainer = null;
let gameModal = null;

// ==================== ЗАПУСК ИГРЫ ====================
export function startShooting() {
    shootingActive = true;
    shootingScore = 0;
    shootingAmmo = 15;
    shootingTime = 30;
    
    createModal();
    
    document.getElementById('shootingScore').textContent = '0';
    document.getElementById('shootingAmmo').textContent = '15';
    document.getElementById('shootingTimer').textContent = '30';
    
    document.getElementById('shootingModal').classList.add('active');
    
    startTimers();
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'shootingModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">🎯 Стрелялка</div>
            <div class="game-container">
                <div class="game-area" id="shootingArea" style="position: relative; height: 300px; background: linear-gradient(180deg, #1a1a2e 0%, #2a2a4e 100%); border-radius: 20px; overflow: hidden; cursor: crosshair;">
                    <p style="color: white; text-align: center; padding-top: 10px;">
                        🎯 <span id="shootingScore">0</span> | 
                        🔫 <span id="shootingAmmo">15</span> | 
                        ⏱️ <span id="shootingTimer">30</span>с
                    </p>
                </div>
                <p style="text-align: center; margin-top: 15px; color: #888;">
                    Кликай по мишеням! Попадание = +1 очко
                </p>
            </div>
            <button class="close-btn" id="closeShootingBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('closeShootingBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ТАЙМЕРЫ ====================
function startTimers() {
    const area = document.getElementById('shootingArea');
    area.querySelectorAll('.shooting-target').forEach(t => t.remove());
    
    shootingTimerInterval = setInterval(() => {
        if (!shootingActive) return;
        shootingTime--;
        document.getElementById('shootingTimer').textContent = shootingTime;
        
        if (shootingTime <= 0 || shootingAmmo <= 0) {
            endGame();
        }
    }, 1000);
    
    shootingSpawnInterval = setInterval(() => {
        if (!shootingActive) return;
        if (shootingAmmo > 0) {
            spawnTarget();
        }
    }, 800);
}

// ==================== СПАВН МИШЕНИ ====================
function spawnTarget() {
    const area = document.getElementById('shootingArea');
    if (!area) return;
    
    const target = document.createElement('div');
    target.className = 'shooting-target';
    target.textContent = '🎯';
    target.style.cssText = `
        position: absolute;
        font-size: 2.8rem;
        cursor: pointer;
        transition: transform 0.1s;
        left: ${Math.random() * 75 + 10}%;
        top: ${Math.random() * 60 + 50}px;
    `;
    
    target.onmouseenter = () => {
        if (shootingActive) target.style.transform = 'scale(1.1)';
    };
    
    target.onmouseleave = () => {
        target.style.transform = 'scale(1)';
    };
    
    target.onclick = (e) => {
        e.stopPropagation();
        if (!shootingActive) return;
        if (shootingAmmo <= 0) {
            showNotification('Нет патронов!', 'error');
            return;
        }
        
        shootingScore++;
        shootingAmmo--;
        
        document.getElementById('shootingScore').textContent = shootingScore;
        document.getElementById('shootingAmmo').textContent = shootingAmmo;
        
        target.remove();
        showNotification('🎯 Попадание!', 'success');
        
        if (shootingAmmo <= 0) {
            endGame();
        }
    };
    
    area.appendChild(target);
    
    // Мишень исчезает через 2 секунды
    setTimeout(() => {
        if (target.parentNode) target.remove();
    }, 2000);
}

// ==================== ЗАВЕРШЕНИЕ ====================
function endGame() {
    shootingActive = false;
    clearInterval(shootingTimerInterval);
    clearInterval(shootingSpawnInterval);
    
    const reward = shootingScore * 3;
    const happiness = Math.min(25, shootingScore * 2);
    
    updateCoins(reward);
    updatePetHappiness(happiness);
    
    AppState.totalGames++;
    
    if (!AppState.gameRecords) AppState.gameRecords = {};
    if (shootingScore > (AppState.gameRecords.shooting || 0)) {
        AppState.gameRecords.shooting = shootingScore;
        showNotification(`🏆 Новый рекорд: ${shootingScore}!`, 'success');
    }
    
    saveState();
    
    showNotification(`🎯 Игра окончена! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'shooting', score: shootingScore, reward });
    
    closeGame();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    shootingActive = false;
    clearInterval(shootingTimerInterval);
    clearInterval(shootingSpawnInterval);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== ЭКСПОРТ ====================
export default { start: startShooting };
