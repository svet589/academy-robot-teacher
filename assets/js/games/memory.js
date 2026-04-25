// ==================== 🧠 НАЙДИ ПАРУ (С ЖИВОТНЫМИ) ====================
const MemoryGame = {
    active: false,
    cards: [],
    flipped: [],
    matched: 0,
    canFlip: false,
    totalPairs: 8,
    previewTime: 2000,

    // Большой список животных
    animalPool: [
        '🐵','🦁','🐯','🐱','🐶','🐺','🐻','🐻‍❄️','🐨','🐼','🐹','🐭','🐰','🦊','🐮','🐗',
        '🦄','🐴','🐲','🦎','🦖','🦕','🐢','🐊','🐍','🐸','🐇','🐈','🐈‍⬛','🦓','🐘','🦣',
        '🦏','🦛','🦘','🦒','🦥','🐿️','🐆','🐫','🐒','🦍','🦧','🦔','🦨','🦝','🐤','🦢',
        '🦆','🕊️','🦜','🦅','🦉','🐦','🐦‍⬛','🦃','🦚','🦩','🐋','🐬','🐟','🐠','🐙','🦀'
    ],

    start(container) {
        this.active = true;
        this.flipped = [];
        this.matched = 0;
        this.canFlip = false;
        this.cards = [];
        this.totalPairs = 8;

        // Выбираем случайные 8 пар
        const shuffledPool = [...this.animalPool].sort(() => Math.random() - 0.5);
        const selected = shuffledPool.slice(0, this.totalPairs);

        // Создаём пары
        selected.forEach(emoji => {
            this.cards.push({ emoji, matched: false });
            this.cards.push({ emoji, matched: false });
        });

        // Перемешиваем
        this.cards.sort(() => Math.random() - 0.5);

        this.render(container);

        // Показываем все карты на 2 секунды
        setTimeout(() => {
            if (this.active) {
                this.canFlip = true;
                this.flipped = [];
                this.render(container);
            }
        }, this.previewTime);
    },

    render(container) {
        const self = this;
        const showAll = !this.canFlip && this.flipped.length === 0 && this.matched === 0;

        let html = `
            <h3 style="text-align:center;">🧠 Найди пару</h3>
            <p style="text-align:center;color:${showAll?'#e74c3c':'#888'};font-weight:bold;">
                ${showAll ? '👀 Смотри и запоминай! (2 секунды)' : `Найдено: <strong>${this.matched}</strong> / ${this.totalPairs}`}
            </p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:400px;margin:20px auto;">`;

        this.cards.forEach((card, idx) => {
            const isFlipped = showAll || this.flipped.includes(idx) || card.matched;
            html += `<div data-idx="${idx}" style="aspect-ratio:1;background:${card.matched?'linear-gradient(135deg,#4caf50,#2e7d32)':isFlipped?'linear-gradient(135deg,#fff,#e0e0e0)':'linear-gradient(135deg,#ffb347,#ff8c00)'};border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;cursor:${card.matched?'default':'pointer'};box-shadow:0 5px 0 ${card.matched?'#1b5e20':'#b47c2e'};transition:all 0.2s;${isFlipped?'':'transform:translateY(-2px);'}">${isFlipped ? card.emoji : '❓'}</div>`;
        });

        html += `</div>`;
        html += `<div style="display:flex;gap:10px;"><button id="memReset" style="flex:1;">🔄 Новая игра</button><button onclick="navigateTo('arcadeHub')" style="flex:1;background:#b3c7e5;">↩️ В игротеку</button></div>`;
        container.innerHTML = html;

        document.getElementById('memReset').onclick = () => self.start(container);

        container.querySelectorAll('[data-idx]').forEach(card => {
            card.onclick = () => {
                if (!self.active || !self.canFlip) return;
                const idx = parseInt(card.dataset.idx);
                if (self.flipped.includes(idx) || self.cards[idx].matched || self.flipped.length >= 2) return;
                self.flipped.push(idx);
                self.render(container);
                if (self.flipped.length === 2) {
                    self.canFlip = false;
                    setTimeout(() => self.checkMatch(container), 600);
                }
            };
        });
    },

    checkMatch(container) {
        const [i1, i2] = this.flipped;
        const c1 = this.cards[i1], c2 = this.cards[i2];
        const match = c1.emoji === c2.emoji;

        if (match) {
            c1.matched = true;
            c2.matched = true;
            this.matched++;
            this.flipped = [];
            this.canFlip = true;
            if (typeof playSound === 'function') playSound('correct');
            if (typeof showNotification === 'function') showNotification('✅ Пара найдена!', 'success');

            if (this.matched === this.totalPairs) {
                this.active = false;
                if (typeof updateCoins === 'function') updateCoins(30);
                if (typeof updatePetHappiness === 'function') updatePetHappiness(20);
                AppState.totalGames++;
                AppState.gameStats.memoryCompleted = (AppState.gameStats.memoryCompleted || 0) + 1;
                if (!AppState.achievements.includes('memory_master')) {
                    AppState.achievements.push('memory_master');
                    if (typeof showNotification === 'function') showNotification('🏆 Достижение: Мастер памяти!', 'success');
                    if (typeof showConfetti === 'function') showConfetti('achievement');
                }
                if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
                if (typeof showNotification === 'function') showNotification('🎉 Все пары найдены! +30 🪙', 'success');
                if (typeof showConfetti === 'function') showConfetti('success');
                if (typeof EventBus !== 'undefined') EventBus.emit('game:ended', { game: 'memory', win: true });
            }
        } else {
            this.flipped = [];
            this.canFlip = true;
            if (typeof playSound === 'function') playSound('wrong');
        }
        this.render(container);
    }
};
