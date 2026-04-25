// ==================== UI РЕНДЕРИНГ — КВАРТИРА + ВСЕ ЭКРАНЫ ====================

// ==================== ВЫБОР АККАУНТА (НОВОЕ) ====================
function renderChildSelect() {
    const app = document.getElementById('app');
    const profiles = typeof loadProfiles === 'function' ? loadProfiles() : [];
    
    app.innerHTML = `
        <div class="screen-container" style="text-align:center;">
            <h2 style="font-size:2rem;margin:20px 0;">👨‍👩‍👧 Выбери ученика</h2>
            <div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;margin:30px 0;">
                ${profiles.map(p => `
                    <div class="child-profile-card" onclick="selectChildProfile('${p.id}')" 
                         style="background:#ffe0b0;border-radius:20px;padding:20px;cursor:pointer;
                                text-align:center;width:160px;border:3px solid #d4a259;
                                box-shadow:0 8px 0 #b47c2e;transition:transform 0.1s;">
                        <div style="font-size:5rem;">
                            ${p.photo ? `<img src="${p.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;">` : (p.avatar || '🧑‍🎓')}
                        </div>
                        <div style="font-weight:bold;font-size:1.3rem;margin-top:10px;">${p.name}</div>
                        ${p.password ? '<div style="font-size:0.9rem;color:#888;">🔒 Пароль</div>' : ''}
                    </div>
                `).join('')}
            </div>
            <button onclick="createNewProfile()" 
                    style="background:#4caf50;color:white;border:none;border-radius:50px;
                           padding:15px 30px;font-size:1.3rem;cursor:pointer;
                           box-shadow:0 5px 0 #2e7d32;margin-top:20px;">
                ➕ Создать нового ученика
            </button>
            <div style="margin-top:30px;">
                <button onclick="navigateTo('parent')" 
                        style="background:#9e9e9e;color:white;border:none;border-radius:50px;
                               padding:10px 20px;font-size:1rem;cursor:pointer;
                               box-shadow:0 5px 0 #757575;">
                    👨‍👩‍👧 Родительский вход
                </button>
            </div>
        </div>
    `;
    
    // Стили для анимации карточек
    const style = document.createElement('style');
    style.textContent = `
        .child-profile-card:active {
            transform: translateY(4px) !important;
            box-shadow: 0 4px 0 #b47c2e !important;
        }
    `;
    document.head.appendChild(style);
}

// Глобальные функции для выбора аккаунта
window.selectChildProfile = function(id) {
    const profiles = typeof loadProfiles === 'function' ? loadProfiles() : [];
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    
    if (profile.password) {
        const pass = prompt(`Введи пароль для ${profile.name}:`);
        if (pass !== profile.password) {
            if (typeof showNotification === 'function') showNotification('❌ Неверный пароль!', 'error');
            return;
        }
    }
    
    AppState.currentChild = profile;
    if (typeof loadState === 'function') loadState(profile.id);
    if (typeof updateStreak === 'function') updateStreak();
    navigateTo(Screens.APARTMENT);
};

window.createNewProfile = function() {
    const name = prompt('Имя ученика:', 'Ученик');
    if (!name || !name.trim()) return;
    
    const password = prompt('Придумай пароль (или оставь пустым):');
    
    if (typeof addProfile === 'function') {
        const profile = addProfile(name.trim(), password || '');
        AppState.currentChild = profile;
        if (typeof loadState === 'function') loadState(profile.id);
        navigateTo(Screens.APARTMENT);
    } else {
        // Заглушка если функция не найдена
        const profile = {
            id: 'child_' + Date.now(),
            name: name.trim(),
            password: password || '',
            avatar: '🧑‍🎓',
            photo: null,
            createdAt: new Date().toISOString()
        };
        AppState.currentChild = profile;
        navigateTo(Screens.APARTMENT);
    }
};

window.createDefaultProfile = function() {
    const profile = {
        id: 'child_' + Date.now(),
        name: 'Ученик',
        password: '',
        avatar: '🧑‍🎓',
        photo: null,
        createdAt: new Date().toISOString()
    };
    AppState.currentChild = profile;
    navigateTo(Screens.APARTMENT);
};

// ==================== КВАРТИРА РОБОТА (ГЛАВНЫЙ ЭКРАН) ====================
function renderApartment() {
    const app = document.getElementById('app');
    const pet = AppState.pet || { type: 'cat', name: 'Мурка', hunger: 100, happiness: 100, energy: 100, isSleeping: false, outfit: {} };
    const petEmoji = { cat: '🐱', dog: '🐶', rabbit: '🐰', fox: '🦊', koala: '🐨', pig: '🐷' }[pet.type] || '🐱';
    const robotSkin = AppState.currentRobotSkin || '🤖';
    
    // Очищаем старые таймеры
    if (window.petSpeechTimer) {
        clearTimeout(window.petSpeechTimer);
        window.petSpeechTimer = null;
    }
    if (window.robotIdleTimer) {
        clearTimeout(window.robotIdleTimer);
        window.robotIdleTimer = null;
    }
    
    app.innerHTML = `
        <div class="robot-apartment" style="perspective:1200px;">
            <!-- Верхняя панель статистики -->
            <div class="apartment-top-panel">
                <div class="apartment-stat">🪙 <span id="aptCoins">${AppState.coins}</span></div>
                <div class="apartment-stat">📚 <span id="aptSolved">${AppState.totalSolved}</span></div>
                <div class="apartment-stat">🔥 <span id="aptStreak">${AppState.streak}</span></div>
                <div class="apartment-stat">⭐ <span id="aptStars">${getTotalStarsUI()}</span></div>
            </div>
            
            <!-- 3D комната -->
            <div style="transform:rotateX(3deg);transform-style:preserve-3d;height:100%;position:relative;">
                
                <!-- ПОЛ с эффектом перспективы -->
                <div style="
                    position:absolute;bottom:0;left:0;right:0;height:55%;
                    background:linear-gradient(180deg,#c4a882,#a0845c);
                    transform:rotateX(60deg);transform-origin:bottom;
                    border-radius:0 0 40px 40px;
                "></div>
                
                <!-- ОКНО с растением -->
                <div class="apartment-item" data-action="daily" 
                     style="top:80px;left:30px;transform:translateZ(20px);">
                    <div style="font-size:5rem;">🪟</div>
                    <div style="position:absolute;bottom:10px;left:55%;">
                        <span style="font-size:2rem;">⚱️</span>
                        <span style="position:absolute;bottom:0.2em;left:0;font-size:3rem;">🌳</span>
                        ${AppState.dailyPlantStage >= 1 ? '<span style="position:absolute;top:-0.3em;left:0.2em;font-size:1.5rem;">🌸</span>' : ''}
                        ${AppState.dailyPlantStage >= 2 ? '<span style="position:absolute;top:-0.1em;left:1.2em;font-size:1.5rem;">🌸</span>' : ''}
                        ${AppState.dailyPlantStage >= 3 ? '<span class="fruit-apple" data-action="harvestFruit" style="position:absolute;top:-0.5em;left:0.6em;font-size:2rem;animation:bounce 0.6s ease infinite;cursor:pointer;">🍎</span>' : ''}
                    </div>
                </div>
                
                <!-- ФОТОАЛЬБОМ на стене -->
                <div class="apartment-item" data-action="album" 
                     style="top:90px;left:50%;transform:translateX(-50%) translateZ(15px);">
                    <span style="font-size:4rem;">🖼️</span>
                    ${AppState.album && AppState.album.length > 0 ? 
                        `<span style="position:absolute;top:0.1em;left:50%;transform:translateX(-50%);font-size:2rem;">📷</span>` : ''}
                </div>
                
                <!-- ЗЕРКАЛО -->
                <div class="apartment-item" data-action="mirror" 
                     style="top:80px;right:40px;transform:translateZ(20px);">
                    <span style="font-size:4.5rem;">🪞</span>
                    ${AppState.currentChild && AppState.currentChild.photo ? 
                        `<img src="${AppState.currentChild.photo}" 
                             style="position:absolute;top:0.4em;left:50%;transform:translateX(-50%);
                                    width:2em;height:2em;border-radius:50%;object-fit:cover;">` : 
                        '<span style="position:absolute;top:0.4em;left:50%;transform:translateX(-50%);font-size:2rem;">🧑‍🎓</span>'}
                </div>
                
                <!-- КРОВАТЬ ПИТОМЦА (3D) -->
                <div class="apartment-item" data-action="pet" 
                     style="bottom:100px;left:40px;transform:translateZ(30px);">
                    <!-- Кровать -->
                    <div style="
                        width:130px;height:80px;
                        background:linear-gradient(180deg,#8B4513,#6B3410);
                        border-radius:15px 15px 5px 5px;
                        box-shadow:0 10px 20px rgba(0,0,0,0.3),inset 0 -10px 20px rgba(0,0,0,0.2);
                        position:relative;
                    ">
                        <!-- Матрас -->
                        <div style="
                            position:absolute;top:-15px;left:5px;right:5px;
                            height:30px;
                            background:linear-gradient(180deg,#ffffff,#f0e6d3);
                            border-radius:12px 12px 0 0;
                            box-shadow:inset 0 -5px 10px rgba(0,0,0,0.1);
                        "></div>
                        <!-- Подушка -->
                        <div style="
                            position:absolute;top:-10px;left:10px;
                            width:40px;height:25px;
                            background:white;
                            border-radius:50%;
                            box-shadow:2px 2px 5px rgba(0,0,0,0.2);
                        "></div>
                        <!-- Одеяло -->
                        <div style="
                            position:absolute;top:0;left:15px;right:5px;
                            height:25px;
                            background:linear-gradient(180deg,#e74c3c,#c0392b);
                            border-radius:8px;
                            box-shadow:inset 0 -3px 5px rgba(0,0,0,0.2);
                        "></div>
                    </div>
                    <!-- Питомец на кровати -->
                    <div style="position:absolute;top:-50px;left:50%;transform:translateX(-50%);">
                        <span style="font-size:3rem;">
                            ${petEmoji}
                            ${pet.outfit.hat ? `<span style="position:absolute;top:-0.5em;left:50%;transform:translateX(-50%);font-size:0.6em;">${pet.outfit.hat}</span>` : ''}
                            ${pet.isSleeping ? '<span style="position:absolute;top:-1em;right:-0.5em;font-size:2rem;animation:float 2s infinite;">💤</span>' : ''}
                        </span>
                    </div>
                    <div class="speech-bubble" id="petSpeech" 
                         style="position:absolute;top:-6em;left:50%;transform:translateX(-50%);display:none;">
                    </div>
                </div>
                
                <!-- ПИСЬМЕННЫЙ СТОЛ С РОБОТОМ (НОВОЕ) -->
                <div style="position:absolute;bottom:100px;right:80px;transform:translateZ(25px);">
                    <!-- Стол -->
                    <div style="
                        width:150px;height:60px;
                        background:linear-gradient(180deg,#deb887,#c4a265);
                        border-radius:8px;
                        box-shadow:0 10px 20px rgba(0,0,0,0.3);
                        position:relative;
                    ">
                        <!-- Монитор-уроки -->
                        <div class="apartment-item" data-action="lessons"
                             style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);cursor:pointer;">
                            <span style="font-size:3rem;">💻</span>
                        </div>
                        <!-- Тетради -->
                        <div style="position:absolute;top:-20px;left:10px;font-size:2.5rem;">📚</div>
                    </div>
                    <!-- РОБОТ -->
                    <div class="apartment-item robot-character" data-action="talkToRobot"
                         style="position:absolute;top:-90px;right:-60px;cursor:pointer;
                                animation:robotIdle 3s ease-in-out infinite;">
                        <span style="font-size:4.5rem;">${robotSkin}</span>
                        <div class="speech-bubble" id="robotSpeech" 
                             style="position:absolute;top:-3em;left:50%;transform:translateX(-50%);
                                    white-space:nowrap;display:none;">
                        </div>
                    </div>
                </div>
                
                <!-- ДВЕРЬ В МАГАЗИН -->
                <div class="apartment-item" data-action="shop" 
                     style="bottom:50px;right:20px;transform:translateZ(10px);">
                    <span style="font-size:5rem;">🚪</span>
                    <span style="position:absolute;top:0.5em;right:1em;font-size:1.5rem;">🛒</span>
                </div>
                
                <!-- КНОПКА НАСТРОЕК -->
                <div class="apartment-item" data-action="settings" 
                     style="bottom:160px;right:20px;transform:translateZ(15px);">
                    <span style="font-size:3.5rem;">⚙️</span>
                </div>
                
                <!-- КНОПКА ИГРОТЕКИ -->
                <div class="apartment-item" data-action="igroteka" 
                     style="bottom:230px;right:20px;transform:translateZ(15px);">
                    <span style="font-size:4rem;">🎮</span>
                </div>
                
            </div>
            
            <!-- Кнопка выхода -->
            <div class="apartment-exit" style="position:absolute;right:15px;top:15px;z-index:200;"
                 onclick="if(confirm('Выйти из игры?')) window.close()">❌</div>
        </div>
        
        <style>
            @keyframes robotIdle {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-8px) rotate(-2deg); }
                75% { transform: translateY(-4px) rotate(2deg); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); opacity: 1; }
                50% { transform: translateY(-10px); opacity: 0.5; }
            }
        </style>
    `;
    
    setupApartmentEvents();
    startPetSpeech();
    startRobotIdle();
}

// ==================== ДИАЛОГ С РОБОТОМ (НОВОЕ) ====================
function startRobotIdle() {
    const robotBubble = document.getElementById('robotSpeech');
    if (!robotBubble) return;
    
    const phrases = [
        'Привет! Готов учиться? 📚',
        'Сегодня отличный день для знаний! ✨',
        'Не забудь про ежедневные задания! 📝',
        'Питомец ждёт тебя! 🐱',
        'Давай поиграем в игротеке! 🎮',
        'Ты молодец! Продолжай учиться! ⭐',
        'Я верю в тебя! 💪',
        'Знания — это сила! 🧠'
    ];
    
    function showRobotPhrase() {
        if (!document.getElementById('robotSpeech')) return;
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        robotBubble.textContent = phrase;
        robotBubble.style.display = 'block';
        setTimeout(() => {
            robotBubble.style.display = 'none';
        }, 4000);
        window.robotIdleTimer = setTimeout(showRobotPhrase, Math.random() * 15000 + 20000);
    }
    
    window.robotIdleTimer = setTimeout(showRobotPhrase, 5000);
}

function talkToRobot() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="text-align:center;max-width:400px;">
            <div style="font-size:6rem;margin-bottom:20px;animation:bounce 0.6s;">${AppState.currentRobotSkin || '🤖'}</div>
            <h3>Привет! Я Робот-Учитель! 🤖</h3>
            <p style="margin:20px 0;color:#666;">Чем займёмся сегодня?</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <button class="robot-action-btn" style="
                    background:linear-gradient(135deg,#667eea,#764ba2);
                    color:white;border:none;border-radius:50px;
                    padding:15px;font-size:1.2rem;cursor:pointer;
                    box-shadow:0 4px 0 #4a3f7a;
                " data-action="lessons">
                    📚 Учиться
                </button>
                <button class="robot-action-btn" style="
                    background:linear-gradient(135deg,#f093fb,#f5576c);
                    color:white;border:none;border-radius:50px;
                    padding:15px;font-size:1.2rem;cursor:pointer;
                    box-shadow:0 4px 0 #c44569;
                " data-action="igroteka">
                    🎮 Игротека
                </button>
                <button class="robot-action-btn" style="
                    background:linear-gradient(135deg,#4facfe,#00f2fe);
                    color:white;border:none;border-radius:50px;
                    padding:15px;font-size:1.2rem;cursor:pointer;
                    box-shadow:0 4px 0 #3a9bd9;
                " data-action="pet">
                    🐾 К питомцу
                </button>
                <button class="robot-action-btn" style="
                    background:linear-gradient(135deg,#fa709a,#fee140);
                    color:white;border:none;border-radius:50px;
                    padding:15px;font-size:1.2rem;cursor:pointer;
                    box-shadow:0 4px 0 #d4a259;
                " data-action="shop">
                    🛒 Магазин
                </button>
                <button class="robot-action-btn" style="
                    background:linear-gradient(135deg,#a8e063,#56ab2f);
                    color:white;border:none;border-radius:50px;
                    padding:15px;font-size:1.2rem;cursor:pointer;
                    box-shadow:0 4px 0 #3d8030;
                " data-action="daily">
                    📅 Ежедневные задания
                </button>
            </div>
            <button id="closeRobotDialog" style="
                margin-top:20px;background:#eee;border:none;
                border-radius:50px;padding:10px 30px;
                font-size:1rem;cursor:pointer;
            ">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelectorAll('.robot-action-btn').forEach(btn => {
        btn.onclick = () => {
            const action = btn.dataset.action;
            modal.remove();
            switch(action) {
                case 'lessons': navigateTo(Screens.SUBJECT_SELECTION); break;
                case 'igroteka': navigateTo(Screens.IGROTEKA); break;
                case 'pet': navigateTo(Screens.PET_ROOM); break;
                case 'shop': navigateTo(Screens.SHOP); break;
                case 'daily': navigateTo(Screens.DAILY_TASKS); break;
            }
        };
    });
    
    document.getElementById('closeRobotDialog').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ==================== ОБРАБОТЧИКИ КВАРТИРЫ ====================
function setupApartmentEvents() {
    document.querySelectorAll('.apartment-item[data-action]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            switch (action) {
                case 'lessons': navigateTo(Screens.SUBJECT_SELECTION); break;
                case 'pet': navigateTo(Screens.PET_ROOM); break;
                case 'shop': navigateTo(Screens.SHOP); break;
                case 'settings': navigateTo(Screens.SETTINGS); break;
                case 'igroteka': navigateTo(Screens.IGROTEKA); break;
                case 'daily': navigateTo(Screens.DAILY_TASKS); break;
                case 'album': navigateTo(Screens.ALBUM); break;
                case 'mirror': navigateTo(Screens.MIRROR); break;
                case 'talkToRobot': 
                    if (typeof talkToRobot === 'function') talkToRobot();
                    break;
                case 'harvestFruit':
                    if (typeof harvestFruitAction === 'function') harvestFruitAction();
                    setTimeout(() => renderApartment(), 500);
                    break;
            }
        });
    });
    
    // Двойной клик по питомцу — погладить
    const petItem = document.querySelector('[data-action="pet"]');
    if (petItem) {
        petItem.addEventListener('dblclick', () => {
            if (typeof updatePetHappiness === 'function') {
                updatePetHappiness(3);
                if (typeof showNotification === 'function') showNotification('😊 Мурлычет!', 'success');
                if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
            }
        });
    }
}

function startPetSpeech() {
    const pet = AppState.pet;
    if (!pet) return;
    
    const bubble = document.getElementById('petSpeech');
    if (!bubble) return;
    
    const phrases = [];
    if (pet.hunger < 30) phrases.push('Хочу кушать! 😋', 'Покорми меня! 🍖', 'Я голодный... 😢');
    else if (pet.energy < 20) phrases.push('Я устал... 😴', 'Хочу спать... 🛏️');
    else if (pet.happiness < 30) phrases.push('Мне скучно... ☹️', 'Поиграй со мной! 🎾', 'Погладь меня! 🤗');
    else if (pet.hunger > 80) phrases.push('Вкуснотища! 😋', 'Я наелся! 😊');
    else phrases.push('Привет! 👋', 'Ты лучший! 🥰', 'Обожаю тебя! ❤️', 'Мррр ♥️', 'Ура! 🎉');
    
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    bubble.textContent = phrase;
    bubble.style.display = 'block';
    
    window.petSpeechTimer = setTimeout(() => {
        bubble.style.display = 'none';
        if (document.getElementById('petSpeech')) {
            window.petSpeechTimer = setTimeout(startPetSpeech, Math.random() * 15000 + 15000);
        }
    }, 4000);
}

function getTotalStarsUI() {
    let total = 0;
    ['math', 'russian', 'english', 'world'].forEach(s => {
        if (AppState.progress[s]) total += Object.values(AppState.progress[s].topics).reduce((sum, t) => sum + (t.stars || 0), 0);
    });
    return total;
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
            <div class="subject-grid">${subjects.map(s => {
                const completed = Object.values(AppState.progress[s.id]?.topics || {}).filter(t => t.completed).length;
                return `<div class="subject-card" onclick="selectSubject('${s.id}')"><div class="subject-emoji">${s.emoji}</div><div class="subject-name">${s.name}</div><div class="subject-progress">${completed} тем пройдено</div></div>`;
            }).join('')}</div>
            <div class="marathon-card" onclick="navigateTo('marathon')"><div class="marathon-emoji">🏃</div><div class="marathon-name">МАРАФОН</div><div class="marathon-desc">Все предметы вперемешку!</div></div>
            <button class="apartment-btn" onclick="navigateTo('encyclopedia')" style="margin-top:15px;">📖 Энциклопедия Эрудита</button>
            <button class="apartment-btn" onclick="navigateTo('igroteka')" style="margin-top:10px;">🎮 Игротека</button>
        </div>`;
}

function selectSubject(subject) { AppState.currentSubject = subject; navigateTo(Screens.WORLDS, { subject }); }

// ==================== МИРЫ ====================
function renderWorldsScreen(app, subject) {
    const worldsData = getWorldsData(subject);
    const names = { math: '📐 Математика', russian: '📖 Русский язык', english: '🇬🇧 Английский', world: '🌍 Окружающий мир' };
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('subjectSelection')">↩️ К предметам</button><h2>${names[subject]}</h2><div></div></div>
            <p style="text-align:center;margin-bottom:20px;">🌍 Выбери мир для изучения!</p>
            <div class="worlds-grid">${worldsData.map(w => `<div class="world-card" onclick="selectWorld('${subject}','${w.id}')"><div class="world-icon">${w.icon}</div><div class="world-name">${w.name}</div><div class="world-desc">${w.description}</div></div>`).join('')}</div>
        </div>`;
}

function getWorldsData(subject) {
    const map = { math: typeof MATH_WORLDS !== 'undefined' ? MATH_WORLDS : [], russian: typeof RUSSIAN_WORLDS !== 'undefined' ? RUSSIAN_WORLDS : [], english: typeof ENGLISH_WORLDS !== 'undefined' ? ENGLISH_WORLDS : [], world: typeof WORLD_WORLDS !== 'undefined' ? WORLD_WORLDS : [] };
    return map[subject] || [];
}

function selectWorld(subject, worldId) {
    AppState.currentWorld = getWorldsData(subject).find(w => w.id === worldId);
    navigateTo(Screens.LIFE_MAP, { subject, worldId });
}

// ==================== КАРТА ЖИЗНИ ====================
function renderLifeMap(app, subject) {
    const data = getTopicsData(subject);
    const progress = AppState.progress[subject] || { topics: {}, diplomas: [] };
    let html = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="navigateTo('worlds',{subject:'${subject}'})">↩️ К мирам</button><h2>${AppState.currentWorld?.icon||'🗺️'} ${AppState.currentWorld?.name||'Карта жизни'}</h2><div></div></div><div class="classes-container">`;
    if (data && data.classes) {
        data.classes.forEach(cls => {
            let topicsHtml = '<div class="topics-grid">'; let prev = true;
            cls.topics.forEach(t => {
                const tp = progress.topics[t.id] || { stars: 0, completed: false };
                const stars = '⭐'.repeat(tp.stars) + '☆'.repeat(3 - tp.stars);
                const locked = !prev; if (tp.completed) prev = true; else prev = false;
                topicsHtml += `<div class="topic-card ${locked?'locked':''} ${tp.completed?'completed':''}" ${!locked?`onclick="startTopic('${subject}','${t.id}')"`:''}><div class="topic-info"><div class="topic-name">${t.name}</div><div class="topic-stars">${stars}</div></div><div class="topic-status">${tp.completed?'✅':(locked?'🔒':'📝')}</div></div>`;
            });
            topicsHtml += '</div>';
            html += `<div class="class-card"><div class="class-title"><span>${cls.name}</span><span>📊 ${cls.topics.filter(t=>progress.topics[t.id]?.completed).length}/${cls.topics.length}</span></div>${topicsHtml}</div>`;
        });
    }
    html += '</div></div>'; app.innerHTML = html;
}

function startTopic(subject, topicId) {
    const data = getTopicsData(subject);
    if (!data) return;
    for (let cls of data.classes) {
        const t = cls.topics.find(x => x.id === topicId);
        if (t) { t.subject = subject; navigateTo(Screens.LEARNING, { topic: t }); return; }
    }
}

function getTopicsData(subject) {
    const map = { math: typeof MATH_TOPICS !== 'undefined' ? MATH_TOPICS : null, russian: typeof RUSSIAN_TOPICS !== 'undefined' ? RUSSIAN_TOPICS : null, english: typeof ENGLISH_TOPICS !== 'undefined' ? ENGLISH_TOPICS : null, world: typeof WORLD_TOPICS !== 'undefined' ? WORLD_TOPICS : null };
    return map[subject];
}

// ==================== ОБУЧЕНИЕ ====================
function renderLearningScreen(app, topic) {
    if (!topic) { navigateTo(Screens.APARTMENT); return; }
    const tasks = typeof generateTasks === 'function' ? generateTasks(topic, 5) : [{ text: '2+2=?', answer: 4 }];
    let idx = 0, correct = 0, lives = 3, hintShown = false;
    
    app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" id="backToMapBtn">← К карте</button><div class="lives-display" id="livesDisplay">${'❤️'.repeat(lives)}${'🩶'.repeat(3-lives)}</div><button id="skipBtn" class="btn-small" ${AppState.inventory.skipTokens<=0?'disabled':''}>⏭️ (${AppState.inventory.skipTokens})</button></div><div id="learningContent"></div></div>`;
    
    document.getElementById('backToMapBtn').onclick = () => navigateTo(Screens.LIFE_MAP, { subject: topic.subject });
    document.getElementById('skipBtn').onclick = () => { if (AppState.inventory.skipTokens > 0) { AppState.inventory.skipTokens--; idx++; if (idx >= tasks.length) finishTopic(); else showTask(); updateLives(); } };
    
    function showTask() {
        const task = tasks[idx];
        document.getElementById('learningContent').innerHTML = `
            <div class="story-box"><span>📖</span> ${topic.story || 'Давай изучим тему!'}</div>
            <div class="rule-box"><span>📚</span> ${topic.rule || 'Внимательно читай задание!'}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${(idx/tasks.length)*100}%"></div></div>
            <div class="task-card"><div class="task-header">❓ Вопрос ${idx+1} из ${tasks.length}</div><div class="task-text">${task.text}</div><div class="options" id="taskOptions"></div></div>
            <div id="hintArea" class="hint-area" style="display:none;"></div><div id="explanationBox" class="explanation-box" style="display:none;"></div>`;
        
        const correctAnswer = task.answer;
        let choices = [correctAnswer];
        if (typeof correctAnswer === 'number') {
            let c = [correctAnswer+1, correctAnswer-1, correctAnswer+2].filter(v=>v>0&&v!==correctAnswer);
            while (choices.length < 3 && c.length) choices.push(c.shift());
            while (choices.length < 3) choices.push(choices[0]);
        } else {
            ['круг','квадрат','треугольник','4','3','<','>','=','Да','Нет'].forEach(o => { if (o!==correctAnswer&&!choices.includes(o)&&choices.length<3) choices.push(o); });
        }
        choices.sort(()=>Math.random()-0.5);
        
        const opts = document.getElementById('taskOptions');
        choices.forEach(o => {
            const btn = document.createElement('button'); btn.className = 'option-btn'; btn.textContent = o;
            btn.onclick = () => {
                if (o == correctAnswer) {
                    correct++; idx++;
                    if (typeof playSound === 'function') playSound('correct');
                    if (typeof showConfetti === 'function') showConfetti('success');
                    if (typeof showNotification === 'function') showNotification('✅ Правильно!', 'success');
                    if (idx >= tasks.length) finishTopic(); else showTask();
                } else {
                    lives--; updateLives();
                    document.getElementById('explanationBox').innerHTML = `❌ Неправильно. Ответ: <strong>${correctAnswer}</strong>`;
                    document.getElementById('explanationBox').style.display = 'block';
                    if (typeof playSound === 'function') playSound('wrong');
                    if (lives <= 1 && !hintShown) { hintShown = true; document.getElementById('hintArea').innerHTML = `💡 Подсказка: ${task.hint || 'Подумай ещё!'}`; document.getElementById('hintArea').style.display = 'block'; }
                    if (lives <= 0) {
                        if (AppState.inventory.reviveTokens > 0) { AppState.inventory.reviveTokens--; lives = 3; updateLives(); if (typeof showNotification === 'function') showNotification('♻️ Воскрешён!', 'success'); }
                        else { finishTopic(); if (typeof showNotification === 'function') showNotification('😢 Жизни закончились...', 'error'); }
                    }
                }
            };
            opts.appendChild(btn);
        });
    }
    
    function updateLives() { const el = document.getElementById('livesDisplay'); if (el) el.innerHTML = '❤️'.repeat(Math.max(0,lives)) + '🩶'.repeat(Math.max(0,3-lives)); }
    
    function finishTopic() {
        const subject = topic.subject;
        const progress = AppState.progress[subject] || { topics: {}, diplomas: [] };
        const existing = progress.topics[topic.id] || { stars: 0, completed: false };
        let stars = lives <= 0 ? 0 : (correct === tasks.length ? 3 : (correct >= 3 ? 2 : (correct >= 1 ? 1 : 0)));
        
        if (!existing.completed && stars > 0) {
            existing.completed = true; existing.stars = Math.max(existing.stars, stars);
            if (typeof updateCoins === 'function') updateCoins(20);
            if (typeof updateSolved === 'function') updateSolved(correct);
            if (stars === 3 && typeof showConfetti === 'function') showConfetti('star');
        } else if (existing.completed) {
            existing.stars = Math.max(existing.stars, stars);
            if (typeof updateCoins === 'function') updateCoins(15);
        }
        progress.topics[topic.id] = existing;
        AppState.progress[subject] = progress;
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        setTimeout(() => navigateTo(Screens.LIFE_MAP, { subject }), 1500);
    }
    
    showTask();
}

// ==================== ИГРОТЕКА ====================
function renderArcadeHub() {
    const app = document.getElementById('app');
    const games = [
        { id: 'maze', name: '🗺️ Лабиринт', screen: Screens.GAME_MAZE },
        { id: 'word', name: '❓ Слово', screen: Screens.GAME_WORD },
        { id: 'checkers', name: '⚫ Шашки', screen: Screens.GAME_CHECKERS },
        { id: 'ticTac', name: '❌ Крестики-нолики', screen: Screens.GAME_TIC_TAC },
        { id: 'memory', name: '🧠 Память', screen: Screens.GAME_MEMORY },
        { id: 'battleship', name: '🚢 Морской бой', screen: Screens.GAME_BATTLESHIP },
        { id: 'sudoku', name: '🧩 Судоку', screen: Screens.GAME_SUDOKU },
        { id: 'shoot', name: '🎯 Попади в цель', screen: Screens.GAME_SHOOT },
        { id: 'compare', name: '⚡ Сравни числа', screen: Screens.GAME_COMPARE },
        { id: 'finger', name: '🖐️ Счёт на пальцах', screen: Screens.GAME_FINGER },
        { id: 'composition', name: '🔢 Состав числа', screen: Screens.GAME_COMPOSITION },
        { id: 'clock', name: '⏰ Который час?', screen: Screens.GAME_CLOCK },
        { id: 'change', name: '💰 Сдача', screen: Screens.GAME_CHANGE }
    ];
    
    app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🎮 ИГРОТЕКА</h2><div></div></div><div class="games-grid">${games.map(g => `<div class="game-card" onclick="navigateTo('${g.screen}')"><div class="game-emoji">${g.name.split(' ')[0]}</div><div class="game-name">${g.name}</div></div>`).join('')}</div></div>`;
}

// ==================== ПИТОМЕЦ ====================
function renderPetRoom() {
    const app = document.getElementById('app');
    const pet = AppState.pet;
    const petEmoji = { cat: '🐱', dog: '🐶', rabbit: '🐰', fox: '🦊', koala: '🐨', pig: '🐷' }[pet.type] || '🐱';
    
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🐾 ${pet.name}</h2><div></div></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin:20px 0;">
                <div class="pet-action-card" onclick="feedPet()"><span style="font-size:3rem;">🍖</span><div>Покормить</div></div>
                <div class="pet-action-card" onclick="petPet()"><span style="font-size:3rem;">🤗</span><div>Погладить</div></div>
                <div class="pet-action-card" onclick="petSleep()"><span style="font-size:3rem;">😴</span><div>${pet.isSleeping ? 'Разбудить' : 'Уложить'}</div></div>
                <div class="pet-action-card" onclick="petOutfit()"><span style="font-size:3rem;">👕</span><div>Одежда</div></div>
                <div class="pet-action-card" onclick="petChange()"><span style="font-size:3rem;">🔄</span><div>Сменить</div></div>
                <div class="pet-action-card" onclick="petRename()"><span style="font-size:3rem;">✏️</span><div>Имя</div></div>
            </div>
            <div style="text-align:center;font-size:5rem;margin:20px 0;">${petEmoji}${pet.outfit.hat||''}${pet.outfit.glasses||''}</div>
            <div style="display:flex;gap:20px;justify-content:center;">
                <div>🍖 ${pet.hunger}%</div><div>😊 ${pet.happiness}%</div><div>⚡ ${pet.energy}%</div>
            </div>
            <p style="text-align:center;">🎂 Возраст: ${pet.age || 0} дней</p>
        </div>`;
}

function feedPet() { if (typeof updatePetHunger === 'function') { updatePetHunger(20); if (typeof showNotification === 'function') showNotification('🍖 Покормлен!', 'success'); renderPetRoom(); } }
function petPet() { if (typeof updatePetHappiness === 'function') { updatePetHappiness(10); if (typeof showNotification === 'function') showNotification('🤗 Поглажен! Мррр ♥️', 'success'); renderPetRoom(); } }
function petSleep() { if (AppState.pet.isSleeping) { if (typeof petWakeUp === 'function') petWakeUp(); } else { if (typeof petGoToSleep === 'function') petGoToSleep(); } renderPetRoom(); }
function petOutfit() { if (typeof showNotification === 'function') showNotification('👕 Гардероб откроется здесь', 'info'); }
function petChange() { if (typeof showNotification === 'function') showNotification('🔄 Смена питомца откроется здесь', 'info'); }
function petRename() {
    const name = prompt('Новое имя питомца (1000 🪙):', AppState.pet.name);
    if (name && name.trim()) {
        if (typeof changePetName === 'function' && changePetName(name.trim())) {
            if (typeof showNotification === 'function') showNotification(`✅ Имя изменено на ${name.trim()}!`, 'success');
            renderPetRoom();
        } else if (AppState.coins < 1000) {
            if (typeof showNotification === 'function') showNotification('❌ Нужно 1000 🪙!', 'error');
        }
    }
}

// ==================== МАГАЗИН ====================
function renderShop() {
    const app = document.getElementById('app');
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
    document.querySelectorAll('.shop-tab').forEach(t => t.onclick = () => { document.querySelectorAll('.shop-tab').forEach(x => x.classList.remove('active')); t.classList.add('active'); renderShopTab(t.dataset.tab); });
}

function renderShopTab(tab) {
    const container = document.getElementById('shopContent');
    if (tab === 'skins') {
        const skins = ['🤖','🧑‍🏫','🧑‍🔬','🧑‍🎨','🧑‍🍳','🧑‍🚀','🐻‍❄️','🐉'];
        container.innerHTML = `<div class="shop-grid">${skins.map(s => `<div class="shop-item" onclick="buySkin('${s}')"><div style="font-size:3rem;">${s}</div><div>${AppState.inventory.robotSkins.includes(s) ? '✅' : '30 🪙'}</div></div>`).join('')}</div>`;
    } else if (tab === 'pets') {
        const pets = [{id:'cat',e:'🐱',n:'Кошка'},{id:'dog',e:'🐶',n:'Собака'},{id:'rabbit',e:'🐰',n:'Кролик'},{id:'fox',e:'🦊',n:'Лис'},{id:'koala',e:'🐨',n:'Коала'},{id:'pig',e:'🐷',n:'Свинка'}];
        container.innerHTML = `<div class="shop-grid">${pets.map(p => `<div class="shop-item" onclick="buyPet('${p.id}')"><div style="font-size:3rem;">${p.e}</div><div>${p.n}</div><div>${AppState.ownedPets.includes(p.id) ? '✅' : '100 🪙'}</div></div>`).join('')}</div>`;
    } else if (tab === 'tokens') {
        container.innerHTML = `<div class="shop-grid">
            <div class="shop-item" onclick="buyToken('skip')"><div style="font-size:3rem;">⏭️</div><div>Пропуск</div><div>50 🪙</div></div>
            <div class="shop-item" onclick="buyToken('revive')"><div style="font-size:3rem;">♻️</div><div>Воскрешение</div><div>60 🪙</div></div>
        </div>`;
    }
}

function buySkin(skin) {
    if (AppState.inventory.robotSkins.includes(skin)) { AppState.currentRobotSkin = skin; if (typeof showNotification === 'function') showNotification('🤖 Скин надет!', 'success'); }
    else if (AppState.coins >= 30) { AppState.coins -= 30; AppState.inventory.robotSkins.push(skin); AppState.currentRobotSkin = skin; if (typeof showNotification === 'function') showNotification('✅ Куплен!', 'success'); }
    else { if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error'); }
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    renderShop();
}

function buyPet(petId) {
    if (AppState.ownedPets.includes(petId)) { if (typeof switchPetType === 'function') switchPetType(petId); renderPetRoom(); }
    else if (AppState.coins >= 100) { AppState.coins -= 100; AppState.ownedPets.push(petId); if (typeof switchPetType === 'function') switchPetType(petId); if (typeof showNotification === 'function') showNotification('✅ Питомец куплен!', 'success'); }
    else { if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error'); }
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    renderShop();
}

function buyToken(type) {
    const price = type === 'skip' ? 50 : 60;
    if (AppState.coins >= price) {
        AppState.coins -= price;
        if (type === 'skip') AppState.inventory.skipTokens++;
        else AppState.inventory.reviveTokens++;
        if (typeof showNotification === 'function') showNotification('✅ Куплен!', 'success');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        renderShop();
    } else { if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error'); }
}

// ==================== ОСТАЛЬНЫЕ ЭКРАНЫ ====================
function renderAchievementsScreen(app) { if (typeof showAllAchievements === 'function') { app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🏆 ДОСТИЖЕНИЯ</h2><div></div></div><div id="achContent"></div></div>`; showAllAchievements(document.getElementById('achContent')); } }

function renderDailyTasksScreen(app) { if (typeof showDailyTasks === 'function') { app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>📅 ЗАДАНИЯ</h2><div></div></div><div id="dailyContent"></div></div>`; showDailyTasks(document.getElementById('dailyContent')); } }

function renderEncyclopedia(app) { if (typeof renderEncyclopediaModule === 'function') renderEncyclopediaModule(app); else app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>📖 ЭНЦИКЛОПЕДИЯ</h2><div></div></div><p>Загрузка...</p></div>`; }

function renderAlbum(app) {
    const photos = AppState.album || [];
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🖼️ МОЙ АЛЬБОМ</h2><div></div></div>
            ${photos.length === 0 ? '<p style="text-align:center;">Альбом пуст. Добавь первое воспоминание!</p>' : photos.map((p, i) => `<div class="album-item"><img src="${p.data}" style="width:100%;border-radius:15px;"><p>${p.caption}</p><small>${new Date(p.date).toLocaleDateString()}</small><button onclick="removePhoto(${i})">🗑️</button></div>`).join('')}
            <button onclick="addPhoto()" style="margin-top:20px;">➕ Добавить фото</button>
        </div>`;
}

function addPhoto() {
    if (typeof uploadImage === 'function') {
        uploadImage((base64) => {
            const caption = prompt('Подпись к фото:');
            if (typeof addToAlbum === 'function') addToAlbum(base64, caption || '');
            renderAlbum(document.getElementById('app'));
        });
    }
}

function removePhoto(index) {
    if (typeof removeFromAlbum === 'function') removeFromAlbum(index);
    renderAlbum(document.getElementById('app'));
}

function renderMirror(app) {
    const child = AppState.currentChild;
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>🪞 ПРОФИЛЬ</h2><div></div></div>
            <div style="text-align:center;">
                ${child && child.photo ? `<img src="${child.photo}" style="width:150px;height:150px;border-radius:50%;object-fit:cover;margin:20px;">` : '<div style="font-size:8rem;">🧑‍🎓</div>'}
                <h3>${child ? child.name : 'Ученик'}</h3>
                <p>📚 Решено: ${AppState.totalSolved} | 🔥 Дней: ${AppState.streak}</p>
                <button onclick="changePhoto()">📸 Загрузить фото</button>
            </div>
        </div>`;
}

function changePhoto() {
    if (typeof uploadImage === 'function') {
        uploadImage((base64) => {
            if (typeof saveProfilePhoto === 'function') saveProfilePhoto(AppState.currentChild?.id, base64);
            AppState.currentChild.photo = base64;
            if (typeof saveProfiles === 'function') {
                const profiles = typeof loadProfiles === 'function' ? loadProfiles() : [];
                const p = profiles.find(x => x.id === AppState.currentChild?.id);
                if (p) { p.photo = base64; if (typeof saveProfiles === 'function') saveProfiles(profiles); }
            }
            renderMirror(document.getElementById('app'));
        });
    }
}

function renderSettingsScreen(app) {
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>⚙️ НАСТРОЙКИ</h2><div></div></div>
            <h3>🔊 Звук</h3>
            <label><input type="checkbox" id="soundToggle" ${AppState.settings.soundEnabled?'checked':''} onchange="AppState.settings.soundEnabled=this.checked"> Звуки</label>
            <label><input type="checkbox" id="voiceToggle" ${AppState.settings.voiceEnabled?'checked':''} onchange="AppState.settings.voiceEnabled=this.checked"> Голос</label>
            <h3>💾 Данные</h3>
            <button onclick="exportData(AppState.currentChild?.id)">📤 Экспорт</button>
            <button onclick="importDataPrompt()">📥 Импорт</button>
            <h3>🔄 Сброс</h3>
            <button class="btn-danger" onclick="resetState(AppState.currentChild?.id)">🗑️ Сбросить</button>
        </div>`;
}

function importDataPrompt() {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => { if (e.target.files[0] && typeof importData === 'function') importData(AppState.currentChild?.id, e.target.files[0]); };
    input.click();
}

function renderMarathon(app) {
    const subjects = ['math', 'russian', 'english', 'world'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const data = getTopicsData(randomSubject);
    if (data && data.classes && data.classes[0] && data.classes[0].topics) {
        const randomTopic = data.classes[0].topics[Math.floor(Math.random() * data.classes[0].topics.length)];
        randomTopic.subject = randomSubject;
        navigateTo(Screens.LEARNING, { topic: randomTopic });
    } else {
        if (typeof showNotification === 'function') showNotification('🏃 Марафон готовится!', 'info');
        navigateTo(Screens.APARTMENT);
    }
}

function renderParentCabinet(app) {
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button><h2>👨‍👩‍👧 РОДИТЕЛЯМ</h2><div></div></div>
            <p style="text-align:center;">Введите мастер-пароль</p>
            <input type="password" id="parentPwd" placeholder="Пароль" style="width:100%;padding:15px;border-radius:40px;text-align:center;font-size:1.2rem;">
            <button id="parentLoginBtn" style="width:100%;margin-top:10px;">🔓 Войти</button>
            <p style="text-align:center;color:#888;margin-top:10px;">По умолчанию: 0000</p>
            <div id="parentPanel" style="display:none;">
                <h3>📊 Статистика</h3>
                <p>📚 Решено: ${AppState.totalSolved}</p>
                <p>🎮 Игр: ${AppState.totalGames}</p>
                <p>🔥 Дней: ${AppState.streak}</p>
                <p>⏰ Сегодня: ${AppState.parentControl.timePlayedToday} мин</p>
                <h3>⏰ Лимит (минут/день)</h3>
                <input type="number" id="timeLimit" value="${AppState.parentControl.dailyTimeLimit}" style="width:100%;padding:10px;border-radius:30px;">
                <button id="setLimitBtn" style="width:100%;margin-top:10px;">Установить</button>
            </div>
        </div>`;
    
    document.getElementById('parentLoginBtn').onclick = () => {
        const pwd = document.getElementById('parentPwd').value;
        if (pwd === (AppState.parentControl.password || '0000')) {
            document.getElementById('parentPanel').style.display = 'block';
        } else { if (typeof showNotification === 'function') showNotification('❌ Неверный пароль', 'error'); }
    };
    document.getElementById('setLimitBtn').onclick = () => {
        AppState.parentControl.dailyTimeLimit = parseInt(document.getElementById('timeLimit').value) || 60;
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        if (typeof showNotification === 'function') showNotification('✅ Лимит установлен', 'success');
    };
}