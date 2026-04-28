// ==================== МАГАЗИН ====================

// ==================== ОТОБРАЖЕНИЕ МАГАЗИНА ====================
function renderShop() {
    const grid = document.getElementById('shopItemsGrid');
    if (!grid) return;
    document.getElementById('shopCoins').textContent = data.coins;
    grid.innerHTML = '';
    
    // Товары
    shopGoods.forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = `${item.name} (${item.price}🪙) - ${item.desc}`;
        btn.onclick = () => {
            if (data.coins >= item.price) {
                data.coins -= item.price;
                if (item.id === 'skip') data.skip_token++;
                if (item.id === 'revive') data.revive_token++;
                if (item.id === 'multiplier') { data.boosters.multiplier = 2; data.boosters.multiplier_left = 3; }
                if (item.id === 'shield') data.boosters.shield = true;
                if (item.id === 'luck') data.boosters.luck = true;
                if (item.id === 'chest') {
                    const bonus = Math.floor(Math.random() * 91) + 10;
                    data.coins += bonus;
                    data.coins_earned_total += bonus;
                    showNotification(`🎁 Секретный сундук: +${bonus}🪙!`, true);
                }
                data.purchases_count++;
                data.purchase_log.push({ timestamp: Date.now(), item: item.name, cost: item.price });
                saveData();
                updateStatsUI();
                renderShop();
                showNotification(`Куплено: ${item.name}!`, true);
                playSound('coin');
                checkAllAchievements();
                updateDailyTask(2, 1);
            } else {
                showNotification('Не хватает монет!', false);
            }
        };
        grid.appendChild(btn);
    });
    
    // Питомцы
    petsList.forEach(pet => {
        const btn = document.createElement('button');
        btn.textContent = `${pet.emoji} ${pet.name} (${pet.price}🪙) - ${pet.abilityDesc}`;
        btn.onclick = () => {
            if (data.pet) { showNotification('У тебя уже есть питомец!', false); return; }
            if (data.coins >= pet.price) {
                data.coins -= pet.price;
                data.pet = { type: pet.type, name: pet.name, level: 1, feedCount: 0, petCount: 0, ability: pet.ability };
                data.purchases_count++;
                saveData();
                updateStatsUI();
                renderShop();
                renderPetScreen();
                showNotification(`Ты купил ${pet.name}!`, true);
                playSound('coin');
                checkAllAchievements();
                document.getElementById('petNameModal').classList.add('active');
            } else {
                showNotification('Не хватает монет!', false);
            }
        };
        grid.appendChild(btn);
    });
}

// ==================== СКИНЫ РОБОТА ====================
function renderAvatarShop() {
    const grid = document.getElementById('avatarGrid');
    if (!grid) return;
    document.getElementById('avatarCoins').textContent = data.coins;
    grid.innerHTML = '';
    
    avatarsList.forEach(av => {
        const owned = data.owned_avatars.includes(av.emoji);
        const isCurrent = data.current_avatar === av.emoji;
        const div = document.createElement('div');
        div.className = `avatar-item ${owned ? 'owned' : ''} ${isCurrent ? 'current' : ''}`;
        div.innerHTML = `<div style="font-size:2.5rem;">${av.emoji}</div><div>${av.name}</div><div style="font-size:0.8rem;">${av.price === 0 ? 'Стартовый' : av.price + '🪙'}</div>`;
        div.onclick = () => {
            if (owned) {
                data.current_avatar = av.emoji;
                saveData();
                updateRobotAvatar();
                showNotification(`🤖 Теперь ты ${av.name}!`, true);
                renderAvatarShop();
            } else if (data.coins >= av.price) {
                data.coins -= av.price;
                data.owned_avatars.push(av.emoji);
                data.current_avatar = av.emoji;
                data.purchases_count++;
                saveData();
                updateRobotAvatar();
                updateStatsUI();
                showNotification(`🎉 Ты купил ${av.name}!`, true);
                playSound('coin');
                renderAvatarShop();
            } else {
                showNotification('Не хватает монет!', false);
            }
        };
        grid.appendChild(div);
    });
}

// ==================== ТЕМЫ ОФОРМЛЕНИЯ ====================
function renderThemesShop() {
    const grid = document.getElementById('themesGrid');
    if (!grid) return;
    document.getElementById('themesCoins').textContent = data.coins;
    grid.innerHTML = '';
    const themes = [
        { id: 'ocean', name: '🌊 Морская', price: 20 },
        { id: 'forest', name: '🌳 Лесная', price: 20 },
        { id: 'dark', name: '🌑 Тёмная', price: 20 }
    ];
    themes.forEach(theme => {
        const owned = data.owned_themes.includes(theme.id);
        const btn = document.createElement('button');
        btn.textContent = `${theme.name} (${theme.price}🪙) ${owned ? '✅ Куплена' : ''}`;
        btn.disabled = owned;
        btn.onclick = () => {
            if (data.coins >= theme.price) {
                data.coins -= theme.price;
                data.owned_themes.push(theme.id);
                data.purchases_count++;
                saveData();
                updateStatsUI();
                renderThemesShop();
                showNotification(`Куплена тема "${theme.name}"! Теперь выбери её в настройках`, true);
                playSound('coin');
            } else {
                showNotification('Не хватает монет!', false);
            }
        };
        grid.appendChild(btn);
    });
}

// ==================== ИНВЕНТАРЬ ====================
function renderInventory() {
    const inv = document.getElementById('inventoryList');
    if (!inv) return;
    let html = '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
    if (data.skip_token > 0) html += `<div class="achievement-badge">⤴️ Пропуски: ${data.skip_token}</div>`;
    if (data.revive_token > 0) html += `<div class="achievement-badge">♻️ Воскрешения: ${data.revive_token}</div>`;
    if (data.boosters.multiplier > 0 && data.boosters.multiplier_left > 0) html += `<div class="achievement-badge">⚡ Удвоитель: ${data.boosters.multiplier_left} задач</div>`;
    if (data.boosters.shield) html += `<div class="achievement-badge">🛡️ Защита активна</div>`;
    if (data.boosters.luck) html += `<div class="achievement-badge">🍀 Талисман удачи</div>`;
    if (data.pet) html += `<div class="achievement-badge">🐾 Питомец: ${data.pet.name} (ур.${data.pet.level || 1})</div>`;
    html += '</div>';
    inv.innerHTML = html;
}

// ==================== ПОКУПКА ТОКЕНОВ (быстрая) ====================
function buyToken(type) {
    const price = type === 'skip' ? 50 : 60;
    if (data.coins >= price) {
        data.coins -= price;
        if (type === 'skip') data.skip_token++;
        else data.revive_token++;
        data.purchases_count++;
        showNotification('✅ Куплен!', true);
        playSound('coin');
        saveData();
        updateStatsUI();
    } else {
        showNotification('❌ Не хватает монет!', false);
    }
}
