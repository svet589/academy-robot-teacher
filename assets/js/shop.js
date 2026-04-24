// ==================== МАГАЗИН (ОСНОВНОЙ) ====================

// Скины робота
const ROBOT_SKINS = [
    { id: 'robot_classic', emoji: '🤖', name: 'Классический', price: 0 },
    { id: 'robot_cyber', emoji: '🦾', name: 'Кибер-робот', price: 30 },
    { id: 'robot_mage', emoji: '🧙‍♂️', name: 'Супер-маг', price: 30 },
    { id: 'robot_super', emoji: '🦸‍♂️', name: 'Супер-робот', price: 30 },
    { id: 'robot_bear', emoji: '🐻‍❄️', name: 'Белый-мишка', price: 25 },
    { id: 'robot_dragon', emoji: '🐉', name: 'Могучий-дракон', price: 40 },
    { id: 'robot_astro', emoji: '👨‍🚀', name: 'Весёлый-космонавт', price: 35 },
    { id: 'robot_santa', emoji: '🧑‍🎄', name: 'Добрый-Дед Мороз', price: 30 }
];

// Питомцы для покупки
const SHOP_PETS = [
    { id: 'cat', emoji: '🐱', name: 'Кошка', price: 0 },
    { id: 'dog', emoji: '🐶', name: 'Собака', price: 50 },
    { id: 'rabbit', emoji: '🐰', name: 'Кролик', price: 50 },
    { id: 'fox', emoji: '🦊', name: 'Лис', price: 80 },
    { id: 'koala', emoji: '🐨', name: 'Коала', price: 100 },
    { id: 'pig', emoji: '🐷', name: 'Свинка', price: 60 }
];

// Аксессуары для питомца (только шляпы)
const SHOP_ACCESSORIES = [
    { id: 'hat_cap', emoji: '🧢', name: 'Кепка', price: 50 },
    { id: 'hat_crown', emoji: '👑', name: 'Корона', price: 150 },
    { id: 'hat_top', emoji: '🎩', name: 'Цилиндр', price: 100 },
    { id: 'hat_grad', emoji: '🎓', name: 'Выпускник', price: 80 },
    { id: 'hat_helmet', emoji: '🪖', name: 'Каска', price: 60 },
    { id: 'hat_rescue', emoji: '⛑️', name: 'Спасатель', price: 70 },
    { id: 'hat_party', emoji: '🎊', name: 'Праздничная', price: 40 }
];

// ==================== РЕНДЕР МАГАЗИНА ====================
function renderShop() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header">
                <button class="back-btn" onclick="navigateTo('apartment')">↩️ Назад</button>
                <h2>🛒 МАГАЗИН</h2>
                <div class="apartment-stat">🪙 ${AppState.coins}</div>
            </div>
            
            <div class="shop-tabs">
                <div class="shop-tab active" data-tab="skins">🤖 Скины робота</div>
                <div class="shop-tab" data-tab="pets">🐾 Питомцы</div>
                <div class="shop-tab" data-tab="accessories">🎩 Шляпы</div>
                <div class="shop-tab" data-tab="tokens">🎫 Токены</div>
            </div>
            
            <div id="shopItemsContainer"></div>
            <div id="shopItemDetail" style="display:none;"></div>
        </div>
    `;
    
    // Переключение вкладок
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderShopTab(tab.dataset.tab);
        };
    });
    
    renderShopTab('skins');
}

// ==================== ВКЛАДКИ МАГАЗИНА ====================
function renderShopTab(tab) {
    const container = document.getElementById('shopItemsContainer');
    if (!container) return;
    
    switch (tab) {
        case 'skins': renderSkinsTab(container); break;
        case 'pets': renderPetsTab(container); break;
        case 'accessories': renderAccessoriesTab(container); break;
        case 'tokens': renderTokensTab(container); break;
    }
}

// ==================== СКИНЫ РОБОТА ====================
function renderSkinsTab(container) {
    let html = '<div class="shop-grid">';
    
    ROBOT_SKINS.forEach(skin => {
        const owned = AppState.inventory.robotSkins.includes(skin.id);
        const equipped = AppState.currentRobotSkin === skin.id;
        
        html += `
            <div class="shop-item ${equipped ? 'equipped' : ''} ${owned ? 'owned' : ''}">
                <div class="shop-item-emoji">${skin.emoji}</div>
                <div class="shop-item-name">${skin.name}</div>
                <div class="shop-item-price">
                    ${equipped ? '✅ Надет' : (owned ? 'Куплено' : `${skin.price} 🪙`)}
                </div>
                ${owned && !equipped ? `<button class="shop-btn" onclick="equipRobotSkin('${skin.id}')">Надеть</button>` : ''}
                ${!owned ? `<button class="shop-btn" onclick="buyRobotSkin('${skin.id}')">Купить</button>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function buyRobotSkin(skinId) {
    const skin = ROBOT_SKINS.find(s => s.id === skinId);
    if (!skin) return;
    
    if (AppState.coins >= skin.price) {
        AppState.coins -= skin.price;
        AppState.inventory.robotSkins.push(skinId);
        AppState.currentRobotSkin = skinId;
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        
        if (typeof showNotification === 'function') showNotification(`✅ Куплен: ${skin.name}!`, 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        if (typeof checkAchievements === 'function') checkAchievements();
        
        renderShopTab('skins');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}

function equipRobotSkin(skinId) {
    AppState.currentRobotSkin = skinId;
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    renderShopTab('skins');
    if (typeof showNotification === 'function') showNotification('🤖 Скин надет!', 'success');
}

// ==================== ПИТОМЦЫ ====================
function renderPetsTab(container) {
    let html = '<div class="shop-grid">';
    
    SHOP_PETS.forEach(pet => {
        const owned = AppState.ownedPets.includes(pet.id);
        const current = AppState.pet.type === pet.id;
        
        html += `
            <div class="shop-item ${current ? 'equipped' : ''} ${owned ? 'owned' : ''}">
                <div class="shop-item-emoji">${pet.emoji}</div>
                <div class="shop-item-name">${pet.name}</div>
                <div class="shop-item-price">
                    ${current ? '✅ Текущий' : (owned ? 'Куплен' : `${pet.price} 🪙`)}
                </div>
                ${owned && !current ? `<button class="shop-btn" onclick="switchToPet('${pet.id}')">Выбрать</button>` : ''}
                ${!owned ? `<button class="shop-btn" onclick="buyPet('${pet.id}')">Купить</button>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function buyPet(petId) {
    const pet = SHOP_PETS.find(p => p.id === petId);
    if (!pet) return;
    
    if (AppState.coins >= pet.price) {
        AppState.coins -= pet.price;
        AppState.ownedPets.push(petId);
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        
        // Переключаемся на нового питомца
        if (typeof switchPetType === 'function') switchPetType(petId);
        
        if (typeof showNotification === 'function') showNotification(`✅ Куплен: ${pet.name}!`, 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        if (typeof checkAchievements === 'function') checkAchievements();
        
        renderShopTab('pets');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}

function switchToPet(petId) {
    if (typeof switchPetType === 'function') switchPetType(petId);
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    renderShopTab('pets');
    if (typeof showNotification === 'function') showNotification('🐾 Питомец выбран!', 'success');
}

// ==================== ШЛЯПЫ ====================
function renderAccessoriesTab(container) {
    let html = '<div class="shop-grid">';
    
    SHOP_ACCESSORIES.forEach(item => {
        const owned = AppState.inventory.accessories.includes(item.id);
        const equipped = AppState.pet.outfit?.hat === item.emoji;
        
        html += `
            <div class="shop-item ${equipped ? 'equipped' : ''} ${owned ? 'owned' : ''}">
                <div class="shop-item-emoji">${item.emoji}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-price">
                    ${equipped ? '✅ Надет' : (owned ? 'Куплено' : `${item.price} 🪙`)}
                </div>
                ${owned && !equipped ? `<button class="shop-btn" onclick="equipAccessory('${item.id}')">Надеть</button>` : ''}
                ${!owned ? `<button class="shop-btn" onclick="buyAccessory('${item.id}')">Купить</button>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function buyAccessory(itemId) {
    const item = SHOP_ACCESSORIES.find(i => i.id === itemId);
    if (!item) return;
    
    if (AppState.coins >= item.price) {
        AppState.coins -= item.price;
        AppState.inventory.accessories.push(itemId);
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        
        if (typeof showNotification === 'function') showNotification(`✅ Куплена: ${item.name}!`, 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        if (typeof checkAchievements === 'function') checkAchievements();
        
        renderShopTab('accessories');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}

function equipAccessory(itemId) {
    const item = SHOP_ACCESSORIES.find(i => i.id === itemId);
    if (!item) return;
    
    if (!AppState.pet.outfit) AppState.pet.outfit = { hat: null };
    AppState.pet.outfit.hat = AppState.pet.outfit.hat === item.emoji ? null : item.emoji;
    
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    renderShopTab('accessories');
    if (typeof showNotification === 'function') showNotification(AppState.pet.outfit.hat ? '🎩 Надето!' : 'Снято!', 'success');
    EventBus.emit('pet:outfitChanged');
}

// ==================== ТОКЕНЫ ====================
function renderTokensTab(container) {
    container.innerHTML = `
        <div class="shop-grid">
            <div class="shop-item">
                <div class="shop-item-emoji">⏭️</div>
                <div class="shop-item-name">Пропуск задания</div>
                <div class="shop-item-desc">Позволяет пропустить одно задание</div>
                <div class="shop-item-price">50 🪙</div>
                <button class="shop-btn" onclick="buySkipToken()">Купить</button>
                <div style="margin-top:5px;font-size:0.9rem;">Имеется: ${AppState.inventory.skipTokens}</div>
            </div>
            
            <div class="shop-item">
                <div class="shop-item-emoji">♻️</div>
                <div class="shop-item-name">Воскрешение</div>
                <div class="shop-item-desc">Восстанавливает 3 жизни в уроке</div>
                <div class="shop-item-price">60 🪙</div>
                <button class="shop-btn" onclick="buyReviveToken()">Купить</button>
                <div style="margin-top:5px;font-size:0.9rem;">Имеется: ${AppState.inventory.reviveTokens}</div>
            </div>
            
            <div class="shop-item">
                <div class="shop-item-emoji">⚡</div>
                <div class="shop-item-name">Удвоитель монет</div>
                <div class="shop-item-desc">Удваивает монеты за 3 задания</div>
                <div class="shop-item-price">40 🪙</div>
                <button class="shop-btn" onclick="buyMultiplier()">Купить</button>
            </div>
            
            <div class="shop-item">
                <div class="shop-item-emoji">🛡️</div>
                <div class="shop-item-name">Защита</div>
                <div class="shop-item-desc">+1 жизнь в следующем уроке</div>
                <div class="shop-item-price">25 🪙</div>
                <button class="shop-btn" onclick="buyShield()">Купить</button>
            </div>
        </div>
    `;
}

function buySkipToken() {
    if (AppState.coins >= 50) {
        AppState.coins -= 50;
        AppState.inventory.skipTokens++;
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        if (typeof showNotification === 'function') showNotification('✅ Пропуск куплен!', 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        renderShopTab('tokens');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}

function buyReviveToken() {
    if (AppState.coins >= 60) {
        AppState.coins -= 60;
        AppState.inventory.reviveTokens++;
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        if (typeof showNotification === 'function') showNotification('✅ Воскрешение куплено!', 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        renderShopTab('tokens');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}

function buyMultiplier() {
    if (AppState.coins >= 40) {
        AppState.coins -= 40;
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        if (typeof showNotification === 'function') showNotification('✅ Удвоитель куплен!', 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        renderShopTab('tokens');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}

function buyShield() {
    if (AppState.coins >= 25) {
        AppState.coins -= 25;
        AppState.purchasesCount = (AppState.purchasesCount || 0) + 1;
        if (typeof showNotification === 'function') showNotification('✅ Защита куплена!', 'success');
        if (typeof playSound === 'function') playSound('coin');
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        renderShopTab('tokens');
    } else {
        if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error');
    }
}
