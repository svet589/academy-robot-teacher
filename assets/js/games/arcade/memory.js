// ==================== 🧠 НАЙДИ ПАРУ (MEMORY) ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let modalContainer = null;
let gameModal = null;

const PAIRS = [
    { text: '3 × 4', pair: '12' }, { text: '5 + 7', pair: '12' },
    { text: '8 - 3', pair: '5' }, { text: '2 × 6', pair: '12' },
    { text: '9 ÷ 3', pair: '3' }, { text: '4 + 4', pair: '8' },
    { text: '10 - 2', pair: '8' }, { text: '6 × 2', pair: '12' }
];

// ==================== ЗАПУСК ИГРЫ ====================
export function startMemory() {
    gameActive = true;
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
    
    initCards();
    createModal();
    renderBoard();
    
    document.getElementById('memoryModal').classList.add('active');
}

// ==================== ИНИЦИАЛИЗАЦИЯ КАРТ ====================
function initCards() {
    cards = [];
    PAIRS.forEach(p => {
        cards.push({ text: p.text, pair: p.pair, matched: false });
        cards.push({ text: p.pair, pair: p.text, matched: false });
    });
    cards.sort(() => Math.random() - 0.5);
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'memoryModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">🧠 Найди пару</div>
            <div class="game-container">
                <div id="memoryBoard" class="memory-board"></div>
                <div id="memoryStatus" class="game-status">
                    <p>Найдено пар: <span id="pairsFound">0</span>/8</p>
                </div>
                <div class="game-controls" style="margin-top: 15px;">
                    <button id="resetMemoryBtn">🔄 Новая игра</button>
                </div>
            </div>
            <button class="close-btn" id="closeMemoryBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('resetMemoryBtn').onclick = () => {
        initCards();
        flippedCards = [];
        matchedPairs = 0;
        canFlip = true;
        gameActive = true;
        renderBoard();
        showNotification('🔄 Новая игра!', 'info');
    };
    document.getElementById('closeMemoryBtn').onclick = closeGame;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== ОТРИСОВКА ====================
function renderBoard() {
    const container = document.getElementById('memoryBoard');
    if (!container) return;
    
    let html = '';
    cards.forEach((card, idx) => {
        const isFlipped = flippedCards.includes(idx) || card.matched;
        const cardClass = isFlipped ? 'flipped' : '';
        const matchedClass = card.matched ? 'matched' : '';
        html += `<div class="memory-card ${cardClass} ${matchedClass}" data-index="${idx}">${isFlipped ? card.text : '❓'}</div>`;
    });
    
    container.innerHTML = html;
    document.getElementById('pairsFound').textContent = matchedPairs;
    
    // Обработчики
    container.querySelectorAll('.memory-card').forEach(card => {
        card.onclick = () => {
            if (!gameActive || !canFlip) return;
            const idx = parseInt(card.dataset.index);
            if (flippedCards.includes(idx) || cards[idx].matched) return;
            if (flippedCards.length >= 2) return;
            
            flipCard(idx);
        };
    });
}

// ==================== ПЕРЕВОРОТ КАРТЫ ====================
function flipCard(idx) {
    if (!gameActive || !canFlip) return;
    if (flippedCards.includes(idx) || cards[idx].matched) return;
    if (flippedCards.length >= 2) return;
    
    flippedCards.push(idx);
    renderBoard();
    
    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

// ==================== ПРОВЕРКА СОВПАДЕНИЯ ====================
function checkMatch() {
    const [idx1, idx2] = flippedCards;
    const card1 = cards[idx1];
    const card2 = cards[idx2];
    
    const isMatch = (card1.text === card2.pair && card1.pair === card2.text) ||
                    (card1.pair === card2.text && card2.pair === card1.text);
    
    if (isMatch) {
        card1.matched = true;
        card2.matched = true;
        matchedPairs++;
        flippedCards = [];
        canFlip = true;
        renderBoard();
        showNotification('✅ Пара найдена!', 'success');
        
        if (matchedPairs === 8) {
            winGame();
        }
    } else {
        setTimeout(() => {
            flippedCards = [];
            canFlip = true;
            renderBoard();
        }, 800);
        showNotification('❌ Не пара!', 'error');
    }
}

// ==================== ПОБЕДА ====================
function winGame() {
    gameActive = false;
    
    const reward = 30;
    updateCoins(reward);
    AppState.totalGames++;
    
    if (!AppState.achievements) AppState.achievements = [];
    if (!AppState.achievements.includes('memory_master')) {
        AppState.achievements.push('memory_master');
        showNotification('🏆 Достижение: Мастер памяти!', 'success');
    }
    
    saveState();
    
    showNotification(`🎉 Все пары найдены! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'memory', win: true, reward });
    
    renderBoard();
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    gameActive = false;
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== СТИЛИ ====================
const style = document.createElement('style');
style.textContent = `
    .memory-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin: 0 auto;
        max-width: 400px;
    }
    .memory-card {
        aspect-ratio: 1;
        background: #ffb347;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 5px 0 #b47c2e;
        transition: all 0.15s;
        color: #2d4059;
    }
    .memory-card:active {
        transform: translateY(3px);
        box-shadow: 0 2px 0 #b47c2e;
    }
    .memory-card.flipped {
        background: #a5d6a5;
        box-shadow: 0 3px 0 #6b9e6b;
        transform: translateY(2px);
    }
    .memory-card.matched {
        background: #4caf50;
        opacity: 0.7;
        cursor: default;
        box-shadow: 0 3px 0 #2e7d32;
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startMemory };
