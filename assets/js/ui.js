// ==================== UI РЕНДЕРИНГ — ВСЕ ЭКРАНЫ ====================

// ==================== ОБНОВЛЕНИЕ СТАТИСТИКИ ====================
function updateStatsUI() {
    const ach = document.getElementById('achCount');
    const coin = document.getElementById('coinCount');
    const solved = document.getElementById('solvedCount');
    const streak = document.getElementById('streakCount');
    if (ach) ach.textContent = data.achievements.length;
    if (coin) coin.textContent = data.coins;
    if (solved) solved.textContent = data.total_solved;
    if (streak) streak.textContent = data.login_streak || 0;
    if (document.getElementById('shopCoins')) document.getElementById('shopCoins').textContent = data.coins;
    if (document.getElementById('avatarCoins')) document.getElementById('avatarCoins').textContent = data.coins;
    if (document.getElementById('themesCoins')) document.getElementById('themesCoins').textContent = data.coins;
}

function updateRobotAvatar() {
    const avatar = document.getElementById('robotAvatar');
    if (avatar) avatar.textContent = data.current_avatar || "🤖";
}

function updateRobotMessage(text) {
    const msg = document.getElementById('robotMsg');
    if (msg) msg.textContent = text;
}

// ==================== ВЫБОР АККАУНТА ====================
function renderChildList() {
    const c = document.getElementById('childList');
    if (!c) return;
    c.innerHTML = '';

    if (childrenList.length === 0) {
        childrenList = ['Ученик'];
        saveChildrenList();
        resetData();
        data.owned_avatars = ["🤖"];
        data.current_avatar = "🤖";
        data.owned_themes = ["default"];
        saveChildData('Ученик', data);
    }

    childrenList.forEach(name => {
        const div = document.createElement('div');
        div.className = 'child-card';
        div.textContent = name;
        div.onclick = () => {
            pendingChild = name;
            const modal = document.getElementById('childLoginModal');
            if (modal) modal.classList.add('active');
        };
        c.appendChild(div);
    });

    const addBtn = document.getElementById('addNewChildBtn');
    if (addBtn) addBtn.onclick = () => {
        const modal = document.getElementById('newChildModal');
        if (modal) modal.classList.add('active');
    };

    const parentBtn = document.getElementById('parentAccessBtn');
    if (parentBtn) parentBtn.onclick = () => showScreen('parent');
}

let pendingChild = null;

function setupModalButtons() {
    // Создание ребёнка
    const createBtn = document.getElementById('createChildBtn');
    const cancelNewBtn = document.getElementById('cancelNewChildBtn');
    if (createBtn) createBtn.onclick = () => {
        const name = document.getElementById('newChildName').value.trim();
        const pwd = document.getElementById('newChildPwd').value;
        if (!name) { showNotification('Введи имя', false); return; }
        if (childrenList.includes(name)) { showNotification('Такое имя уже есть', false); return; }
        childrenList.push(name);
        saveChildrenList();
        resetData();
        data.passwordHash = hashPassword(pwd);
        data.owned_avatars = ["🤖"];
        data.current_avatar = "🤖";
        data.owned_themes = ["default"];
        saveChildData(name, data);
        renderChildList();
        document.getElementById('newChildModal').classList.remove('active');
        document.getElementById('newChildName').value = '';
        document.getElementById('newChildPwd').value = '';
        showNotification(`Ученик ${name} создан!`, true);
    };
    if (cancelNewBtn) cancelNewBtn.onclick = () => {
        document.getElementById('newChildModal').classList.remove('active');
    };

    // Вход с паролем
    const submitPwdBtn = document.getElementById('submitChildPwdBtn');
    const cancelPwdBtn = document.getElementById('cancelChildLoginBtn');
    if (submitPwdBtn) submitPwdBtn.onclick = () => {
        const pwd = document.getElementById('childPwdInput').value;
        if (!pendingChild) return;
        const saved = localStorage.getItem('math_academy_child_' + pendingChild);
        if (saved) {
            const cd = JSON.parse(saved);
            if (verifyPassword(pwd, cd.passwordHash || hashPassword(''))) {
                enterChildMode(pendingChild);
                document.getElementById('childLoginModal').classList.remove('active');
                document.getElementById('childPwdInput').value = '';
            } else showNotification('Неверный пароль', false);
        } else {
            resetData();
            data.passwordHash = hashPassword(pwd);
            saveChildData(pendingChild, data);
            enterChildMode(pendingChild);
            document.getElementById('childLoginModal').classList.remove('active');
            document.getElementById('childPwdInput').value = '';
        }
    };
    if (cancelPwdBtn) cancelPwdBtn.onclick = () => {
        document.getElementById('childLoginModal').classList.remove('active');
        document.getElementById('childPwdInput').value = '';
        pendingChild = null;
    };

    // Питомец
    const petSave = document.getElementById('petNameSaveBtn');
    const petCancel = document.getElementById('petNameCancelBtn');
    if (petSave) petSave.onclick = () => {
        const newName = document.getElementById('petNameInput').value.trim();
        if (newName && data.pet) {
            data.pet.name = newName;
            saveData();
            showNotification('Имя сохранено', true);
            document.getElementById('petNameModal').classList.remove('active');
            renderPetScreen();
        }
    };
    if (petCancel) petCancel.onclick = () => document.getElementById('petNameModal').classList.remove('active');

    // Достижения
    const closeAch = document.getElementById('closeAchievementDescBtn');
    if (closeAch) closeAch.onclick = () => document.getElementById('achievementDescModal').classList.remove('active');
}

// ==================== УРОКИ ====================
function startLessonUI() {
    currentStep = 1;
    currentLives = 3;
    currentScore = 0;
    errorCount = 0;
    hintShown = false;
    totalSteps = 5;
    document.getElementById('stepTotal').textContent = totalSteps;
    document.getElementById('difficultyModal').classList.add('active');
}

// ==================== СПРАВОЧНИК ====================
function showRefTab(tabId) {
    let content = '';
    if (tabId === 'tab1') content = '<h3>➕ Сложение</h3><p>Сложение — это объединение чисел. Например, 5 + 3 = 8.</p>';
    else if (tabId === 'tab2') content = '<h3>➖ Вычитание</h3><p>Вычитание — это нахождение разности. Например, 8 - 3 = 5.</p>';
    else if (tabId === 'tab3') {
        content = '<h3>✖️ Таблица умножения</h3><div style="overflow-x:auto;"><table style="margin:auto; border-collapse:collapse;">';
        for (let i = 1; i <= 9; i++) {
            content += '<tr>';
            for (let j = 1; j <= 9; j++) content += `<td style="border:1px solid #ccc; padding:8px;">${i}×${j}=${i*j}</td>`;
            content += '</tr>';
        }
        content += '</table></div>';
    }
    else if (tabId === 'tab4') content = '<h3>➗ Деление</h3><p>Деление — это разбиение на равные части. 12 ÷ 3 = 4.</p>';
    else if (tabId === 'tab5') content = '<h3>🍕 Дроби</h3><p>Дроби показывают часть от целого. 1/2 — это половина.</p>';
    else if (tabId === 'tab6') content = '<h3>🕰️ Время</h3><p>1 час = 60 минут, 1 сутки = 24 часа</p>';
    else if (tabId === 'tab7') content = '<h3>📏 Единицы измерения</h3><p>1 м = 100 см, 1 кг = 1000 г, 1 л = 1000 мл</p>';
    else if (tabId === 'tab8') content = '<h3>💰 Деньги</h3><p>Монеты: 1₽, 2₽, 5₽, 10₽. Купюры: 50₽, 100₽, 500₽, 1000₽</p>';
    else if (tabId === 'tab9') {
        content = '<h3>❌ Мои ошибки</h3>';
        if (data.mistakes.length === 0) content += '<p>✨ Пока нет ошибок! Так держать!</p>';
        else data.mistakes.slice(0, 10).forEach(m => {
            content += `<div style="background:#ffe0b5; border-radius:20px; padding:10px; margin:10px 0;"><strong>${m.date}</strong><br>📝 ${m.question}<br>❌ Твой ответ: ${m.userAnswer}<br>✅ Правильно: ${m.correctAnswer}</div>`;
        });
    }
    const ref = document.getElementById('refContent');
    if (ref) ref.innerHTML = content;
}

// ==================== НАСТРОЙКИ ====================
function initSettings() {
    const musicToggle = document.getElementById('musicToggle');
    const themeSelect = document.getElementById('themeSelect');
    const voiceToggle = document.getElementById('voiceToggle');
    if (musicToggle) { musicToggle.checked = musicEnabled; musicToggle.onchange = (e) => { musicEnabled = e.target.checked; }; }
    if (voiceToggle) { voiceToggle.checked = voiceEnabled; voiceToggle.onchange = (e) => { voiceEnabled = e.target.checked; }; }
    if (themeSelect) {
        themeSelect.value = data.skin_theme || 'default';
        themeSelect.onchange = (e) => {
            if (data.owned_themes.includes(e.target.value) || e.target.value === 'default') applyTheme(e.target.value);
            else { showNotification('Сначала купи эту тему!', false); themeSelect.value = data.skin_theme; }
        };
    }
}

function applyTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-forest', 'theme-ocean');
    if (theme === 'ocean') document.body.classList.add('theme-ocean');
    else if (theme === 'forest') document.body.classList.add('theme-forest');
    else if (theme === 'dark') document.body.classList.add('theme-dark');
    data.skin_theme = theme;
    saveData();
}

// ==================== РОДИТЕЛЬСКАЯ ПАНЕЛЬ ====================
function renderChildManagement() {
    const c = document.getElementById('childManagement');
    if (!c) return;
    c.innerHTML = '';
    childrenList.forEach(name => {
        const div = document.createElement('div');
        div.style.cssText = 'background:#ffefc0; border-radius:30px; padding:10px; margin:5px; display:inline-block;';
        div.innerHTML = `<strong>${name}</strong> <button class="delChildBtn" data-name="${name}">❌</button>`;
        c.appendChild(div);
    });
    document.querySelectorAll('.delChildBtn').forEach(btn => {
        btn.onclick = (e) => {
            const name = e.target.dataset.name;
            if (confirm(`Удалить ${name}?`)) {
                childrenList = childrenList.filter(n => n !== name);
                saveChildrenList();
                localStorage.removeItem('math_academy_child_' + name);
                if (childrenList.length === 0) { childrenList = ['Ученик']; saveChildrenList(); resetData(); saveChildData('Ученик', data); }
                renderChildManagement();
                renderParentChildSelector();
                if (currentChild === name) { currentChild = childrenList[0]; loadChildData(currentChild); updateStatsUI(); }
            }
        };
    });
}

function renderParentChildSelector() {
    const sel = document.getElementById('parentChildSelector');
    if (!sel) return;
    sel.innerHTML = '';
    childrenList.forEach(name => { const o = document.createElement('option'); o.value = name; o.textContent = name; sel.appendChild(o); });
    if (childrenList.length) renderChildStats(childrenList[0]);
}

function renderChildStats(childName) {
    const saved = localStorage.getItem('math_academy_child_' + childName);
    const cd = saved ? JSON.parse(saved) : data;
    const spent = (cd.purchase_log || []).reduce((a, p) => a + p.cost, 0);
    const html = `<div style="background:#fff7e6; border-radius:30px; padding:20px;">
        <div class="stat-row"><span class="stat-label">📚 Решено:</span><span>${cd.total_solved||0}</span></div>
        <div class="stat-row"><span class="stat-label">🪙 Монет:</span><span>${cd.coins||0}</span></div>
        <div class="stat-row"><span class="stat-label">💰 Заработано:</span><span>${cd.coins_earned_total||0}</span></div>
        <div class="stat-row"><span class="stat-label">💸 Потрачено:</span><span>${spent}</span></div>
        <div class="stat-row"><span class="stat-label">🔥 Серия:</span><span>${cd.login_streak||0} дн.</span></div>
    </div>`;
    const full = document.getElementById('childStatsFull');
    if (full) full.innerHTML = html;
    const earned = document.getElementById('pcEarned');
    const spentEl = document.getElementById('pcSpent');
    if (earned) earned.textContent = cd.coins_earned_total || 0;
    if (spentEl) spentEl.textContent = spent;
}

// ==================== ИНИЦИАЛИЗАЦИЯ ВСЕХ КНОПОК ====================
function initAllButtons() {
    // Навигация
    document.querySelectorAll('[data-screen]').forEach(btn => btn.onclick = () => showScreen(btn.dataset.screen));
    document.querySelectorAll('[data-back]').forEach(btn => btn.onclick = () => showScreen(btn.dataset.back));
    document.querySelectorAll('[data-world]').forEach(btn => btn.onclick = () => {
        currentWorld = btn.dataset.world;
        currentSection = 'standard';
        if (currentWorld === 'compare') currentSection = 'compare';
        showScreen('lessonScreen');
        startLessonUI();
    });
    document.querySelectorAll('[data-section]').forEach(btn => btn.onclick = () => {
        currentSection = btn.dataset.section;
        showScreen('lessonScreen');
        startLessonUI();
    });

    // Урок: ответ
    const submitAnswer = document.getElementById('submitAnswer');
    if (submitAnswer) submitAnswer.onclick = () => {
        const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
        let correct = false;
        if (typeof currentTask?.answer === 'number') correct = parseInt(userAnswer) === currentTask.answer;
        else correct = userAnswer === currentTask?.answer.toString().toLowerCase();
        if (correct) {
            playSound('correct'); showNotification('✅ Правильно!', true);
            currentScore++; data.total_solved++;
            let reward = 1;
            if (data.boosters.multiplier > 0 && data.boosters.multiplier_left > 0) { reward *= data.boosters.multiplier; data.boosters.multiplier_left--; }
            if (data.boosters.luck) reward = Math.floor(reward * 1.1);
            data.coins += reward; data.coins_earned_total += reward;
            currentStep++; errorCount = 0; hintShown = false;
            updateDailyTask(0, 1); updateDailyProgress();
            nextTask();
        } else {
            playSound('wrong'); showNotification('❌ Неправильно', false);
            currentLives--; errorCount++;
            if (currentTask) { data.mistakes.unshift({ date: new Date().toLocaleString(), question: currentTask.text, userAnswer, correctAnswer: currentTask.answer }); if (data.mistakes.length > 20) data.mistakes.pop(); }
            if (errorCount >= 2 && !hintShown) { showHint(); hintShown = true; }
            if (currentLives <= 0) {
                if (data.revive_token > 0) { data.revive_token--; currentLives = 3; showNotification('♻️ Воскрешён!', true); }
                else { showNotification('😢 Проиграл...', false); saveData(); showScreen('mainMenu'); return; }
            }
            let hearts = ''; for (let i = 0; i < currentLives; i++) hearts += '❤️'; for (let i = currentLives; i < 3; i++) hearts += '🩶';
            document.getElementById('livesDisplay').innerHTML = hearts;
        }
        saveData(); updateStatsUI(); checkAllAchievements();
    };

    // Урок: пропуск
    const skipBtn = document.getElementById('skipLesson');
    if (skipBtn) skipBtn.onclick = () => {
        if (data.skip_token > 0) { data.skip_token--; currentStep++; nextTask(); saveData(); updateStatsUI(); showNotification('⏭️ Пропущено', true); }
        else showNotification('Нет пропусков', false);
    };

    // Урок: выход
    const quitBtn = document.getElementById('quitLesson');
    if (quitBtn) quitBtn.onclick = () => showScreen('mainMenu');

    // Сложность
    document.getElementById('diffEasy')?.addEventListener('click', () => setDifficulty(10));
    document.getElementById('diffMedium')?.addEventListener('click', () => setDifficulty(50));
    document.getElementById('diffHard')?.addEventListener('click', () => setDifficulty(100));
    document.getElementById('cancelDifficulty')?.addEventListener('click', () => {
        document.getElementById('difficultyModal').classList.remove('active');
        showScreen('mainMenu');
    });

    // Игры
    document.getElementById('showMaze')?.addEventListener('click', startMazeGame);
    document.getElementById('showWord')?.addEventListener('click', startWordGame);
    document.getElementById('showCheckers')?.addEventListener('click', startCheckers);
    document.getElementById('showTicTac')?.addEventListener('click', startTicTac);
    document.getElementById('showMemory')?.addEventListener('click', startMemoryGame);
    document.getElementById('showBattleship')?.addEventListener('click', startBattleship);
    document.getElementById('showSudoku')?.addEventListener('click', startSudoku);
    document.getElementById('showShootGame')?.addEventListener('click', startShootGame);
    document.getElementById('showCompareFast')?.addEventListener('click', startCompareFast);
    document.getElementById('showFingerCount')?.addEventListener('click', startFingerCount);
    document.getElementById('showNumberComposition')?.addEventListener('click', startNumberComposition);
    document.getElementById('showClockGame')?.addEventListener('click', startClockGame);
    document.getElementById('showChangeGame')?.addEventListener('click', startChangeGame);
    document.getElementById('showPet')?.addEventListener('click', () => { showScreen('petScreen'); renderPetScreen(); });

    // Магазин
    document.getElementById('shopBuyBtn')?.addEventListener('click', () => { showScreen('shop'); renderShop(); });
    document.getElementById('shopInventoryBtn')?.addEventListener('click', () => { showScreen('inventory'); renderInventory(); });
    document.getElementById('shopAvatarBtn')?.addEventListener('click', () => { showScreen('avatarShop'); renderAvatarShop(); });
    document.getElementById('shopThemesBtn')?.addEventListener('click', () => { showScreen('themesShop'); renderThemesShop(); });

    // Главное меню
    document.getElementById('switchChildBtn')?.addEventListener('click', () => { document.getElementById('robotHeader').style.display = 'none'; document.getElementById('statsHeader').style.display = 'none'; showScreen('childSelect'); });
    document.getElementById('exitBtn')?.addEventListener('click', () => { if (confirm('Закрыть игру?')) window.close(); });

    // Родительский кабинет
    document.getElementById('enterParentBtn')?.addEventListener('click', () => {
        if (verifyMasterPassword(document.getElementById('parentPwd').value)) {
            document.getElementById('parentLoginArea').style.display = 'none';
            document.getElementById('parentPanel').style.display = 'block';
            renderChildManagement(); renderParentChildSelector();
            showNotification('Добро пожаловать!', true);
        } else showNotification('Неверный пароль', false);
    });
    document.getElementById('addChildFromParentBtn')?.addEventListener('click', () => document.getElementById('newChildModal').classList.add('active'));
    document.getElementById('parentChildSelector')?.addEventListener('change', (e) => renderChildStats(e.target.value));
    document.getElementById('pcSetLimitBtn')?.addEventListener('click', () => { data.daily_play_limit = parseInt(document.getElementById('pcTimeLimit').value)||0; saveData(); });
    document.getElementById('changeMasterPwdBtn')?.addEventListener('click', () => { const np = prompt('Новый пароль:'); if (np) setMasterPassword(np); });
    document.getElementById('parentLogoutBtn')?.addEventListener('click', () => { document.getElementById('parentLoginArea').style.display = 'block'; document.getElementById('parentPanel').style.display = 'none'; showScreen('mainMenu'); });

    // Вкладки справочника
    document.querySelectorAll('.ref-tab').forEach(tab => tab.onclick = () => showRefTab(tab.dataset.ref));

    // Настройки
    initSettings();

    // Модальные окна
    setupModalButtons();
}

// ==================== ЗАПУСК ====================
document.addEventListener('DOMContentLoaded', () => {
    initAllButtons();
});
