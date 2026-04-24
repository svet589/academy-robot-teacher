// ==================== РОДИТЕЛЬСКИЙ КАБИНЕТ ====================
import { AppState, EventBus } from '../core/state.js';
import { Screens, navigateTo } from '../core/router.js';
import { saveState } from '../core/storage.js';
import { showNotification } from '../core/notifications.js';

const DEFAULT_PASSWORD = '0000';

export function verifyParentPassword(password) {
    return password === (AppState.parentControl.password || DEFAULT_PASSWORD);
}

export function changeParentPassword(oldPassword, newPassword) {
    if (verifyParentPassword(oldPassword)) {
        AppState.parentControl.password = newPassword;
        saveState(AppState.currentChild?.id);
        showNotification('🔐 Пароль изменён!', 'success');
        return true;
    }
    showNotification('❌ Неверный старый пароль', 'error');
    return false;
}

export function setDailyTimeLimit(minutes, password) {
    if (!verifyParentPassword(password)) {
        showNotification('❌ Неверный пароль', 'error');
        return false;
    }
    AppState.parentControl.dailyTimeLimit = minutes;
    saveState(AppState.currentChild?.id);
    showNotification(`⏰ Лимит: ${minutes} мин/день`, 'success');
    return true;
}

export function restrictGame(gameId, restricted, password) {
    if (!verifyParentPassword(password)) return false;
    if (restricted) {
        if (!AppState.parentControl.restrictedGames.includes(gameId)) {
            AppState.parentControl.restrictedGames.push(gameId);
        }
    } else {
        AppState.parentControl.restrictedGames = AppState.parentControl.restrictedGames.filter(id => id !== gameId);
    }
    saveState(AppState.currentChild?.id);
    return true;
}

export function toggleShop(enabled, password) {
    if (!verifyParentPassword(password)) return false;
    AppState.parentControl.shopEnabled = enabled;
    saveState(AppState.currentChild?.id);
    return true;
}

export function getChildStats() {
    const progress = AppState.progress || {};
    return {
        totalSolved: AppState.totalSolved,
        coins: AppState.coins,
        streak: AppState.streak,
        totalGames: AppState.totalGames,
        timePlayedToday: AppState.parentControl.timePlayedToday,
        dailyLimit: AppState.parentControl.dailyTimeLimit,
        achievements: AppState.achievements.length,
        progress: {
            math: Object.values(progress.math?.topics || {}).filter(t => t.completed).length,
            russian: Object.values(progress.russian?.topics || {}).filter(t => t.completed).length,
            english: Object.values(progress.english?.topics || {}).filter(t => t.completed).length,
            world: Object.values(progress.world?.topics || {}).filter(t => t.completed).length
        }
    };
}

export function renderParentCabinet(app) {
    const stats = getChildStats();
    const pc = AppState.parentControl;

    app.innerHTML = `
        <div class="card">
            <div class="screen-header">
                <button class="back-btn" id="backFromParentBtn">↩️ Назад</button>
                <h2>👨‍👩‍👧 Родительский кабинет</h2>
                <div></div>
            </div>
            
            <div id="parentLoginArea">
                <p style="text-align:center;">Введите мастер-пароль</p>
                <input type="password" id="parentPasswordInput" placeholder="Пароль" style="width:100%;padding:15px;border-radius:40px;text-align:center;">
                <button id="parentLoginBtn" style="margin-top:15px;">🔓 Войти</button>
                <p style="text-align:center;color:#888;margin-top:10px;">По умолчанию: 0000</p>
            </div>
            
            <div id="parentPanel" style="display:none;">
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-number">${stats.totalSolved}</div><div>📚 Решено</div></div>
                    <div class="stat-card"><div class="stat-number">${stats.coins}</div><div>🪙 Монет</div></div>
                    <div class="stat-card"><div class="stat-number">${stats.streak}</div><div>🔥 Дней</div></div>
                    <div class="stat-card"><div class="stat-number">${stats.totalGames}</div><div>🎮 Игр</div></div>
                </div>
                
                <h3>📊 Прогресс</h3>
                ${['📐 Математика','📖 Русский','🇬🇧 Английский','🌍 Окр. мир'].map((name, i) => {
                    const subj = ['math','russian','english','world'][i];
                    return `<div class="progress-item"><span>${name}</span><div class="progress-bar"><div class="progress-fill" style="width:${(stats.progress[subj]/25)*100}%"></div></div><span>${stats.progress[subj]}/25</span></div>`;
                }).join('')}
                
                <h3>⏰ Контроль времени</h3>
                <p>Сегодня: <strong>${stats.timePlayedToday}</strong> из <strong>${stats.dailyLimit}</strong> мин</p>
                <div style="display:flex;gap:10px;">
                    <input type="number" id="timeLimitInput" value="${stats.dailyLimit}" min="0" max="240" style="flex:1;padding:10px;border-radius:30px;">
                    <button id="setTimeLimitBtn">Установить</button>
                </div>
                
                <h3>🎮 Ограничение игр</h3>
                ${['maze','word','checkers','ticTac','memory','battleship'].map(g => `
                    <label style="display:flex;align-items:center;gap:10px;padding:5px;">
                        <input type="checkbox" ${!pc.restrictedGames.includes(g) ? 'checked' : ''} data-game="${g}">
                        <span>${g}</span>
                    </label>
                `).join('')}
                
                <h3>🔐 Сменить пароль</h3>
                <input type="password" id="oldPassword" placeholder="Старый пароль" style="width:100%;padding:10px;border-radius:30px;margin-bottom:5px;">
                <input type="password" id="newPassword" placeholder="Новый пароль" style="width:100%;padding:10px;border-radius:30px;margin-bottom:10px;">
                <button id="changePasswordBtn">Сменить</button>
                
                <button id="parentLogoutBtn" class="btn-secondary" style="margin-top:20px;">🚪 Выйти</button>
            </div>
        </div>
    `;

    document.getElementById('backFromParentBtn').onclick = () => navigateTo(Screens.MAIN);
    
    document.getElementById('parentLoginBtn').onclick = () => {
        if (verifyParentPassword(document.getElementById('parentPasswordInput').value)) {
            document.getElementById('parentLoginArea').style.display = 'none';
            document.getElementById('parentPanel').style.display = 'block';
        } else showNotification('❌ Неверный пароль', 'error');
    };
    
    document.getElementById('setTimeLimitBtn').onclick = () => {
        setDailyTimeLimit(parseInt(document.getElementById('timeLimitInput').value), document.getElementById('parentPasswordInput').value);
    };
    
    document.getElementById('changePasswordBtn').onclick = () => {
        changeParentPassword(document.getElementById('oldPassword').value, document.getElementById('newPassword').value);
    };
    
    document.getElementById('parentLogoutBtn').onclick = () => {
        document.getElementById('parentLoginArea').style.display = 'block';
        document.getElementById('parentPanel').style.display = 'none';
    };
    
    document.querySelectorAll('#parentPanel input[type="checkbox"]').forEach(cb => {
        cb.onchange = (e) => {
            restrictGame(cb.dataset.game, !e.target.checked, document.getElementById('parentPasswordInput').value);
        };
    });
}
