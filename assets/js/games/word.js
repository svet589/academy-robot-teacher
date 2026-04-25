// ==================== ❓ СЛОВО (ВИСЕЛИЦА) ====================
const WordGame = {
    active: false,
    word: '',
    guessed: [],
    wrong: [],
    attempts: 7,
    words: ['ШКОЛА','КОСМОС','РОБОТ','ЯБЛОКО','СОЛНЦЕ','ПЛАНЕТА','ГАЛАКТИКА','АТОМ','МОЛЕКУЛА','МАТЕМАТИКА','АЛФАВИТ','БИБЛИОТЕКА','КАРАНДАШ','ТЕТРАДЬ','УЧИТЕЛЬ','ЗВЕЗДА','КОМПЬЮТЕР','ТЕЛЕФОН','ВЕЛОСИПЕД','САМОЛЁТ'],

    start(container) {
        this.active = true;
        this.word = this.words[Math.floor(Math.random() * this.words.length)];
        this.guessed = [];
        this.wrong = [];
        this.attempts = 7;
        this.render(container);
    },

    render(container) {
        const display = this.word.split('').map(l => this.guessed.includes(l) ? l : '_').join(' ');
        const hearts = '❤️'.repeat(Math.max(0, this.attempts)) + '🩶'.repeat(Math.max(0, 7 - this.attempts));
        const gameOver = this.attempts <= 0;
        const won = this.word.split('').every(l => this.guessed.includes(l));

        container.innerHTML = `
            <h3 style="text-align:center;">❓ Отгадай слово</h3>
            <div style="background:#fff3cd;border-radius:20px;padding:25px;text-align:center;margin:20px 0;">
                <span style="font-size:2.8rem;letter-spacing:12px;font-weight:bold;">${display}</span>
            </div>
            <p style="text-align:center;font-size:1.2rem;">${hearts} (Осталось: ${this.attempts})</p>
            <p style="text-align:center;color:#e74c3c;">Ошибки: ${this.wrong.join(', ') || '—'}</p>
            <div id="lettersRow" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:20px 0;"></div>
            <div style="display:flex;gap:10px;margin:15px 0;">
                <input type="text" id="wordGuessInput" placeholder="Введи слово целиком" maxlength="20" 
                       style="flex:1;padding:15px;border-radius:40px;border:3px solid #ffb347;text-align:center;text-transform:uppercase;font-size:1.2rem;">
                <button id="guessWordBtn" style="font-size:1.5rem;padding:15px 25px;">✅</button>
            </div>
            <button id="resetWordBtn" style="width:100%;margin-top:10px;">🔄 Новая игра</button>
            <button onclick="navigateTo('arcadeHub')" style="width:100%;margin-top:10px;background:#b3c7e5;">↩️ В игротеку</button>
        `;

        if (gameOver || won) {
            document.getElementById('wordGuessInput').disabled = true;
            document.getElementById('guessWordBtn').disabled = true;
        }

        const self = this;
        const lettersRow = document.getElementById('lettersRow');
        'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('').forEach(l => {
            const used = self.guessed.includes(l) || self.wrong.includes(l) || gameOver || won;
            const btn = document.createElement('button');
            btn.textContent = l;
            btn.disabled = used;
            btn.style.cssText = 'width:42px;height:42px;padding:0;font-weight:bold;';
            btn.onclick = () => self.guessLetter(l, container);
            lettersRow.appendChild(btn);
        });

        document.getElementById('guessWordBtn').onclick = () => {
            const guess = document.getElementById('wordGuessInput').value.trim().toUpperCase();
            if (!guess) return;
            if (guess === self.word) {
                self.win(container);
            } else {
                self.attempts = Math.max(0, self.attempts - 2);
                if (typeof showNotification === 'function') showNotification('❌ Неправильно! -2 попытки', 'error');
                document.getElementById('wordGuessInput').value = '';
                if (self.attempts <= 0) self.lose(container);
                else self.render(container);
            }
        };

        document.getElementById('resetWordBtn').onclick = () => self.start(container);

        document.addEventListener('keydown', function handler(e) {
            if (!self.active) { document.removeEventListener('keydown', handler); return; }
            const key = e.key.toUpperCase();
            if (/^[А-ЯЁ]$/.test(key)) { e.preventDefault(); self.guessLetter(key, container); }
            if (e.key === 'Enter') { e.preventDefault(); document.getElementById('guessWordBtn').click(); }
        });
    },

    guessLetter(l, container) {
        if (!this.active || this.guessed.includes(l) || this.wrong.includes(l)) return;
        if (this.word.includes(l)) {
            this.guessed.push(l);
            if (typeof showNotification === 'function') showNotification('✅ Есть такая буква!', 'success');
            if (this.word.split('').every(x => this.guessed.includes(x))) { this.win(container); return; }
        } else {
            this.wrong.push(l);
            this.attempts--;
            if (typeof showNotification === 'function') showNotification('❌ Нет такой буквы!', 'error');
            if (this.attempts <= 0) { this.lose(container); return; }
        }
        this.render(container);
    },

    win(container) {
        this.active = false;
        if (typeof updateCoins === 'function') updateCoins(30);
        if (typeof updatePetHappiness === 'function') updatePetHappiness(15);
        AppState.totalGames++;
        AppState.gameStats.wordWins = (AppState.gameStats.wordWins || 0) + 1;
        if (!AppState.achievements.includes('word_master')) {
            AppState.achievements.push('word_master');
            if (typeof showNotification === 'function') showNotification('🏆 Достижение: Словесник!', 'success');
            if (typeof showConfetti === 'function') showConfetti('achievement');
        }
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        if (typeof showNotification === 'function') showNotification('🎉 Слово отгадано! +30 🪙', 'success');
        if (typeof showConfetti === 'function') showConfetti('success');
        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'word', win: true });
        this.render(container);
    },

    lose(container) {
        this.active = false;
        if (typeof showNotification === 'function') showNotification(`😢 Слово: ${this.word}`, 'error');
        if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'word', win: false });
        this.render(container);
    }
};
