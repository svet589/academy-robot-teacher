// ==================== 🏁 ГОНКИ ====================
const RacingGame = {
    active: false, time: 0, carPos: 50, timer: null, car: '🚗',

    start(carEmoji) {
        const self = this;
        this.active = true; this.time = 0; this.carPos = 50; this.car = carEmoji || '🚗';
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:450px;">
                <h3>🏁 Гонки</h3>
                <div style="position:relative;height:320px;background:#2c3e50;border-radius:20px;overflow:hidden;">
                    <div style="position:absolute;left:25%;width:2px;height:100%;background:rgba(255,255,255,0.2);"></div>
                    <div style="position:absolute;left:50%;width:2px;height:100%;background:rgba(255,255,255,0.2);"></div>
                    <div style="position:absolute;left:75%;width:2px;height:100%;background:rgba(255,255,255,0.2);"></div>
                    <div id="rcObstacle" style="font-size:3rem;position:absolute;top:0;left:50%;transform:translateX(-50%);display:none;">🚧</div>
                    <div id="rcCar" style="font-size:3.5rem;position:absolute;bottom:30px;left:50%;transform:translateX(-50%);">${this.car}</div>
                </div>
                <div style="display:flex;gap:20px;justify-content:center;margin-top:15px;">
                    <button id="rcLeft" style="font-size:2rem;padding:15px 30px;">⬅️</button>
                    <button id="rcRight" style="font-size:2rem;padding:15px 30px;">➡️</button>
                </div>
                <p style="text-align:center;">⏱️ <span id="rcTimer">0.0</span>с | 🏆 Рекорд: <span id="rcRecord">${(AppState.gameRecords?.racing||0).toFixed(1)}</span>с</p>
                <button id="rcClose" class="close-btn" style="margin-top:10px;">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('rcClose').onclick = () => { self.active = false; clearInterval(self.timer); modal.remove(); };
        modal.addEventListener('click', e => { if (e.target === modal) { self.active = false; clearInterval(self.timer); modal.remove(); } });
        document.getElementById('rcLeft').onclick = () => { self.carPos = Math.max(10, self.carPos-8); document.getElementById('rcCar').style.left = self.carPos+'%'; };
        document.getElementById('rcRight').onclick = () => { self.carPos = Math.min(90, self.carPos+8); document.getElementById('rcCar').style.left = self.carPos+'%'; };
        document.addEventListener('keydown', function h(e) { if (!self.active) { document.removeEventListener('keydown',h); return; } if (e.key==='ArrowLeft') { e.preventDefault(); self.carPos=Math.max(10,self.carPos-8); document.getElementById('rcCar').style.left=self.carPos+'%'; } if (e.key==='ArrowRight') { e.preventDefault(); self.carPos=Math.min(90,self.carPos+8); document.getElementById('rcCar').style.left=self.carPos+'%'; } });

        this.timer = setInterval(() => { if (!self.active) return; self.time += 0.1; document.getElementById('rcTimer').textContent = self.time.toFixed(1); }, 100);
        setTimeout(() => self.spawnObstacle(modal), 500);
    },

    spawnObstacle(modal) {
        if (!this.active) return;
        const self = this;
        const obs = document.getElementById('rcObstacle');
        obs.style.left = Math.random()*80+10+'%'; obs.style.top = '0px'; obs.style.display = 'block';
        const fall = setInterval(() => {
            if (!self.active) { clearInterval(fall); return; }
            const top = parseFloat(obs.style.top)||0;
            obs.style.top = (top+4)+'px';
            if (top > 260) {
                if (Math.abs(parseFloat(obs.style.left)-self.carPos) < 15) {
                    self.active = false; clearInterval(self.timer); clearInterval(fall);
                    const record = AppState.gameRecords?.racing || 0;
                    if (self.time > record) { if (!AppState.gameRecords) AppState.gameRecords = {}; AppState.gameRecords.racing = self.time; if (typeof showNotification==='function') showNotification(`🏆 Рекорд: ${self.time.toFixed(1)}с!`,'success'); }
                    const reward = Math.floor(self.time*2); if (typeof updateCoins==='function') updateCoins(reward); if (typeof updatePetHappiness==='function') updatePetHappiness(Math.floor(self.time/2)); AppState.totalGames++; AppState.pet.stats.timesPlayed=(AppState.pet.stats.timesPlayed||0)+1; if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`💥 +${reward} 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'racing'});
                } else { obs.style.display = 'none'; clearInterval(fall); if (self.active) self.spawnObstacle(modal); }
            }
        }, 25);
    }
};
