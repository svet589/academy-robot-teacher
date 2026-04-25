// ==================== 🎯 СТРЕЛЯЛКА 2.0 (ИСПРАВЛЕННЫЙ ИНТЕРФЕЙС) ====================
const ShootingPetGame = {
    active: false, score: 0, enemies: [], bullets: [], playerX: 50, playerY: 60, ammo: 20, maxAmmo: 20, wave: 1, gameLoop: null, spawnLoop: null, keys: {},

    start() {
        const self = this;
        this.active = true; this.score = 0; this.wave = 1; this.enemies = []; this.bullets = []; this.playerX = 50; this.playerY = 60; this.ammo = 20; this.keys = {};
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:500px;">
                <h3 style="text-align:center;margin-bottom:10px;">🎯 СТРЕЛЯЛКА — ВОЛНА ${this.wave}</h3>
                
                <!-- Статистика -->
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.95rem;background:#f0f0f0;border-radius:10px;padding:8px 12px;">
                    <span>🎯 <strong id="stScore">0</strong></span>
                    <span>🔫 <strong id="stAmmo">${this.ammo}</strong>/${this.maxAmmo}</span>
                    <span>👾 <strong id="stEnemies">0</strong></span>
                </div>
                
                <!-- Игровое поле -->
                <div id="stArea" style="position:relative;width:100%;height:350px;background:linear-gradient(180deg,#1a1a2e,#16213e,#0f3460);border-radius:20px;overflow:hidden;cursor:crosshair;">
                    <div id="stPlayer" style="position:absolute;top:${this.playerY}%;left:${this.playerX}%;transform:translate(-50%,-50%);font-size:3rem;transition:top 0.1s,left 0.1s;">🦾</div>
                </div>
                
                <!-- УПРАВЛЕНИЕ — СГРУППИРОВАННОЕ -->
                <div style="margin-top:15px;">
                    <!-- ДЖОЙСТИК -->
                    <div style="
                        display:grid;
                        grid-template-areas:
                            '. up .'
                            'left . right'
                            '. down .';
                        gap:8px;
                        width:fit-content;
                        margin:0 auto;
                    ">
                        <button id="stUp" style="grid-area:up;font-size:1.5rem;padding:12px 20px;background:#5dade2;color:white;border:none;border-radius:10px;cursor:pointer;">⬆️</button>
                        <button id="stLeft" style="grid-area:left;font-size:1.5rem;padding:12px 20px;background:#5dade2;color:white;border:none;border-radius:10px;cursor:pointer;">⬅️</button>
                        <button id="stRight" style="grid-area:right;font-size:1.5rem;padding:12px 20px;background:#5dade2;color:white;border:none;border-radius:10px;cursor:pointer;">➡️</button>
                        <button id="stDown" style="grid-area:down;font-size:1.5rem;padding:12px 20px;background:#5dade2;color:white;border:none;border-radius:10px;cursor:pointer;">⬇️</button>
                    </div>
                    
                    <!-- ОРУЖИЕ -->
                    <div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">
                        <button id="stShoot" style="
                            background:linear-gradient(180deg,#e74c3c,#c0392b);
                            color:white;border:none;border-radius:25px;
                            font-size:1.2rem;padding:12px 25px;cursor:pointer;
                            box-shadow:0 4px 0 #a93226;flex:1;
                            font-weight:bold;
                        ">🔫 СТРЕЛЯТЬ</button>
                        <button id="stReload" style="
                            background:linear-gradient(180deg,#3498db,#2980b9);
                            color:white;border:none;border-radius:25px;
                            font-size:1.2rem;padding:12px 25px;cursor:pointer;
                            box-shadow:0 4px 0 #1f618d;flex:1;
                            font-weight:bold;
                        ">🔄 ПЕРЕЗАРЯДКА</button>
                    </div>
                </div>
                
                <!-- Подсказка -->
                <p style="text-align:center;color:#999;margin-top:10px;font-size:0.8rem;">
                    💡 Стрелки на клавиатуре — движение | ПРОБЕЛ — стрелять
                </p>
                
                <button id="stClose" class="close-btn" style="
                    display:block;margin:15px auto 0;
                    background:#95a5a6;color:white;border:none;
                    border-radius:20px;padding:10px 30px;
                    font-size:1rem;cursor:pointer;
                ">✕ Закрыть</button>
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
