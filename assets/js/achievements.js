// ==================== ДОСТИЖЕНИЯ ====================

// Список достижений уже в state.js (achievementsList)
// Здесь — логика проверки, выдачи и отображения

// ==================== ДОБАВИТЬ ДОСТИЖЕНИЕ ====================
function addAchievement(id) {
    const ach = achievementsList.find(a => a.id === id);
    if (ach && !data.achievements.includes(ach.name)) {
        data.achievements.push(ach.name);
        let reward = ach.reward || 10;
        if (data.boosters.luck) reward = Math.floor(reward * 1.1);
        data.coins += reward;
        data.coins_earned_total += reward;
        saveData();
        showNotification(`✨ Новая награда: ${ach.name} +${reward}🪙`, true);
        playSound('achievement');
        showConfetti('achievement');
        refreshAchievements();
        updateStatsUI();
    }
}

// ==================== ПРОВЕРИТЬ ВСЕ ДОСТИЖЕНИЯ ====================
function checkAllAchievements() {
    if (data.total_solved >= 1) addAchievement('first');
    if (data.total_solved >= 10) addAchievement('ten');
    if (data.total_solved >= 20) addAchievement('twenty');
    if (data.total_solved >= 50) addAchievement('fifty');
    if (data.total_solved >= 100) addAchievement('hundred');
    if (data.coins_earned_total >= 10) addAchievement('coin10');
    if (data.coins_earned_total >= 50) addAchievement('coin50');
    if (data.coins_earned_total >= 100) addAchievement('coin100');
    if (data.login_streak >= 3) addAchievement('streak3');
    if (data.login_streak >= 7) addAchievement('streak7');
    if (data.perfect_rounds >= 1) addAchievement('perfect1');
    if (data.purchases_count >= 1) addAchievement('buyFirst');
    if (data.skip_token >= 3) addAchievement('collector');
    if (data.pet) addAchievement('petOwner');
}

// ==================== ОТОБРАЖЕНИЕ ДОСТИЖЕНИЙ ====================
function refreshAchievements() {
    const list = document.getElementById('achievementList');
    if (!list) return;
    list.innerHTML = '';
    if (data.achievements.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px;">Пока нет наград. Решай задачи и получай достижения! 🏆</p>';
        return;
    }
    data.achievements.forEach(achName => {
        const ach = achievementsList.find(a => a.name === achName);
        const span = document.createElement('span');
        span.className = 'achievement-badge';
        span.textContent = `⭐ ${achName}`;
        span.onclick = () => {
            document.getElementById('achievementModalTitle').textContent = achName;
            document.getElementById('achievementModalText').textContent = ach ? ach.desc : achName;
            document.getElementById('achievementDescModal').classList.add('active');
        };
        list.appendChild(span);
    });
}
