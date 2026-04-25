// ==================== 🔢 СОСТАВ ЧИСЛА ====================
const CompositionGame = {
    active: false, score: 0, target: 10, total: 0, part: 0, missing: 0,

    start(container) {
        this.active = true; this.score = 0; this.gen(); this.render(container);
    },

    gen() { this.total = Math.floor(Math.random() * 10) + 5; this.part = Math.floor(Math.random() * (this.total - 1)) + 1; this.missing = this.total - this.part; },

    render(container) {
        const self = this;
        let html = `<h3 style="text-align:center;">🔢 Состав числа</h3>`;
        html += `<div style="font-size:3rem;font-weight:bold;text-align:center;margin:30px 0;">${this.total} = ${this.part} + ?</div>`;
        html += `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">`;
        let opts = [this.missing]; while (opts.length < 4) { const o = Math.floor(Math.random()*this.total)+1; if (!opts.includes(o)) opts.push(o); }
        opts.sort(() => Math.random()-0.5);
        opts.forEach(o => { html += `<button class="n-btn" data-a="${o}" style="width:80px;height:80px;font-size:2rem;border-radius:50%;">${o}</button>`; });
        html += `</div>`;
        html += `<p style="text-align:center;font-size:1.3rem;margin-top:20px;">🔢 Счёт: <strong>${this.score}</strong> / ${this.target}</p>`;
        html += `<div style="display:flex;gap:10px;"><button id="nReset" style="flex:1;">🔄 Заново</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        container.querySelectorAll('.n-btn').forEach(btn => {
            btn.onclick = () => {
                if (!self.active) return;
                if (parseInt(btn.dataset.a) === self.missing) {
                    self.score++;
                    if (typeof playSound === 'function') playSound('correct');
                    if (self.score >= self.target) { self.active = false; if (typeof updateCoins==='function') updateCoins(20); if (typeof updatePetHappiness==='function') updatePetHappiness(15); AppState.totalGames++; AppState.gameStats.compositionCorrect=(AppState.gameStats.compositionCorrect||0)+self.score; if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`🎉 ${self.score}/${self.target}! +20 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'composition',win:true}); return; }
                    self.gen(); self.render(container);
                } else { self.active = false; if (typeof playSound==='function') playSound('wrong'); if (typeof showNotification==='function') showNotification(`❌ Правильно: ${self.missing}. Счёт: ${self.score}`,'error'); self.render(container); }
            };
        });
        document.getElementById('nReset').onclick = () => self.start(container);
    }
};
