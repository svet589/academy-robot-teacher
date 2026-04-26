// ==================== 🏀 БАСКЕТБОЛ ====================
const BasketballGame = {
    active: false, score: 0, ballX: 250, ballY: 300, velocityY: 0, velocityX: 0,
    petX: 225, petWidth: 100, petHeight: 80, gravity: 0.4, isJumping: false,
    
    start() {
        const self = this;
        this.active = true; this.score = 0; this.velocityY = 0; this.velocityX = 0; this.ballY = 300;
        const modal = document.createElement('div'); modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:550px;">
                <h3>🏀 Баскетбол с питомцем</h3>
                <div id="basketballArea" style="position:relative;width:100%;height:400px;background:#87CEEB;border-radius:20px;overflow:hidden;margin:15px 0;">
                    <div id="bbPet" style="position:absolute;bottom:20px;left:225px;font-size:3rem;width:50px;text-align:center;">🐱</div>
                    <div id="bbHoop" style="position:absolute;top:50px;right:50px;font-size:4rem;">🏀</div>
                    <div id="bbBall" style="position:absolute;top:300px;left:50%;font-size:3rem;transition: none;">⚽</div>
                </div>
                <p>🏆 Счёт: <span id="bbScore">0</span></p>
                <p style="font-size:0.8rem;">Кликай на поле, чтобы мяч полетел. Двигай питомца (⬅️ ➡️) чтобы отбить мяч в кольцо.</p>
                <button id="bbClose" class="btn-secondary">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Управление
        document.addEventListener('keydown', function movePet(e) {
            if (!self.active) return;
            const pet = document.getElementById('bbPet');
            if (!pet) return;
            let left = parseInt(pet.style.left);
            if (e.key === 'ArrowLeft') pet.style.left = Math.max(10, left - 20) + 'px';
            if (e.key === 'ArrowRight') pet.style.left = Math.min(440, left + 20) + 'px';
        });
        
        document.getElementById('basketballArea').onclick = (e) => {
            if (!self.active || self.isJumping) return;
            const rect = document.getElementById('basketballArea').getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            self.ballX = Math.max(20, Math.min(480, mouseX));
            self.ballY = 300;
            self.velocityX = (self.ballX - 250) * 0.1;
            self.velocityY = -9;
            self.isJumping = true;
        };
        
        // Игровой цикл
        const loop = setInterval(() => {
            if (!self.active) { clearInterval(loop); return; }
            const ball = document.getElementById('bbBall');
            const pet = document.getElementById('bbPet');
            if (!ball || !pet) { clearInterval(loop); return; }
            
            self.velocityY += self.gravity;
            self.ballY += self.velocityY;
            self.ballX += self.velocityX;
            self.velocityX *= 0.99;
            
            // Отскок от пола
            if (self.ballY >= 350) {
                self.ballY = 345;
                self.velocityY *= -0.6;
                self.isJumping = false;
            }
            
            // Отскок от питомца
            const petX = parseInt(pet.style.left) || 225;
            if (self.ballX > petX - 20 && self.ballX < petX + 50 && self.ballY > 280 && self.ballY < 340 && self.velocityY > 0) {
                self.velocityY = -8;
                self.velocityX += (self.ballX - petX - 25) * 0.15;
                self.isJumping = false;
            }
            
            // Гол
            if (self.ballY < 60 && self.ballX > 380 && self.ballX < 450 && self.velocityY < 0) {
                self.score++;
                document.getElementById('bbScore').textContent = self.score;
                self.ballY = 300;
                self.velocityY = 0;
                self.velocityX = 0;
                self.isJumping = false;
            }
            
            ball.style.top = self.ballY + 'px';
            ball.style.left = self.ballX + 'px';
        }, 20);
        
        document.getElementById('bbClose').onclick = () => { self.active = false; modal.remove(); };
        modal.addEventListener('click', (e) => { if (e.target === modal) { self.active = false; modal.remove(); } });
    }
};
