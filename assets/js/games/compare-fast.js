// ==================== ⚡ СРАВНИ ЧИСЛА ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, score = 0, timeLeft = 15, timerInterval = null, currentQ = null, targetScore = 20;

export function renderScreen(container) {
    gameActive = true; score = 0; generateQ(); renderGame(container);
}

function generateQ() { const a = Math.floor(Math.random()*100)+1; let b; if (Math.random()<0.2) b=a; else b=Math.floor(Math.random()*100)+1; currentQ = { a, b, correct: a<b?'<':(a>b?'>':'=') }; }

function renderGame(container) {
    if (!currentQ) return;
    let html = `<div style="text-align:center;"><div style="font-size:2.5rem;font-weight:bold;font-family:monospace;margin-bottom:15px;color:${timeLeft<=3?'#e74c3c':'inherit'}">⏱️ ${timeLeft}</div>`;
    html += `<div style="font-size:4rem;font-weight:bold;margin:30px 0;">${currentQ.a} ? ${currentQ.b}</div>`;
    html += `<div style="display:flex;gap:20px;justify-content:center;">`;
    html += `<button class="compare-btn" data-sign="<" style="width:100px;height:100px;font-size:4rem;">&lt;</button>`;
    html += `<button class="compare-btn" data-sign=">" style="width:100px;height:100px;font-size:4rem;">&gt;</button>`;
    html += `<button class="compare-btn" data-sign="=" style="width:100px;height:100px;font-size:4rem;">=</button>`;
    html += `</div><div style="font-size:1.5rem;margin-top:20px;">⚡ Счёт: <strong>${score}</strong> / ${targetScore}</div>`;
    html += `<div class="progress-bar" style="background:#ddd;border-radius:20px;height:10px;margin:15px 0;"><div style="background:#4caf50;height:100%;width:${(score/targetScore)*100}%"></div></div>`;
    html += `<button id="resetCompareBtn" style="margin-top:15px;">🔄 Заново</button></div>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.compare-btn').forEach(btn => { btn.onclick = () => { if (!gameActive) return; if (btn.dataset.sign === currentQ.correct) { score++; clearInterval(timerInterval); if (score >= targetScore) { gameActive = false; updateCoins(25); updatePetHappiness(15); AppState.totalGames++; if (!AppState.achievements.includes('fast_compare')) { AppState.achievements.push('fast_compare'); showNotification('🏆 Достижение: Быстрый ум!', 'success'); } saveState(AppState.currentChild?.id); showNotification(`🎉 ${score}/${targetScore}! +25 🪙`, 'success'); renderGame(container); return; } generateQ(); renderGame(container); startTimer(container); } else { gameActive = false; clearInterval(timerInterval); showNotification(`❌ Нужно: ${currentQ.correct}. Счёт: ${score}`, 'error'); renderGame(container); } }; });
    document.getElementById('resetCompareBtn').onclick = () => { gameActive = true; score = 0; generateQ(); renderGame(container); startTimer(container); };
    startTimer(container);
}

function startTimer(container) { timeLeft = 15; clearInterval(timerInterval); timerInterval = setInterval(() => { if (!gameActive) { clearInterval(timerInterval); return; } timeLeft--; renderGame(container); if (timeLeft <= 0) { clearInterval(timerInterval); gameActive = false; showNotification('⏰ Время вышло!', 'error'); renderGame(container); } }, 1000); }

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
