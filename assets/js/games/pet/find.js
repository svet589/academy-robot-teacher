// ==================== 🦴 НАЙДИ КОСТОЧКУ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let findActive = false;
let findRound = 1;
let findScore = 0;
let correctBowl = 0;
let modalContainer = null;
let gameModal = null;

// ==================== ЗАПУСК ИГРЫ ====================
export function startFind() {
    findActive = true;
    findRound = 1;
    findScore = 0;
    correctBowl = Math.floor(Math.random() * 3);
    
    createModal();
    renderGame();
    
    document.getElementById('findModal').classList.add('active');
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'findModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-title">🦴 Найди косточку</div>
            <div class="game-container">
                <p style="text-align: center; margin-bottom: 20px;">Где спрятана косточка?</p>
                <div class="bowl-container">
                    <div class="bowl" data-bowl="0">🥣</div>
                    <div class="bowl" data-bowl="1">🥣</div>
                    <div class="bowl" data-bowl="2">🥣</div>
                </div>
                <p style="text-align: center; margin-top: 20px;">
                    Раунд: <span id="findRound">1</span>/3 | Счёт: <span id="findScore">0</span>
                </p>
            </div>
            <button class="close-btn" id="closeFindBtn">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    // Обработчики
    document.querySelectorAll('.bowl').forEach(bowl => {
        bowl.onclick = () => checkBowl(parseInt(bowl.dataset.bowl));
    });
    
    document.getElementById('closeFindBtn').onclick = closeGame;
    
    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ОТРИСОВКА ====================
function renderGame() {
    document.getElementById('findRound').textContent = findRound;
    document.getElementById('findScore').textContent = findScore;
    
    // Сбрасываем миски
    document.querySelectorAll('.bowl').forEach(b => b.textContent = '🥣');
}

// ==================== ПРОВЕРКА ВЫБОРА ====================
function checkBowl(index) {
    if (!findActive) return;
    
    const bowls = document.querySelectorAll('.bowl');
    
    // Показываем результат
    bowls.forEach((bowl, i) => {
        bowl.textContent = i === correctBowl ? '🦴' : '🥣';
    });
    
    if (index === correctBowl) {
        findScore++;
        showNotification('🎉 Правильно! +1 очко', 'success');
    } else {
        showNotification('😢 Мимо!', 'error');
    }
    
    document.getElementById('findScore').textContent = findScore;
    
    if (findRound < 3) {
        // Следующий раунд
        findRound++;
        correctBowl = Math.floor(Math.random() * 3);
        
        setTimeout(() => {
            document.getElementById('findRound').textContent = findRound;
            bowls.forEach(b => b.textContent = '🥣');
        }, 1000);
    } else {
        // Конец игры
        setTimeout(() => endGame(), 1000);
    }
}

// ==================== ЗАВЕРШЕНИЕ ИГРЫ ====================
function endGame() {
    findActive = false;
    
    // Награды
    const reward = findScore * 15;
    updateCoins(reward);
    updatePetHappiness(findScore * 10);
    
    AppState.totalGames++;
    saveState();
    
    showNotification(`🎮 Игра окончена! +${reward} 🪙, +${findScore * 10} счастья`, 'success');
    
    EventBus.emit('game:ended', { game: 'find', score: findScore, reward });
    
    closeGame();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    findActive = false;
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== ЭКСПОРТ ====================
export default { start: startFind };
