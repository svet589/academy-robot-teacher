// ==================== РОДИТЕЛЬСКИЙ КАБИНЕТ ====================

const DEFAULT_PASSWORD = '0000';

// ==================== ПРОВЕРКА ПАРОЛЯ ====================
function verifyParentPassword(password) {
    return password === (AppState.parentControl.password || DEFAULT_PASSWORD);
}

// ==================== СМЕНА ПАРОЛЯ ====================
function changeParentPassword(oldPassword, newPassword) {
    if (!verifyParentPassword(oldPassword)) {
        if (typeof showNotification === 'function') showNotification('❌ Неверный старый пароль', 'error');
        return false;
    }
    if (!newPassword || newPassword.length < 4) {
        if (typeof showNotification === 'function') showNotification('❌ Пароль должен быть не менее 4 символов', 'error');
        return false;
    }
    AppState.parentControl.password = newPassword;
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    if (typeof showNotification === 'function') showNotification('🔐 Пароль изменён!', 'success');
    return true;
}

// ==================== ВКЛЮЧЕНИЕ/ВЫКЛЮЧЕНИЕ КОНТРОЛЯ ====================
function toggleParentControl(enabled, password) {
    if (!verifyParentPassword(password)) {
        if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error');
        return false;
    }
    AppState.parentControl.enabled = enabled;
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    if (typeof showNotification === 'function') showNotification(enabled ? '🔒 Родительский контроль включён' : '🔓 Родительский контроль выключен', 'success');
    return true;
}

// ==================== ЛИМИТ ВРЕМЕНИ ====================
function setDailyTimeLimit(minutes, password) {
    if (!verifyParentPassword(password)) {
        if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error');
        return false;
    }
    if (minutes < 0 || minutes > 480) {
        if (typeof showNotification === 'function') showNotification('❌ Лимит должен быть от 0 до 480 минут', 'error');
        return false;
    }
    AppState.parentControl.dailyTimeLimit = minutes;
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    if (typeof showNotification === 'function') showNotification(`⏰ Лимит времени: ${minutes} минут в день`, 'success');
    EventBus.emit('timeLimit:changed', minutes);
    return true;
}

// ==================== ОГРАНИЧЕНИЕ ИГР ====================
function restrictGame(gameId, restricted, password) {
    if (!verifyParentPassword(password)) {
        if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error');
        return false;
    }
    if (restricted) {
        if (!AppState.parentControl.restrictedGames.includes(gameId)) {
            AppState.parentControl.restrictedGames.push(gameId);
        }
    } else {
        AppState.parentControl.restrictedGames = AppState.parentControl.restrictedGames.filter(id => id !== gameId);
    }
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    EventBus.emit('games:restrictionsUpdated', AppState.parentControl.restrictedGames);
    return true;
}

// ==================== КОНТРОЛЬ МАГАЗИНА ====================
function toggleShop(enabled, password) {
    if (!verifyParentPassword(password)) {
        if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error');
        return false;
    }
    AppState.parentControl.shopEnabled = enabled;
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    if (typeof showNotification === 'function') showNotification(enabled ? '🛒 Магазин включён' : '🚫 Магазин выключен', 'success');
    return true;
}

// ==================== СТАТИСТИКА РЕБЁНКА ====================
function getChildStats() {
    const progress = AppState.progress || {};
    
    // Подсчёт тем по предметам
    const mathCompleted = Object.values(progress.math?.topics || {}).filter(t => t.completed).length;
    const mathTotal = 25;
    const russianCompleted = Object.values(progress.russian?.topics || {}).filter(t => t.completed).length;
    const russianTotal = 23;
    const englishCompleted = Object.values(progress.english?.topics || {}).filter(t => t.completed).length;
    const englishTotal = 22;
    const worldCompleted = Object.values(progress.world?.topics || {}).filter(t => t.completed).length;
    const worldTotal = 22;
    
    // Звёзды
    let totalStars = 0;
    ['math', 'russian', 'english', 'world'].forEach(subj => {
        if (progress[subj]) {
            totalStars += Object.values(progress[subj].topics || {}).reduce((sum, t) => sum + (t.stars || 0), 0);
        }
    });
    
    return {
        name: AppState.currentChild?.name || 'Ученик',
        totalSolved: AppState.totalSolved,
        totalGames: AppState.totalGames,
        coins: AppState.coins,
        streak: AppState.streak,
        achievements: AppState.achievements.length,
        achievementsTotal: 50,
        stars: totalStars,
        perfectRounds: AppState.perfectRounds || 0,
        timePlayedToday: AppState.parentControl.timePlayedToday,
        dailyLimit: AppState.parentControl.dailyTimeLimit,
        controlEnabled: AppState.parentControl.enabled,
        shopEnabled: AppState.parentControl.shopEnabled,
        progress: {
            math: { completed: mathCompleted, total: mathTotal, percent: Math.round((mathCompleted / mathTotal) * 100) },
            russian: { completed: russianCompleted, total: russianTotal, percent: Math.round((russianCompleted / russianTotal) * 100) },
            english: { completed: englishCompleted, total: englishTotal, percent: Math.round((englishCompleted / englishTotal) * 100) },
            world: { completed: worldCompleted, total: worldTotal, percent: Math.round((worldCompleted / worldTotal) * 100) }
        },
        pet: {
            name: AppState.pet?.name || '—',
            type: AppState.pet?.type || '—',
            age: AppState.pet?.age || 0,
            hunger: AppState.pet?.hunger || 0,
            happiness: AppState.pet?.happiness || 0,
            energy: AppState.pet?.energy || 0
        },
        inventory: {
            skipTokens: AppState.inventory.skipTokens,
            reviveTokens: AppState.inventory.reviveTokens,
            robotSkins: AppState.inventory.robotSkins.length,
            accessories: AppState.inventory.accessories.length,
            food: AppState.inventory.food.length,
            ownedPets: AppState.ownedPets.length
        },
        album: AppState.album?.length || 0,
        restrictedGames: AppState.parentControl.restrictedGames || []
    };
}

// ==================== РЕНДЕР РОДИТЕЛЬСКОГО КАБИНЕТА ====================
function renderParentCabinet(app) {
    if (!app) return;
    
    const stats = getChildStats();
    const pc = AppState.parentControl;
    
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header">
                <button class="back-btn" onclick="navigateTo('apartment')">↩️ В квартиру</button>
                <h2>👨‍👩‍👧 РОДИТЕЛЬСКИЙ КАБИНЕТ</h2>
                <div></div>
            </div>
            
            <div id="parentLoginArea">
                <p style="text-align:center;margin-bottom:15px;">Введите мастер-пароль для доступа</p>
                <input type="password" id="parentPasswordInput" placeholder="Мастер-пароль" 
                       style="width:100%;padding:15px;border-radius:40px;border:3px solid #8B4513;text-align:center;font-size:1.2rem;margin-bottom:10px;">
                <button id="parentLoginBtn" style="width:100%;">🔓 Войти</button>
                <p style="text-align:center;color:#888;margin-top:10px;font-size:0.9rem;">По умолчанию: 0000</p>
            </div>
            
            <div id="parentPanel" style="display:none;">
                <!-- Статистика -->
                <h3>📊 Общая статистика</h3>
                <div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:15px 0;">
                    <div class="stat-card" style="background:#ffe0b0;border-radius:15px;padding:15px;text-align:center;">
                        <div style="font-size:2rem;font-weight:bold;color:var(--text-secondary);">${stats.totalSolved}</div>
                        <div>📚 Решено задач</div>
                    </div>
                    <div class="stat-card" style="background:#ffe0b0;border-radius:15px;padding:15px;text-align:center;">
                        <div style="font-size:2rem;font-weight:bold;color:var(--text-secondary);">${stats.totalGames}</div>
                        <div>🎮 Игр сыграно</div>
                    </div>
                    <div class="stat-card" style="background:#ffe0b0;border-radius:15px;padding:15px;text-align:center;">
                        <div style="font-size:2rem;font-weight:bold;color:var(--text-secondary);">${stats.coins}</div>
                        <div>🪙 Монет</div>
                    </div>
                    <div class="stat-card" style="background:#ffe0b0;border-radius:15px;padding:15px;text-align:center;">
                        <div style="font-size:2rem;font-weight:bold;color:var(--text-secondary);">${stats.streak}</div>
                        <div>🔥 Дней подряд</div>
                    </div>
                    <div class="stat-card" style="background:#ffe0b0;border-radius:15px;padding:15px;text-align:center;">
                        <div style="font-size:2rem;font-weight:bold;color:var(--text-secondary);">${stats.achievements}/${stats.achievementsTotal}</div>
                        <div>🏆 Достижений</div>
                    </div>
                    <div class="stat-card" style="background:#ffe0b0;border-radius:15px;padding:15px;text-align:center;">
                        <div style="font-size:2rem;font-weight:bold;color:var(--text-secondary);">${stats.stars}</div>
                        <div>⭐ Звёзд</div>
                    </div>
                </div>
                
                <!-- Прогресс по предметам -->
                <h3>📖 Прогресс по предметам</h3>
                <div style="margin:15px 0;">
                    ${[
                        { name: '📐 Математика', data: stats.progress.math },
                        { name: '📖 Русский язык', data: stats.progress.russian },
                        { name: '🇬🇧 Английский', data: stats.progress.english },
                        { name: '🌍 Окружающий мир', data: stats.progress.world }
                    ].map(subj => `
                        <div style="display:flex;align-items:center;gap:10px;margin:10px 0;">
                            <span style="width:150px;">${subj.name}</span>
                            <div class="progress-bar" style="flex:1;">
                                <div class="progress-fill" style="width:${subj.data.percent}%;background:${subj.data.percent >= 80 ? '#4caf50' : subj.data.percent >= 40 ? '#ff9800' : '#e74c3c'};"></div>
                            </div>
                            <span style="width:80px;text-align:right;">${subj.data.completed}/${subj.data.total}</span>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Питомец -->
                <h3>🐾 Питомец</h3>
                <div style="background:#ffe0b0;border-radius:15px;padding:15px;margin:15px 0;">
                    <p><strong>Имя:</strong> ${stats.pet.name} | <strong>Возраст:</strong> ${stats.pet.age} дн.</p>
                    <p>🍖 Голод: ${stats.pet.hunger}% | 😊 Счастье: ${stats.pet.happiness}% | ⚡ Энергия: ${stats.pet.energy}%</p>
                </div>
                
                <!-- Инвентарь -->
                <h3>📦 Инвентарь</h3>
                <div style="background:#ffe0b0;border-radius:15px;padding:15px;margin:15px 0;">
                    <p>🤖 Скинов робота: ${stats.inventory.robotSkins} | 🐾 Питомцев: ${stats.inventory.ownedPets}</p>
                    <p>🎩 Аксессуаров: ${stats.inventory.accessories} | 🍎 Еды: ${stats.inventory.food}</p>
                    <p>⏭️ Пропусков: ${stats.inventory.skipTokens} | ♻️ Воскрешений: ${stats.inventory.reviveTokens}</p>
                    <p>🖼️ Фото в альбоме: ${stats.album}</p>
                </div>
                
                <!-- Контроль времени -->
                <h3>⏰ Контроль времени</h3>
                <div style="background:#ffe0b0;border-radius:15px;padding:15px;margin:15px 0;">
                    <p>Сегодня сыграно: <strong>${stats.timePlayedToday}</strong> из <strong>${stats.dailyLimit}</strong> минут</p>
                    <label style="display:flex;align-items:center;gap:10px;">
                        <input type="checkbox" id="controlToggle" ${stats.controlEnabled ? 'checked' : ''}>
                        <span>Включить родительский контроль</span>
                    </label>
                    <div style="display:flex;gap:10px;margin-top:10px;">
                        <input type="number" id="timeLimitInput" value="${stats.dailyLimit}" min="0" max="480" 
                               style="flex:1;padding:10px;border-radius:30px;border:2px solid #d4a259;text-align:center;">
                        <button id="setTimeLimitBtn">Установить</button>
                    </div>
                </div>
                
                <!-- Ограничение игр -->
                <h3>🎮 Ограничение игр</h3>
                <div style="background:#ffe0b0;border-radius:15px;padding:15px;margin:15px 0;">
                    ${['maze','word','checkers','ticTac','memory','battleship','sudoku','shoot','compare','finger','composition','clock','change'].map(game => `
                        <label style="display:flex;align-items:center;gap:10px;padding:5px;cursor:pointer;">
                            <input type="checkbox" class="game-restrict" data-game="${game}" ${!stats.restrictedGames.includes(game) ? 'checked' : ''}>
                            <span>${game}</span>
                        </label>
                    `).join('')}
                </div>
                
                <!-- Магазин -->
                <h3>🛒 Магазин</h3>
                <div style="background:#ffe0b0;border-radius:15px;padding:15px;margin:15px 0;">
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" id="shopToggle" ${stats.shopEnabled ? 'checked' : ''}>
                        <span>Разрешить покупки в магазине</span>
                    </label>
                </div>
                
                <!-- Смена пароля -->
                <h3>🔐 Сменить мастер-пароль</h3>
                <div style="background:#ffe0b0;border-radius:15px;padding:15px;margin:15px 0;">
                    <input type="password" id="oldPassword" placeholder="Старый пароль" 
                           style="width:100%;padding:10px;border-radius:30px;border:2px solid #d4a259;margin-bottom:8px;text-align:center;">
                    <input type="password" id="newPassword" placeholder="Новый пароль (мин. 4 символа)" 
                           style="width:100%;padding:10px;border-radius:30px;border:2px solid #d4a259;margin-bottom:10px;text-align:center;">
                    <button id="changePasswordBtn" style="width:100%;">🔐 Сменить пароль</button>
                </div>
                
                <button id="parentLogoutBtn" class="btn-secondary" style="width:100%;margin-top:15px;">🚪 Выйти из кабинета</button>
            </div>
        </div>
    `;
    
    // Вход
    document.getElementById('parentLoginBtn').onclick = () => {
        const password = document.getElementById('parentPasswordInput').value;
        if (verifyParentPassword(password)) {
            document.getElementById('parentLoginArea').style.display = 'none';
            document.getElementById('parentPanel').style.display = 'block';
            setupParentPanelEvents();
        } else {
            if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error');
        }
    };
    
    // Enter для входа
    document.getElementById('parentPasswordInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('parentLoginBtn').click();
    });
}

function setupParentPanelEvents() {
    const password = document.getElementById('parentPasswordInput')?.value || '';
    
    // Включение/выключение контроля
    document.getElementById('controlToggle').onchange = (e) => {
        toggleParentControl(e.target.checked, password);
    };
    
    // Лимит времени
    document.getElementById('setTimeLimitBtn').onclick = () => {
        const minutes = parseInt(document.getElementById('timeLimitInput').value);
        setDailyTimeLimit(minutes, password);
    };
    
    // Ограничение игр
    document.querySelectorAll('.game-restrict').forEach(cb => {
        cb.onchange = (e) => {
            restrictGame(cb.dataset.game, !e.target.checked, password);
        };
    });
    
    // Магазин
    document.getElementById('shopToggle').onchange = (e) => {
        toggleShop(e.target.checked, password);
    };
    
    // Смена пароля
    document.getElementById('changePasswordBtn').onclick = () => {
        const oldPwd = document.getElementById('oldPassword').value;
        const newPwd = document.getElementById('newPassword').value;
        changeParentPassword(oldPwd, newPwd);
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
    };
    
    // Выход
    document.getElementById('parentLogoutBtn').onclick = () => {
        document.getElementById('parentLoginArea').style.display = 'block';
        document.getElementById('parentPanel').style.display = 'none';
    };
}
