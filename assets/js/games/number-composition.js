// ==================== 🔢 СОСТАВ ЧИСЛА ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, total = 0, part = 0, missing = 0, score = 0, targetScore = 10;

export function renderScreen(container) {
    gameActive = true; score = 0; generateQ(); renderGame(container);
}

function generateQ() { total = Math.floor(Math.random() * 10) + 5; part = Math.floor(Math.random() * (total - 1)) + 1; missing = total - part; }

function renderGame(container) {
    let html = `<div style="text-align:center;">
        <div style="font-size:3rem;font-weight:bold;margin:30px 0;">${total} = ${part} + ?</div>
        <div style="font-size:1.5rem;margin-bottom:20px;">Какое число в сумме с ${part} даст ${total}?</div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:20px 0;">`;
    
    let options = [missing];
    while (options.length < 4) { const o = Math.floor(Math.random()*total)+1; if (!options.includes(o)) options.push(o); }
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(opt => { html += `<button class="comp-btn" data-answer="${opt}" style="width:80px;height:80px;font-size:2rem;border-radius:50%;">${opt}</button>`; });
    
    html += `</div><div style="font-size:1.3rem;margin-top:20px;">🔢 Счёт: <strong>${score}</strong> / ${targetScore}</div>`;
    html += `<button id="resetCompBtn" style="margin-top:15px;">🔄 Заново</button></div>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.comp-btn').forEach(btn => { btn.onclick = () => { if (!gameActive) return; if (parseInt(btn.dataset.answer) === missing) { score++; if (score >= targetScore) { gameActive = false; updateCoins(20); updatePetHappiness(15); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`🎉 ${score}/${targetScore}! +20 🪙`, 'success'); renderGame(container); return; } generateQ(); renderGame(container); } else { gameActive = false; showNotification(`❌ Правильно: ${missing}. Счёт: ${score}`, 'error'); renderGame(container); } }; });
    document.getElementById('resetCompBtn').onclick = () => { gameActive = true; score = 0; generateQ(); renderGame(container); };
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
