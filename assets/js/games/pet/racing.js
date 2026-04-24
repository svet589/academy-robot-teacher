// ==================== 🏁 ГОНКИ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false, raceTime = 0, carPos = 50, timerInterval = null, currentCar = '🚗';

export function startRacing(carEmoji = '🚗') {
    gameActive = true; raceTime = 0; carPos = 50; currentCar = carEmoji || '🚗';
    const container = document.getElementById('modal-container');
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="max-width:450px;">
            <h3>🏁 Гонки</h3>
            <div class="game-area" style="position:relative;height:320px;background:#2c3e50;border-radius:20px;overflow:hidden;">
                <div style="position:absolute;left:20%;width:2px;height:100%;background:rgba(255,255,255,0.2);"></div>
                <div style="position:absolute;left:50%;width:2px;height:100%;background:rgba(255,255,255,0.2);"></div>
                <div style="position:absolute;left:80%;width:2px;height:100%;background:rgba(255,255,255,0.2);"></div>
                <div id="obstacle" style="font-size:3rem;position:absolute;top:0;left:50%;transform:translateX(-50%);display:none;">🚧</div>
                <div id="raceCar" style="font-size:3.5rem;position:absolute;bottom:30px;left:50%;transform:translateX(-50%);">${currentCar}</div>
            </div>
            <div class="game-controls" style="display:flex;gap:20px;justify-content:center;margin-top:20px;">
                <button class="game-btn" id="raceLeft">⬅️</button>
                <button class="game-btn" id="raceRight">➡️</button>
            </div>
            <p style="text-align:center;">Время: <span id="raceTimer">0.0</span>с | 🏆 Рекорд: <span id="raceRecord">${(AppState.gameRecords?.racing||0).toFixed(1)}</span>с</p>
            <button class="close-btn" id="closeRaceBtn" style="margin-top:10px;">Закрыть</button>
        </div>
    `;
    container.appendChild(modal);
    
    document.getElementById('raceLeft').onclick = () => { carPos = Math.max(10, carPos - 8); document.getElementById('raceCar').style.left = carPos + '%'; };
    document.getElementById('raceRight').onclick = () => { carPos = Math.min(90, carPos + 8); document.getElementById('raceCar').style.left = carPos + '%'; };
    document.getElementById('closeRaceBtn').onclick = () => { gameActive = false; clearInterval(timerInterval); modal.remove(); };
    document.addEventListener('keydown', function h(e) { if (!gameActive) { document.removeEventListener('keydown', h); return; } if (e.key==='ArrowLeft') { e.preventDefault(); carPos=Math.max(10,carPos-8); document.getElementById('raceCar').style.left=carPos+'%'; } if (e.key==='ArrowRight') { e.preventDefault(); carPos=Math.min(90,carPos+8); document.getElementById('raceCar').style.left=carPos+'%'; } });
    modal.addEventListener('click', e => { if (e.target === modal) { gameActive = false; clearInterval(timerInterval); modal.remove(); } });
    
    timerInterval = setInterval(() => { if (!gameActive) return; raceTime += 0.1; document.getElementById('raceTimer').textContent = raceTime.toFixed(1); }, 100);
    
    let obstacleX = 500, speed = 4;
    setTimeout(() => spawnObstacle(), 500);
    
    function spawnObstacle() {
        if (!gameActive) return;
        const obs = document.getElementById('obstacle');
        obs.style.left = Math.random()*80+10+'%'; obs.style.top = '0px'; obs.style.display = 'block';
        const fall = setInterval(() => {
            if (!gameActive) { clearInterval(fall); return; }
            const top = parseFloat(obs.style.top) || 0;
            obs.style.top = (top + 4) + 'px';
            if (top > 260) {
                if (Math.abs(parseFloat(obs.style.left) - carPos) < 15) { gameActive = false; clearInterval(timerInterval); clearInterval(fall); const record = AppState.gameRecords?.racing || 0; if (raceTime > record) { if (!AppState.gameRecords) AppState.gameRecords = {}; AppState.gameRecords.racing = raceTime; showNotification(`🏆 Новый рекорд: ${raceTime.toFixed(1)}с!`, 'success'); } const reward = Math.floor(raceTime*2); updateCoins(reward); updatePetHappiness(Math.floor(raceTime/2)); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`💥 +${reward} 🪙`, 'success'); EventBus.emit('game:ended',{game:'racing'}); } else { obs.style.display = 'none'; clearInterval(fall); if (gameActive) spawnObstacle(); }
            }
        }, 25);
    }
}

export default { start: startRacing };
