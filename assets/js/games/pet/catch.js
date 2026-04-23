// ==================== 🎾 ПОЙМАЙ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let catchActive = false;
let catchScore = 0;
let catchTime = 30;
let catchPetPos = 50;
let catchInterval = null;
let catchTimerInterval = null;
let currentItem = { emoji: '🍎', points: 5 };
let modalContainer = null;
let gameModal = null;

const ITEMS = [
    { emoji: '🍎', points: 5 },
    { emoji: '🍪', points: 8 },
    { emoji: '🦴', points: 10 },
    { emoji: '🍕', points: 12 },
    { emoji: '🗑️', points: -3 },
    { emoji: '💩', points: -5 }
];

// ==================== ЗАПУСК ИГРЫ ====================
export function startCatch() {
    catchActive = true;
    catchScore = 0;
    catchTime = 30;
    catchPetPos = 50;
    
    createModal();
    
    document.getElementById('catchScore').textContent = '0';
    document.getElementById('catchTimer').textContent = '30';
    document.getElementById('catchPet').textContent = AppState.pet?.emoji || '🐱';
    document.getElementById('catchPet').style.left = '50%';
    
    document.getElementById('catchModal').classList.add('active');
    
    spawnItem();
    startTimers();
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'catchModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">🎾 Поймай</div>
            <div class="game-container">
                <div class="game-area" id="catchArea" style="position: relative; height: 280px; background: linear-gradient(180deg, #87CEEB 0%, #E8F5E9 100%); border-radius: 20px; overflow: hidden;">
                    <div id="catchItem" style="font-size: 3rem; position: absolute; top: 20px; left: 50%; transform: translateX(-50%); transition: top 0.04s linear;">🍎</div>
                    <div id="catchPet" style="font-size: 4rem; position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);">🐱</div>
                </div>
                <div class="game-controls">
                    <button class="game-btn" id="catchLeft">⬅️</button>
                    <button class="game-btn" id="catchRight">➡️</button>
                </div>
                <p style="text-align: center; margin-top: 15px;">
                    <span>🍎🍪🦴 = +очки</span> | 
                    <span>🗑️💩 = -очки</span>
                </p>
                <p style="text-align: center; font-size: 1.2rem;">
                    Счёт: <span id="catchScore">0</span> | 
                    Время: <span id="catchTimer">30</span>с
                </p>
            </div>
            <button class="close-btn" id="closeCatchBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    // Обработчики управления
    document.getElementById('catchLeft').onclick = () => movePet(-10);
    document.getElementById('catchRight').onclick = () => movePet(10);
    document.getElementById('closeCatchBtn').onclick = closeGame;
    
    // Управление с клавиатуры
    document.addEventListener('keydown', handleKeydown);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== УПРАВЛЕНИЕ С КЛАВИАТУРЫ ====================
function handleKeydown(e) {
    if (!catchActive) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        movePet(-10);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        movePet(10);
    }
}

// ==================== ДВИЖЕНИЕ ПИТОМЦА ====================
function movePet(delta) {
    if (!catchActive) return;
    catchPetPos = Math.max(10, Math.min(90, catchPetPos + delta));
    document.getElementById('catchPet').style.left = catchPetPos + '%';
}

// ==================== ЗАПУСК ТАЙМЕРОВ ====================
function startTimers() {
    catchInterval = setInterval(() => {
        if (!catchActive) return;
        
        const item = document.getElementById('catchItem');
        const itemTop = parseInt(item.style.top) || 20;
        item.style.top = (itemTop + 4) + 'px';
        
        if (itemTop > 230) {
            const itemLeft = parseFloat(item.style.left) || 50;
            const petLeft = catchPetPos;
            
            if (Math.abs(itemLeft - petLeft) < 18) {
                // Поймал предмет
                if (currentItem.points > 0) {
                    catchScore += currentItem.points;
                    showNotification(`+${currentItem.points} очков!`, 'success');
                } else {
                    catchScore = Math.max(0, catchScore + currentItem.points);
                    showNotification(`${currentItem.points} очков...`, 'error');
                }
                document.getElementById('catchScore').textContent = catchScore;
            }
            spawnItem();
        }
    }, 40);
    
    catchTimerInterval = setInterval(() => {
        if (!catchActive) return;
        catchTime--;
        document.getElementById('catchTimer').textContent = catchTime;
        
        if (catchTime <= 0) {
            endGame();
        }
    }, 1000);
}

// ==================== СПАВН ПРЕДМЕТА ====================
function spawnItem() {
    if (!catchActive) return;
    
    currentItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    document.getElementById('catchItem').textContent = currentItem.emoji;
    document.getElementById('catchItem').style.left = Math.random() * 70 + 15 + '%';
    document.getElementById('catchItem').style.top = '20px';
}

// ==================== ЗАВЕРШЕНИЕ ИГРЫ ====================
function endGame() {
    catchActive = false;
    clearInterval(catchInterval);
    clearInterval(catchTimerInterval);
    document.removeEventListener('keydown', handleKeydown);
    
    const reward = Math.floor(catchScore / 2);
    const happiness = Math.floor(catchScore / 3);
    
    updateCoins(reward);
    updatePetHappiness(happiness);
    
    AppState.totalGames++;
    saveState();
    
    showNotification(`🎮 Игра окончена! +${reward} 🪙, +${happiness} счастья`, 'success');
    
    EventBus.emit('game:ended', { game: 'catch', score: catchScore, reward });
    
    closeGame();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    catchActive = false;
    clearInterval(catchInterval);
    clearInterval(catchTimerInterval);
    document.removeEventListener('keydown', handleKeydown);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== ЭКСПОРТ ====================
export default { start: startCatch };
