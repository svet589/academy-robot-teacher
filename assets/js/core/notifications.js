// ==================== УВЕДОМЛЕНИЯ ====================
import { EventBus } from './state.js';

let notificationContainer = null;
let activeNotifications = [];

export function initNotifications() {
    notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    EventBus.on('notification:show', (data) => showNotification(data.text, data.type, data.duration));
    EventBus.on('notification:success', (text) => showNotification(text, 'success'));
    EventBus.on('notification:error', (text) => showNotification(text, 'error'));
    EventBus.on('notification:warning', (text) => showNotification(text, 'warning'));
    EventBus.on('notification:info', (text) => showNotification(text, 'info'));
}

export function showNotification(text, type = 'success', duration = 3000) {
    if (!notificationContainer) initNotifications();
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || '📢'}</span>
        <span class="notification-text">${text}</span>
        <button class="notification-close">×</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Анимация появления
    requestAnimationFrame(() => notification.classList.add('show'));
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.onclick = () => hideNotification(notification);
    
    const timeout = setTimeout(() => hideNotification(notification), duration);
    
    notification.dataset.timeout = timeout;
    activeNotifications.push(notification);
}

export function hideNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    clearTimeout(parseInt(notification.dataset.timeout));
    notification.classList.remove('show');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
        activeNotifications = activeNotifications.filter(n => n !== notification);
    }, 300);
}

export function hideAllNotifications() {
    activeNotifications.forEach(n => {
        clearTimeout(parseInt(n.dataset.timeout));
        n.remove();
    });
    activeNotifications = [];
}
