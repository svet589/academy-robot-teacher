// ==================== 💰 СДАЧА В МАГАЗИНЕ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, price = 0, paid = 0, change = 0, score = 0, targetScore = 10;

export function renderScreen(container) {
    gameActive = true; score = 0; generateQ(); renderGame(container);
}

function generateQ() { price = Math.floor(Math.random() * 90) + 10; paid = Math.floor(price + Math.random() * 50) + 10; change = paid - price; }

function renderGame(container) {
    let html = `<div style="text-align:center;">
        <div style="font-size:1.5rem;margin:15px;">💰 Покупка стоит <strong>${price}₽</strong></div>
        <div style="font-size:1.5rem;margin:15px;">💵 Ты дал <strong>${paid}₽</strong></div>
        <div style="font-size:1.5rem;margin:15px;">Сколько сдачи?</div>
        <input type="number" id="changeAnswer" style="width:150px;padding:15px;font-size:2rem;text-align:center;border-radius:30px;border:3px solid #ffb347;margin:20px 0;">
        <button id="submitChangeBtn" style="font-size:1.3rem;">✅ Проверить</button>
        <div style="font-size:1.3rem;margin-top:20px;">💰 Счёт: <strong>${score}</strong> / ${targetScore}</div>
        <button id="resetChangeBtn" style="margin-top:15px;">🔄 Заново</button>
    </div>`;
    
    container.innerHTML = html;
    
    document.getElementById('submitChangeBtn').onclick = () => { if (!gameActive) return; const answer = parseInt(document.getElementById('changeAnswer').value); if (answer === change) { score++; if (score >= targetScore) { gameActive = false; updateCoins(20); updatePetHappiness(15); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`🎉 ${score}/${targetScore}! +20 🪙`, 'success'); renderGame(container); return; } generateQ(); renderGame(container); } else { gameActive = false; showNotification(`❌ Сдача: ${change}₽. Счёт: ${score}`, 'error'); renderGame(container); } };
    document.getElementById('resetChangeBtn').onclick = () => { gameActive = true; score = 0; generateQ(); renderGame(container); };
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
