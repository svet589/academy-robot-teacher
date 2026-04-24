// ==================== 🧠 НАЙДИ ПАРУ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, cards = [], flippedCards = [], matchedPairs = 0, canFlip = true;

const PAIRS = [
    { text: '3 × 4', pair: '12' }, { text: '5 + 7', pair: '12' }, { text: '8 - 3', pair: '5' }, { text: '2 × 6', pair: '12' },
    { text: '9 ÷ 3', pair: '3' }, { text: '4 + 4', pair: '8' }, { text: '10 - 2', pair: '8' }, { text: '6 × 2', pair: '12' }
];

export function renderScreen(container) {
    gameActive = true; flippedCards = []; matchedPairs = 0; canFlip = true;
    cards = []; PAIRS.forEach(p => { cards.push({ text: p.text, pair: p.pair, matched: false }); cards.push({ text: p.pair, pair: p.text, matched: false }); });
    cards.sort(() => Math.random() - 0.5);
    renderGame(container);
}

function renderGame(container) {
    let html = '<div class="memory-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:400px;margin:0 auto;">';
    
    cards.forEach((card, idx) => {
        const isFlipped = flippedCards.includes(idx) || card.matched;
        html += `<div class="memory-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" data-index="${idx}" style="aspect-ratio:1;background:${card.matched?'#4caf50':isFlipped?'#a5d6a5':'#ffb347'};border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:bold;cursor:pointer;box-shadow:0 5px 0 ${card.matched?'#2e7d32':'#b47c2e'};transition:all 0.15s;">${isFlipped ? card.text : '❓'}</div>`;
    });
    
    html += `</div><p style="text-align:center;margin-top:15px;">Найдено пар: <strong>${matchedPairs}</strong>/8</p>`;
    html += `<div style="text-align:center;margin-top:10px;"><button id="resetMemoryBtn">🔄 Новая игра</button></div>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.memory-card').forEach(card => {
        card.onclick = () => {
            if (!gameActive || !canFlip) return;
            const idx = parseInt(card.dataset.index);
            if (flippedCards.includes(idx) || cards[idx].matched || flippedCards.length >= 2) return;
            flippedCards.push(idx); renderGame(container);
            if (flippedCards.length === 2) { canFlip = false; setTimeout(() => checkMatch(container), 800); }
        };
    });
    
    document.getElementById('resetMemoryBtn').onclick = () => { cards = []; PAIRS.forEach(p => { cards.push({ text: p.text, pair: p.pair, matched: false }); cards.push({ text: p.pair, pair: p.text, matched: false }); }); cards.sort(() => Math.random() - 0.5); flippedCards = []; matchedPairs = 0; canFlip = true; gameActive = true; renderGame(container); };
}

function checkMatch(container) {
    const [i1, i2] = flippedCards;
    const c1 = cards[i1], c2 = cards[i2];
    const isMatch = (c1.text === c2.pair && c1.pair === c2.text) || (c1.pair === c2.text && c2.pair === c1.text);
    if (isMatch) { c1.matched = true; c2.matched = true; matchedPairs++; flippedCards = []; canFlip = true; if (matchedPairs === 8) { gameActive = false; updateCoins(30); updatePetHappiness(20); AppState.totalGames++; if (!AppState.achievements.includes('memory_master')) { AppState.achievements.push('memory_master'); showNotification('🏆 Достижение: Мастер памяти!', 'success'); } saveState(AppState.currentChild?.id); showNotification('🎉 Все пары найдены! +30 🪙', 'success'); } }
    else { flippedCards = []; canFlip = true; }
    renderGame(container);
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
