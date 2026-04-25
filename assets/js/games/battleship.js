// ==================== 🚢 МОРСКОЙ БОЙ ====================
const BattleshipGame = {
    active: false,
    playerBoard: [],
    botBoard: [],
    playerShips: 5,
    botShips: 5,
    gameOver: false,
    playerTurn: true,

    start(container) {
        this.active = true;
        this.gameOver = false;
        this.playerTurn = true;
        this.playerShips = 5;
        this.botShips = 5;
        this.playerBoard = Array(8).fill().map(() => Array(8).fill(null));
        this.botBoard = Array(8).fill().map(() => Array(8).fill(null));
        this.placeShips(this.playerBoard, 5);
        this.placeShips(this.botBoard, 5);
        this.render(container);
    },

    placeShips(board, count) {
        let placed = 0;
        while (placed < count) {
            const r = Math.floor(Math.random() * 8);
            const c = Math.floor(Math.random() * 8);
            if (board[r][c] !== 'ship') { board[r][c] = 'ship'; placed++; }
        }
    },

    render(container) {
        const self = this;
        let html = `<h3 style="text-align:center;">🚢 Морской бой</h3>`;
        html += `<div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;">`;
        html += `<div><h4>🎯 Твои выстрелы</h4><div style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;background:#2c3e50;padding:10px;border-radius:15px;width:280px;height:280px;">`;
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
            const cell = this.playerBoard[i][j];
            let bg = '#3498db', emoji = '';
            if (cell === 'hit') { bg = '#e74c3c'; emoji = '💥'; }
            else if (cell === 'miss') { bg = '#95a5a6'; emoji = '❌'; }
            html += `<div data-r="${i}" data-c="${j}" data-board="player" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:${bg};border-radius:4px;cursor:pointer;font-size:1.2rem;">${emoji}</div>`;
        }
        html += `</div></div>`;
        html += `<div><h4>🤖 Выстрелы бота</h4><div style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;background:#2c3e50;padding:10px;border-radius:15px;width:280px;height:280px;">`;
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
            const cell = this.botBoard[i][j];
            let bg = '#3498db', emoji = '';
            if (cell === 'hit') { bg = '#e74c3c'; emoji = '💥'; }
            else if (cell === 'miss') { bg = '#95a5a6'; emoji = '❌'; }
            html += `<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:${bg};border-radius:4px;font-size:1.2rem;">${emoji}</div>`;
        }
        html += `</div></div></div>`;

        const status = this.gameOver ? (this.playerShips === 0 ? '🎉 ПОБЕДА!' : '😢 ПОРАЖЕНИЕ...') : (this.playerTurn ? '✅ ТВОЙ ХОД!' : '⏳ Бот думает...');
        html += `<p style="text-align:center;font-size:1.2rem;margin:15px 0;">${status} | 🚢 Твои: ${this.botShips} | 🤖 Бота: ${this.playerShips}</p>`;
        html += `<div style="display:flex;gap:10px;"><button id="bsReset" style="flex:1;">🔄 Новая игра</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        document.getElementById('bsReset').onclick = () => self.start(container);

        container.querySelectorAll('[data-board="player"]').forEach(cell => {
            cell.onclick = () => {
                if (!self.active || self.gameOver || !self.playerTurn) return;
                const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
                if (self.playerBoard[r][c] === 'hit' || self.playerBoard[r][c] === 'miss') {
                    if (typeof showNotification === 'function') showNotification('Уже стрелял сюда!', 'warning');
                    return;
                }
                if (self.playerBoard[r][c] === 'ship') {
                    self.playerBoard[r][c] = 'hit';
                    self.playerShips--;
                    if (typeof showNotification === 'function') showNotification('💥 Попадание!', 'success');
                    if (typeof playSound === 'function') playSound('correct');
                } else {
                    self.playerBoard[r][c] = 'miss';
                    if (typeof showNotification === 'function') showNotification('❌ Мимо!', 'info');
                    if (typeof playSound === 'function') playSound('wrong');
                }
                if (self.playerShips === 0) {
                    self.gameOver = true; self.active = false;
                    if (typeof updateCoins === 'function') updateCoins(40);
                    if (typeof updatePetHappiness === 'function') updatePetHappiness(25);
                    AppState.totalGames++;
                    AppState.gameStats.battleshipWins = (AppState.gameStats.battleshipWins || 0) + 1;
                    if (!AppState.achievements.includes('battleship_master')) { AppState.achievements.push('battleship_master'); if (typeof showNotification === 'function') showNotification('🏆 Адмирал!', 'success'); if (typeof showConfetti === 'function') showConfetti('achievement'); }
                    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                    if (typeof showNotification === 'function') showNotification('🎉 Победа! +40 🪙', 'success');
                    if (typeof showConfetti === 'function') showConfetti('success');
                    if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'battleship', win: true });
                } else {
                    self.playerTurn = false;
                    self.render(container);
                    setTimeout(() => self.botTurn(container), 800);
                    return;
                }
                self.render(container);
            };
        });
    },

    botTurn(container) {
        if (!this.active || this.gameOver || this.playerTurn) return;
        const available = [];
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
            if (this.botBoard[i][j] !== 'hit' && this.botBoard[i][j] !== 'miss') available.push({ r: i, c: j });
        }
        if (available.length === 0) { this.gameOver = true; this.active = false; this.render(container); return; }
        const shot = available[Math.floor(Math.random() * available.length)];
        if (this.botBoard[shot.r][shot.c] === 'ship') {
            this.botBoard[shot.r][shot.c] = 'hit';
            this.botShips--;
            if (typeof showNotification === 'function') showNotification('🤖 Бот попал!', 'error');
        } else {
            this.botBoard[shot.r][shot.c] = 'miss';
            if (typeof showNotification === 'function') showNotification('🤖 Бот промахнулся!', 'success');
        }
        if (this.botShips === 0) {
            this.gameOver = true; this.active = false;
            if (typeof showNotification === 'function') showNotification('😢 Поражение...', 'error');
            if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'battleship', win: false });
        } else {
            this.playerTurn = true;
        }
        this.render(container);
    }
};
