// ==================== УВЕДОМЛЕНИЯ И ЗВУКИ ====================
let audioCtx = null;

function showNotification(text, isGood = true) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const n = document.createElement('div');
    n.textContent = text;
    n.style.cssText = `
        background: ${isGood ? '#d4edc9' : '#ffe0b0'};
        color: #2d4059;
        border: 2px solid ${isGood ? '#4caf50' : '#ff9800'};
        border-radius: 40px;
        padding: 12px 25px;
        margin: 5px;
        font-weight: bold;
        font-size: 1rem;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        display: inline-block;
    `;
    container.appendChild(n);
    setTimeout(() => {
        n.style.opacity = '0';
        n.style.transition = 'opacity 0.3s';
        setTimeout(() => n.remove(), 300);
    }, 2500);
}

function playSound(type) {
    if (!AppState.settings.soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        let freq = 440, duration = 0.1;
        if (type === 'correct') { freq = 880; duration = 0.15; }
        else if (type === 'wrong') { freq = 220; duration = 0.2; }
        else if (type === 'coin') { freq = 1200; duration = 0.1; }
        else if (type === 'achievement') { freq = 1500; duration = 0.3; }
        else if (type === 'move') { freq = 600; duration = 0.05; }
        else if (type === 'gameover') { freq = 100; duration = 0.5; }
        else if (type === 'click') { freq = 800; duration = 0.05; }
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    } catch(e) {}
}

function speak(text) {
    if (!AppState.settings.voiceEnabled || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ru';
    utter.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

// ==================== КОНФЕТТИ ====================
function showConfetti(type = 'success') {
    const emojis = {
        success: ['🎉', '✨', '⭐', '🌟', '🎊', '💫', '🌈', '🎯'],
        achievement: ['🏆', '👑', '💎', '🎖️', '🥇', '🌟', '✨', '🎉'],
        coins: ['🪙', '💰', '💵', '💎', '✨'],
        pet: ['❤️', '💕', '💖', '😻', '🐾'],
        star: ['⭐', '🌟', '💫', '✨'],
        fruit: ['🍎', '🌸', '🌺', '🌻', '🍀']
    };
    
    const confettiEmojis = emojis[type] || emojis.success;
    const count = type === 'achievement' ? 50 : 30;
    
    for (let i = 0; i < count; i++) {
        const conf = document.createElement('div');
        conf.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        conf.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -30px;
            font-size: ${Math.random() * 20 + 15}px;
            pointer-events: none;
            z-index: 9999;
            transition: all ${Math.random() * 1 + 1}s ease-out;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(conf);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance + window.innerHeight;
        
        setTimeout(() => {
            conf.style.top = dy + 'px';
            conf.style.left = (parseFloat(conf.style.left) + dx / window.innerWidth * 100) + '%';
            conf.style.opacity = '0';
        }, 10);
        
        setTimeout(() => conf.remove(), 2000);
    }
}

// ==================== СТИЛИ ДЛЯ УВЕДОМЛЕНИЙ ====================
const notifStyles = document.createElement('style');
notifStyles.textContent = `
    @keyframes slideIn {
        0% { transform: translateY(20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    #notification-container {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        z-index: 10000;
        pointer-events: none;
    }
`;
document.head.appendChild(notifStyles);
