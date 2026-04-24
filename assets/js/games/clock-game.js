// ==================== ⏰ КОТОРЫЙ ЧАС? ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, hours = 0, minutes = 0, score = 0, targetScore = 10;

const CLOCK_EMOJIS = { 1:'🕐',2:'🕑',3:'🕒',4:'🕓',5:'🕔',6:'🕕',7:'🕖',8:'🕗',9:'🕘',10:'🕙',11:'🕚',12:'🕛' };

export function renderScreen(container) {
    gameActive = true; score = 0; generateQ(); renderGame(container);
}

function generateQ() { hours = Math.floor(Math.random() * 12) + 1; const minOptions = [0, 15, 30, 45]; minutes = minOptions[Math.floor(Math.random() * 4)]; }

function getClockEmoji(h, m) {
    if (m === 0) return CLOCK_EMOJIS[h];
    if (m === 30) return ['','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'][h];
    return CLOCK_EMOJIS[h];
}

function renderGame(container) {
    const emoji = getClockEmoji(hours, minutes);
    const timeStr = `${hours}:${minutes.toString().padStart(2, '0')}`;
    
    let html = `<div style="text-align:center;">
        <div style="font-size:6rem;margin:30px 0;">${emoji}</div>
        <div style="font-size:1.5rem;margin-bottom:20px;">Который час? Напиши в формате Ч:ММ</div>
        <input type="text" id="clockAnswer" placeholder="например: 3:15" style="width:200px;padding:15px;font-size:1.5rem;text-align:center;border-radius:30px;border:3px solid #ffb347;margin-bottom:20px;">
        <button id="submitClockBtn" style="font-size:1.3rem;">✅ Проверить</button>
        <div style="font-size:1.3rem;margin-top:20px;">⏰ Счёт: <strong>${score}</strong> / ${targetScore}</div>
        <button id="resetClockBtn" style="margin-top:15px;">🔄 Заново</button>
    </div>`;
    
    container.innerHTML = html;
    
    document.getElementById('submitClockBtn').onclick = () => { if (!gameActive) return; const answer = document.getElementById('clockAnswer').value.trim(); if (answer === timeStr) { score++; if (score >= targetScore) { gameActive = false; updateCoins(20); updatePetHappiness(15); AppState.totalGames++; if (!AppState.achievements.includes('clock_master')) { AppState.achievements.push('clock_master'); showNotification('🏆 Достижение: Повелитель времени!', 'success'); } saveState(AppState.currentChild?.id); showNotification(`🎉 ${score}/${targetScore}! +20 🪙`, 'success'); renderGame(container); return; } generateQ(); renderGame(container); } else { gameActive = false; showNotification(`❌ Правильно: ${timeStr}. Счёт: ${score}`, 'error'); renderGame(container); } };
    document.getElementById('resetClockBtn').onclick = () => { gameActive = true; score = 0; generateQ(); renderGame(container); };
}

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
