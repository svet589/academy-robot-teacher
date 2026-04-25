// ==================== 🦴 НАЙДИ КОСТОЧКУ ====================
const FindGame = {
    active: false, round: 1, score: 0, correctBowl: 0,

    start() {
        const self = this;
        this.active = true; this.round = 1; this.score = 0; this.correctBowl = Math.floor(Math.random()*3);
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card">
                <h3>🦴 Найди косточку</h3>
                <p style="text-align:center;">Где спрятана косточка?</p>
                <div style="display:flex;gap:30px;justify-content:center;margin:30px 0;">
                    <div class="bowl" data-b="0" style="font-size:4.5rem;cursor:pointer;">🥣</div>
                    <div class="bowl" data-b="1" style="font-size:4.5rem;cursor:pointer;">🥣</div>
                    <div class="bowl" data-b="2" style="font-size:4.5rem;cursor:pointer;">🥣</div>
                </div>
                <p style="text-align:center;">Раунд: <span id="fdRound">1</span>/3 | Счёт: <span id="fdScore">0</span></p>
                <button id="fdClose" class="close-btn" style="margin-top:10px;">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('fdClose').onclick = () => { self.active = false; modal.remove(); };
        modal.addEventListener('click', e => { if (e.target === modal) { self.active = false; modal.remove(); } });

        modal.querySelectorAll('.bowl').forEach(bowl => {
            bowl.onclick = () => {
                if (!self.active) return;
                const idx = parseInt(bowl.dataset.b);
                modal.querySelectorAll('.bowl').forEach((b,i) => { b.textContent = i === self.correctBowl ? '🦴' : '🥣'; });
                if (idx === self.correctBowl) { self.score++; if (typeof showNotification==='function') showNotification('🎉 Правильно!','success'); }
                else { if (typeof showNotification==='function') showNotification('😢 Мимо!','error'); }
                document.getElementById('fdScore').textContent = self.score;
                if (self.round < 3) { self.round++; self.correctBowl = Math.floor(Math.random()*3); document.getElementById('fdRound').textContent = self.round; setTimeout(() => { modal.querySelectorAll('.bowl').forEach(b => b.textContent = '🥣'); }, 1000); }
                else { self.active = false; const reward = self.score*15; if (typeof updateCoins==='function') updateCoins(reward); if (typeof updatePetHappiness==='function') updatePetHappiness(self.score*10); AppState.totalGames++; AppState.pet.stats.timesPlayed=(AppState.pet.stats.timesPlayed||0)+1; if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`🎮 +${reward} 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'find',score:self.score}); }
            };
        });
    }
};
