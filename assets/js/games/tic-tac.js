// ==================== ❌ КРЕСТИКИ-НОЛИКИ ====================
const TicTacGame = {
    active: false,
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameOver: false,
    mode: 'bot',

    start(container) {
        this.active = true;
        this.gameOver = false;
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.mode = 'bot';
        this.render(container);
    },

    render(container) {
        const winner = this.checkWinner();
        if (winner) { this.gameOver = true; this.active = false; }

        let html = `
            <h3 style="text-align:center;">❌ Крестики-нолики</h3>
            <div style="display:flex;gap:10px;justify-content:center;margin:15px 0;">
                <button id="ttBot" style="background:${this.mode==='bot'?'#f9d342':'#b3c7e5'}">🤖 С ботом</button>
                <button id="ttFriend" style="background:${this.mode==='friend'?'#f9d342':'#b3c7e5'}">👫 С другом</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#333;padding:15px;border-radius:20px;max-width:300px;margin:0 auto;">`;

        for (let i = 0; i < 9; i++) {
            const val = this.board[i];
            html += `<div data-index="${i}" style="aspect-ratio:1;background:#fff;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;font-weight:bold;cursor:pointer;${val==='X'?'color:#e74c3c;':val==='O'?'color:#3498db;':''}">${val}</div>`;
        }

        const status = winner ? (winner === 'draw' ? '🤝 Ничья!' : `🎉 Победил ${winner}!`) : `Ходит: ${this.currentPlayer}`;
        html += `</div><p style="text-align:center;font-size:1.3rem;margin:15px 0;">${status}</p>`;
        html += `<div style="display:flex;gap:10px;"><button id="ttReset" style="flex:1;">🔄 Новая игра</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;

        container.innerHTML = html;

        const self = this;
        document.getElementById('ttBot').onclick = () => { self.mode = 'bot'; self.start(container); };
        document.getElementById('ttFriend').onclick = () => { self.mode = 'friend'; self.start(container); };
        document.getElementById('ttReset').onclick = () => self.start(container);

        container.querySelectorAll('[data-index]').forEach(cell => {
            cell.onclick = () => {
                if (!self.active || self.gameOver) return;
                const idx = parseInt(cell.dataset.index);
                if (self.board[idx] !== '') return;
                self.board[idx] = self.currentPlayer;
                const w = self.checkWinner();
                if (w) {
                    self.gameOver = true; self.active = false;
                    if (w === 'X') {
                        if (typeof updateCoins === 'function') updateCoins(20);
                        if (typeof updatePetHappiness === 'function') updatePetHappiness(15);
                        AppState.totalGames++;
                        AppState.gameStats.ticTacWins = (AppState.gameStats.ticTacWins || 0) + 1;
                        if (!AppState.achievements.includes('tic_tac_win')) { AppState.achievements.push('tic_tac_win'); if (typeof showNotification === 'function') showNotification('🏆 Крестик!', 'success'); if (typeof showConfetti === 'function') showConfetti('achievement'); }
                        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                        if (typeof showNotification === 'function') showNotification('🎉 Победа! +20 🪙', 'success');
                        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'ticTac', win: true });
                    }
                } else {
                    self.currentPlayer = self.currentPlayer === 'X' ? 'O' : 'X';
                    if (self.mode === 'bot' && self.currentPlayer === 'O' && self.active) {
                        setTimeout(() => self.botMove(container), 400);
                    }
                }
                self.render(container);
            };
        });
    },

    checkWinner() {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (const [a,b,c] of lines) { if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) return this.board[a]; }
        if (this.board.every(cell => cell !== '')) return 'draw';
        return null;
    },

    botMove(container) {
        if (!this.active || this.gameOver || this.currentPlayer !== 'O') return;
        const empty = this.board.reduce((arr, c, i) => c === '' ? [...arr, i] : arr, []);
        for (const i of empty) { this.board[i] = 'O'; if (this.checkWinner() === 'O') { this.currentPlayer = 'X'; this.render(container); return; } this.board[i] = ''; }
        for (const i of empty) { this.board[i] = 'X'; if (this.checkWinner() === 'X') { this.board[i] = 'O'; this.currentPlayer = 'X'; this.render(container); return; } this.board[i] = ''; }
        const move = empty.includes(4) ? 4 : empty[Math.floor(Math.random() * empty.length)];
        this.board[move] = 'O'; this.currentPlayer = 'X';
        this.render(container);
    }
};
