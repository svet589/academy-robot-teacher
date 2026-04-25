// ==================== 🎮 АРКАДА ====================
const ArcadePetGame = {
    active: false, score: 0, timeLeft: 30, spawnInterval: null, timerInterval: null,
    targets: ['🎈','🎯','👾','⭐','🌟','💎'],

    start() {
        const self = this;
        this.active = true; this.score = 0; this.timeLeft = 30;
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:450px;">
                <h3>🎮 Аркада</h3>
                <div id="arcArea" style="position:relative;height:300px;background:#1a1a2e;border-radius:20px;overflow:hidden;">
                    <p style="color:white;text-align:center;padding-top:10px;">🎯 <span id="arcScore">0</span> | ⏱️ <span id="arcTimer">30</span>с</p>
                </div>
                <button id="arcClose" class="close-btn" style="margin-top:10px;">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('arcClose').onclick = () => { self.active = false; clearInterval(self.spawnInterval); clearInterval(self.timerInterval); modal.remove(); };
        modal.addEventListener('click', e => { if (e.target === modal) { self.active = false; clearInterval(self.spawnInterval); clearInterval(self.timerInterval); modal.remove(); } });

        const area = document.getElementById('arcArea');
        this.spawnInterval = setInterval(() => {
            if (!self.active) return;
            const target = document.createElement('div');
            target.textContent = self.targets[Math.floor(Math.random()*self.targets.length)];
            target.style.cssText = `position:absolute;font-size:2.5rem;cursor:pointer;left:${Math.random()*80+10}%;top:${Math.random()*60+40}px;animation:targetPop 0.3s ease;`;
            target.onclick = () => { if (!self.active) return; self.score++; document.getElementById('arcScore').textContent = self.score; target.remove(); if (typeof playSound==='function') playSound('click'); };
            area.appendChild(target);
            setTimeout(() => { if (target.parentNode) target.remove(); }, 1500);
        }, 600);

        this.timerInterval = setInterval(() => { if (!self.active) return; self.timeLeft--; document.getElementById('arcTimer').textContent = self.timeLeft; if (self.timeLeft <= 0) { self.active = false; clearInterval(self.spawnInterval); clearInterval(self.timerInterval); const reward = self.score*2; if (typeof updateCoins==='function') updateCoins(reward); if (typeof updatePetHappiness==='function') updatePetHappiness(Math.min(25,self.score)); if (!AppState.gameRecords) AppState.gameRecords = {}; if (self.score > (AppState.gameRecords.arcade||0)) { AppState.gameRecords.arcade = self.score; if (typeof showNotification==='function') showNotification(`🏆 Рекорд: ${self.score}!`,'success'); } AppState.totalGames++; AppState.pet.stats.timesPlayed=(AppState.pet.stats.timesPlayed||0)+1; if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`+${reward} 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'arcade'}); } }, 1000);
    }
};
