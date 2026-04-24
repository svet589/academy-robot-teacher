// ==================== ЗВУКИ ====================

let audioContext = null;

function initSounds() {
    // Создаём аудиоконтекст при первом взаимодействии (требование браузеров)
    document.addEventListener('click', () => {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('🔇 Аудио не поддерживается');
            }
        }
    }, { once: true });
    
    // Подписка на события
    EventBus.on('sound:play', (type) => playSound(type));
    EventBus.on('sound:correct', () => playSound('correct'));
    EventBus.on('sound:wrong', () => playSound('wrong'));
    EventBus.on('sound:coin', () => playSound('coin'));
    EventBus.on('sound:achievement', () => playSound('achievement'));
    EventBus.on('sound:click', () => playSound('click'));
    EventBus.on('sound:gameover', () => playSound('gameover'));
    EventBus.on('sound:drop', () => playSound('drop'));
    EventBus.on('sound:pop', () => playSound('pop'));
    EventBus.on('sound:win', () => playSound('win'));
}

function playSound(type) {
    if (!AppState.settings.soundEnabled) return;
    if (!audioContext) return;
    
    try {
        const now = audioContext.currentTime;
        
        switch (type) {
            case 'correct':
                playTone(880, 0.12, 'sine');
                setTimeout(() => playTone(1100, 0.1, 'sine'), 100);
                break;
            case 'wrong':
                playTone(220, 0.3, 'square');
                break;
            case 'coin':
                playTone(1200, 0.08, 'sine');
                setTimeout(() => playTone(1600, 0.06, 'sine'), 60);
                break;
            case 'achievement':
                playTone(800, 0.15, 'sine');
                setTimeout(() => playTone(1000, 0.15, 'sine'), 120);
                setTimeout(() => playTone(1200, 0.2, 'sine'), 240);
                break;
            case 'click':
                playTone(600, 0.04, 'sine');
                break;
            case 'gameover':
                playTone(400, 0.2, 'square');
                setTimeout(() => playTone(300, 0.2, 'square'), 180);
                setTimeout(() => playTone(200, 0.4, 'square'), 360);
                break;
            case 'drop':
                playTone(300, 0.1, 'sine');
                break;
            case 'pop':
                playTone(1000, 0.05, 'sine');
                break;
            case 'win':
                playTone(600, 0.15, 'sine');
                setTimeout(() => playTone(800, 0.15, 'sine'), 120);
                setTimeout(() => playTone(1000, 0.15, 'sine'), 240);
                setTimeout(() => playTone(1200, 0.3, 'sine'), 360);
                break;
            default:
                playTone(440, 0.1, 'sine');
        }
    } catch (e) {
        // Игнорируем ошибки аудио
    }
}

function playTone(frequency, duration, type = 'sine') {
    if (!audioContext) return;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.15, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);
}

// ==================== ОЗВУЧКА РОБОТА ====================
function speak(text) {
    if (!AppState.settings.voiceEnabled) return;
    if (!window.speechSynthesis) return;
    
    try {
        // Очищаем очередь
        speechSynthesis.cancel();
        
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';
        utter.rate = 0.9;
        utter.pitch = 1.2;
        utter.volume = 0.8;
        
        // Выбираем русский голос
        const voices = speechSynthesis.getVoices();
        const russianVoice = voices.find(v => v.lang.startsWith('ru'));
        if (russianVoice) utter.voice = russianVoice;
        
        speechSynthesis.speak(utter);
    } catch (e) {
        // Игнорируем ошибки синтеза речи
    }
}

// Предзагрузка голосов
if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}
