// ==================== 🎾 ПОЙМАЙ ====================
const CatchGame = {
    active: false, score: 0, timeLeft: 30, petPos: 50, interval: null, timer: null,
    items: [{e:'🍎',p:5},{e:'🍪',p:8},{e:'🦴',p:10},{e:'🍕',p:12},{e:'🗑️',p:-3},{e:'💩',p:-5}],

    start() {
        const self = this;
        this.active = true; this.score = 0; this.timeLeft = 30; this.petPos = 50;
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:450px;">
                <h3>🎾 Поймай</h3>
                <div style="position:relative;height:280px;background:linear-gradient(180deg,#87CEEB,#E8F5E9);border-radius:20px;overflow:hidden;">
                    <div id="ctItem" style="font-size:3rem;position:absolute;top:20px;left:50%;transform:translateX(-50%);">🍎</div>
                    <div id="ctPet" style="font-size:4rem;position:absolute;bottom:20px;left:50%;transform:translateX(-50%);">${AppState.pet?.emoji||'🐱'}</div>
                </div>
                <div style="display:flex;gap:20px;justify-content:center;margin-top:15px;">
                    <button id="ctLeft" style="font-size:2rem;padding:15px 30px;">⬅️</button>
                    <button id="ctRight" style="font-size:2rem;padding:15px 30px;">➡️</button>
                </div>
                <p style="text-align:center;">Счёт: <span id="ctScore">0</span> | ⏱️ <span id="ctTimer">30</span>с</p>
                <p style="text-align:center;font-size:0.8rem;color:#888;">🍎🍪🦴🍕 = +очки | 🗑️💩 = -очки</p>
                <button id="ctClose" class="close-btn" style="margin-top:10px;">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('ctClose').onclick = () => { self.active = false; clearInterval(self.interval); clearInterval(self.timer); modal.remove(); };
        modal.addEventListener('click', e => { if (e.target === modal) { self.active = false; clearInterval(self.interval); clearInterval(self.timer); modal.remove(); } });
        document.getElementById('ctLeft').onclick = () => { self.petPos=Math.max(10,self.petPos-10); document.getElementById('ctPet').style.left=self.petPos+'%'; };
        document.getElementById('ctRight').onclick = () => { self.petPos=Math.min(90,self.petPos+10); document.getElementById('ctPet').style.left=self.petPos+'%'; };
        document.addEventListener('keydown', function h(e) { if (!self.active) { document.removeEventListener('keydown',h); return; } if (e.key==='ArrowLeft') { e.preventDefault(); self.petPos=Math.max(10,self.petPos-10); document.getElementById('ctPet').style.left=self.petPos+'%'; } if (e.key==='ArrowRight') { e.preventDefault(); self.petPos=Math.min(90,self.petPos+10); document.getElementById('ctPet').style.left=self.petPos+'%'; } });

        let currentItem = this.items[0];
        const spawn = () => { if (!self.active) return; currentItem = self.items[Math.floor(Math.random()*self.items.length)]; document.getElementById('ctItem').textContent = currentItem.e; document.getElementById('ctItem').style.left = Math.random()*70+15+'%'; document.getElementById('ctItem').style.top = '20px'; };

        this.interval = setInterval(() => {
            if (!self.active) return;
            const item = document.getElementById('ctItem'); const top = parseInt(item.style.top)||20;
            item.style.top = (top+4)+'px';
            if (top > 230) {
                if (Math.abs(parseFloat(item.style.left)-self.petPos) < 18) { self.score += currentItem.p; if (self.score<0) self.score=0; document.getElementById('ctScore').textContent = self.score; }
                spawn();
            }
        }, 40);

        this.timer = setInterval(() => { if (!self.active) return; self.timeLeft--; document.getElementById('ctTimer').textContent = self.timeLeft; if (self.timeLeft <= 0) { self.active = false; clearInterval(self.interval); clearInterval(self.timer); const reward = Math.floor(Math.max(0,self.score)/2); if (typeof updateCoins==='function') updateCoins(reward); if (typeof updatePetHappiness==='function') updatePetHappiness(Math.floor(Math.max(0,self.score)/3)); AppState.totalGames++; AppState.pet.stats.timesPlayed=(AppState.pet.stats.timesPlayed||0)+1; if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`🎮 +${reward} 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'catch',score:self.score}); } }, 1000);

        spawn();
    }
};
