// ==================== 🎯 ПОПАДИ В ЦЕЛЬ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let gameActive = false, score = 0, currentQ = null, timeLeft = 12, timerInterval = null, targetScore = 10;

export function renderScreen(container) {
    gameActive = true; score = 0; generateQ(); renderGame(container);
}

function generateQ() { const a = Math.floor(Math.random()*20)+1, b = Math.floor(Math.random()*20)+1, correct = a+b; let w1 = correct+Math.floor(Math.random()*5)+1, w2 = Math.max(1,correct-Math.floor(Math.random()*5)-1); while (w1===correct) w1++; while (w2===correct||w2===w1) w2=Math.max(1,w2-1); currentQ = { text: `${a} + ${b} = ?`, correct, options: [correct,w1,w2].sort(()=>Math.random()-0.5) }; }

function renderGame(container) {
    if (!currentQ) return;
    let html = `<div style="text-align:center;"><div style="font-size:2.5rem;font-weight:bold;font-family:monospace;margin-bottom:15px;color:${timeLeft<=3?'#e74c3c':'inherit'}">⏱️ ${timeLeft}</div>`;
    html += `<div style="font-size:3.5rem;font-weight:bold;margin:20px 0;">${currentQ.text}</div>`;
    html += `<div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin:20px 0;">`;
    currentQ.options.forEach(opt => { html += `<button class="target-btn" data-answer="${opt}" style="width:100px;height:100px;font-size:2.5rem;border-radius:50%;background:radial-gradient(circle,#ffd966,#ffb347);box-shadow:0 8px 0 #b47c2e;">${opt}</button>`; });
    html += `</div><div style="font-size:1.5rem;margin-top:20px;">🎯 Счёт: <strong>${score}</strong> / ${targetScore}</div>`;
    html += `<div class="progress-bar" style="background:#ddd;border-radius:20px;height:10px;margin:15px 0;overflow:hidden;"><div class="progress-fill" style="background:#4caf50;height:100%;width:${(score/targetScore)*100}%"></div></div>`;
    html += `<button id="resetShootBtn" style="margin-top:15px;">🔄 Заново</button></div>`;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.target-btn').forEach(btn => { btn.onclick = () => { if (!gameActive) return; if (parseInt(btn.dataset.answer) === currentQ.correct) { score++; clearInterval(timerInterval); if (score >= targetScore) { gameActive = false; updateCoins(25); updatePetHappiness(15); AppState.totalGames++; if (!AppState.achievements.includes('shoot_master')) { AppState.achievements.push('shoot_master'); showNotification('🏆 Достижение: Снайпер!', 'success'); } saveState(AppState.currentChild?.id); showNotification(`🎉 Победа! ${score}/${targetScore}! +25 🪙`, 'success'); renderGame(container); return; } generateQ(); renderGame(container); startTimer(container); } else { gameActive = false; clearInterval(timerInterval); showNotification(`❌ Неправильно! Ответ: ${currentQ.correct}. Счёт: ${score}`, 'error'); renderGame(container); } }; });
    document.getElementById('resetShootBtn').onclick = () => { gameActive = true; score = 0; generateQ(); renderGame(container); startTimer(container); };
    startTimer(container);
}

function startTimer(container) { timeLeft = 12; clearInterval(timerInterval); timerInterval = setInterval(() => { if (!gameActive) { clearInterval(timerInterval); return; } timeLeft--; renderGame(container); if (timeLeft <= 0) { clearInterval(timerInterval); gameActive = false; showNotification('⏰ Время вышло!', 'error'); renderGame(container); } }, 1000); }

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
