// ==================== 💰 СДАЧА В МАГАЗИНЕ ====================
const ChangeGame = {
    active: false, score: 0, target: 10, price: 0, paid: 0, change: 0,

    start(container) { this.active=true; this.score=0; this.gen(); this.render(container); },

    gen() { this.price = Math.floor(Math.random()*90)+10; this.paid = Math.floor(this.price+Math.random()*50)+10; this.change = this.paid-this.price; },

    render(container) {
        const self = this;
        let html = `<h3 style="text-align:center;">💰 Сдача в магазине</h3>`;
        html += `<div style="font-size:1.5rem;text-align:center;margin:20px 0;">💰 Покупка стоит <strong>${this.price}₽</strong></div>`;
        html += `<div style="font-size:1.5rem;text-align:center;margin:20px 0;">💵 Ты дал <strong>${this.paid}₽</strong></div>`;
        html += `<p style="text-align:center;">Сколько сдачи?</p>`;
        html += `<input type="number" id="chInput" style="width:150px;padding:15px;font-size:2rem;text-align:center;border-radius:30px;border:3px solid #ffb347;margin:15px auto;display:block;">`;
        html += `<button id="chCheck" style="width:100%;">✅ Проверить</button>`;
        html += `<p style="text-align:center;font-size:1.3rem;margin-top:15px;">💰 Счёт: <strong>${this.score}</strong> / ${this.target}</p>`;
        html += `<div style="display:flex;gap:10px;"><button id="chReset" style="flex:1;">🔄 Заново</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        document.getElementById('chCheck').onclick = () => {
            const answer = parseInt(document.getElementById('chInput').value);
            if (answer === self.change) {
                self.score++;
                if (typeof playSound==='function') playSound('correct');
                if (self.score >= self.target) { self.active=false; if (typeof updateCoins==='function') updateCoins(20); if (typeof updatePetHappiness==='function') updatePetHappiness(15); AppState.totalGames++; AppState.gameStats.changeCorrect=(AppState.gameStats.changeCorrect||0)+self.score; if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`🎉 ${self.score}/${self.target}! +20 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'change',win:true}); return; }
                self.gen(); self.render(container);
            } else { self.active=false; if (typeof playSound==='function') playSound('wrong'); if (typeof showNotification==='function') showNotification(`❌ Сдача: ${self.change}₽. Счёт: ${self.score}`,'error'); self.render(container); }
        };
        document.getElementById('chReset').onclick = () => self.start(container);
        document.getElementById('chInput').addEventListener('keydown', e => { if (e.key==='Enter') document.getElementById('chCheck').click(); });
    }
};
