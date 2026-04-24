// ==================== 🦴 НАЙДИ КОСТОЧКУ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false, round = 1, score = 0, correctBowl = 0;

export function startFind() {
    gameActive = true; round = 1; score = 0; correctBowl = Math.floor(Math.random()*3);
    const container = document.getElementById('modal-container');
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card">
            <h3>🦴 Найди косточку</h3>
            <p style="text-align:center;">Где спрятана косточка?</p>
            <div style="display:flex;gap:30px;justify-content:center;margin:30px 0;" id="bowlsContainer">
                <div class="bowl" data-bowl="0" style="font-size:4.5rem;cursor:pointer;">🥣</div>
                <div class="bowl" data-bowl="1" style="font-size:4.5rem;cursor:pointer;">🥣</div>
                <div class="bowl" data-bowl="2" style="font-size:4.5rem;cursor:pointer;">🥣</div>
            </div>
            <p style="text-align:center;">Раунд: <span id="findRound">1</span>/3 | Счёт: <span id="findScore">0</span></p>
            <button class="close-btn" id="closeFindBtn" style="margin-top:10px;">Закрыть</button>
        </div>
    `;
    container.appendChild(modal);
    
    document.getElementById('closeFindBtn').onclick = () => { gameActive = false; modal.remove(); };
    modal.addEventListener('click', e => { if (e.target === modal) { gameActive = false; modal.remove(); } });
    
    modal.querySelectorAll('.bowl').forEach(bowl => { bowl.onclick = () => { if (!gameActive) return; const idx = parseInt(bowl.dataset.bowl); modal.querySelectorAll('.bowl').forEach((b,i) => { b.textContent = i === correctBowl ? '🦴' : '🥣'; }); if (idx === correctBowl) { score++; showNotification('🎉 Правильно!', 'success'); } else { showNotification('😢 Мимо!', 'error'); } document.getElementById('findScore').textContent = score; if (round < 3) { round++; correctBowl = Math.floor(Math.random()*3); document.getElementById('findRound').textContent = round; setTimeout(() => { modal.querySelectorAll('.bowl').forEach(b => b.textContent = '🥣'); }, 1000); } else { gameActive = false; const reward = score * 15; updateCoins(reward); updatePetHappiness(score*10); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification(`🎮 +${reward} 🪙`, 'success'); EventBus.emit('game:ended',{game:'find',score}); } }; });
}

export default { start: startFind };
