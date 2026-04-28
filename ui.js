// ==================== UI РЕНДЕРИНГ — ВСЕ ЭКРАНЫ ====================

// ==================== ОБНОВЛЕНИЕ СТАТИСТИКИ ====================
function updateStatsUI() {
    document.getElementById('achCount').textContent = data.achievements.length;
    document.getElementById('coinCount').textContent = data.coins;
    document.getElementById('solvedCount').textContent = data.total_solved;
    document.getElementById('streakCount').textContent = data.login_streak || 0;
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
    childrenList.forEach(name => {
        const btn = document.createElement('div');
        btn.className = 'child-card';
        btn.textContent = name;
        btn.onclick = () => promptChildPassword(name);
        c.appendChild(btn);
    });
    document.getElementById('addNewChildBtn').onclick = () => document.getElementById('newChildModal').classList.add('active');
    document.getElementById('parentAccessBtn').onclick = () => showScreen('parent');
}

let pendingChild = null;

function promptChildPassword(name) {
    pendingChild = name;
    document.getElementById('childLoginModal').classList.add('active');
}

// ==================== ГЛАВНОЕ МЕНЮ ====================
function renderMainMenu() {
    document.getElementById('robotHeader').style.display = 'flex';
    document.getElementById('statsHeader').style.display = 'flex';
    updateStatsUI();
    updateRobotAvatar();
    updateRobotMessage(`Привет, ${currentChild || 'Ученик'}! Решено: ${data.total_solved}`);
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
            for (let j = 1; j <= 9; j++) content += `<td style="border:1px solid #ccc; padding:8px; text-align:center;">${i}×${j}=${i*j}</td>`;
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
        else {
            data.mistakes.slice(0, 10).forEach(m => {
                content += `<div style="background:#ffe0b5; border-radius:20px; padding:10px; margin:10px 0;"><strong>${m.date}</strong><br>📝 ${m.question}<br>❌ Твой ответ: ${m.userAnswer}<br>✅ Правильно: ${m.correctAnswer}</div>`;
            });
        }
    }
    document.getElementById('refContent').innerHTML = content;
}

// ==================== НАСТРОЙКИ ====================
function initSettings() {
    const musicToggle = document.getElementById('musicToggle');
    const themeSelect = document.getElementById('themeSelect');
    const voiceToggle = document.getElementById('voiceToggle');
    if (musicToggle) {
        musicToggle.checked = musicEnabled;
        musicToggle.onchange = (e) => { musicEnabled = e.target.checked; };
    }
    if (voiceToggle) {
        voiceToggle.checked = voiceEnabled;
        voiceToggle.onchange = (e) => { voiceEnabled = e.target.checked; };
    }
    if (themeSelect) {
        themeSelect.value = data.skin_theme || 'default';
        themeSelect.onchange = (e) => {
            if (data.owned_themes.includes(e.target.value) || e.target.value === 'default') {
                applyTheme(e.target.value);
            } else {
                showNotification('Сначала купи эту тему в магазине!', false);
                themeSelect.value = data.skin_theme;
            }
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

// ==================== РОДИТЕЛЬСКИЙ КАБИНЕТ ====================
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
                if (childrenList.length === 0) {
                    childrenList = ['Ученик'];
                    saveChildrenList();
                    resetData();
                    saveChildData('Ученик', data);
                }
                renderChildManagement();
                renderParentChildSelector();
                if (currentChild === name) {
                    currentChild = childrenList[0];
                    loadChildData(currentChild);
                    updateStatsUI();
                }
                showNotification('Профиль удалён', false);
            }
        };
    });
}

function renderParentChildSelector() {
    const sel = document.getElementById('parentChildSelector');
    if (!sel) return;
    sel.innerHTML = '';
    childrenList.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
    });
    if (childrenList.length) renderChildStats(childrenList[0]);
}

function renderChildStats(childName) {
    const saved = localStorage.getItem('math_academy_child_' + childName);
    const cd = saved ? JSON.parse(saved) : data;
    const spent = (cd.purchase_log || []).reduce((a, p) => a + p.cost, 0);
    let html = `<div style="background:#fff7e6; border-radius:30px; padding:20px;">`;
    html += `<div class="stat-row"><span class="stat-label">📚 Решено задач:</span><span>${cd.total_solved || 0}</span></div>`;
    html += `<div class="stat-row"><span class="stat-label">🪙 Монет:</span><span>${cd.coins || 0}</span></div>`;
    html += `<div class="stat-row"><span class="stat-label">💰 Заработано всего:</span><span>${cd.coins_earned_total || 0}</span></div>`;
    html += `<div class="stat-row"><span class="stat-label">💸 Потрачено:</span><span>${spent}</span></div>`;
    html += `<div class="stat-row"><span class="stat-label">🔥 Серия входов:</span><span>${cd.login_streak || 0} дней</span></div>`;
    html += `</div>`;
    document.getElementById('childStatsFull').innerHTML = html;
    document.getElementById('pcEarned').textContent = cd.coins_earned_total || 0;
    document.getElementById('pcSpent').textContent = spent;
}

// ==================== ИНИЦИАЛИЗАЦИЯ ВСЕХ КНОПОК И ОБРАБОТЧИКОВ ====================
function initAllButtons() {
    // Кнопки навигации по data-screen
    document.querySelectorAll('[data-screen]').forEach(btn => {
        btn.onclick = () => showScreen(btn.dataset.screen);
    });
    // Кнопки назад по data-back
    document.querySelectorAll('[data-back]').forEach(btn => {
        btn.onclick = () => showScreen(btn.dataset.back);
    });
    
    // Кнопки миров (уроки)
    document.querySelectorAll('[data-world]').forEach(btn => {
        btn.onclick = () => {
            currentWorld = btn.dataset.world;
            currentSection = 'standard';
            if (currentWorld === 'compare') currentSection = 'compare';
            showScreen('lessonScreen');
            startLessonUI();
        };
    });
    // Кнопки секций
    document.querySelectorAll('[data-section]').forEach(btn => {
        btn.onclick = () => {
            currentSection = btn.dataset.section;
            showScreen('lessonScreen');
            startLessonUI();
        };
    });
    
    // Кнопка отправки ответа
    document.getElementById('submitAnswer').onclick = () => {
        const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
        let correct = false;
        if (typeof currentTask?.answer === 'number') {
            const num = parseInt(userAnswer);
            if (!isNaN(num) && num === currentTask.answer) correct = true;
        } else {
            if (userAnswer === currentTask?.answer.toString().toLowerCase()) correct = true;
        }
        if (correct) {
            playSound('correct');
            showNotification('✅ Правильно!', true);
            currentScore++;
            data.total_solved++;
            let reward = 1;
            if (data.boosters.multiplier > 0 && data.boosters.multiplier_left > 0) {
                reward *= data.boosters.multiplier;
                data.boosters.multiplier_left--;
                if (data.boosters.multiplier_left === 0) data.boosters.multiplier = 0;
            }
            if (data.boosters.luck) reward = Math.floor(reward * 1.1);
            data.coins += reward;
            data.coins_earned_total += reward;
            currentStep++;
            errorCount = 0;
            hintShown = false;
            updateDailyTask(0, 1);
            updateDailyProgress();
            nextTask();
        } else {
            playSound('wrong');
            showNotification('❌ Неправильно', false);
            currentLives--;
            errorCount++;
            if (currentTask) {
                data.mistakes.unshift({ date: new Date().toLocaleString(), question: currentTask.text, userAnswer: userAnswer, correctAnswer: currentTask.answer });
                if (data.mistakes.length > 20) data.mistakes.pop();
            }
            if (errorCount >= 2 && !hintShown) { showHint(); hintShown = true; }
            if (currentLives <= 0) {
                if (data.revive_token > 0) {
                    data.revive_token--;
                    currentLives = 3;
                    showNotification('♻️ Воскрешён!', true);
                } else {
                    showNotification('😢 Ты проиграл...', false);
                    playSound('gameover');
                    saveData();
                    showScreen('mainMenu');
                    return;
                }
            }
            let hearts = '';
            for (let i = 0; i < currentLives; i++) hearts += '❤️';
            for (let i = currentLives; i < 3; i++) hearts += '🩶';
            document.getElementById('livesDisplay').innerHTML = hearts;
        }
        saveData();
        updateStatsUI();
        checkAllAchievements();
    };
    
    // Пропуск задания
    document.getElementById('skipLesson').onclick = () => {
        if (data.skip_token > 0) {
            data.skip_token--;
            currentStep++;
            showNotification('⏭️ Пропуск', true);
            playSound('move');
            nextTask();
            saveData();
            updateStatsUI();
        } else {
            showNotification('Нет пропусков', false);
        }
    };
    
    // Выход из урока
    document.getElementById('quitLesson').onclick = () => showScreen('mainMenu');
    
    // Сложность
    document.getElementById('diffEasy').onclick = () => setDifficulty(10);
    document.getElementById('diffMedium').onclick = () => setDifficulty(50);
    document.getElementById('diffHard').onclick = () => setDifficulty(100);
    document.getElementById('cancelDifficulty').onclick = () => {
        document.getElementById('difficultyModal').classList.remove('active');
        showScreen('mainMenu');
    };
    
    // Игры
    document.getElementById('showMaze').onclick = startMazeGame;
    document.getElementById('showWord').onclick = startWordGame;
    document.getElementById('showCheckers').onclick = startCheckers;
    document.getElementById('showTicTac').onclick = startTicTac;
    document.getElementById('showMemory').onclick = startMemoryGame;
    document.getElementById('showBattleship').onclick = startBattleship;
    document.getElementById('showSudoku').onclick = startSudoku;
    document.getElementById('showShootGame').onclick = startShootGame;
    document.getElementById('showCompareFast').onclick = startCompareFast;
    document.getElementById('showFingerCount').onclick = startFingerCount;
    document.getElementById('showNumberComposition').onclick = startNumberComposition;
    document.getElementById('showClockGame').onclick = startClockGame;
    document.getElementById('showChangeGame').onclick = startChangeGame;
    document.getElementById('showPet').onclick = () => { showScreen('petScreen'); renderPetScreen(); };
    
    // Магазин
    document.getElementById('shopBuyBtn').onclick = () => { showScreen('shop'); renderShop(); };
    document.getElementById('shopInventoryBtn').onclick = () => { showScreen('inventory'); renderInventory(); };
    document.getElementById('shopAvatarBtn').onclick = () => { showScreen('avatarShop'); renderAvatarShop(); };
    document.getElementById('shopThemesBtn').onclick = () => { showScreen('themesShop'); renderThemesShop(); };
    
    // Переключение между детьми
    document.getElementById('switchChildBtn').onclick = () => {
        document.getElementById('robotHeader').style.display = 'none';
        document.getElementById('statsHeader').style.display = 'none';
        showScreen('childSelect');
    };
    document.getElementById('exitBtn').onclick = () => { if (confirm('Закрыть игру?')) window.close(); };
    
    // Профиль ребёнка
    document.getElementById('submitChildPwdBtn').onclick = () => {
        const pwd = document.getElementById('childPwdInput').value;
        if (!pendingChild) return;
        const saved = localStorage.getItem('math_academy_child_' + pendingChild);
        if (saved) {
            const cd = JSON.parse(saved);
            if (verifyPassword(pwd, cd.passwordHash || hashPassword(''))) enterChildMode(pendingChild);
            else showNotification('Неверный пароль', false);
        } else {
            resetData();
            data.passwordHash = hashPassword(pwd);
            saveChildData(pendingChild, data);
            enterChildMode(pendingChild);
        }
        document.getElementById('childLoginModal').classList.remove('active');
    };
    document.getElementById('cancelChildLoginBtn').onclick = () => {
        document.getElementById('childLoginModal').classList.remove('active');
        pendingChild = null;
    };
    
    // Создание ребёнка
    document.getElementById('createChildBtn').onclick = () => {
        const name = document.getElementById('newChildName').value.trim();
        const pwd = document.getElementById('newChildPwd').value;
        if (!name) { showNotification('Введите имя', false); return; }
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
        showNotification(`Ребёнок ${name} создан`, true);
    };
    document.getElementById('cancelNewChildBtn').onclick = () => document.getElementById('newChildModal').classList.remove('active');
    
    // Родительский кабинет
    document.getElementById('enterParentBtn').onclick = () => {
        const pwd = document.getElementById('parentPwd').value;
        if (verifyMasterPassword(pwd)) {
            document.getElementById('parentLoginArea').style.display = 'none';
            document.getElementById('parentPanel').style.display = 'block';
            renderChildManagement();
            renderParentChildSelector();
            showNotification('Добро пожаловать, родитель!', true);
            playSound('achievement');
        } else {
            showNotification('Неверный пароль', false);
        }
    };
    document.getElementById('addChildFromParentBtn').onclick = () => document.getElementById('newChildModal').classList.add('active');
    document.getElementById('parentChildSelector').onchange = (e) => renderChildStats(e.target.value);
    document.getElementById('pcSetLimitBtn').onclick = () => {
        const limit = parseInt(document.getElementById('pcTimeLimit').value);
        if (!isNaN(limit)) {
            data.daily_play_limit = limit;
            saveData();
            showNotification('Лимит установлен', true);
        }
    };
    document.getElementById('changeMasterPwdBtn').onclick = () => {
        const np = prompt("Новый мастер-пароль:");
        if (np) setMasterPassword(np);
        showNotification("Пароль изменён", true);
    };
    document.getElementById('parentLogoutBtn').onclick = () => {
        document.getElementById('parentLoginArea').style.display = 'block';
        document.getElementById('parentPanel').style.display = 'none';
        showScreen('mainMenu');
    };
    
    // Питомец
    document.getElementById('petNameSaveBtn').onclick = () => {
        const newName = document.getElementById('petNameInput').value.trim();
        if (newName && data.pet) {
            data.pet.name = newName;
            saveData();
            showNotification('Имя сохранено', true);
            document.getElementById('petNameModal').classList.remove('active');
            renderPetScreen();
        }
    };
    document.getElementById('petNameCancelBtn').onclick = () => document.getElementById('petNameModal').classList.remove('active');
    
    // Достижения
    document.getElementById('closeAchievementDescBtn').onclick = () => document.getElementById('achievementDescModal').classList.remove('active');
    
    // Вкладки справочника
    document.querySelectorAll('.ref-tab').forEach(tab => {
        tab.onclick = () => showRefTab(tab.dataset.ref);
    });
    
    // Настройки
    initSettings();
}

// ==================== ЗАПУСК ПОСЛЕ ЗАГРУЗКИ ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initAllButtons();
});
