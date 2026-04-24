// ==================== 🎾 ПОЙМАЙ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false, score = 0, timeLeft = 30, petPos = 50, catchInterval = null, timerInterval = null;
const ITEMS = [{e:'🍎',p:5},{e:'🍪',p:8},{e:'🦴',p:10},{e:'🗑️',p:-3},{e:'💩',p:-5}];
let currentItem = ITEMS[0];

export function startCatch() {
    gameActive = true; score = 0; timeLeft = 30; petPos = 50;
    const container = document.getElementById('modal-container');
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="max-width:450px;">
            <h3>🎾 Поймай</h3>
            <div class="game-area" style="position:relative;height:280px;background:linear-gradient(180deg,#87CEEB,#E8F5E9);border-radius:20px;overflow:hidden;">
                <div id="catchItem" style="font-size:3rem;position:absolute;top:20px;left:50%;transform:translateX(-50%);">🍎</div>
                <div id="catchPet" style="font-size:4rem;position:absolute;bottom:20px;left:50%;transform:translateX(-50%);">${AppState.pet?.emoji||'🐱'}</div>
            </div>
            <div class="game-controls" style="display:flex;gap:20px;justify-content:center;margin-top:20px;">
                <button class="game-btn" id="catchLeft">⬅️</button>
                <button class="game-btn" id="catchRight">➡️</button>
            </div>
            <p style="text-align:center;">Счёт: <span id="catchScore">0</span> | Время: <span id="catchTimer">30</span>с</p>
            <p style="text-align:center;font-size:0.8rem;color:#888;">🍎🍪🦴 = +очки | 🗑️💩 = -очки</p>
            <button class="close-btn" id="closeCatchBtn" style="margin-top:10px;">Закрыть</button>
        </div>
    `;
    container.appendChild(modal);
    
    document.getElementById('catchLeft').onclick = () => { petPos = Math.max(10, petPos - 10); document.getElementById('catchPet').style.left = petPos + '%'; };
    document.getElementById('catchRight').onclick = () => { petPos = Math.min(90, petPos + 10); document.getElementById('catchPet').style.left = petPos + '%'; };
    document.getElementById('closeCatchBtn').onclick = () => { gameActive = false; clearInterval(catchInterval); clearInterval(timerInterval); modal.remove(); };
    document.addEventListener('keydown', function h(e) { if (!gameActive) { document.removeEventListener('keydown', h); return; } if (e.key==='ArrowLeft') { e.preventDefault(); petPos=Math.max(10,petPos-10); document.getElementById('catchPet').style.left=petPos+'%'; } if (e.key==='ArrowRight') { e.preventDefault(); petPos=Math.min(90,petPos+10); document.getElementById('catchPet').style.left=petPos+'%'; } });
    modal.addEventListener('click', e => { if (e.target === modal) { gameActive = false; clearInterval(catchInterval); clearInterval(timerInterval); modal.remove(); } });
    
    function spawn() { if (!gameActive) return; currentItem = ITEMS[Math.floor(Math.random()*ITEMS.length)]; document.getElementById('catchItem').textContent = currentItem.e; document.getElementById('catchItem').style.left = Math.random()*70+15+'%'; document.getElementById('catchItem').style.top = '20px'; }
    
    catchInterval = setInterval(() => {
        if (!gameActive) return;
        const item = document.getElementById('catchItem');
        const top = parseInt(item.style.top) || 20;
        item.style.top = (top + 4) + 'px';
        if (top > 230) {
            if (Math.abs(parseFloat(item.style.left) - petPos) < 18) { score += currentItem.p; if (score < 0) score = 0; document.getElementById('catchScore').textContent = score; }
            spawn();
        }
    }, 40);
    
    timerInterval = setInterval(() => { if (!gameActive) return; timeLeft--; document.getElementById('catchTimer').textContent = timeLeft; if (timeLeft <= 0) { gameActive = false; clearInterval(catchInterval); clearInterval(timerInterval); const reward = Math.floor(Math.max(0,score)/2); updateCoins(reward); updatePetHappiness(Math.floor(Math.max(0,score)/3)); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`🎮 +${reward} 🪙`, 'success'); EventBus.emit('game:ended',{game:'catch',score}); } }, 1000);
    
    spawn();
}

export default { start: startCatch };
