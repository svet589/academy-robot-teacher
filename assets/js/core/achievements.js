// ==================== ДОСТИЖЕНИЯ ====================
import { AppState, EventBus, getAchievements } from './state.js';
import { Screens, navigateTo } from './router.js';
import { showNotification } from './notifications.js';

export function initAchievements() {
    EventBus.on('achievement:unlocked', (ach) => {
        showAchievementPopup(ach);
    });
}

function showAchievementPopup(ach) {
    const container = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="achievement-popup">
            <div class="achievement-popup-icon">🏆</div>
            <div class="achievement-popup-title">${ach.name}</div>
            <div class="achievement-popup-desc">${ach.desc}</div>
            <div class="achievement-popup-reward">+${ach.reward} 🪙</div>
            <button class="achievement-popup-btn">🎉 Ура!</button>
        </div>
    `;
    
    container.appendChild(modal);
    
    const btn = modal.querySelector('.achievement-popup-btn');
    btn.onclick = () => modal.remove();
    
    // Автозакрытие через 5 секунд
    setTimeout(() => {
        if (modal.parentNode) modal.remove();
    }, 5000);
    
    // Звук
    EventBus.emit('sound:achievement');
}

export function renderAchievementsScreen(container) {
    const achievements = getAchievements();
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    
    container.innerHTML = `
        <div class="card">
            <div class="screen-header">
                <button class="back-btn" id="backFromAchievementsBtn">↩️ Назад</button>
                <h2>🏆 Достижения</h2>
                <div></div>
            </div>
            
            <div class="achievements-progress">
                <p>Разблокировано: <strong>${unlocked}</strong> из <strong>${total}</strong></p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(unlocked/total)*100}%"></div>
                </div>
            </div>
            
            <div class="achievements-grid">
                ${achievements.map(ach => `
                    <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${ach.unlocked ? '🏆' : '🔒'}</div>
                        <div class="achievement-name">${ach.name}</div>
                        <div class="achievement-desc">${ach.desc}</div>
                        <div class="achievement-reward">${ach.unlocked ? '✅' : `+${ach.reward}🪙`}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('backFromAchievementsBtn').onclick = () => {
        navigateTo(Screens.MAIN);
    };
}

// Стили для попапа достижений
const popupStyle = document.createElement('style');
popupStyle.textContent = `
    .achievement-popup {
        background: linear-gradient(135deg, #ffd700, #ffb347);
        border-radius: 30px;
        padding: 30px;
        text-align: center;
        max-width: 350px;
        width: 90%;
        border: 5px solid #ff8c00;
        animation: achievementBounce 0.5s ease;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    @keyframes achievementBounce {
        0% { transform: scale(0); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .achievement-popup-icon {
        font-size: 5rem;
        margin-bottom: 10px;
    }
    
    .achievement-popup-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 5px;
    }
    
    .achievement-popup-desc {
        font-size: 1rem;
        margin-bottom: 10px;
        color: #555;
    }
    
    .achievement-popup-reward {
        font-size: 1.5rem;
        font-weight: bold;
        color: #b8860b;
        margin-bottom: 20px;
    }
    
    .achievement-popup-btn {
        background: #fff;
        border: none;
        border-radius: 50px;
        padding: 12px 30px;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 0 #ddd;
    }
`;
document.head.appendChild(popupStyle);
