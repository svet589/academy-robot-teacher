// ==================== ❓ СЛОВО (ВИСЕЛИЦА) ====================
import { AppState, EventBus, updateCoins } from '../../core/state.js';
import { showNotification } from '../../core/notifications.js';
import { saveState } from '../../core/storage.js';

let wordActive = false;
let secretWord = '';
let guessedLetters = [];
let wrongLetters = [];
let attemptsLeft = 7;
let modalContainer = null;
let gameModal = null;

const WORDS = [
    'ШКОЛА', 'КОСМОС', 'РОБОТ', 'ЯБЛОКО', 'СОЛНЦЕ', 'ПЛАНЕТА',
    'ГАЛАКТИКА', 'АТОМ', 'МОЛЕКУЛА', 'МАТЕМАТИКА', 'АЛФАВИТ',
    'БИБЛИОТЕКА', 'КАРАНДАШ', 'ТЕТРАДЬ', 'УЧИТЕЛЬ', 'ЗВЕЗДА'
];

// ==================== ЗАПУСК ИГРЫ ====================
export function startWord() {
    wordActive = true;
    secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    guessedLetters = [];
    wrongLetters = [];
    attemptsLeft = 7;
    
    createModal();
    renderGame();
    
    document.getElementById('wordModal').classList.add('active');
}

// ==================== СОЗДАНИЕ МОДАЛЬНОГО ОКНА ====================
function createModal() {
    modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = 'wordModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px;">
            <div class="modal-title">❓ Отгадай слово</div>
            <div class="game-container">
                <div id="wordDisplay" class="word-display"></div>
                <div id="wrongLetters" class="wrong-letters"></div>
                <div id="attemptsDisplay" class="attempts-display"></div>
                
                <div class="letter-buttons" id="letterButtons"></div>
                
                <div style="margin-top: 20px;">
                    <input type="text" id="wordGuessInput" placeholder="Введи слово целиком" maxlength="20" style="width: 100%; padding: 12px; border-radius: 30px; border: 3px solid var(--border); text-align: center; text-transform: uppercase;">
                    <button id="guessWordBtn" style="margin-top: 10px;">✅ Проверить слово</button>
                </div>
            </div>
            <button class="close-btn" id="closeWordBtn" style="margin-top: 15px;">Закрыть</button>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    gameModal = modal;
    
    document.getElementById('closeWordBtn').onclick = closeGame;
    document.getElementById('guessWordBtn').onclick = guessWholeWord;
    
    // Ввод с клавиатуры
    document.addEventListener('keydown', handleKeydown);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGame();
    });
}

// ==================== УПРАВЛЕНИЕ С КЛАВИАТУРЫ ====================
function handleKeydown(e) {
    if (!wordActive) return;
    
    const key = e.key.toUpperCase();
    if (/^[А-ЯЁ]$/.test(key)) {
        e.preventDefault();
        guessLetter(key);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        guessWholeWord();
    }
}

// ==================== ОТРИСОВКА ====================
function renderGame() {
    // Слово
    const display = secretWord.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
    document.getElementById('wordDisplay').innerHTML = `<span style="font-size: 2.5rem; letter-spacing: 10px;">${display}</span>`;
    
    // Неправильные буквы
    document.getElementById('wrongLetters').innerHTML = `
        <p>❌ Ошибки: ${wrongLetters.join(', ') || '—'}</p>
    `;
    
    // Попытки
    const hearts = '❤️'.repeat(attemptsLeft) + '🩶'.repeat(7 - attemptsLeft);
    document.getElementById('attemptsDisplay').innerHTML = `
        <p>${hearts} (${attemptsLeft})</p>
    `;
    
    // Кнопки букв
    renderLetterButtons();
}

// ==================== КНОПКИ БУКВ ====================
function renderLetterButtons() {
    const container = document.getElementById('letterButtons');
    const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
    
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin: 15px 0;">';
    for (let letter of letters) {
        const used = guessedLetters.includes(letter) || wrongLetters.includes(letter);
        html += `<button class="letter-btn" data-letter="${letter}" ${used ? 'disabled' : ''} style="width: 40px; height: 40px; padding: 0;">${letter}</button>`;
    }
    html += '</div>';
    
    container.innerHTML = html;
    
    container.querySelectorAll('.letter-btn').forEach(btn => {
        btn.onclick = () => guessLetter(btn.dataset.letter);
    });
}

// ==================== УГАДАТЬ БУКВУ ====================
function guessLetter(letter) {
    if (!wordActive) return;
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) return;
    
    if (secretWord.includes(letter)) {
        guessedLetters.push(letter);
        showNotification(`✅ Есть буква "${letter}"!`, 'success');
        
        // Проверка победы
        const allGuessed = secretWord.split('').every(l => guessedLetters.includes(l));
        if (allGuessed) {
            winGame();
            return;
        }
    } else {
        wrongLetters.push(letter);
        attemptsLeft--;
        showNotification(`❌ Буквы "${letter}" нет!`, 'error');
        
        if (attemptsLeft <= 0) {
            loseGame();
            return;
        }
    }
    
    renderGame();
}

// ==================== УГАДАТЬ СЛОВО ЦЕЛИКОМ ====================
function guessWholeWord() {
    if (!wordActive) return;
    
    const input = document.getElementById('wordGuessInput');
    const guess = input.value.trim().toUpperCase();
    
    if (!guess) {
        showNotification('Введи слово!', 'warning');
        return;
    }
    
    if (guess === secretWord) {
        winGame();
    } else {
        attemptsLeft = Math.max(0, attemptsLeft - 2);
        showNotification(`❌ Неправильно! -2 попытки`, 'error');
        input.value = '';
        
        if (attemptsLeft <= 0) {
            loseGame();
        } else {
            renderGame();
        }
    }
}

// ==================== ПОБЕДА ====================
function winGame() {
    wordActive = false;
    
    const reward = 30;
    updateCoins(reward);
    AppState.totalGames++;
    
    if (!AppState.achievements) AppState.achievements = [];
    if (!AppState.achievements.includes('word_master')) {
        AppState.achievements.push('word_master');
        showNotification('🏆 Достижение: Словесник!', 'success');
    }
    
    saveState();
    
    showNotification(`🎉 Слово отгадано! +${reward} 🪙`, 'success');
    EventBus.emit('game:ended', { game: 'word', win: true, reward });
    
    closeGame();
}

// ==================== ПРОИГРЫШ ====================
function loseGame() {
    wordActive = false;
    
    showNotification(`😢 Ты проиграл. Слово: ${secretWord}`, 'error');
    EventBus.emit('game:ended', { game: 'word', win: false });
    
    setTimeout(closeGame, 2000);
}

// ==================== ЗАКРЫТИЕ ====================
function closeGame() {
    wordActive = false;
    document.removeEventListener('keydown', handleKeydown);
    
    if (gameModal) {
        gameModal.classList.remove('active');
        setTimeout(() => gameModal.remove(), 300);
        gameModal = null;
    }
}

// ==================== СТИЛИ ====================
const style = document.createElement('style');
style.textContent = `
    .word-display {
        background: #fff3cd;
        border-radius: 20px;
        padding: 20px;
        text-align: center;
        margin-bottom: 15px;
    }
    .wrong-letters {
        background: #ffe0b0;
        border-radius: 15px;
        padding: 10px;
        text-align: center;
        margin-bottom: 10px;
    }
    .attempts-display {
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    .letter-btn {
        background: #f9d342;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        box-shadow: 0 3px 0 #b47c2e;
        cursor: pointer;
        transition: 0.07s;
    }
    .letter-btn:active {
        transform: translateY(2px);
        box-shadow: 0 1px 0 #b47c2e;
    }
    .letter-btn:disabled {
        opacity: 0.4;
        transform: none;
        box-shadow: 0 3px 0 #b47c2e;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// ==================== ЭКСПОРТ ====================
export default { start: startWord };
