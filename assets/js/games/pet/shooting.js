// ==================== 🎯 СТРЕЛЯЛКА 2.0 (ОТКРЫТЫЙ МИР) ====================
const ShootingPetGame = {
    active: false, score: 0, enemies: [], bullets: [], playerX: 50, playerY: 60, ammo: 20, maxAmmo: 20, wave: 1, gameLoop: null, spawnLoop: null, keys: {},

    start() {
        const self = this;
        this.active = true; this.score = 0; this.wave = 1; this.enemies = []; this.bullets = []; this.playerX = 50; this.playerY = 60; this.ammo = 20; this.keys = {};
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:500px;">
                <h3>🎯 СТРЕЛЯЛКА — ВОЛНА ${this.wave}</h3>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;">
                    <span>🎯 <span id="stScore">0</span></span>
                    <span>🔫 <span id="stAmmo">${this.ammo}</span>/${this.maxAmmo}</span>
                    <span>👾 <span id="stEnemies">0</span></span>
                </div>
                <div id="stArea" style="position:relative;width:100%;height:350px;background:linear-gradient(180deg,#1a1a2e,#16213e,#0f3460);border-radius:20px;overflow:hidden;cursor:crosshair;">
                    <div id="stPlayer" style="position:absolute;top:${this.playerY}%;left:${this.playerX}%;transform:translate(-50%,-50%);font-size:3rem;">🦾</div>
                </div>
                <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
                    <button id="stUp" style="font-size:1.5rem;padding:10px 20px;">⬆️</button>
                    <button id="stDown" style="font-size:1.5rem;padding:10px 20px;">⬇️</button>
                    <button id="stLeft" style="font-size:1.5rem;padding:10px 20px;">⬅️</button>
                    <button id="stRight" style="font-size:1.5rem;padding:10px 20px;">➡️</button>
                    <button id="stShoot" style="font-size:1.5rem;padding:10px 20px;background:#e74c3c;color:white;">🔫</button>
                    <button id="stReload" style="font-size:1.5rem;padding:10px 20px;">🔄</button>
                </div>
                <button id="stClose" class="close-btn" style="margin-top:10px;">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('stClose').onclick = () => { self.active = false; clearInterval(self.gameLoop); clearInterval(self.spawnLoop); modal.remove(); };
        modal.addEventListener('click', e => { if (e.target === modal) { self.active = false; clearInterval(self.gameLoop); clearInterval(self.spawnLoop); modal.remove(); } });

        this.setupControls(modal);
        this.startGameLoop(modal);
        this.startSpawning(modal);
    },

    setupControls(modal) {
        const self = this;
        document.getElementById('stUp').onclick = () => { self.playerY = Math.max(10, self.playerY-5); document.getElementById('stPlayer').style.top = self.playerY+'%'; };
        document.getElementById('stDown').onclick = () => { self.playerY = Math.min(90, self.playerY+5); document.getElementById('stPlayer').style.top = self.playerY+'%'; };
        document.getElementById('stLeft').onclick = () => { self.playerX = Math.max(5, self.playerX-5); document.getElementById('stPlayer').style.left = self.playerX+'%'; };
        document.getElementById('stRight').onclick = () => { self.playerX = Math.min(95, self.playerX+5); document.getElementById('stPlayer').style.left = self.playerX+'%'; };
        document.getElementById('stShoot').onclick = () => self.shoot(modal);
        document.getElementById('stReload').onclick = () => { self.ammo = self.maxAmmo; document.getElementById('stAmmo').textContent = self.ammo; if (typeof showNotification==='function') showNotification('🔄 Перезаряжено!','info'); };

        document.addEventListener('keydown', function h(e) { if (!self.active) { document.removeEventListener('keydown',h); return; }
            if (e.key==='ArrowUp') { e.preventDefault(); self.playerY=Math.max(10,self.playerY-5); document.getElementById('stPlayer').style.top=self.playerY+'%'; }
            if (e.key==='ArrowDown') { e.preventDefault(); self.playerY=Math.min(90,self.playerY+5); document.getElementById('stPlayer').style.top=self.playerY+'%'; }
            if (e.key==='ArrowLeft') { e.preventDefault(); self.playerX=Math.max(5,self.playerX-5); document.getElementById('stPlayer').style.left=self.playerX+'%'; }
            if (e.key==='ArrowRight') { e.preventDefault(); self.playerX=Math.min(95,self.playerX+5); document.getElementById('stPlayer').style.left=self.playerX+'%'; }
            if (e.key===' ') { e.preventDefault(); self.shoot(modal); }
        });
    },

    shoot(modal) {
        if (!this.active || this.ammo <= 0) return;
        this.ammo--; document.getElementById('stAmmo').textContent = this.ammo;
        this.bullets.push({ x: this.playerX, y: this.playerY, id: Date.now() });
        const area = document.getElementById('stArea');
        const bullet = document.createElement('div');
        bullet.id = 'b'+Date.now();
        bullet.style.cssText = `position:absolute;top:${this.playerY}%;left:${this.playerX}%;width:6px;height:6px;background:#ff0;border-radius:50%;box-shadow:0 0 6px #ff0;`;
        area.appendChild(bullet);
        if (typeof playSound === 'function') playSound('click');
    },

    startGameLoop(modal) {
        const self = this;
        this.gameLoop = setInterval(() => {
            if (!self.active) return;
            const area = document.getElementById('stArea');
            // Движение пуль
            const bullets = area.querySelectorAll('[id^="b"]');
            bullets.forEach(b => {
                const top = parseFloat(b.style.top)||0;
                b.style.top = (top-2)+'%';
                if (top < 0) b.remove();
                // Проверка попаданий
                self.enemies.forEach((enemy, idx) => {
                    const enemyEl = document.getElementById('e'+enemy.id);
                    if (!enemyEl) return;
                    const bx = parseFloat(b.style.left), by = parseFloat(b.style.top);
                    const ex = parseFloat(enemyEl.style.left), ey = parseFloat(enemyEl.style.top);
                    if (Math.abs(bx-ex)<8 && Math.abs(by-ey)<8) {
                        b.remove(); enemyEl.remove();
                        self.enemies.splice(idx, 1);
                        self.score++;
                        document.getElementById('stScore').textContent = self.score;
                        document.getElementById('stEnemies').textContent = self.enemies.length;
                        if (typeof playSound === 'function') playSound('correct');
                    }
                });
            });
            // Движение врагов к игроку
            self.enemies.forEach(enemy => {
                const el = document.getElementById('e'+enemy.id);
                if (!el) return;
                const ex = parseFloat(el.style.left), ey = parseFloat(el.style.top);
                const dx = self.playerX - ex, dy = self.playerY - ey;
                const dist = Math.sqrt(dx*dx+dy*dy);
                if (dist > 0) { el.style.left = (ex + dx/dist*0.3) + '%'; el.style.top = (ey + dy/dist*0.3) + '%'; }
                if (dist < 10) { self.active = false; clearInterval(self.gameLoop); clearInterval(self.spawnLoop); if (typeof showNotification==='function') showNotification('💀 Тебя поймали!','error'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'shooting',score:self.score}); }
            });
        }, 30);
    },

    startSpawning(modal) {
        const self = this;
        this.spawnLoop = setInterval(() => {
            if (!self.active) return;
            const count = 2 + self.wave;
            if (self.enemies.length < count) {
                const area = document.getElementById('stArea');
                const enemy = document.createElement('div');
                const id = Date.now();
                enemy.id = 'e'+id;
                enemy.style.cssText = `position:absolute;top:${Math.random()*80+10}%;left:${Math.random()*80+10}%;font-size:2.5rem;`;
                enemy.textContent = ['👾','👽','🤖','💀','🕷️'][Math.floor(Math.random()*5)];
                area.appendChild(enemy);
                self.enemies.push({ id, hp: 1 });
                document.getElementById('stEnemies').textContent = self.enemies.length;
            }
            if (self.enemies.length === 0 && self.score > 0 && self.score % 10 === 0) {
                self.wave++;
                const modalTitle = modal.querySelector('h3');
                if (modalTitle) modalTitle.textContent = `🎯 СТРЕЛЯЛКА — ВОЛНА ${self.wave}`;
                if (typeof showNotification==='function') showNotification(`🌊 Волна ${self.wave}!`,'success');
            }
        }, 2000);
    }
};
