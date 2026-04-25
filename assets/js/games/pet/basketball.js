// ==================== 🏀 БАСКЕТБОЛ 2.0 (РИКОШЕТЫ) ====================
const BasketballGame = {
    active: false,
    score: 0,
    targetScore: 5,
    petPos: 50,
    ballX: 50,
    ballY: 10,
    ballVX: 1.5,
    ballVY: 1.2,
    gameLoop: null,
    hoopX: 75,
    hoopY: 15,

    start() {
        const self = this;
        this.active = true;
        this.score = 0;
        this.petPos = 50;
        this.ballX = 50;
        this.ballY = 10;
        this.ballVX = (Math.random() - 0.5) * 3;
        this.ballVY = 1.5;
        this.hoopX = 70 + Math.random() * 20;
        this.hoopY = 10 + Math.random() * 10;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card" style="max-width:480px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h3>🏀 Баскетбол 2.0</h3>
                    <span style="font-size:1.3rem;">🏀 <strong id="bb2Score">0</strong> / ${this.targetScore}</span>
                </div>
                <div id="bb2Court" style="position:relative;width:100%;height:350px;background:linear-gradient(180deg,#FFD54F 0%,#FF8F00 100%);border-radius:20px;overflow:hidden;border:4px solid #e65100;">
                    <!-- Кольцо -->
                    <div id="bb2Hoop" style="position:absolute;top:${this.hoopY}%;left:${this.hoopX}%;transform:translate(-50%,-50%);font-size:3.5rem;pointer-events:none;">⭕</div>
                    <!-- Мяч -->
                    <div id="bb2Ball" style="position:absolute;top:${this.ballY}%;left:${this.ballX}%;transform:translate(-50%,-50%);font-size:2.5rem;transition:none;">🏀</div>
                    <!-- Питомец -->
                    <div id="bb2Pet" style="position:absolute;bottom:10%;left:${this.petPos}%;transform:translateX(-50%);font-size:4rem;transition:left 0.05s;">
                        ${AppState.pet?.emoji || '🐱'}
                    </div>
                </div>
                <div style="display:flex;gap:15px;justify-content:center;margin-top:15px;">
                    <button id="bb2Left" style="font-size:2rem;padding:15px 30px;">⬅️</button>
                    <button id="bb2Right" style="font-size:2rem;padding:15px 30px;">➡️</button>
                </div>
                <p style="text-align:center;font-size:0.85rem;color:#888;margin-top:8px;">Двигай питомца, отбивай мяч и целься в кольцо ⭕!</p>
                <p style="text-align:center;font-size:0.8rem;color:#888;">⬅️➡️ на клавиатуре тоже работают!</p>
                <button id="bb2Close" class="close-btn" style="margin-top:10px;">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('bb2Close').onclick = () => {
            self.active = false;
            clearInterval(self.gameLoop);
            modal.remove();
        };
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                self.active = false;
                clearInterval(self.gameLoop);
                modal.remove();
            }
        });

        // Управление
        document.getElementById('bb2Left').onclick = () => {
            self.petPos = Math.max(10, self.petPos - 8);
            document.getElementById('bb2Pet').style.left = self.petPos + '%';
        };
        document.getElementById('bb2Right').onclick = () => {
            self.petPos = Math.min(90, self.petPos + 8);
            document.getElementById('bb2Pet').style.left = self.petPos + '%';
        };

        // Клавиатура
        document.addEventListener('keydown', function handler(e) {
            if (!self.active) { document.removeEventListener('keydown', handler); return; }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                self.petPos = Math.max(10, self.petPos - 8);
                document.getElementById('bb2Pet').style.left = self.petPos + '%';
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                self.petPos = Math.min(90, self.petPos + 8);
                document.getElementById('bb2Pet').style.left = self.petPos + '%';
            }
        });

        this.startGameLoop(modal);
    },

    startGameLoop(modal) {
        const self = this;
        this.gameLoop = setInterval(() => {
            if (!self.active) { clearInterval(self.gameLoop); return; }

            // Движение мяча
            self.ballX += self.ballVX;
            self.ballY += self.ballVY;

            // Гравитация
            self.ballVY += 0.15;

            // Рикошет от стен
            if (self.ballX <= 3 || self.ballX >= 97) {
                self.ballVX *= -1;
                self.ballX = Math.max(3, Math.min(97, self.ballX));
                if (typeof playSound === 'function') playSound('click');
            }
            if (self.ballY <= 3) {
                self.ballVY = Math.abs(self.ballVY);
                self.ballY = 3;
            }

            // Отбивание от питомца
            const petLeft = self.petPos - 8;
            const petRight = self.petPos + 8;
            const petTop = 78;
            const petBottom = 92;

            if (self.ballX >= petLeft && self.ballX <= petRight &&
                self.ballY >= petTop && self.ballY <= petBottom && self.ballVY > 0) {
                // Отскок от питомца
                self.ballVY = -Math.abs(self.ballVY) - 2;
                self.ballVX += (Math.random() - 0.5) * 4;
                self.ballY = petTop - 1;
                if (typeof playSound === 'function') playSound('correct');
                if (typeof showNotification === 'function') showNotification('💥 Отбил!', 'success');
            }

            // Проверка попадания в кольцо
            const hoopX = self.hoopX;
            const hoopY = self.hoopY;
            if (Math.abs(self.ballX - hoopX) < 6 && Math.abs(self.ballY - hoopY) < 6 && self.ballVY < 0) {
                self.score++;
                document.getElementById('bb2Score').textContent = self.score;
                if (typeof playSound === 'function') playSound('achievement');
                if (typeof showNotification === 'function') showNotification('🏀 ГОООЛ!', 'success');
                if (typeof showConfetti === 'function') showConfetti('success');

                if (self.score >= self.targetScore) {
                    self.active = false;
                    clearInterval(self.gameLoop);
                    if (typeof updateCoins === 'function') updateCoins(30);
                    if (typeof updatePetHappiness === 'function') updatePetHappiness(20);
                    AppState.totalGames++;
                    if (AppState.pet) AppState.pet.stats.timesPlayed = (AppState.pet.stats.timesPlayed || 0) + 1;
                    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                    if (typeof showNotification === 'function') showNotification('🎉 Победа! +30 🪙', 'success');
                    if (typeof showConfetti === 'function') showConfetti('achievement');
                    if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'basketball', win: true });
                }

                // Сброс мяча
                self.ballX = 50;
                self.ballY = 10;
                self.ballVX = (Math.random() - 0.5) * 3;
                self.ballVY = 1.5;
                self.hoopX = 70 + Math.random() * 20;
                self.hoopY = 10 + Math.random() * 10;
                document.getElementById('bb2Hoop').style.top = self.hoopY + '%';
                document.getElementById('bb2Hoop').style.left = self.hoopX + '%';
            }

            // Мяч упал вниз
            if (self.ballY > 98) {
                self.active = false;
                clearInterval(self.gameLoop);
                if (typeof playSound === 'function') playSound('gameover');
                if (typeof showNotification === 'function') showNotification(`😢 Мяч упал! Счёт: ${self.score}`, 'error');
                if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'basketball', score: self.score });
            }

            // Обновление позиций
            const ball = document.getElementById('bb2Ball');
            if (ball) {
                ball.style.left = self.ballX + '%';
                ball.style.top = self.ballY + '%';
            }
        }, 25);
    }
};
