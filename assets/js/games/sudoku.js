// ==================== 🧩 СУДОКУ 4×4 ====================
const SudokuGame = {
    active: false,
    board: [],
    solution: [],
    selected: null,

    start(container) {
        this.active = true;
        this.selected = null;
        this.solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
        this.board = this.solution.map(row => [...row]);
        const toRemove = 6 + Math.floor(Math.random() * 3);
        for (let i = 0; i < toRemove; i++) {
            const r = Math.floor(Math.random() * 4), c = Math.floor(Math.random() * 4);
            this.board[r][c] = null;
        }
        this.render(container);
    },

    render(container) {
        const self = this;
        let html = `<h3 style="text-align:center;">🧩 Судоку 4×4</h3>`;
        html += `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;background:#333;padding:15px;border-radius:20px;max-width:300px;margin:20px auto;">`;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const val = this.board[i][j];
                const isSelected = this.selected && this.selected.r === i && this.selected.c === j;
                const isFixed = this.solution[i][j] === val || val === null;
                html += `<div data-r="${i}" data-c="${j}" style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:bold;cursor:pointer;background:${isSelected?'#ffd966':'#fff'};border-radius:10px;${isSelected?'border:3px solid #ffb347;':''}${!isFixed&&val?'color:#2196f3;':''}">${val !== null ? val : ''}</div>`;
            }
        }
        html += `</div>`;
        html += `<div style="display:flex;gap:10px;justify-content:center;margin:15px 0;">`;
        for (let n = 1; n <= 4; n++) {
            html += `<button class="sudoku-num" data-n="${n}" style="width:60px;height:60px;font-size:1.8rem;padding:0;">${n}</button>`;
        }
        html += `<button class="sudoku-num" data-n="clear" style="width:60px;height:60px;font-size:1.5rem;padding:0;">🗑️</button>`;
        html += `</div>`;
        html += `<div style="display:flex;gap:10px;"><button id="sCheck" style="flex:1;">✅ Проверить</button><button id="sReset" style="flex:1;">🔄 Новая</button></div>`;
        html += `<button onclick="navigateTo('arcadeHub')" style="width:100%;margin-top:10px;background:#b3c7e5;">↩️ В игротеку</button>`;
        container.innerHTML = html;

        container.querySelectorAll('[data-r]').forEach(cell => {
            cell.onclick = () => {
                if (!self.active) return;
                const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
                if (self.solution[r][c] === self.board[r][c] && self.board[r][c] !== null) {
                    if (typeof showNotification === 'function') showNotification('Эту клетку нельзя изменить', 'warning');
                    return;
                }
                self.selected = { r, c };
                self.render(container);
            };
        });

        container.querySelectorAll('.sudoku-num').forEach(btn => {
            btn.onclick = () => {
                if (!self.active) return;
                if (btn.dataset.n === 'clear') {
                    if (self.selected) { self.board[self.selected.r][self.selected.c] = null; self.selected = null; self.render(container); }
                    return;
                }
                if (!self.selected) {
                    if (typeof showNotification === 'function') showNotification('Выбери клетку!', 'warning');
                    return;
                }
                self.board[self.selected.r][self.selected.c] = parseInt(btn.dataset.n);
                self.selected = null;
                self.render(container);
            };
        });

        document.getElementById('sCheck').onclick = () => self.check(container);
        document.getElementById('sReset').onclick = () => self.start(container);
    },

    check(container) {
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
            if (this.board[i][j] === null) { if (typeof showNotification === 'function') showNotification('❌ Заполни все клетки!', 'error'); return; }
        }
        for (let i = 0; i < 4; i++) {
            const rs = new Set(), cs = new Set();
            for (let j = 0; j < 4; j++) { rs.add(this.board[i][j]); cs.add(this.board[j][i]); }
            if (rs.size !== 4 || cs.size !== 4) { if (typeof showNotification === 'function') showNotification('❌ Неправильно!', 'error'); return; }
        }
        for (let br = 0; br < 2; br++) for (let bc = 0; bc < 2; bc++) {
            const bs = new Set();
            for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) bs.add(this.board[br*2+i][bc*2+j]);
            if (bs.size !== 4) { if (typeof showNotification === 'function') showNotification('❌ Неправильно!', 'error'); return; }
        }
        this.active = false;
        if (typeof updateCoins === 'function') updateCoins(35);
        if (typeof updatePetHappiness === 'function') updatePetHappiness(20);
        AppState.totalGames++;
        AppState.gameStats.sudokuCompleted = (AppState.gameStats.sudokuCompleted || 0) + 1;
        if (!AppState.achievements.includes('sudoku_master')) { AppState.achievements.push('sudoku_master'); if (typeof showNotification === 'function') showNotification('🏆 Судоку-мастер!', 'success'); if (typeof showConfetti === 'function') showConfetti('achievement'); }
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        if (typeof showNotification === 'function') showNotification('🎉 Судоку решено! +35 🪙', 'success');
        if (typeof showConfetti === 'function') showConfetti('success');
        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'sudoku', win: true });
        this.render(container);
    }
};
