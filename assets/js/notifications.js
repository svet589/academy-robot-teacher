// ==================== УВЕДОМЛЕНИЯ + КОНФЕТТИ ====================

let notificationContainer = null;
let activeNotifications = [];

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function initNotifications() {
    notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Подписка на события
    EventBus.on('notification:show', (data) => showNotification(data.text, data.type, data.duration));
    EventBus.on('notification:success', (text) => showNotification(text, 'success'));
    EventBus.on('notification:error', (text) => showNotification(text, 'error'));
    EventBus.on('notification:warning', (text) => showNotification(text, 'warning'));
    EventBus.on('notification:info', (text) => showNotification(text, 'info'));
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(text, type = 'success', duration = 3000) {
    if (!notificationContainer) initNotifications();
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const colors = {
        success: { bg: '#d4edc9', border: '#4caf50', text: '#2d4059' },
        error: { bg: '#ffe0b0', border: '#e74c3c', text: '#2d4059' },
        warning: { bg: '#fff3e0', border: '#ff9800', text: '#2d4059' },
        info: { bg: '#e3f2fd', border: '#2196f3', text: '#2d4059' }
    };
    
    const color = colors[type] || colors.success;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${color.bg};
        border: 3px solid ${color.border};
        border-radius: 50px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        margin-bottom: 8px;
        color: ${color.text};
        font-weight: bold;
        font-family: 'Comic Neue', 'Segoe UI', Roboto, cursive, sans-serif;
    `;
    
    notification.innerHTML = `
        <span class="notification-icon" style="font-size: 1.5rem;">${icons[type] || '📢'}</span>
        <span class="notification-text" style="flex: 1;">${text}</span>
        <button class="notification-close" style="
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 5px;
            color: inherit;
            opacity: 0.6;
        ">×</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.onclick = () => hideNotification(notification);
    
    // Автоматическое скрытие
    const timeout = setTimeout(() => hideNotification(notification), duration);
    notification.dataset.timeout = timeout;
    
    activeNotifications.push(notification);
}

function hideNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    clearTimeout(parseInt(notification.dataset.timeout));
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
        activeNotifications = activeNotifications.filter(n => n !== notification);
    }, 300);
}

function hideAllNotifications() {
    activeNotifications.forEach(n => {
        clearTimeout(parseInt(n.dataset.timeout));
        n.remove();
    });
    activeNotifications = [];
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
        const confetti = document.createElement('div');
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -30px;
            font-size: ${Math.random() * 25 + 15}px;
            pointer-events: none;
            z-index: 9999;
            transition: all ${Math.random() * 1 + 0.8}s ease-out;
            opacity: 1;
        `;
        document.body.appendChild(confetti);
        
        requestAnimationFrame(() => {
            confetti.style.top = `${100 + Math.random() * 20}vh`;
            confetti.style.left = `${parseFloat(confetti.style.left) + (Math.random() - 0.5) * 30}%`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (confetti.parentNode) confetti.remove();
        }, 1500);
    }
    
    // Звук
    if (typeof playSound === 'function') {
        playSound(type === 'achievement' ? 'achievement' : 'coin');
    }
}

// ==================== ВСПЛЫВАШКА ДОСТИЖЕНИЯ ====================
function showAchievementPopup(achievement) {
    const container = document.getElementById('modal-container') || document.body;
    
    const popup = document.createElement('div');
    popup.className = 'achievement-popup-overlay';
    popup.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    popup.innerHTML = `
        <div class="achievement-popup" style="
            background: linear-gradient(135deg, #ffd700, #ffb347);
            border-radius: 30px;
            padding: 30px;
            text-align: center;
            max-width: 350px;
            width: 90%;
            border: 5px solid #ff8c00;
            animation: achievementBounce 0.5s ease;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
            <div style="font-size: 5rem; margin-bottom: 10px;">🏆</div>
            <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 5px;">${achievement.name}</div>
            <div style="font-size: 1rem; margin-bottom: 10px; color: #555;">${achievement.desc}</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: #b8860b; margin-bottom: 20px;">+${achievement.reward} 🪙</div>
            <button class="achievement-popup-btn" style="
                background: #fff;
                border: none;
                border-radius: 50px;
                padding: 12px 30px;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 0 #ddd;
            ">🎉 Ура!</button>
        </div>
    `;
    
    container.appendChild(popup);
    
    const btn = popup.querySelector('.achievement-popup-btn');
    btn.onclick = () => popup.remove();
    popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });
    
    // Автозакрытие
    setTimeout(() => {
        if (popup.parentNode) popup.remove();
    }, 5000);
    
    // Конфетти!
    showConfetti('achievement');
    
    // Звук
    if (typeof playSound === 'function') {
        playSound('achievement');
    }
}

// ==================== СТИЛИ ====================
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-container {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 10000;
        max-width: 400px;
        width: 90%;
    }
    
    @keyframes achievementBounce {
        0% { transform: scale(0); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @media (max-width: 480px) {
        .notification-container {
            bottom: 10px;
            width: 95%;
        }
        .notification {
            padding: 12px 15px;
            font-size: 0.9rem;
        }
    }
`;
document.head.appendChild(notificationStyles);
