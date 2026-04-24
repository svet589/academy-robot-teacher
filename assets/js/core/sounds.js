// ==================== ЗВУКИ ====================
import { AppState, EventBus } from './state.js';

let audioContext = null;

export function initSounds() {
    document.addEventListener('click', () => {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('🔇 Аудио не поддерживается');
            }
        }
    }, { once: true });
    
    EventBus.on('sound:play', (type) => playSound(type));
    EventBus.on('sound:correct', () => playSound('correct'));
    EventBus.on('sound:wrong', () => playSound('wrong'));
    EventBus.on('sound:coin', () => playSound('coin'));
    EventBus.on('sound:achievement', () => playSound('achievement'));
    EventBus.on('sound:click', () => playSound('click'));
    EventBus.on('sound:gameover', () => playSound('gameover'));
}

export function playSound(type) {
    if (!AppState.settings.soundEnabled) return;
    if (!audioContext) return;
    
    try {
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        const sounds = {
            correct: [880, 0.15],
            wrong: [220, 0.3],
            coin: [1200, 0.1],
            achievement: [1500, 0.4],
            click: [600, 0.05],
            gameover: [150, 0.5]
        };
        
        const [freq, duration] = sounds[type] || [440, 0.1];
        
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {}
}

export function speak(text) {
    if (!AppState.settings.voiceEnabled) return;
    if (!window.speechSynthesis) return;
    
    try {
        speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';
        utter.rate = 0.9;
        utter.pitch = 1.1;
        speechSynthesis.speak(utter);
    } catch (e) {}
}
