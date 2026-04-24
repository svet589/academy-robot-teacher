// ==================== 🖐️ СЧЁТ НА ПАЛЬЦАХ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, currentNumber = 0, score = 0, targetScore = 10;

export function renderScreen(container) {
    gameActive = true; score = 0; generateNumber(); renderGame(container);
}

function generateNumber() { currentNumber = Math.floor(Math.random() * 10) + 1; }

function renderGame(container) {
    const fingers = '🖐️'.repeat(Math.min(currentNumber, 5)) + (currentNumber > 5 ? '✋'.repeat(currentNumber - 5) : '');
    
    let html = `<div style="text-align:center;">
        <div style="font-size:5rem;letter-spacing:15px;margin:30px 0;">${fingers}</div>
        <div style="font-size:2rem;margin:20px;">Сколько пальцев?</div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:20px 0;">`;
    
    let options = [currentNumber];
    while (options.length < 4) { const o = Math.floor(Math.random()*10)+1; if (!options.includes(o)) options.push(o); }
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(opt => { html += `<button class="finger-btn" data-answer="${opt}" style="width:80px;height:80px;font-size:2rem;border-radius:50%;">${opt}</button>`; });
    
    html += `</div><div style="font-size:1.3rem;margin-top:20px;">🖐️ Счёт: <strong>${score}</strong> / ${targetScore}</div>`;
    html += `<button id="resetFingerBtn" style="margin-top:15px;">🔄 Заново</button></div>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.finger-btn').forEach(btn => { btn.onclick = () => { if (!gameActive) return; if (parseInt(btn.dataset.answer) === currentNumber) { score++; if (score >= targetScore) { gameActive = false; updateCoins(20); updatePetHappiness(15); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`🎉 ${score}/${targetScore}! +20 🪙`, 'success'); renderGame(container); return; } generateNumber(); renderGame(container); } else { gameActive = false; showNotification(`❌ Правильно: ${currentNumber}. Счёт: ${score}`, 'error'); renderGame(container); } }; });
    document.getElementById('resetFingerBtn').onclick = () => { gameActive = true; score = 0; generateNumber(); renderGame(container); };
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
