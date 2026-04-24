// ==================== 🎯 СТРЕЛЯЛКА ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false, score = 0, ammo = 15, timeLeft = 30, spawnInterval = null, timerInterval = null;

export function startShooting() {
    gameActive = true; score = 0; ammo = 15; timeLeft = 30;
    const container = document.getElementById('modal-container');
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="max-width:450px;">
            <h3>🎯 Стрелялка</h3>
            <div class="game-area" id="shootingArea" style="position:relative;height:300px;background:linear-gradient(180deg,#1a1a2e,#2a2a4e);border-radius:20px;overflow:hidden;cursor:crosshair;">
                <p style="color:white;text-align:center;padding-top:10px;">🎯 <span id="shootScore">0</span> | 🔫 <span id="shootAmmo">15</span> | ⏱️ <span id="shootTimer">30</span>с</p>
            </div>
            <p style="text-align:center;color:#888;">Кликай по мишеням!</p>
            <button class="close-btn" id="closeShootingBtn" style="margin-top:10px;">Закрыть</button>
        </div>
    `;
    container.appendChild(modal);
    
    document.getElementById('closeShootingBtn').onclick = () => { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); modal.remove(); };
    modal.addEventListener('click', e => { if (e.target === modal) { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); modal.remove(); } });
    
    const area = document.getElementById('shootingArea');
    
    spawnInterval = setInterval(() => {
        if (!gameActive || ammo <= 0) return;
        const target = document.createElement('div');
        target.className = 'shooting-target';
        target.textContent = '🎯';
        target.style.cssText = `position:absolute;font-size:2.8rem;cursor:pointer;transition:transform 0.1s;left:${Math.random()*75+10}%;top:${Math.random()*60+50}px;`;
        target.onmouseenter = () => { if (gameActive) target.style.transform = 'scale(1.1)'; };
        target.onmouseleave = () => { target.style.transform = 'scale(1)'; };
        target.onclick = (e) => { e.stopPropagation(); if (!gameActive || ammo <= 0) { showNotification('Нет патронов!', 'error'); return; } score++; ammo--; document.getElementById('shootScore').textContent = score; document.getElementById('shootAmmo').textContent = ammo; target.remove(); if (ammo <= 0) { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); const reward = score*3; updateCoins(reward); updatePetHappiness(Math.min(25,score*2)); if (!AppState.gameRecords) AppState.gameRecords = {}; if (score > (AppState.gameRecords.shooting||0)) { AppState.gameRecords.shooting = score; showNotification(`🏆 Рекорд: ${score}!`, 'success'); } AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`+${reward} 🪙`, 'success'); } };
        area.appendChild(target);
        setTimeout(() => { if (target.parentNode) target.remove(); }, 2000);
    }, 800);
    
    timerInterval = setInterval(() => { if (!gameActive) return; timeLeft--; document.getElementById('shootTimer').textContent = timeLeft; if (timeLeft <= 0 || ammo <= 0) { gameActive = false; clearInterval(spawnInterval); clearInterval(timerInterval); const reward = score*3; updateCoins(reward); updatePetHappiness(Math.min(25,score*2)); if (!AppState.gameRecords) AppState.gameRecords = {}; if (score > (AppState.gameRecords.shooting||0)) { AppState.gameRecords.shooting = score; showNotification(`🏆 Рекорд: ${score}!`, 'success'); } AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`+${reward} 🪙`, 'success'); } }, 1000);
}

export default { start: startShooting };
