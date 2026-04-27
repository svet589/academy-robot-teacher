// ==================== UI РЕНДЕРИНГ ====================

// ==================== ВЫБОР АККАУНТА ====================
function renderChildSelect() {
    const app = document.getElementById('app');
    const profiles = loadProfiles();
    
    app.innerHTML = `
        <div class="screen-container" style="text-align:center;">
            <h2>👨‍👩‍👧 Выбери ученика</h2>
            <div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;margin:30px 0;">
                ${profiles.map(p => `
                    <div class="child-card" onclick="selectChildProfile('${p.id}')">
                        <div style="font-size:4rem;">${p.photo ? `<img src="${p.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">` : '🧑‍🎓'}</div>
                        <div style="font-weight:bold;">${p.name}</div>
                        ${p.password ? '<div style="font-size:0.8rem;">🔒 Пароль</div>' : ''}
                    </div>
                `).join('')}
            </div>
            <button class="apartment-btn" onclick="createNewProfile()">➕ Создать нового ученика</button>
            <button class="apartment-btn btn-secondary" onclick="navigateTo('parent')" style="margin-top:10px;">👨‍👩‍👧 Родительский вход</button>
        </div>
    `;
}

window.selectChildProfile = function(id) {
    const profiles = loadProfiles();
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    
    if (profile.password) {
        const pass = prompt(`Введи пароль для ${profile.name}:`);
        if (pass !== profile.password) {
            showNotification('❌ Неверный пароль!', false);
            return;
        }
    }
    
    AppState.currentChild = profile;
    loadState(profile.id).then(savedState => {
        if (savedState) Object.assign(AppState, savedState);
        navigateTo(Screens.APARTMENT);
    }).catch(() => {
        navigateTo(Screens.APARTMENT);
    });
};

window.createNewProfile = function() {
    const name = prompt('Имя ученика:', 'Ученик');
    if (!name || !name.trim()) return;
    const password = prompt('Придумай пароль (или оставь пустым):');
    const profile = addProfile(name.trim(), password || '');
    AppState.currentChild = profile;
    navigateTo(Screens.APARTMENT);
};

// ==================== КВАРТИРА ====================
function renderApartment() {
    const app = document.getElementById('app');
    const pet = AppState.pet || { type: 'cat', name: 'Мурка', hunger: 100, happiness: 100, energy: 100, isSleeping: false, outfit: {} };
    const petEmoji = PETS[pet.type]?.emoji || '🐱';
    const robotSkin = AppState.currentRobotSkin || '🤖';
    
    if (window.petSpeechTimer) { clearTimeout(window.petSpeechTimer); window.petSpeechTimer = null; }
    if (window.robotIdleTimer) { clearTimeout(window.robotIdleTimer); window.robotIdleTimer = null; }
    
    app.innerHTML = `
        <div class="robot-apartment" style="perspective:1200px;">
            <div class="apartment-top-panel">
                <div class="apartment-stat">🪙 <span id="aptCoins">${AppState.coins}</span></div>
                <div class="apartment-stat">📚 <span id="aptSolved">${AppState.totalSolved}</span></div>
                <div class="apartment-stat">🔥 <span id="aptStreak">${AppState.streak}</span></div>
                <button class="apartment-exit" onclick="navigateTo('settings')" style="position:static;transform:none;margin-left:auto;">⚙️</button>
            </div>
            
            <div style="transform:rotateX(3deg);transform-style:preserve-3d;height:100%;position:relative;">
                <!-- Окно с растением -->
                <div class="apartment-item" data-action="dailyTasks" style="top:80px;left:30px;transform:translateZ(20px);">
                    <span style="font-size:5rem;">🪟</span>
                    <span style="position:absolute;bottom:10px;left:55%;">🌳${AppState.dailyPlantStage >= 3 ? '🍎' : ''}</span>
                </div>
                
                <!-- Картина -->
                <div class="apartment-item" data-action="album" style="top:90px;left:50%;transform:translateX(-50%) translateZ(15px);">
                    <span style="font-size:4rem;">🖼️</span>
                </div>
                
                <!-- Зеркало -->
                <div class="apartment-item" data-action="mirror" style="top:80px;right:40px;transform:translateZ(20px);">
                    <span style="font-size:4.5rem;">🪞</span>
                </div>
                
                <!-- Кровать питомца -->
                <div class="apartment-item" data-action="petRoom" style="bottom:120px;left:50px;transform:translateZ(30px);">
                    <div style="width:120px;height:70px;background:linear-gradient(180deg,#8B4513,#6B3410);border-radius:15px;box-shadow:0 10px 20px rgba(0,0,0,0.3);position:relative;">
                        <div style="position:absolute;top:-15px;left:5px;right:5px;height:25px;background:linear-gradient(180deg,#fff,#f0e6d3);border-radius:12px;"></div>
                        <div style="position:absolute;top:-10px;left:10px;width:35px;height:20px;background:#fff;border-radius:50%;"></div>
                    </div>
                    <span style="position:absolute;top:-45px;left:50%;transform:translateX(-50%);font-size:3rem;">${petEmoji}</span>
                    <div class="speech-bubble" id="petSpeech" style="position:absolute;top:-6em;left:50%;transform:translateX(-50%);display:none;"></div>
                </div>
                
                <!-- Стол с роботом -->
                <div style="position:absolute;bottom:120px;right:100px;transform:translateZ(25px);">
                    <div style="width:140px;height:50px;background:linear-gradient(180deg,#deb887,#c4a265);border-radius:5px;box-shadow:0 10px 20px rgba(0,0,0,0.3);">
                        <div class="apartment-item" data-action="subjectSelection" style="position:absolute;top:-50px;left:50%;transform:translateX(-50%);">
                            <span style="font-size:3rem;">💻</span>
                        </div>
                    </div>
                    <div class="apartment-item" data-action="talkToRobot" style="position:absolute;top:-80px;right:-50px;animation:robotIdle 3s ease-in-out infinite; cursor:pointer;">
                        <span style="font-size:4rem;">${robotSkin}</span>
                    </div>
                </div>
                
                <!-- Дверь в магазин -->
                <div class="apartment-item" data-action="shop" style="bottom:50px;right:30px;transform:translateZ(10px);">
                    <span style="font-size:5rem;">🚪</span>
                    <span style="position:absolute;top:0.5em;right:1em;font-size:1.5rem;">🛒</span>
                </div>
                
                <!-- Кнопка Игротеки -->
                <div class="apartment-item" data-action="arcadeHub" style="bottom:200px;right:30px;transform:translateZ(15px);">
                    <span style="font-size:4rem;">🎮</span>
                </div>
            </div>
        </div>
        <style>
            @keyframes robotIdle { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
        </style>
    `;
    
    document.querySelectorAll('.apartment-item[data-action]').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = item.dataset.action;
            const screenMap = {
                'subjectSelection': Screens.SUBJECT_SELECTION,
                'petRoom': Screens.PET_ROOM,
                'shop': Screens.SHOP,
                'arcadeHub': Screens.ARCADE_HUB,
                'dailyTasks': Screens.DAILY_TASKS,
                'album': Screens.ALBUM,
                'mirror': Screens.MIRROR,
                'settings': Screens.SETTINGS,
                'talkToRobot': null
            };
            if (action === 'talkToRobot') talkToRobot();
            else if (screenMap[action]) navigateTo(screenMap[action]);
        });
    });
    
    startPetSpeech();
    startRobotIdle();
}

function talkToRobot() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="text-align:center;">
            <div style="font-size:5rem;margin-bottom:20px;">${AppState.currentRobotSkin || '🤖'}</div>
            <h3>Привет! Я Робот-Учитель!</h3>
            <p style="margin:20px 0;">Чем займёмся?</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
                <button onclick="modal.remove();navigateTo('subjectSelection')" class="apartment-btn">📚 Учиться</button>
                <button onclick="modal.remove();navigateTo('arcadeHub')" class="apartment-btn">🎮 Игротека</button>
                <button onclick="modal.remove();navigateTo('petRoom')" class="apartment-btn">🐾 Питомец</button>
                <button onclick="modal.remove();navigateTo('shop')" class="apartment-btn">🛒 Магазин</button>
                <button onclick="modal.remove();navigateTo('encyclopedia')" class="apartment-btn">📖 Энциклопедия</button>
            </div>
            <button onclick="modal.remove()" style="margin-top:15px;">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function startPetSpeech() {
    if (!AppState.pet) return;
    const bubble = document.getElementById('petSpeech');
    if (!bubble) return;
    const phrases = [];
    if (AppState.pet.hunger < 30) phrases.push('Хочу кушать! 😋', 'Покорми меня! 🍖');
    else if (AppState.pet.energy < 20) phrases.push('Я устал... 😴', 'Хочу спать...');
    else if (AppState.pet.happiness < 30) phrases.push('Мне скучно...', 'Поиграй со мной!');
    else phrases.push('Ты лучший! 🥰', 'Привет! 👋', 'Мррр ♥️');
    
    bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    bubble.style.display = 'block';
    window.petSpeechTimer = setTimeout(() => {
        if (bubble) bubble.style.display = 'none';
    }, 4000);
}

function startRobotIdle() {
    const bubble = document.getElementById('robotSpeech');
    if (!bubble) return;
    const phrases = [
        'Привет! Готов учиться? 📚',
        'Не забудь про задания! 📝',
        'Питомец ждёт тебя! 🐱',
        'Ты молодец! ⭐'
    ];
    bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    bubble.style.display = 'block';
    window.robotIdleTimer = setTimeout(() => {
        if (bubble) bubble.style.display = 'none';
    }, 5000);
}

// ==================== ВЫБОР ПРЕДМЕТА ====================
function renderSubjectSelection(app) {
    const subjects = [
        { id: 'math', emoji: '📐', name: 'МАТЕМАТИКА' },
        { id: 'russian', emoji: '📖', name: 'РУССКИЙ ЯЗЫК' },
        { id: 'english', emoji: '🇬🇧', name: 'АНГЛИЙСКИЙ' },
        { id: 'world', emoji: '🌍', name: 'ОКРУЖАЮЩИЙ МИР' }
    ];
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>📚 ВЫБЕРИ ПРЕДМЕТ</h2><div></div></div>
            <div class="subject-grid">
                ${subjects.map(s => `<div class="subject-card" onclick="navigateTo('worlds', {subject:'${s.id}'})"><div class="subject-emoji">${s.emoji}</div><div class="subject-name">${s.name}</div></div>`).join('')}
            </div>
            <div class="marathon-card" onclick="navigateTo('marathon')"><div class="marathon-emoji">🏃</div><div class="marathon-name">МАРАФОН</div></div>
        </div>`;
}

// ==================== ИГРОТЕКА ====================
function renderArcadeHub(app) {
    const games = [
        { name: '🗺️ Лабиринт', screen: 'gameMaze' },
        { name: '❓ Слово', screen: 'gameWord' },
        { name: '⚫ Шашки', screen: 'gameCheckers' },
        { name: '❌ Крестики-нолики', screen: 'gameTicTac' },
        { name: '🧠 Найди пару', screen: 'gameMemory' },
        { name: '🚢 Морской бой', screen: 'gameBattleship' },
        { name: '🧩 Судоку', screen: 'gameSudoku' },
        { name: '🎯 Попади в цель', screen: 'gameShoot' },
        { name: '⚡ Сравни числа', screen: 'gameCompare' },
        { name: '🎨 Рисовалка', screen: 'gameDrawing' },
        { name: '🔢 Состав числа', screen: 'gameComposition' },
        { name: '⏰ Который час?', screen: 'gameClock' },
        { name: '💰 Сдача', screen: 'gameChange' }
    ];
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🎮 ИГРОТЕКА</h2><div></div></div>
            <div class="games-grid">${games.map(g => `<div class="game-card" onclick="navigateTo('${g.screen}')"><div class="game-emoji">${g.name.split(' ')[0]}</div><div class="game-name">${g.name}</div></div>`).join('')}</div>
        </div>`;
}

// ==================== МАГАЗИН ====================
function renderShop(app) {
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🛒 МАГАЗИН</h2><div>🪙 ${AppState.coins}</div></div>
            <div class="shop-tabs">
                <div class="shop-tab active" data-tab="skins">🤖 Скины</div>
                <div class="shop-tab" data-tab="pets">🐾 Питомцы</div>
                <div class="shop-tab" data-tab="tokens">🎫 Токены</div>
            </div>
            <div id="shopContent"></div>
        </div>`;
    renderShopTab('skins');
    document.querySelectorAll('.shop-tab').forEach(t => {
        t.onclick = () => {
            document.querySelectorAll('.shop-tab').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            renderShopTab(t.dataset.tab);
        };
    });
}

function renderShopTab(tab) {
    const container = document.getElementById('shopContent');
    if (tab === 'skins') {
        container.innerHTML = `<div class="shop-grid">${AVATARS_LIST.map(a => `
            <div class="shop-item ${AppState.inventory.robotSkins.includes(a.emoji) ? 'owned' : ''}" onclick="buySkin('${a.emoji}')">
                <div class="shop-item-emoji">${a.emoji}</div>
                <div class="shop-item-name">${a.name}</div>
                <div class="shop-item-price">${AppState.inventory.robotSkins.includes(a.emoji) ? '✅' : a.price + ' 🪙'}</div>
            </div>`).join('')}</div>`;
    }
}

function buySkin(skin) {
    if (AppState.inventory.robotSkins.includes(skin)) {
        AppState.currentRobotSkin = skin;
        showNotification('🤖 Скин надет!', true);
    } else {
        const avatar = AVATARS_LIST.find(a => a.emoji === skin);
        if (avatar && AppState.coins >= avatar.price) {
            AppState.coins -= avatar.price;
            AppState.inventory.robotSkins.push(skin);
            AppState.currentRobotSkin = skin;
            showNotification('✅ Куплен!', true);
            playSound('coin');
        } else {
            showNotification('❌ Не хватает монет!', false);
        }
    }
    saveState(AppState.currentChild.id, AppState);
    renderShop(document.getElementById('app'));
}

// ==================== НАСТРОЙКИ ====================
function renderSettings(app) {
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>⚙️ НАСТРОЙКИ</h2><div></div></div>
            <label><input type="checkbox" id="soundToggle" ${AppState.settings.soundEnabled ? 'checked' : ''} onchange="AppState.settings.soundEnabled=this.checked"> 🔊 Звуки</label>
            <label><input type="checkbox" id="voiceToggle" ${AppState.settings.voiceEnabled ? 'checked' : ''} onchange="AppState.settings.voiceEnabled=this.checked"> 🎤 Голос</label>
        </div>`;
}