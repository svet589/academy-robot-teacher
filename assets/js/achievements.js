// ==================== ДОСТИЖЕНИЯ ====================

// Список достижений уже в state.js (ACHIEVEMENTS_LIST)
// Здесь — логика отображения и всплывашек

function initAchievements() {
    // Подписка на открытие достижения
    EventBus.on('achievement:unlocked', (achievement) => {
        showAchievementUnlock(achievement);
    });
}

// ==================== ПОКАЗАТЬ ВСПЛЫВАШКУ ====================
function showAchievementUnlock(achievement) {
    // Конфетти
    if (typeof showConfetti === 'function') {
        showConfetti('achievement');
    }
    
    // Звук
    if (typeof playSound === 'function') {
        playSound('achievement');
    }
    
    // Всплывашка
    if (typeof showAchievementPopup === 'function') {
        showAchievementPopup(achievement);
        return;
    }
    
    // Если нет showAchievementPopup — создаём свою
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
    
    setTimeout(() => {
        if (popup.parentNode) popup.remove();
    }, 5000);
}

// ==================== ПОКАЗАТЬ ВСЕ ДОСТИЖЕНИЯ ====================
function showAllAchievements(container) {
    const achievements = typeof getAchievements === 'function' ? getAchievements() : [];
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    
    let html = `
        <div class="achievements-container">
            <div class="achievements-header">
                <p>Открыто: <strong>${unlocked}</strong> из <strong>${total}</strong></p>
                <div class="progress-bar" style="background:#ddd;border-radius:20px;height:15px;overflow:hidden;margin:10px 0;">
                    <div style="background:#4caf50;height:100%;width:${(unlocked/total)*100}%;transition:width 0.3s;"></div>
                </div>
            </div>
            <div class="achievements-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:15px;">
    `;
    
    achievements.forEach(ach => {
        html += `
            <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}" style="
                background: ${ach.unlocked ? 'linear-gradient(135deg, #ffe0b0, #ffd699)' : '#e0e0e0'};
                border-radius: 20px;
                padding: 20px;
                text-align: center;
                border: 3px solid ${ach.unlocked ? '#ffb347' : '#bdbdbd'};
                opacity: ${ach.unlocked ? '1' : '0.6'};
            ">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">${ach.unlocked ? '🏆' : '🔒'}</div>
                <div style="font-weight: bold; margin-bottom: 5px;">${ach.name}</div>
                <div style="font-size: 0.8rem; color: #888; margin-bottom: 10px;">${ach.desc}</div>
                <div style="font-weight: bold; color: #b57c1c;">${ach.unlocked ? '✅' : `+${ach.reward}🪙`}</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    if (container) {
        container.innerHTML = html;
    }
    
    return html;
}

// ==================== СТИЛИ ====================
const achievementStyles = document.createElement('style');
achievementStyles.textContent = `
    @keyframes achievementBounce {
        0% { transform: scale(0); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @media (max-width: 600px) {
        .achievements-grid {
            grid-template-columns: repeat(2, 1fr) !important;
        }
    }
    
    @media (max-width: 400px) {
        .achievements-grid {
            grid-template-columns: 1fr !important;
        }
    }
`;
document.head.appendChild(achievementStyles);
