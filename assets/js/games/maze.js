// ==================== 🗺️ ЛАБИРИНТ ====================
const MazeGame = {
    active: false,
    level: 1,
    totalLevels: 5,
    map: [],
    player: { x: 1, y: 1 },
    exit: { x: 7, y: 7 },
    levels: [
        { map: [['#','#','#','#','#','#','#','#','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#'],['#',' ','#',' ',' ',' ','#',' ','#'],['#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#']], player: {x:1,y:1}, exit: {x:5,y:7}, name: '🌱 Начало', reward: 10 },
        { map: [['#','#','#','#','#','#','#','#','#'],['#',' ','#',' ',' ',' ','#',' ','#'],['#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#'],['#',' ',' ',' ',' ',' ','#',' ','#'],['#',' ','#','#','#','#','#',' ','#'],['#',' ',' ',' ',' ',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#']], player: {x:1,y:1}, exit: {x:7,y:7}, name: '🌿 Извилистый', reward: 15 },
        { map: [['#','#','#','#','#','#','#','#','#'],['#',' ',' ','#',' ',' ',' ',' ','#'],['#','#',' ','#',' ','#','#',' ','#'],['#',' ',' ',' ',' ','#',' ',' ','#'],['#',' ','#','#','#','#',' ','#','#'],['#',' ',' ',' ','#',' ',' ',' ','#'],['#','#','#',' ','#',' ','#',' ','#'],['#',' ',' ',' ',' ',' ','#',' ','#'],['#','#','#','#','#','#','#','#','#']], player: {x:1,y:1}, exit: {x:7,y:7}, name: '🍂 Запутанный', reward: 20 },
        { map: [['#','#','#','#','#','#','#','#','#','#','#'],['#',' ',' ',' ','#',' ',' ',' ','#',' ','#'],['#','#','#',' ',' ',' ','#',' ',' ',' ','#'],['#',' ','#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ','#',' ','#'],['#','#','#',' ','#',' ','#','#','#',' ','#'],['#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#'],['#',' ','#','#','#',' ','#','#','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#','#','#']], player: {x:1,y:1}, exit: {x:8,y:9}, name: '🌲 Дремучий лес', reward: 25 },
        { map: [['#','#','#','#','#','#','#','#','#','#','#'],['#',' ',' ','#',' ',' ',' ','#',' ',' ','#'],['#',' ','#','#','#',' ','#','#',' ','#','#'],['#',' ',' ',' ','#',' ',' ',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#',' ','#'],['#',' ',' ',' ',' ',' ','#',' ',' ',' ','#'],['#',' ','#','#','#',' ','#','#','#',' ','#'],['#',' ',' ',' ','#',' ',' ',' ',' ',' ','#'],['#','#','#',' ','#','#','#',' ','#','#','#'],['#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#'],['#','#','#','#','#','#','#','#','#','#','#']], player: {x:1,y:1}, exit: {x:9,y:9}, name: '🏆 Финальный', reward: 50 }
    ],

    start(container) {
        this.active = true;
        this.level = 1;
        this.loadLevel(1);
        this.render(container);
    },

    loadLevel(l) {
        const data = this.levels[l - 1];
        this.map = data.map.map(row => [...row]);
        this.player = { ...data.player };
        this.exit = { ...data.exit };
    },

    render(container) {
        const ld = this.levels[this.level - 1];
        container.innerHTML = `
            <div style="text-align:center;margin-bottom:15px;">
                <h3>${ld.name}</h3>
                <p>Уровень ${this.level} из ${this.totalLevels} | Награда: ${ld.reward} 🪙</p>
            </div>
            <div id="mazeGrid" style="display:grid;gap:3px;background:#654321;padding:12px;border-radius:20px;max-width:500px;margin:0 auto;"></div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;">
                <button id="mUp" style="font-size:2rem;padding:15px 25px;">⬆️</button>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;">
                <button id="mLeft" style="font-size:2rem;padding:15px 25px;">⬅️</button>
                <button id="mDown" style="font-size:2rem;padding:15px 25px;">⬇️</button>
                <button id="mRight" style="font-size:2rem;padding:15px 25px;">➡️</button>
            </div>
            <button id="mReset" style="margin-top:15px;width:100%;">🔄 Заново</button>
            <button onclick="navigateTo('arcadeHub')" style="margin-top:10px;width:100%;background:#b3c7e5;">↩️ В игротеку</button>
        `;

        this.drawGrid();
        this.setupControls(container);
    },

    drawGrid() {
        const grid = document.getElementById('mazeGrid');
        if (!grid) return;
        grid.style.gridTemplateColumns = `repeat(${this.map[0].length}, 1fr)`;
        let html = '';
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[0].length; j++) {
                let bg = '#a9d6e5', emoji = '⬜';
                if (this.map[i][j] === '#') { bg = '#8b5a2b'; emoji = '🧱'; }
                else if (i === this.player.x && j === this.player.y) { bg = '#ffd966'; emoji = AppState.pet?.emoji || '🐱'; }
                else if (i === this.exit.x && j === this.exit.y) { bg = '#4caf50'; emoji = '🎁'; }
                html += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:1.3rem;background:${bg};border-radius:4px;">${emoji}</div>`;
            }
        }
        grid.innerHTML = html;
    },

    setupControls(container) {
        const self = this;
        document.getElementById('mUp').onclick = () => self.move(-1, 0, container);
        document.getElementById('mDown').onclick = () => self.move(1, 0, container);
        document.getElementById('mLeft').onclick = () => self.move(0, -1, container);
        document.getElementById('mRight').onclick = () => self.move(0, 1, container);
        document.getElementById('mReset').onclick = () => { self.loadLevel(self.level); self.render(container); };

        document.addEventListener('keydown', function handler(e) {
            if (!self.active) { document.removeEventListener('keydown', handler); return; }
            if (e.key === 'ArrowUp') { e.preventDefault(); self.move(-1, 0, container); }
            if (e.key === 'ArrowDown') { e.preventDefault(); self.move(1, 0, container); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); self.move(0, -1, container); }
            if (e.key === 'ArrowRight') { e.preventDefault(); self.move(0, 1, container); }
        });
    },

    move(dx, dy, container) {
        if (!this.active) return;
        const nx = this.player.x + dx, ny = this.player.y + dy;
        if (nx < 0 || nx >= this.map.length || ny < 0 || ny >= this.map[0].length || this.map[nx][ny] === '#') {
            if (typeof showNotification === 'function') showNotification('🚫 Там стена!', 'warning');
            return;
        }
        this.player.x = nx;
        this.player.y = ny;

        if (nx === this.exit.x && ny === this.exit.y) {
            const reward = this.levels[this.level - 1].reward;
            if (this.level < this.totalLevels) {
                this.level++;
                this.loadLevel(this.level);
                if (typeof updateCoins === 'function') updateCoins(reward);
                if (typeof showNotification === 'function') showNotification(`🎉 Уровень ${this.level - 1} пройден! +${reward} 🪙`, 'success');
                if (typeof showConfetti === 'function') showConfetti('success');
                this.render(container);
            } else {
                this.active = false;
                if (typeof updateCoins === 'function') updateCoins(reward);
                if (typeof updatePetHappiness === 'function') updatePetHappiness(20);
                AppState.totalGames++;
                AppState.gameStats.mazeCompleted = (AppState.gameStats.mazeCompleted || 0) + 1;
                if (!AppState.achievements.includes('maze_master')) {
                    AppState.achievements.push('maze_master');
                    if (typeof showNotification === 'function') showNotification('🏆 Достижение: Исследователь!', 'success');
                    if (typeof showConfetti === 'function') showConfetti('achievement');
                }
                if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                if (typeof showNotification === 'function') showNotification(`🏆 Все уровни пройдены! +${reward} 🪙`, 'success');
                if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'maze', win: true });
                this.render(container);
            }
        } else {
            this.drawGrid();
        }
    }
};
