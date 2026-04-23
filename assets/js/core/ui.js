// ==================== UI РЕНДЕРИНГ (ЧАСТЬ 1/3) ====================
import { AppState, EventBus, updateCoins, updateSolved, getAchievements } from './state.js';
import { Screens, navigateTo } from './router.js';
import { showNotification } from './notifications.js';
import { generateTasks } from './task-generator.js';
import { saveState } from './storage.js';
import { verifyParentPassword, getChildStats } from './parent-control.js';

// ==================== ГЛАВНОЕ МЕНЮ ====================
export function renderMainMenu(app) {
    const pet = AppState.pet || { name: 'Мурка', emoji: '🐱', hunger: 100, happiness: 100, energy: 100 };
    
    app.innerHTML = `
        <div class="card main-menu-card">
            <div class="top-panel">
                <div class="coins-display">
                    <span>🪙</span>
                    <span id="globalCoins">${AppState.coins}</span>
                </div>
                <div class="coins-display">
                    <span>📚</span>
                    <span id="globalSolved">${AppState.totalSolved}</span>
                </div>
                <div class="coins-display">
                    <span>🔥</span>
                    <span id="globalStreak">${AppState.streak}</span>
                </div>
            </div>
            
            <div class="menu-header">
                <div class="robot-section">
                    <div class="robot-avatar">🤖</div>
                    <div class="robot-message">
                        Привет${AppState.user.name ? ', ' + AppState.user.name : ''}!<br>
                        Выбери, чем займёмся!
                    </div>
                </div>
                <div class="home-pet-widget" id="homePetWidget">
                    <div class="home-pet-emoji" id="homePetEmoji">${pet.emoji}</div>
                    <div class="home-pet-bubble" id="homePetBubble" style="display: none;"></div>
                    <div class="home-pet-name" id="homePetName">${pet.name}</div>
                    <div class="pet-status-mini">
                        <span class="status-icon" style="color: ${pet.hunger < 30 ? 'red' : 'inherit'}">🍖</span>
                        <span class="status-icon" style="color: ${pet.happiness < 30 ? 'orange' : 'inherit'}">😊</span>
                        <span class="status-icon" style="color: ${pet.energy < 30 ? 'blue' : 'inherit'}">⚡</span>
                    </div>
                </div>
            </div>
            
            <div class="menu-grid">
                <div class="menu-card" data-action="lessons">
                    <div class="menu-emoji">📚</div>
                    <div class="menu-name">УРОКИ</div>
                </div>
                <div class="menu-card" data-action="arcade">
                    <div class="menu-emoji">🎮</div>
                    <div class="menu-name">ИГРОТЕКА</div>
                </div>
                <div class="menu-card" data-action="pet">
                    <div class="menu-emoji">🐾</div>
                    <div class="menu-name">ПИТОМЕЦ</div>
                </div>
                <div class="menu-card" data-action="achievements">
                    <div class="menu-emoji">🏆</div>
                    <div class="menu-name">ДОСТИЖЕНИЯ</div>
                </div>
                <div class="menu-card" data-action="parent">
                    <div class="menu-emoji">👨‍👩‍👧</div>
                    <div class="menu-name">РОДИТЕЛИ</div>
                </div>
                <div class="menu-card" data-action="settings">
                    <div class="menu-emoji">⚙️</div>
                    <div class="menu-name">НАСТРОЙКИ</div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('[data-action="lessons"]').onclick = () => renderSubjectSelection(app);
    document.querySelector('[data-action="arcade"]').onclick = () => navigateTo(Screens.ARCADE);
    document.querySelector('[data-action="pet"]').onclick = () => navigateTo(Screens.PET_MODULE);
    document.querySelector('[data-action="achievements"]').onclick = () => navigateTo(Screens.ACHIEVEMENTS);
    document.querySelector('[data-action="parent"]').onclick = () => navigateTo(Screens.PARENT);
    document.querySelector('[data-action="settings"]').onclick = () => navigateTo(Screens.SETTINGS);
    document.getElementById('homePetWidget').onclick = () => navigateTo(Screens.PET_MODULE);
    
    startPetPhrases();
}

// ==================== ВЫБОР ПРЕДМЕТА ====================
function renderSubjectSelection(app) {
    app.innerHTML = `
        <div class="card">
            <div class="worlds-header">
                <button class="back-btn" id="backToMainFromSubjectsBtn">↩️ Назад</button>
                <h2>📚 ВЫБОР ПРЕДМЕТА</h2>
                <div style="width: 100px;"></div>
            </div>
            
            <div class="subject-grid">
                <div class="subject-card" data-subject="math">
                    <div class="subject-emoji">📐</div>
                    <div class="subject-name">МАТЕМАТИКА</div>
                    <div class="subject-progress">${getSubjectProgressText('math')}</div>
                </div>
                <div class="subject-card" data-subject="russian">
                    <div class="subject-emoji">📖</div>
                    <div class="subject-name">РУССКИЙ ЯЗЫК</div>
                    <div class="subject-progress">${getSubjectProgressText('russian')}</div>
                </div>
                <div class="subject-card" data-subject="english">
                    <div class="subject-emoji">🇬🇧</div>
                    <div class="subject-name">АНГЛИЙСКИЙ</div>
                    <div class="subject-progress">${getSubjectProgressText('english')}</div>
                </div>
                <div class="subject-card" data-subject="world">
                    <div class="subject-emoji">🌍</div>
                    <div class="subject-name">ОКРУЖАЮЩИЙ МИР</div>
                    <div class="subject-progress">${getSubjectProgressText('world')}</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('backToMainFromSubjectsBtn').onclick = () => renderMainMenu(app);
    document.querySelectorAll('[data-subject]').forEach(card => {
        card.onclick = () => EventBus.emit('subject:selected', card.dataset.subject);
    });
}

function getSubjectProgressText(subject) {
    const progress = AppState.progress[subject];
    if (!progress) return '0/0 тем';
    const topics = progress.topics || {};
    const completed = Object.values(topics).filter(t => t.completed).length;
    return `${completed}/${Object.keys(topics).length || '?'} тем`;
}

// ==================== КАРТА ЖИЗНИ ====================
export function renderLifeMap(app, subject, worldId) {
    const subjectNames = {
        math: '📐 Математика', russian: '📖 Русский язык',
        english: '🇬🇧 Английский', world: '🌍 Окружающий мир'
    };
    const world = AppState.currentWorld || { name: 'Карта жизни', icon: '🗺️' };
    
    app.innerHTML = `
        <div class="card life-map-card">
            <div class="life-map-header">
                <button class="back-btn" id="backToWorldsBtn">↩️ К мирам</button>
                <div class="stats-bar">
                    <span>🪙 ${AppState.coins}</span>
                    <span>⭐ ${getTotalStars(subject)}</span>
                    <span>✅ ${getCompletedTopics(subject)}</span>
                </div>
            </div>
            <h2 style="text-align: center; margin: 20px 0;">${world.icon} ${world.name} — ${subjectNames[subject]}</h2>
            <div class="classes-container" id="lifeMapContent"><p style="text-align: center;">Загрузка тем...</p></div>
        </div>
    `;
    
    document.getElementById('backToWorldsBtn').onclick = () => navigateTo(Screens.WORLDS, { subject });
    loadLifeMapContent(subject, worldId);
}
async function loadLifeMapContent(subject, worldId) {
    const container = document.getElementById('lifeMapContent');
    try {
        const response = await fetch(`/data/${subject}-topics.json`);
        if (response.ok) {
            const data = await response.json();
            renderTopics(container, data, subject);
        } else {
            container.innerHTML = '<p style="text-align: center;">Темы скоро появятся!</p>';
        }
    } catch (e) {
        container.innerHTML = '<p style="text-align: center;">Темы скоро появятся!</p>';
    }
}

function renderTopics(container, data, subject) {
    const progress = AppState.progress[subject] || { topics: {}, diplomas: [] };
    let html = '';
    
    data.classes.forEach(cls => {
        let topicsHtml = '<div class="topics-grid">';
        let prevCompleted = true;
        
        cls.topics.forEach(topic => {
            const tp = progress.topics[topic.id] || { stars: 0, completed: false };
            const stars = '⭐'.repeat(tp.stars) + '☆'.repeat(3 - tp.stars);
            const locked = !prevCompleted;
            if (tp.completed) prevCompleted = true; else prevCompleted = false;
            
            topicsHtml += `<div class="topic-card ${locked ? 'locked' : ''} ${tp.completed ? 'completed' : ''}" data-topic-id="${topic.id}">
                <div class="topic-info"><div class="topic-name">${topic.name}</div><div class="topic-stars">${stars}</div></div>
                <div class="topic-status">${tp.completed ? '✅' : (locked ? '🔒' : '📝')}</div>
            </div>`;
        });
        topicsHtml += '</div>';
        
        const completed = cls.topics.filter(t => progress.topics[t.id]?.completed).length;
        html += `<div class="class-card"><div class="class-title"><span>${cls.name}</span><span class="class-progress">📊 ${completed}/${cls.topics.length}</span></div>${topicsHtml}</div>`;
    });
    
    container.innerHTML = html;
    
    document.querySelectorAll('.topic-card:not(.locked)').forEach(card => {
        card.onclick = () => {
            const topicId = card.dataset.topicId;
            for (let cls of data.classes) {
                const topic = cls.topics.find(t => t.id === topicId);
                if (topic) { topic.subject = subject; EventBus.emit('topic:selected', topic); break; }
            }
        };
    });
}

function getTotalStars(subject) {
    const progress = AppState.progress[subject];
    return progress ? Object.values(progress.topics || {}).reduce((s, t) => s + (t.stars || 0), 0) : 0;
}

function getCompletedTopics(subject) {
    const progress = AppState.progress[subject];
    return progress ? Object.values(progress.topics || {}).filter(t => t.completed).length : 0;
}

// ==================== ЭКРАН ОБУЧЕНИЯ ====================
export function renderLearningScreen(app, topic) {
    if (!topic) { navigateTo(Screens.MAIN); return; }
    const tasks = generateTasks(topic, 5);
    
    app.innerHTML = `<div class="card learning-card"><button class="back-btn" id="backToMapBtn">← Назад к карте</button><div id="learningContent"></div></div>`;
    document.getElementById('backToMapBtn').onclick = () => navigateTo(Screens.LIFE_MAP, { subject: topic.subject });
    renderTask(topic, tasks, 0, 0);
}

function renderTask(topic, tasks, index, correct) {
    const content = document.getElementById('learningContent');
    const task = tasks[index];
    
    content.innerHTML = `
        <div class="story-box"><span class="story-icon">📖</span><span>${topic.story || 'Давай изучим эту тему!'}</span></div>
        <div class="rule-box"><span class="rule-icon">📚</span><span>${topic.rule || 'Внимательно читай задание!'}</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${(index / tasks.length) * 100}%"></div></div>
        <div class="task-card"><div class="task-header">❓ Вопрос ${index + 1} из ${tasks.length}</div><div class="task-text">${task.text}</div><div class="options" id="taskOptions"></div></div>
        <div id="explanationBox" class="explanation-box" style="display: none;"></div>
    `;
    
    const correctAnswer = task.answer;
    let choices = task.options || [correctAnswer];
    
    if (!task.options) {
        if (typeof correctAnswer === 'number') {
            let candidates = [correctAnswer + 1, correctAnswer - 1, correctAnswer + 2, correctAnswer - 2].filter(v => v > 0 && v !== correctAnswer);
            while (choices.length < 3 && candidates.length) choices.push(candidates.shift());
            while (choices.length < 3) choices.push(choices[0]);
        } else {
            ['круг', 'квадрат', 'треугольник', '4', '3', '<', '>', '=', 'Да', 'Нет'].forEach(opt => {
                if (opt !== correctAnswer && !choices.includes(opt) && choices.length < 3) choices.push(opt);
            });
        }
    }
    choices.sort(() => Math.random() - 0.5);
    
    const optsDiv = document.getElementById('taskOptions');
    choices.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => {
            if (opt == correctAnswer) {
                const newCorrect = correct + 1;
                if (index + 1 < tasks.length) { renderTask(topic, tasks, index + 1, newCorrect); showNotification('✅ Правильно!', 'success'); }
                else { finishTopic(topic, newCorrect, tasks.length); }
            } else {
                document.getElementById('explanationBox').innerHTML = `❌ Неправильно. Правильный ответ: ${correctAnswer}`;
                document.getElementById('explanationBox').style.display = 'block';
                showNotification('❌ Попробуй ещё раз!', 'error');
            }
        };
        optsDiv.appendChild(btn);
    });
}

function finishTopic(topic, correct, total) {
    const subject = topic.subject || AppState.currentSubject;
    const progress = AppState.progress[subject] || { topics: {}, diplomas: [] };
    const existing = progress.topics[topic.id] || { stars: 0, completed: false };
    
    let stars = correct === total ? 3 : (correct >= 3 ? 2 : (correct >= 2 ? 1 : 0));
    
    if (!existing.completed) {
        existing.completed = true;
        existing.stars = stars;
        updateCoins(20);
        updateSolved(correct);
        showNotification(`🎉 Тема пройдена! +20🪙 и ${stars}⭐`, 'success');
    } else {
        updateCoins(15);
        showNotification(`🔄 Повторение! +15🪙`, 'success');
    }
    
    progress.topics[topic.id] = existing;
    AppState.progress[subject] = progress;
    saveState();
    setTimeout(() => navigateTo(Screens.LIFE_MAP, { subject }), 1500);
      }
// ==================== МОДУЛЬ ПИТОМЦА ====================
export function renderPetModule(app) {
    app.innerHTML = `
        <div class="card pet-module-card">
            <button class="back-btn" id="backFromPetBtn">↩️ Назад</button>
            <div class="pet-module-container">
                <h2 style="text-align: center;">🐾 Мой питомец</h2>
                <p style="text-align: center; padding: 40px;">🐱🛋️🎮<br>Модуль питомца загружается...</p>
                <button id="openFullPetBtn" style="margin-top: 20px;">🏠 Открыть комнату питомца</button>
            </div>
        </div>
    `;
    document.getElementById('backFromPetBtn').onclick = () => navigateTo(Screens.MAIN);
    document.getElementById('openFullPetBtn').onclick = () => import('../modules/pet-module.js').then(({ PetModule }) => new PetModule().renderFullRoom(app));
}

// ==================== ДОСТИЖЕНИЯ ====================
export function renderAchievements(app) {
    const achievements = getAchievements();
    app.innerHTML = `
        <div class="card">
            <div class="worlds-header">
                <button class="back-btn" id="backFromAchievementsBtn">↩️ Назад</button>
                <h2>🏆 ДОСТИЖЕНИЯ</h2>
                <div style="width: 100px;"></div>
            </div>
            <div class="achievements-grid">
                ${achievements.map(ach => `
                    <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${ach.unlocked ? '🏆' : '🔒'}</div>
                        <div class="achievement-name">${ach.name}</div>
                        <div class="achievement-desc">${ach.desc}</div>
                        <div class="achievement-reward">${ach.unlocked ? '✅' : `${ach.reward}🪙`}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('backFromAchievementsBtn').onclick = () => navigateTo(Screens.MAIN);
}

// ==================== РОДИТЕЛЬСКИЙ КАБИНЕТ ====================
export function renderParentCabinet(app) {
    const stats = getChildStats();
    app.innerHTML = `
        <div class="card">
            <div class="worlds-header">
                <button class="back-btn" id="backFromParentBtn">↩️ Назад</button>
                <h2>👨‍👩‍👧 РОДИТЕЛЬСКИЙ КАБИНЕТ</h2>
                <div style="width: 100px;"></div>
            </div>
            <div id="parentLoginArea">
                <p style="text-align: center;">Введите пароль</p>
                <input type="password" id="parentPasswordInput" placeholder="Пароль" style="width: 100%; padding: 15px; border-radius: 40px; text-align: center;">
                <button id="parentLoginBtn" style="margin-top: 15px;">🔓 Войти</button>
                <p style="text-align: center; margin-top: 10px; color: #888;">По умолчанию: 0000</p>
            </div>
            <div id="parentPanel" style="display: none;">
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-number">${stats.totalSolved}</div><div>📚 Решено</div></div>
                    <div class="stat-card"><div class="stat-number">${stats.coins}</div><div>🪙 Монет</div></div>
                    <div class="stat-card"><div class="stat-number">${stats.streak}</div><div>🔥 Дней</div></div>
                    <div class="stat-card"><div class="stat-number">${stats.totalGames}</div><div>🎮 Игр</div></div>
                </div>
                <h3>📊 Прогресс</h3>
                ${['math', 'russian', 'english', 'world'].map(s => `
                    <div class="progress-item"><span>${s}</span><div class="progress-bar"><div class="progress-fill" style="width: ${(stats.progress[s]||0)/25*100}%"></div></div><span>${stats.progress[s]||0}/25</span></div>
                `).join('')}
                <h3>⏰ Время сегодня</h3>
                <p><strong>${stats.timePlayedToday}</strong> из <strong>${stats.dailyLimit}</strong> минут</p>
                <button id="parentLogoutBtn" class="btn-secondary" style="margin-top: 20px;">🚪 Выйти</button>
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
    document.getElementById('parentLogoutBtn').onclick = () => {
        document.getElementById('parentLoginArea').style.display = 'block';
        document.getElementById('parentPanel').style.display = 'none';
    };
}

// ==================== НАСТРОЙКИ ====================
export function renderSettings(app) {
    app.innerHTML = `
        <div class="card">
            <div class="worlds-header"><button class="back-btn" id="backFromSettingsBtn">↩️ Назад</button><h2>⚙️ НАСТРОЙКИ</h2><div></div></div>
            <h3>🎨 Тема</h3>
            <select id="themeSelect" style="width:100%;padding:15px;border-radius:40px;">
                <option value="default" ${AppState.settings.theme==='default'?'selected':''}>☀️ Светлая</option>
                <option value="dark" ${AppState.settings.theme==='dark'?'selected':''}>🌙 Тёмная</option>
                <option value="forest" ${AppState.settings.theme==='forest'?'selected':''}>🌲 Лесная</option>
                <option value="ocean" ${AppState.settings.theme==='ocean'?'selected':''}>🌊 Морская</option>
            </select>
            <h3 style="margin-top:20px;">💾 Данные</h3>
            <button id="exportDataBtn">📤 Экспорт</button>
            <button id="importDataBtn" style="margin-top:10px;">📥 Импорт</button>
            <input type="file" id="importFileInput" accept=".json" style="display:none;">
            <h3 style="margin-top:20px;">🔄 Сброс</h3>
            <button id="resetDataBtn" class="btn-danger">🗑️ Сбросить прогресс</button>
        </div>
    `;
    document.getElementById('backFromSettingsBtn').onclick = () => navigateTo(Screens.MAIN);
    document.getElementById('themeSelect').onchange = e => { AppState.settings.theme = e.target.value; document.body.className = e.target.value==='default'?'':`theme-${e.target.value}`; saveState(); };
    document.getElementById('exportDataBtn').onclick = () => import('./storage.js').then(({ exportData }) => exportData());
    document.getElementById('importDataBtn').onclick = () => document.getElementById('importFileInput').click();
    document.getElementById('importFileInput').onchange = e => { if(e.target.files[0]) import('./storage.js').then(({ importData }) => importData(e.target.files[0])); };
    document.getElementById('resetDataBtn').onclick = () => import('./storage.js').then(({ resetState }) => resetState());
}

// ==================== ФРАЗЫ ПИТОМЦА ====================
function startPetPhrases() {
    const phrases = ['Хочу кушать! 😋', 'Поиграй со мной! 🎾', 'Ты лучший! 🥰', 'Я немного устал... 😴', 'Давай учиться! 📚'];
    setInterval(() => {
        const bubble = document.getElementById('homePetBubble');
        if (bubble && Math.random() > 0.6) {
            bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
            bubble.style.display = 'block';
            setTimeout(() => bubble.style.display = 'none', 3000);
        }
    }, 20000);
}

// ==================== СТИЛИ ====================
const style = document.createElement('style');
style.textContent = `
    .menu-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:30px 0}
    .menu-card{background:linear-gradient(135deg,#ffe0b0,#ffd699);border-radius:30px;padding:25px 15px;text-align:center;cursor:pointer;border:4px solid #d4a259;box-shadow:0 8px 0 #b47c2e}
    .menu-card:active{transform:translateY(4px);box-shadow:0 4px 0 #b47c2e}
    .menu-emoji{font-size:3.5rem;margin-bottom:10px}
    .menu-name{font-size:1.2rem;font-weight:bold}
    .achievements-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin:20px 0}
    .achievement-card{background:#ffe0b0;border-radius:20px;padding:20px;text-align:center;border:2px solid #d4a259}
    .achievement-card.locked{opacity:0.5}
    .achievement-icon{font-size:2.5rem;margin-bottom:10px}
    .achievement-name{font-weight:bold;margin-bottom:5px}
    .achievement-desc{font-size:0.8rem;color:#b57c1c;margin-bottom:10px}
    .achievement-reward{font-weight:bold;color:#b57c1c}
    @media (max-width:600px){.menu-grid{grid-template-columns:repeat(2,1fr)}.achievements-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);
