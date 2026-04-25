// ==================== ⚡ СРАВНИ ЧИСЛА ====================
const CompareGame = {
    active: false, score: 0, target: 20, currentQ: null, timeLeft: 15, timer: null,

    start(container) {
        this.active = true; this.score = 0; this.generateQ(); this.render(container); this.startTimer(container);
    },

    generateQ() {
        const a = Math.floor(Math.random() * 100) + 1;
        let b;
        if (Math.random() < 0.2) b = a;
        else b = Math.floor(Math.random() * 100) + 1;
        this.currentQ = { a, b, correct: a < b ? '<' : (a > b ? '>' : '=') };
    },

    render(container) {
        const self = this;
        if (!this.currentQ) return;
        let html = `<h3 style="text-align:center;">⚡ Сравни числа</h3>`;
        html += `<div style="text-align:center;font-size:2.5rem;color:${this.timeLeft<=3?'#e74c3c':'inherit'};">⏱️ ${this.timeLeft}</div>`;
        html += `<div style="font-size:4rem;font-weight:bold;text-align:center;margin:30px 0;">${this.currentQ.a} ? ${this.currentQ.b}</div>`;
        html += `<div style="display:flex;gap:20px;justify-content:center;">`;
        html += `<button class="cmp-btn" data-s="<" style="width:100px;height:100px;font-size:4rem;">&lt;</button>`;
        html += `<button class="cmp-btn" data-s=">" style="width:100px;height:100px;font-size:4rem;">&gt;</button>`;
        html += `<button class="cmp-btn" data-s="=" style="width:100px;height:100px;font-size:4rem;">=</button>`;
        html += `</div>`;
        html += `<p style="text-align:center;font-size:1.3rem;margin-top:20px;">⚡ Счёт: <strong>${this.score}</strong> / ${this.target}</p>`;
        html += `<div class="progress-bar"><div class="progress-fill" style="width:${(this.score/this.target)*100}%"></div></div>`;
        html += `<div style="display:flex;gap:10px;margin-top:15px;"><button id="cmpReset" style="flex:1;">🔄 Заново</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        container.querySelectorAll('.cmp-btn').forEach(btn => {
            btn.onclick = () => {
                if (!self.active) return;
                if (btn.dataset.s === self.currentQ.correct) {
                    self.score++;
                    clearInterval(self.timer);
                    if (typeof playSound === 'function') playSound('correct');
                    if (self.score >= self.target) {
                        self.active = false;
                        if (typeof updateCoins === 'function') updateCoins(25);
                        if (typeof updatePetHappiness === 'function') updatePetHappiness(15);
                        AppState.totalGames++;
                        AppState.gameStats.compareCorrect = (AppState.gameStats.compareCorrect || 0) + self.score;
                        if (!AppState.achievements.includes('fast_compare')) { AppState.achievements.push('fast_compare'); if (typeof showNotification === 'function') showNotification('🏆 Быстрый ум!', 'success'); if (typeof showConfetti === 'function') showConfetti('achievement'); }
                        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                        if (typeof showNotification === 'function') showNotification(`🎉 ${self.score}/${self.target}! +25 🪙`, 'success');
                        if (typeof showConfetti === 'function') showConfetti('success');
                        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'compare', win: true });
                        return;
                    }
                    self.generateQ(); self.render(container); self.startTimer(container);
                } else {
                    self.active = false; clearInterval(self.timer);
                    if (typeof playSound === 'function') playSound('wrong');
                    if (typeof showNotification === 'function') showNotification(`❌ Нужно: ${self.currentQ.correct}. Счёт: ${self.score}`, 'error');
                    self.render(container);
                }
            };
        });
        document.getElementById('cmpReset').onclick = () => { clearInterval(self.timer); self.start(container); };
    },

    startTimer(container) {
        const self = this; this.timeLeft = 15; clearInterval(this.timer);
        this.timer = setInterval(() => { if (!self.active) { clearInterval(self.timer); return; } self.timeLeft--; self.render(container); if (self.timeLeft <= 0) { clearInterval(self.timer); self.active = false; if (typeof showNotification === 'function') showNotification('⏰ Время вышло!', 'error'); self.render(container); } }, 1000);
    }
};
