// ==================== 🎯 ПОПАДИ В ЦЕЛЬ ====================
const ShootGame = {
    active: false,
    score: 0,
    target: 10,
    currentQ: null,
    timeLeft: 12,
    timer: null,

    start(container) {
        this.active = true;
        this.score = 0;
        this.generateQ();
        this.render(container);
        this.startTimer(container);
    },

    generateQ() {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const correct = a + b;
        let w1 = correct + Math.floor(Math.random() * 5) + 1;
        let w2 = Math.max(1, correct - Math.floor(Math.random() * 5) - 1);
        while (w1 === correct) w1++;
        while (w2 === correct || w2 === w1) w2 = Math.max(1, w2 - 1);
        this.currentQ = { text: `${a} + ${b} = ?`, correct, options: [correct, w1, w2].sort(() => Math.random() - 0.5) };
    },

    render(container) {
        const self = this;
        if (!this.currentQ) return;
        let html = `<h3 style="text-align:center;">🎯 Попади в цель</h3>`;
        html += `<div style="text-align:center;font-size:2.5rem;font-weight:bold;color:${this.timeLeft<=3?'#e74c3c':'inherit'};">⏱️ ${this.timeLeft}</div>`;
        html += `<div style="font-size:3rem;font-weight:bold;text-align:center;margin:20px 0;">${this.currentQ.text}</div>`;
        html += `<div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin:20px 0;">`;
        this.currentQ.options.forEach(opt => {
            html += `<button class="shoot-btn" data-a="${opt}" style="width:100px;height:100px;font-size:2.5rem;border-radius:50%;background:radial-gradient(circle,#ffd966,#ffb347);box-shadow:0 8px 0 #b47c2e;">${opt}</button>`;
        });
        html += `</div>`;
        html += `<p style="text-align:center;font-size:1.3rem;">🎯 Счёт: <strong>${this.score}</strong> / ${this.target}</p>`;
        html += `<div class="progress-bar"><div class="progress-fill" style="width:${(this.score/this.target)*100}%"></div></div>`;
        html += `<div style="display:flex;gap:10px;"><button id="shReset" style="flex:1;">🔄 Заново</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        container.querySelectorAll('.shoot-btn').forEach(btn => {
            btn.onclick = () => {
                if (!self.active) return;
                const answer = parseInt(btn.dataset.a);
                if (answer === self.currentQ.correct) {
                    self.score++;
                    clearInterval(self.timer);
                    if (typeof playSound === 'function') playSound('correct');
                    if (typeof showNotification === 'function') showNotification('✅ Правильно!', 'success');
                    self.render(container);
                    if (self.score >= self.target) {
                        self.active = false;
                        if (typeof updateCoins === 'function') updateCoins(25);
                        if (typeof updatePetHappiness === 'function') updatePetHappiness(15);
                        AppState.totalGames++;
                        AppState.gameStats.shootTargets = (AppState.gameStats.shootTargets || 0) + self.score;
                        if (!AppState.achievements.includes('shoot_master')) { AppState.achievements.push('shoot_master'); if (typeof showNotification === 'function') showNotification('🏆 Снайпер!', 'success'); if (typeof showConfetti === 'function') showConfetti('achievement'); }
                        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                        if (typeof showNotification === 'function') showNotification(`🎉 Победа! +25 🪙`, 'success');
                        if (typeof showConfetti === 'function') showConfetti('success');
                        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'shoot', win: true });
                        return;
                    }
                    self.generateQ();
                    self.render(container);
                    self.startTimer(container);
                } else {
                    self.active = false;
                    clearInterval(self.timer);
                    if (typeof playSound === 'function') playSound('wrong');
                    if (typeof showNotification === 'function') showNotification(`❌ Ответ: ${self.currentQ.correct}. Счёт: ${self.score}`, 'error');
                    self.render(container);
                }
            };
        });

        document.getElementById('shReset').onclick = () => { clearInterval(self.timer); self.start(container); };
    },

    startTimer(container) {
        const self = this;
        this.timeLeft = 12;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (!self.active) { clearInterval(self.timer); return; }
            self.timeLeft--;
            self.render(container);
            if (self.timeLeft <= 0) {
                clearInterval(self.timer);
                self.active = false;
                if (typeof showNotification === 'function') showNotification('⏰ Время вышло!', 'error');
                self.render(container);
            }
        }, 1000);
    }
};
