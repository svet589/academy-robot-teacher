import { EventBus } from './state.js';

// ==================== УВЕДОМЛЕНИЯ ====================
let notificationContainer = null;
let activeNotifications = [];

export function initNotifications() {
    notificationContainer = document.getElementById('notification-container');
    
    // Подписка на события
    EventBus.on('notification:show', showNotification);
    EventBus.on('notification:success', (text) => showNotification(text, 'success'));
    EventBus.on('notification:error', (text) => showNotification(text, 'error'));
    EventBus.on('notification:warning', (text) => showNotification(text, 'warning'));
    EventBus.on('notification:info', (text) => showNotification(text, 'info'));
}

export function showNotification(text, type = 'success', duration = 3000) {
    if (!notificationContainer) {
        notificationContainer = document.getElementById('notification-container');
    }
    
    const id = Date.now() + Math.random();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.dataset.id = id;
    
    // Иконка в зависимости от типа
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || '📢'}</span>
        <span class="notification-text">${text}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Автоматическое скрытие
    const timeout = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Сохраняем для возможной отмены
    activeNotifications.push({ id, element: notification, timeout });
    
    return id;
}

export function hideNotification(id) {
    const notification = activeNotifications.find(n => n.id === id);
    if (notification) {
        clearTimeout(notification.timeout);
        notification.element.classList.remove('show');
        setTimeout(() => notification.element.remove(), 300);
        activeNotifications = activeNotifications.filter(n => n.id !== id);
    }
}

export function hideAllNotifications() {
    activeNotifications.forEach(n => {
        clearTimeout(n.timeout);
        n.element.remove();
    });
    activeNotifications = [];
}

// Экспорт для глобального использования
window.showNotification = (text, type) => {
    EventBus.emit('notification:show', { text, type });
};
