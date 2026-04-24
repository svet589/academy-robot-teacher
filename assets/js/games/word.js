// ==================== ❓ СЛОВО (ВИСЕЛИЦА) ====================
import { AppState, EventBus, updateCoins, updatePetHappiness } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

let wordActive = false, secretWord = '', guessedLetters = [], wrongLetters = [], attemptsLeft = 7;

const WORDS = ['ШКОЛА','КОСМОС','РОБОТ','ЯБЛОКО','СОЛНЦЕ','ПЛАНЕТА','ГАЛАКТИКА','АТОМ','МОЛЕКУЛА','МАТЕМАТИКА','АЛФАВИТ','БИБЛИОТЕКА','КАРАНДАШ','ТЕТРАДЬ','УЧИТЕЛЬ','ЗВЕЗДА','КОМПЬЮТЕР','ТЕЛЕФОН','ВЕЛОСИПЕД','САМОЛЁТ'];

export function renderScreen(container) {
    wordActive = true; secretWord = WORDS[Math.floor(Math.random() * WORDS.length)]; guessedLetters = []; wrongLetters = []; attemptsLeft = 7;
    renderGame(container);
}

function renderGame(container) {
    const display = secretWord.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' ');
    const hearts = '❤️'.repeat(attemptsLeft) + '🩶'.repeat(7 - attemptsLeft);
    
    let html = `
        <div style="background:#fff3cd;border-radius:20px;padding:20px;text-align:center;margin-bottom:15px;">
            <span style="font-size:2.5rem;letter-spacing:10px;">${display}</span>
        </div>
        <p style="text-align:center;">❌ Ошибки: ${wrongLetters.join(', ') || '—'}</p>
        <p style="text-align:center;font-size:1.5rem;">${hearts} (${attemptsLeft})</p>
        <div style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:15px 0;">
    `;
    
    'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('').forEach(letter => {
        const used = guessedLetters.includes(letter) || wrongLetters.includes(letter);
        html += `<button class="letter-btn" data-letter="${letter}" ${used ? 'disabled' : ''} style="width:40px;height:40px;padding:0;">${letter}</button>`;
    });
    
    html += `</div>
        <div style="margin-top:20px;display:flex;gap:10px;">
            <input type="text" id="wordGuessInput" placeholder="Введи слово целиком" maxlength="20" style="flex:1;padding:12px;border-radius:30px;border:3px solid #ffb347;text-align:center;text-transform:uppercase;">
            <button id="guessWordBtn">✅</button>
        </div>
        <button id="resetWordBtn" style="margin-top:15px;">🔄 Новая игра</button>
    `;
    
    container.innerHTML = html;
    
    container.querySelectorAll('.letter-btn').forEach(btn => {
        btn.onclick = () => guessLetter(btn.dataset.letter, container);
    });
    
    document.getElementById('guessWordBtn').onclick = () => {
        const guess = document.getElementById('wordGuessInput').value.trim().toUpperCase();
        if (guess === secretWord) { winGame(container); }
        else { attemptsLeft = Math.max(0, attemptsLeft - 2); showNotification(`❌ Неправильно! -2 попытки`, 'error'); document.getElementById('wordGuessInput').value = ''; if (attemptsLeft <= 0) loseGame(container); else renderGame(container); }
    };
    
    document.getElementById('resetWordBtn').onclick = () => { secretWord = WORDS[Math.floor(Math.random() * WORDS.length)]; guessedLetters = []; wrongLetters = []; attemptsLeft = 7; renderGame(container); };
    
    document.addEventListener('keydown', function handler(e) {
        if (!wordActive) { document.removeEventListener('keydown', handler); return; }
        const key = e.key.toUpperCase();
        if (/^[А-ЯЁ]$/.test(key)) { e.preventDefault(); guessLetter(key, container); }
        else if (e.key === 'Enter') { e.preventDefault(); document.getElementById('guessWordBtn').click(); }
    });
}

function guessLetter(letter, container) {
    if (!wordActive || guessedLetters.includes(letter) || wrongLetters.includes(letter)) return;
    if (secretWord.includes(letter)) { guessedLetters.push(letter); if (secretWord.split('').every(l => guessedLetters.includes(l))) { winGame(container); return; } }
    else { wrongLetters.push(letter); attemptsLeft--; if (attemptsLeft <= 0) { loseGame(container); return; } }
    renderGame(container);
}

function winGame(container) { wordActive = false; updateCoins(30); updatePetHappiness(15); AppState.totalGames++; if (!AppState.achievements.includes('word_master')) { AppState.achievements.push('word_master'); showNotification('🏆 Достижение: Словесник!', 'success'); } saveState(AppState.currentChild?.id); showNotification('🎉 Слово отгадано! +30 🪙', 'success'); EventBus.emit('game:ended', { game: 'word', win: true }); renderGame(container); }
function loseGame(container) { wordActive = false; showNotification(`😢 Слово: ${secretWord}`, 'error'); EventBus.emit('game:ended', { game: 'word', win: false }); renderGame(container); }

export default { start: () => { const c = document.createElement('div'); document.body.appendChild(c); renderScreen(c); } };
