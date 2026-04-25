// ==================== ПОЛНЫЙ МОДУЛЬ ПИТОМЦА ====================

const PETS = {
    cat: { name: 'Кошка', emoji: '🐱' },
    dog: { name: 'Собака', emoji: '🐶' },
    rabbit: { name: 'Кролик', emoji: '🐰' },
    fox: { name: 'Лис', emoji: '🦊' },
    koala: { name: 'Коала', emoji: '🐨' },
    pig: { name: 'Свинка', emoji: '🐷' }
};

const PET_FOOD = [
    { id: 'apple', emoji: '🍎', name: 'Яблоко', nutrition: 20, price: 5 },
    { id: 'banana', emoji: '🍌', name: 'Банан', nutrition: 20, price: 5 },
    { id: 'kiwi', emoji: '🥝', name: 'Киви', nutrition: 15, price: 6 },
    { id: 'grapes', emoji: '🍇', name: 'Виноград', nutrition: 10, price: 4 },
    { id: 'strawberry', emoji: '🍓', name: 'Клубника', nutrition: 10, price: 5 },
    { id: 'cookie', emoji: '🍪', name: 'Печенье', nutrition: 15, happiness: 5, price: 8 },
    { id: 'croissant', emoji: '🥐', name: 'Круассан', nutrition: 25, happiness: 5, price: 10 },
    { id: 'pancakes', emoji: '🥞', name: 'Блинчики', nutrition: 30, happiness: 10, price: 15 },
    { id: 'waffle', emoji: '🧇', name: 'Вафля', nutrition: 20, happiness: 5, price: 8 },
    { id: 'bone', emoji: '🦴', name: 'Косточка', nutrition: 30, price: 10 },
    { id: 'fish', emoji: '🐟', name: 'Рыбка', nutrition: 25, price: 12 },
    { id: 'pizza', emoji: '🍕', name: 'Пицца', nutrition: 40, happiness: 15, price: 20 },
    { id: 'sandwich', emoji: '🥪', name: 'Сэндвич', nutrition: 25, price: 12 },
    { id: 'dumpling', emoji: '🥟', name: 'Пельмени', nutrition: 30, price: 12 },
    { id: 'egg', emoji: '🍳', name: 'Яичница', nutrition: 20, price: 8 },
    { id: 'cake', emoji: '🎂', name: 'Тортик', nutrition: 50, happiness: 20, price: 25 },
    { id: 'candy', emoji: '🍬', name: 'Конфета', nutrition: 5, happiness: 10, price: 5 },
    { id: 'lollipop', emoji: '🍭', name: 'Леденец', nutrition: 5, happiness: 8, price: 4 },
    { id: 'icecream', emoji: '🍦', name: 'Мороженое', nutrition: 15, happiness: 15, price: 10 },
    { id: 'donut', emoji: '🍩', name: 'Пончик', nutrition: 20, happiness: 10, price: 10 },
    { id: 'chocolate', emoji: '🍫', name: 'Шоколад', nutrition: 15, happiness: 12, price: 12 }
];

// ТОЛЬКО шляпы (очки, шарфы, банты удалены)
const PET_ACCESSORIES = [
    { id: 'hat_cap', emoji: '🧢', name: 'Кепка', slot: 'hat', price: 50 },
    { id: 'hat_crown', emoji: '👑', name: 'Корона', slot: 'hat', price: 150 },
    { id: 'hat_top', emoji: '🎩', name: 'Цилиндр', slot: 'hat', price: 100 },
    { id: 'hat_grad', emoji: '🎓', name: 'Выпускник', slot: 'hat', price: 80 },
];

// ==================== ГЛАВНЫЙ РЕНДЕР КОМНАТЫ ====================
function renderFullPetRoom(app) {
    const pet = AppState.pet;
    if (!pet) return;
    
    // Убедимся, что outfit существует только для шляп
    if (!pet.outfit || pet.outfit.glasses || pet.outfit.scarf || pet.outfit.bow) {
        pet.outfit = { hat: pet.outfit?.hat || null };
    }
    
    const petEmoji = PETS[pet.type]?.emoji || '🐱';
    const room = AppState.petRoom || 'bedroom';
    
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header">
                <button class="back-btn" onclick="navigateTo('apartment')">↩️ В квартиру</button>
                <h2>🐾 ${pet.name}</h2>
                <div>🎂 ${pet.age || 0} дн.</div>
            </div>
            
            <div class="pet-module-container">
                <div class="room-area room-${room}">
                    <div class="room-background"></div>
                    <div class="room-items" id="petRoomItems"></div>
                    <div class="plates-container" id="petPlatesContainer" style="display:none;"></div>
                    <div class="pet-character pet-type-${pet.type}${pet.isSleeping ? ' sleeping' : ''}" id="petCharacter">
                        <span class="pet-base">${petEmoji}</span>
                        ${pet.outfit.hat ? `<span class="pet-hat">${pet.outfit.hat}</span>` : ''}
                        ${pet.isSleeping ? '<span class="sleeping-zzz">💤</span>' : ''}
                    </div>
                </div>
                
                <div class="bottom-panel">
                    <div class="room-tab ${room === 'bedroom' ? 'active' : ''}" data-room="bedroom">
                        <span class="tab-icon">😴</span><span class="tab-label">Спальня</span>
                        <div class="tab-indicator" style="background:conic-gradient(#2196f3 ${pet.energy}%, #ddd ${pet.energy}%)">⚡${pet.energy}%</div>
                    </div>
                    <div class="room-tab ${room === 'kitchen' ? 'active' : ''}" data-room="kitchen">
                        <span class="tab-icon">🍴</span><span class="tab-label">Кухня</span>
                        <div class="tab-indicator" style="background:conic-gradient(#4caf50 ${pet.hunger}%, #ddd ${pet.hunger}%)">🍖${pet.hunger}%</div>
                    </div>
                    <div class="room-tab ${room === 'living' ? 'active' : ''}" data-room="living">
                        <span class="tab-icon">🛋️</span><span class="tab-label">Гостиная</span>
                        <div class="tab-indicator" style="background:conic-gradient(#ff9800 ${pet.happiness}%, #ddd ${pet.happiness}%)">😊${pet.happiness}%</div>
                    </div>
                    <div class="room-tab ${room === 'street' ? 'active' : ''}" data-room="street">
                        <span class="tab-icon">🏞️</span><span class="tab-label">Улица</span>
                        <div class="tab-indicator">🎮</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.room-tab').forEach(tab => {
        tab.onclick = () => {
            AppState.petRoom = tab.dataset.room;
            renderFullPetRoom(app);
        };
    });
    
    renderPetRoomItems(pet, room);
    setupPetEvents(pet);
}

function renderPetRoomItems(pet, room) {
    const items = document.getElementById('petRoomItems');
    const plates = document.getElementById('petPlatesContainer');
    
    if (room === 'bedroom') {
        items.innerHTML = `
            <div class="cozy-window"></div>
            <div class="cozy-picture"></div>
            <div class="cozy-rug"></div>
            <div class="cozy-bed" data-action="sleep"><div class="cozy-pillow"></div></div>
            <div class="cozy-wardrobe" data-action="wardrobe"></div>
        `;
        plates.style.display = 'none';
    } else if (room === 'kitchen') {
        items.innerHTML = `
            <div class="cozy-window" style="right:30px;left:auto;"></div>
            <div class="cozy-fridge" data-action="foodShop"></div>
            <div class="cozy-table"></div>
        `;
        plates.style.display = 'flex';
        renderPetPlates();
    } else if (room === 'living') {
        items.innerHTML = `
            <div class="cozy-picture" style="left:20px;"></div>
            <div class="cozy-rug"></div>
            <div class="cozy-sofa" data-action="sofa">
                <div class="sofa-pillow"></div><div class="sofa-pillow2"></div>
            </div>
            <div class="cozy-tv" data-action="tv"></div>
            <div class="cozy-vase-stand"></div>
        `;
        plates.style.display = 'none';
        const vaseDiv = document.createElement('div');
        vaseDiv.className = 'vase-container';
        vaseDiv.setAttribute('data-action', 'vase');
        vaseDiv.innerHTML = `<span class="vase">⚱️</span><span class="flower-inside">${pet.room?.vaseFlower || '🌻'}</span>`;
        items.appendChild(vaseDiv);
    } else if (room === 'street') {
        items.innerHTML = `
            <div class="item-sun">☀️</div>
            <div class="item-cloud item-cloud1">☁️</div>
            <div class="item-cloud item-cloud2">☁️</div>
            <div class="cozy-fence"></div>
            <div class="cozy-tree"><div class="tree-trunk"></div><div class="tree-crown"></div></div>
            <div class="cozy-chest" data-action="games"></div>
        `;
        plates.style.display = 'none';
    }
}

function renderPetPlates() {
    const container = document.getElementById('petPlatesContainer');
    if (!container) return;
    
    const plates = AppState.petPlates || [
        { food: 'apple', emoji: '🍎', quantity: 3 },
        { food: 'cookie', emoji: '🍪', quantity: 5 },
        { food: null, emoji: '🍽️', quantity: 0 }
    ];
    
    container.innerHTML = plates.map((plate, i) => `
        <div class="plate ${plate.food ? '' : 'empty'}" data-plate-index="${i}" draggable="${!!plate.food}">
            <div class="plate-emoji">${plate.emoji}</div>
            ${plate.quantity > 0 ? `<div class="plate-quantity">${plate.quantity}</div>` : ''}
        </div>
    `).join('');
    
    container.querySelectorAll('.plate').forEach(plate => {
        plate.addEventListener('dragstart', (e) => {
            const idx = parseInt(plate.dataset.plateIndex);
            const p = plates[idx];
            if (!p.food || p.quantity <= 0) { e.preventDefault(); return; }
            e.dataTransfer.setData('text/plain', idx.toString());
        });
    });
}

function setupPetEvents(pet) {
    const petChar = document.getElementById('petCharacter');
    if (!petChar) return;
    
    petChar.addEventListener('dragover', e => e.preventDefault());
    petChar.addEventListener('drop', e => {
        e.preventDefault();
        const idx = e.dataTransfer.getData('text/plain');
        if (idx === '') return;
        const plates = AppState.petPlates || [];
        const plate = plates[parseInt(idx)];
        if (!plate?.food || plate.quantity <= 0) return;
        const foodData = PET_FOOD.find(f => f.id === plate.food);
        if (!foodData) return;
        if (typeof updatePetHunger === 'function') updatePetHunger(foodData.nutrition);
        if (foodData.happiness && typeof updatePetHappiness === 'function') updatePetHappiness(foodData.happiness);
        plate.quantity--;
        if (plate.quantity <= 0) { plate.food = null; plate.emoji = '🍽️'; }
        AppState.petPlates = plates;
        if (typeof showNotification === 'function') showNotification(`${pet.name} съел ${foodData.name}!`, 'success');
        renderPetPlates();
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    });
    
    petChar.addEventListener('click', (e) => {
        if (e.target.closest('[data-action]')) return;
        if (typeof updatePetHappiness === 'function') {
            updatePetHappiness(3);
            if (typeof showNotification === 'function') showNotification('😊 Мррр ♥️', 'success');
            if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        }
    });
    
    document.addEventListener('click', (e) => {
        const item = e.target.closest('[data-action]');
        if (!item) return;
        const action = item.dataset.action;
        
        if (action === 'sleep') {
            // ЗАЩИТА ОТ ДВОЙНОГО КЛИКА (ИСПРАВЛЕНИЕ БАГА)
            if (window.sleepActionInProgress) return;
            window.sleepActionInProgress = true;
            
            if (pet.isSleeping) {
                if (typeof petWakeUp === 'function') petWakeUp();
                if (typeof showNotification === 'function') showNotification('☀️ Питомец проснулся!', 'success');
            } else {
                if (typeof petGoToSleep === 'function') petGoToSleep();
                if (typeof showNotification === 'function') showNotification('😴 Питомец уснул...', 'success');
            }
            
            if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
            
            setTimeout(() => {
                renderFullPetRoom(document.getElementById('app'));
                window.sleepActionInProgress = false;
            }, 500);
            
        } else if (action === 'wardrobe') showPetWardrobe();
        else if (action === 'foodShop') showPetFoodShop();
        else if (action === 'tv') showPetTVGames();
        else if (action === 'vase') showPetVaseFlowers();
        else if (action === 'games') showPetOutdoorGames();
        else if (action === 'sofa') {
            if (typeof updatePetEnergy === 'function') updatePetEnergy(10);
            if (typeof updatePetHappiness === 'function') updatePetHappiness(5);
            if (typeof showNotification === 'function') showNotification('🛋️ Отдохнул на диване!', 'success');
            if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
        }
    });
}

function showPetWardrobe() {
    const owned = PET_ACCESSORIES.filter(a => AppState.inventory.accessories.includes(a.id));
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card">
            <div class="modal-close" id="closeWardrobeBtn">❌</div>
            <h3>🚪 Гардероб (шляпы)</h3>
            ${owned.length > 0 ? `
                <div style="display:flex;gap:15px;flex-wrap:wrap;justify-content:center;margin:20px 0;">
                    ${owned.map(a => `
                        <div class="wardrobe-item" data-emoji="${a.emoji}" style="font-size:3rem;cursor:pointer;padding:10px;border-radius:15px;background:${AppState.pet.outfit.hat === a.emoji ? '#d4edc9' : '#ffe0b0'};">
                            ${a.emoji}
                        </div>
                    `).join('')}
                </div>
            ` : '<p>Купи аксессуары в магазине!</p>'}
            <button id="removeHat" class="btn-danger" style="margin-top:10px;">🗑️ Снять шляпу</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('.wardrobe-item').forEach(item => { item.onclick = () => { AppState.pet.outfit.hat = AppState.pet.outfit.hat === item.dataset.emoji ? null : item.dataset.emoji; modal.remove(); renderFullPetRoom(document.getElementById('app')); if (typeof showNotification === 'function') showNotification(AppState.pet.outfit.hat ? 'Надето!' : 'Снято!', 'success'); if (typeof saveState === 'function') saveState(AppState.currentChild?.id); }; });
    document.getElementById('closeWardrobeBtn').onclick = () => modal.remove();
    document.getElementById('removeHat').onclick = () => { AppState.pet.outfit.hat = null; modal.remove(); renderFullPetRoom(document.getElementById('app')); if (typeof showNotification === 'function') showNotification('Снято!', 'success'); if (typeof saveState === 'function') saveState(AppState.currentChild?.id); };
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showPetFoodShop() {
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-card" style="max-width:550px;">
            <div class="modal-close" id="closeFoodShopBtn">❌</div>
            <h3>🧊 Холодильник</h3>
            <div class="modal-grid" style="grid-template-columns:repeat(3,1fr);">
                ${PET_FOOD.map(f => `
                    <div class="modal-item" data-food="${f.id}">
                        <div class="modal-item-emoji">${f.emoji}</div>
                        <div class="modal-item-name">${f.name}</div>
                        <div>${f.price} 🪙</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-food]').forEach(item => { item.onclick = () => { const food = PET_FOOD.find(f => f.id === item.dataset.food); if (!food) return; if (AppState.coins >= food.price) { AppState.coins -= food.price; if (!AppState.petPlates) AppState.petPlates = [{ food: 'apple', emoji: '🍎', quantity: 3 }, { food: 'cookie', emoji: '🍪', quantity: 5 }, { food: null, emoji: '🍽️', quantity: 0 }]; const empty = AppState.petPlates.find(p => !p.food); if (empty) { empty.food = food.id; empty.emoji = food.emoji; empty.quantity = 1; } else { const ex = AppState.petPlates.find(p => p.food === food.id); if (ex) ex.quantity++; } if (typeof showNotification === 'function') showNotification(`✅ ${food.name}!`, 'success'); if (typeof saveState === 'function') saveState(AppState.currentChild?.id); modal.remove(); renderFullPetRoom(document.getElementById('app')); } else { if (typeof showNotification === 'function') showNotification('❌ Не хватает монет!', 'error'); } }; });
    document.getElementById('closeFoodShopBtn').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showPetTVGames() {
    const games = [
        { name: '🏁 Гонки', action: () => { if (typeof RacingGame !== 'undefined' && RacingGame.start) RacingGame.start(); } },
        { name: '🎮 Аркада', action: () => { if (typeof ArcadePetGame !== 'undefined' && ArcadePetGame.start) ArcadePetGame.start(); } },
        { name: '🎯 Стрелялка', action: () => { if (typeof ShootingPetGame !== 'undefined' && ShootingPetGame.start) ShootingPetGame.start(); } }
    ];
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-card"><div class="modal-close" id="closeTVBtn">❌</div><h3>📺 Видео-игры</h3>${games.map(g => `<div class="game-option" style="background:#ffe0b0;border-radius:20px;padding:15px;margin:10px 0;cursor:pointer;text-align:center;font-weight:bold;">${g.name}</div>`).join('')}</div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('.game-option').forEach((opt, i) => { opt.onclick = () => { modal.remove(); games[i].action(); }; });
    document.getElementById('closeTVBtn').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showPetOutdoorGames() {
    const games = [
        { name: '🏀 Баскетбол', action: () => { if (typeof BasketballGame !== 'undefined' && BasketballGame.start) BasketballGame.start(); } },
        { name: '🎾 Поймай', action: () => { if (typeof CatchGame !== 'undefined' && CatchGame.start) CatchGame.start(); } },
        { name: '🦴 Найди косточку', action: () => { if (typeof FindGame !== 'undefined' && FindGame.start) FindGame.start(); } }
    ];
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-card"><div class="modal-close" id="closeOutdoorBtn">❌</div><h3>🎮 Мини-игры</h3>${games.map(g => `<div class="game-option" style="background:#ffe0b0;border-radius:20px;padding:15px;margin:10px 0;cursor:pointer;text-align:center;font-weight:bold;">${g.name}</div>`).join('')}</div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('.game-option').forEach((opt, i) => { opt.onclick = () => { modal.remove(); games[i].action(); }; });
    document.getElementById('closeOutdoorBtn').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showPetVaseFlowers() {
    const flowers = ['🌻', '🌷', '🌹', '🌸'];
    const modal = document.createElement('div'); modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-card"><div class="modal-close" id="closeVaseBtn">❌</div><h3>⚱️ Выбери цветок</h3><div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin:20px 0;">${flowers.map(f => `<div class="flower-option" data-flower="${f}" style="font-size:3rem;cursor:pointer;padding:10px;">${f}</div>`).join('')}</div></div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('.flower-option').forEach(opt => { opt.onclick = () => { if (!AppState.pet.room) AppState.pet.room = {}; AppState.pet.room.vaseFlower = opt.dataset.flower; modal.remove(); renderFull
