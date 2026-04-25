// ==================== 🖐️ СЧЁТ НА ПАЛЬЦАХ ====================
const FingerGame = {
    active: false, score: 0, target: 10, num: 0,

    start(container) {
        this.active = true; this.score = 0; this.gen(); this.render(container);
    },

    gen() { this.num = Math.floor(Math.random() * 10) + 1; },

    render(container) {
        const self = this;
        const fingers = '🖐️'.repeat(Math.min(this.num, 5)) + (this.num > 5 ? '✋'.repeat(this.num - 5) : '');
        let html = `<h3 style="text-align:center;">🖐️ Счёт на пальцах</h3>`;
        html += `<div style="font-size:5rem;text-align:center;letter-spacing:15px;margin:30px 0;">${fingers}</div>`;
        html += `<div style="font-size:1.8rem;text-align:center;margin:20px;">Сколько пальцев?</div>`;
        html += `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">`;
        let opts = [this.num]; while (opts.length < 4) { const o = Math.floor(Math.random()*10)+1; if (!opts.includes(o)) opts.push(o); }
        opts.sort(() => Math.random()-0.5);
        opts.forEach(o => { html += `<button class="f-btn" data-a="${o}" style="width:80px;height:80px;font-size:2rem;border-radius:50%;">${o}</button>`; });
        html += `</div>`;
        html += `<p style="text-align:center;font-size:1.3rem;margin-top:20px;">🖐️ Счёт: <strong>${this.score}</strong> / ${this.target}</p>`;
        html += `<div style="display:flex;gap:10px;"><button id="fReset" style="flex:1;">🔄 Заново</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        container.querySelectorAll('.f-btn').forEach(btn => {
            btn.onclick = () => {
                if (!self.active) return;
                if (parseInt(btn.dataset.a) === self.num) {
                    self.score++;
                    if (typeof playSound === 'function') playSound('correct');
                    if (self.score >= self.target) {
                        self.active = false;
                        if (typeof updateCoins === 'function') updateCoins(20); if (typeof updatePetHappiness === 'function') updatePetHappiness(15);
                        AppState.totalGames++; AppState.gameStats.fingerCorrect = (AppState.gameStats.fingerCorrect||0)+self.score;
                        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                        if (typeof showNotification === 'function') showNotification(`🎉 ${self.score}/${self.target}! +20 🪙`, 'success');
                        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'finger', win: true });
                        return;
                    }
                    self.gen(); self.render(container);
                } else { self.active = false; if (typeof playSound === 'function') playSound('wrong'); if (typeof showNotification === 'function') showNotification(`❌ Правильно: ${self.num}. Счёт: ${self.score}`, 'error'); self.render(container); }
            };
        });
        document.getElementById('fReset').onclick = () => self.start(container);
    }
};
