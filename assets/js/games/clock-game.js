// ==================== ⏰ КОТОРЫЙ ЧАС? ====================
const ClockGame = {
    active: false, score: 0, target: 10, hours: 0, minutes: 0,
    emojis: {1:'🕐',2:'🕑',3:'🕒',4:'🕓',5:'🕔',6:'🕕',7:'🕖',8:'🕗',9:'🕘',10:'🕙',11:'🕚',12:'🕛'},

    start(container) { this.active=true; this.score=0; this.gen(); this.render(container); },

    gen() { this.hours = Math.floor(Math.random()*12)+1; this.minutes = [0,15,30,45][Math.floor(Math.random()*4)]; },

    getEmoji(h,m) { if (m===0) return this.emojis[h]; if (m===30) return ['','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧'][h]; return this.emojis[h]; },

    render(container) {
        const self = this;
        const emoji = this.getEmoji(this.hours, this.minutes);
        const correct = `${this.hours}:${this.minutes.toString().padStart(2,'0')}`;
        let html = `<h3 style="text-align:center;">⏰ Который час?</h3>`;
        html += `<div style="font-size:6rem;text-align:center;margin:30px 0;">${emoji}</div>`;
        html += `<p style="text-align:center;">Напиши время (Ч:ММ)</p>`;
        html += `<input type="text" id="clInput" placeholder="например: 3:15" style="width:100%;padding:15px;font-size:1.5rem;text-align:center;border-radius:30px;border:3px solid #ffb347;margin:15px 0;">`;
        html += `<button id="clCheck" style="width:100%;">✅ Проверить</button>`;
        html += `<p style="text-align:center;font-size:1.3rem;margin-top:15px;">⏰ Счёт: <strong>${this.score}</strong> / ${this.target}</p>`;
        html += `<div style="display:flex;gap:10px;"><button id="clReset" style="flex:1;">🔄 Заново</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        document.getElementById('clCheck').onclick = () => {
            const answer = document.getElementById('clInput').value.trim();
            if (answer === correct) {
                self.score++;
                if (typeof playSound==='function') playSound('correct');
                if (self.score >= self.target) { self.active=false; if (typeof updateCoins==='function') updateCoins(20); if (typeof updatePetHappiness==='function') updatePetHappiness(15); AppState.totalGames++; AppState.gameStats.clockCorrect=(AppState.gameStats.clockCorrect||0)+self.score; if (!AppState.achievements.includes('clock_master')){AppState.achievements.push('clock_master');if(typeof showNotification==='function') showNotification('🏆 Повелитель времени!','success');if(typeof showConfetti==='function') showConfetti('achievement');} if (typeof saveState==='function') saveState(AppState.currentChild?.id); if (typeof showNotification==='function') showNotification(`🎉 ${self.score}/${self.target}! +20 🪙`,'success'); if (typeof EventBus!=='undefined') EventBus.emit('game:ended',{game:'clock',win:true}); return; }
                self.gen(); self.render(container);
            } else { self.active=false; if (typeof playSound==='function') playSound('wrong'); if (typeof showNotification==='function') showNotification(`❌ Правильно: ${correct}. Счёт: ${self.score}`,'error'); self.render(container); }
        };
        document.getElementById('clReset').onclick = () => self.start(container);
        document.getElementById('clInput').addEventListener('keydown', e => { if (e.key==='Enter') document.getElementById('clCheck').click(); });
    }
};
