// ==================== 🎮 АРКАДА ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false, score = 0, timeLeft = 30, spawnInterval = null, timerInterval = null;
const TARGETS = ['🎈','🎯','👾','⭐','🌟','💎'];

export function startArcadeGame() {
    gameActive = true; score = 0; timeLeft = 30;
    const container = document.getElementById('modal-container');
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="max-width:450px;">
            <h3>🎮 Аркада</h3>
            <div class="game-area" id="arcadeArea" style="position:relative;height:300px;background:#1a1a2e;border-radius:20px;overflow:hidden;">
                <p style="color:white;text-align:center;padding-top:10px;">Счёт: <span id="arcadeScore">0</span> | Время: <span id="arcadeTimer">30</span>с</p>
            </div>
            <p style="text-align:center;color:#888;">Кликай по целям!</p>
            <button class="close-btn" id="closeArcadeBtn" style="margin-top:10px;">Закрыть</button>
        </div>
    `;
    container.appendChild(modal);
    
    document.getElementById('closeArcadeBtn').onclick = () => { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); modal.remove(); };
    modal.addEventListener('click', e => { if (e.target === modal) { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); modal.remove(); } });
    
    const area = document.getElementById('arcadeArea');
    
    spawnInterval = setInterval(() => {
        if (!gameActive) return;
        const target = document.createElement('div');
        target.className = 'arcade-target';
        target.textContent = TARGETS[Math.floor(Math.random()*TARGETS.length)];
        target.style.cssText = `position:absolute;font-size:2.5rem;cursor:pointer;animation:targetPop 0.3s ease;left:${Math.random()*80+10}%;top:${Math.random()*60+40}px;`;
        target.onclick = () => { if (!gameActive) return; score++; document.getElementById('arcadeScore').textContent = score; target.remove(); };
        area.appendChild(target);
        setTimeout(() => { if (target.parentNode) target.remove(); }, 1500);
    }, 600);
    
    timerInterval = setInterval(() => { if (!gameActive) return; timeLeft--; document.getElementById('arcadeTimer').textContent = timeLeft; if (timeLeft <= 0) { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); const reward = score*2; updateCoins(reward); updatePetHappiness(Math.min(25,score)); if (!AppState.gameRecords) AppState.gameRecords = {}; if (score > (AppState.gameRecords.arcade||0)) { AppState.gameRecords.arcade = score; showNotification(`🏆 Рекорд: ${score}!`, 'success'); } AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`+${reward} 🪙`, 'success'); } }, 1000);
}

export default { start: startArcadeGame };
