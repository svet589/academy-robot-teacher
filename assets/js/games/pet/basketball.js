// ==================== 🏀 БАСКЕТБОЛ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let basketballActive = false;
let basketballScore = 0;
let basketballPetPos = 50;
let ballInterval = null;
let modalContainer = null;
let gameModal = null;

// ==================== ЗАПУСК ИГРЫ ====================
export function startBasketball() {
    basketballActive = true;
    basketballScore = 0;
    basketballPetPos = 50;
    
    createModal();
    
    document.getElementById('basketballScore').textContent = '0';
    document.getElementById('gamePet').textContent = AppState.pet?.emoji || '🐱';
    document.getElementById('gamePet').style.left = '50%';
    document.getElementById('ball').style.top = '50px';
    document.getElementById('ball').style.left = '50%';
    
    document.getElementById('basketballModal').classList.add('active');
    
    startBallMovement();
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'basketballModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">🏀 Баскетбол</div>
            <div class="game-container">
                <div class="game-area" style="position: relative; height: 280px; background: linear-gradient(180deg, #FFD54F 0%, #FF8F00 100%); border-radius: 20px;">
                    <div style="font-size: 4rem; position: absolute; top: 10px; right: 20px;">⭕</div>
                    <div id="ball" style="font-size: 3rem; position: absolute; top: 50px; left: 50%; transform: translateX(-50%);">🏀</div>
                    <div id="gamePet" style="font-size: 4rem; position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);">🐱</div>
                </div>
                <div class="game-controls">
                    <button class="game-btn" id="moveLeft">⬅️</button>
                    <button class="game-btn" id="moveRight">➡️</button>
                </div>
                <p style="text-align: center; font-size: 1.2rem; margin-top: 15px;">
                    Счёт: <span id="basketballScore">0</span> / 5
                </p>
                <p style="text-align: center; font-size: 0.9rem; color: #888;">
                    Поймай мяч 5 раз, чтобы победить!
                </p>
            </div>
            <button class="close-btn" id="closeBasketballBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('moveLeft').onclick = () => movePet(-10);
    document.getElementById('moveRight').onclick = () => movePet(10);
    document.getElementById('closeBasketballBtn').onclick = closeGame;
    
    document.addEventListener('keydown', handleKeydown);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== УПРАВЛЕНИЕ ====================
function handleKeydown(e) {
    if (!basketballActive) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        movePet(-10);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        movePet(10);
    }
}

function movePet(delta) {
    if (!basketballActive) return;
    basketballPetPos = Math.max(10, Math.min(90, basketballPetPos + delta));
    document.getElementById('gamePet').style.left = basketballPetPos + '%';
}

// ==================== ДВИЖЕНИЕ МЯЧА ====================
function startBallMovement() {
    ballInterval = setInterval(() => {
        if (!basketballActive) return;
        
        const ball = document.getElementById('ball');
        const ballTop = parseInt(ball.style.top) || 50;
        ball.style.top = (ballTop + 5) + 'px';
        
        if (ballTop > 200) {
            const ballLeft = parseFloat(ball.style.left) || 50;
            const petLeft = basketballPetPos;
            
            if (Math.abs(ballLeft - petLeft) < 15) {
                // Поймал мяч
                basketballScore++;
                document.getElementById('basketballScore').textContent = basketballScore;
                showNotification(`🏀 +1! Осталось ${5 - basketballScore}`, 'success');
                
                if (basketballScore >= 5) {
                    endGame(true);
                    return;
                }
            }
            
            // Новый мяч
            ball.style.top = '50px';
            ball.style.left = Math.random() * 70 + 15 + '%';
        }
    }, 40);
}

// ==================== ЗАВЕРШЕНИЕ ====================
function endGame(win = false) {
    basketballActive = false;
    clearInterval(ballInterval);
    document.removeEventListener('keydown', handleKeydown);
    
    if (win) {
        const reward = 25;
        const happiness = 15;
        
        updateCoins(reward);
        updatePetHappiness(happiness);
        
        AppState.totalGames++;
        saveState();
        
        showNotification(`🎉 Победа! +${reward} 🪙, +${happiness} счастья`, 'success');
        EventBus.emit('game:ended', { game: 'basketball', score: basketballScore, win: true });
    }
    
    closeGame();
}

function closeGame() {
    basketballActive = false;
    clearInterval(ballInterval);
    document.removeEventListener('keydown', handleKeydown);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

export default { start: startBasketball };
