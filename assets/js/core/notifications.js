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
    
    EventBus.on('notification:show', (data) => showNotification(data.text, data.type));
    EventBus.on('notification:success', (text) => showNotification(text, 'success'));
    EventBus.on('notification:error', (text) => showNotification(text, 'error'));
    EventBus.on('notification:warning', (text) => showNotification(text, 'warning'));
    EventBus.on('notification:info', (text) => showNotification(text, 'info'));
}

export function showNotification(text, type = 'success', duration = 3000) {
    if (!notificationContainer) initNotifications();
    
    const id = Date.now() + Math.random();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.dataset.id = id;
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || '📢'}</span>
        <span class="notification-text">${text}</span>
        <button class="notification-close">×</button>
    `;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.onclick = () => hideNotification(id);
    
    const timeout = setTimeout(() => hideNotification(id), duration);
    
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

window.showNotification = (text, type) => EventBus.emit('notification:show', { text, type });
