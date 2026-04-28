// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(text, isGood = true) {
    const n = document.getElementById('notification');
    if (!n) return;
    n.textContent = text;
    n.style.background = isGood ? '#d4edc9' : '#ffe0b0';
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 2500);
}

// ==================== ЗВУКИ ====================
function playSound(type) {
    if (!musicEnabled) return;
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

// ==================== ГОЛОС ====================
function speak(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
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
        conf.style.position = 'fixed';
        conf.style.left = Math.random() * 100 + '%';
        conf.style.top = '-20px';
        conf.style.fontSize = (Math.random() * 20 + 15) + 'px';
        conf.style.pointerEvents = 'none';
        conf.style.zIndex = '9999';
        conf.style.transition = 'all 1s ease-out';
        document.body.appendChild(conf);
        setTimeout(() => { conf.style.top = '100vh'; conf.style.opacity = '0'; }, 10);
        setTimeout(() => conf.remove(), 1100);
    }
}

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let musicEnabled = true;
let voiceEnabled = true;
