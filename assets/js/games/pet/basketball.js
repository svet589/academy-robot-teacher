// ==================== 🏀 БАСКЕТБОЛ ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let gameActive = false, score = 0, petPos = 50, ballInterval = null, targetScore = 5;

export function startBasketball() {
    gameActive = true; score = 0; petPos = 50;
    const container = document.getElementById('modal-container');
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="max-width:450px;">
            <h3>🏀 Баскетбол</h3>
            <div class="game-area" style="position:relative;height:280px;background:linear-gradient(180deg,#FFD54F,#FF8F00);border-radius:20px;">
                <div style="font-size:4rem;position:absolute;top:10px;right:20px;">⭕</div>
                <div id="bbBall" style="font-size:3rem;position:absolute;top:50px;left:50%;transform:translateX(-50%);">🏀</div>
                <div id="bbPet" style="font-size:4rem;position:absolute;bottom:20px;left:50%;transform:translateX(-50%);">${AppState.pet?.emoji||'🐱'}</div>
            </div>
            <div class="game-controls" style="display:flex;gap:20px;justify-content:center;margin-top:20px;">
                <button class="game-btn" id="bbLeft">⬅️</button>
                <button class="game-btn" id="bbRight">➡️</button>
            </div>
            <p style="text-align:center;font-size:1.2rem;">Счёт: <span id="bbScore">0</span> / ${targetScore}</p>
            <button class="close-btn" id="closeBBBtn" style="margin-top:10px;">Закрыть</button>
        </div>
    `;
    container.appendChild(modal);
    
    document.getElementById('bbLeft').onclick = () => { petPos = Math.max(10, petPos - 10); document.getElementById('bbPet').style.left = petPos + '%'; };
    document.getElementById('bbRight').onclick = () => { petPos = Math.min(90, petPos + 10); document.getElementById('bbPet').style.left = petPos + '%'; };
    document.getElementById('closeBBBtn').onclick = () => { gameActive = false; clearInterval(ballInterval); modal.remove(); };
    document.addEventListener('keydown', function h(e) { if (!gameActive) { document.removeEventListener('keydown', h); return; } if (e.key==='ArrowLeft') { e.preventDefault(); petPos=Math.max(10,petPos-10); document.getElementById('bbPet').style.left=petPos+'%'; } if (e.key==='ArrowRight') { e.preventDefault(); petPos=Math.min(90,petPos+10); document.getElementById('bbPet').style.left=petPos+'%'; } });
    modal.addEventListener('click', e => { if (e.target === modal) { gameActive = false; clearInterval(ballInterval); modal.remove(); } });
    
    ballInterval = setInterval(() => {
        if (!gameActive) { clearInterval(ballInterval); return; }
        const ball = document.getElementById('bbBall');
        const ballTop = parseInt(ball.style.top) || 50;
        ball.style.top = (ballTop + 5) + 'px';
        if (ballTop > 200) {
            const ballLeft = parseFloat(ball.style.left) || 50;
            if (Math.abs(ballLeft - petPos) < 15) {
                score++; document.getElementById('bbScore').textContent = score;
                if (score >= targetScore) { gameActive = false; clearInterval(ballInterval); updateCoins(25); updatePetHappiness(15); AppState.totalGames++; saveState(AppState.currentChild?.id); showNotification('🎉 Победа! +25 🪙', 'success'); EventBus.emit('game:ended', {game:'basketball',win:true}); }
                else { ball.style.top = '50px'; ball.style.left = Math.random()*70+15+'%'; }
            } else if (ballTop > 240) { ball.style.top = '50px'; ball.style.left = Math.random()*70+15+'%'; }
        }
    }, 40);
}

export default { start: startBasketball };
