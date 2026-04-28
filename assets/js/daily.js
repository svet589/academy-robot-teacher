// ==================== ЕЖЕДНЕВНЫЕ ЗАДАНИЯ ====================

// Проверка и сброс заданий при новом дне
function checkDailyTasks() {
    const today = new Date().toDateString();
    if (data.last_daily_date !== today) {
        data.daily_tasks = [
            { desc: "Реши 5 примеров", target: 5, progress: 0, reward: 10, done: false },
            { desc: "Выиграй в игре", target: 1, progress: 0, reward: 5, done: false },
            { desc: "Купи в магазине", target: 1, progress: 0, reward: 8, done: false }
        ];
        data.last_daily_date = today;
        saveData();
    }
}

// Отображение заданий
function renderDailyTasks() {
    const c = document.getElementById('dailyTasksList');
    if (!c) return;
    checkDailyTasks();
    c.innerHTML = '';
    (data.daily_tasks || []).forEach(t => {
        c.innerHTML += `<div class="daily-task ${t.done ? 'done' : ''}"><span>${t.desc} (${t.progress}/${t.target})</span><span>+${t.reward}🪙</span></div>`;
    });
}

// Обновление прогресса задания
function updateDailyTask(idx, inc = 1) {
    if (data.daily_tasks && data.daily_tasks[idx] && !data.daily_tasks[idx].done) {
        data.daily_tasks[idx].progress += inc;
        if (data.daily_tasks[idx].progress >= data.daily_tasks[idx].target) {
            data.daily_tasks[idx].done = true;
            let reward = data.daily_tasks[idx].reward;
            if (data.boosters.luck) reward = Math.floor(reward * 1.1);
            data.coins += reward;
            data.coins_earned_total += reward;
            showNotification(`✅ Задание выполнено! +${reward}🪙`, true);
            playSound('coin');
            saveData();
            updateStatsUI();
        }
    }
}

// Ежедневный бонус за вход
function checkDailyBonus() {
    const today = new Date().toDateString();
    if (data.last_login_date !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (data.last_login_date === yesterday) {
            data.login_streak = (data.login_streak || 0) + 1;
        } else {
            data.login_streak = 1;
        }
        let bonus = 5 + Math.min(data.login_streak, 7) * 2;
        if (data.pet && data.pet.type === 'fox') bonus += 1;
        if (data.pet && data.pet.type === 'penguin' && new Date().getDay() === 1) bonus += 5;
        data.coins += bonus;
        data.coins_earned_total += bonus;
        showNotification(`🎁 Ежедневный бонус! +${bonus}🪙 (день ${data.login_streak})`, true);
        playSound('coin');
        data.last_login_date = today;
        saveData();
        updateStatsUI();
        checkAllAchievements();
    }
}

// Обновление статистики по дням
function updateDailyProgress() {
    const today = new Date().toDateString();
    const existing = data.daily_stats.find(d => d.date === today);
    if (existing) {
        existing.solved = data.total_solved;
    } else {
        data.daily_stats.push({ date: today, solved: data.total_solved });
    }
    if (data.daily_stats.length > 30) {
        data.daily_stats = data.daily_stats.slice(-30);
    }
    saveData();
            }
