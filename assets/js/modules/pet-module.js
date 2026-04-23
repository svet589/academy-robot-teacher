// ==================== ПОЛНЫЙ МОДУЛЬ ПИТОМЦА (ЧАСТЬ 1/2) ====================
import { AppState, EventBus, updateCoins, updatePetHunger, updatePetHappiness, updatePetEnergy } from '../core/state.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';
import { startBasketball } from '../games/pet/basketball.js';
import { startCatch } from '../games/pet/catch.js';
import { startFind } from '../games/pet/find.js';
import { startRacing } from '../games/pet/racing.js';
import { startArcadeGame } from '../games/pet/arcade-game.js';
import { startShooting } from '../games/pet/shooting.js';

// Конфигурация питомцев
const PETS = {
    cat: { name: 'Кошка', emoji: '🐱' },
    dog: { name: 'Собака', emoji: '🐶' },
    rabbit: { name: 'Кролик', emoji: '🐰' },
    fox: { name: 'Лис', emoji: '🦊' },
    koala: { name: 'Коала', emoji: '🐨' },
    pig: { name: 'Свинка', emoji: '🐷' }
};

const FOOD = [
    { id: 'apple', emoji: '🍎', name: 'Яблоко', nutrition: 20, price: 5 },
    { id: 'cookie', emoji: '🍪', name: 'Печенье', nutrition: 15, happiness: 5, price: 8 },
    { id: 'bone', emoji: '🦴', name: 'Косточка', nutrition: 30, price: 10 },
    { id: 'fish', emoji: '🐟', name: 'Рыбка', nutrition: 25, price: 12 },
    { id: 'cake', emoji: '🎂', name: 'Тортик', nutrition: 50, happiness: 20, price: 25 }
];

const ACCESSORIES = [
    { id: 'hat_cap', emoji: '🧢', name: 'Кепка', slot: 'hat', price: 50 },
    { id: 'hat_crown', emoji: '👑', name: 'Корона', slot: 'hat', price: 150 },
    { id: 'hat_top', emoji: '🎩', name: 'Цилиндр', slot: 'hat', price: 100 },
    { id: 'glasses', emoji: '👓', name: 'Очки', slot: 'glasses', price: 35 },
    { id: 'scarf', emoji: '🧣', name: 'Шарф', slot: 'scarf', price: 45 },
    { id: 'bow', emoji: '🎀', name: 'Бантик', slot: 'bow', price: 30 }
];

export class PetModule {
    constructor() {
        this.currentRoom = 'bedroom';
        this.plates = [
            { food: 'apple', emoji: '🍎', quantity: 3 },
            { food: 'cookie', emoji: '🍪', quantity: 5 },
            { food: null, emoji: '🍽️', quantity: 0 }
        ];
        this.ownedAccessories = [];
        this.ownedFlowers = ['🌻'];
        this.vaseFlower = '🌻';
        this.ownedCars = ['car_red'];
        this.currentCar = 'car_red';
    }
    
    // ==================== ГЛАВНЫЙ РЕНДЕР ====================
    renderFullRoom(container) {
        this.container = container;
        this.render();
    }
    
    render() {
        const pet = AppState.pet || { type: 'cat', name: 'Мурка', hunger: 100, happiness: 100, energy: 100, outfit: {} };
        const petEmoji = PETS[pet.type]?.emoji || '🐱';
        
        this.container.innerHTML = `
            <div class="pet-module-container">
                <div class="top-panel">
                    <div class="age-badge"><span>🎂</span><span>${AppState.pet?.age || 0}</span></div>
                    <div class="coins-badge"><span>🪙</span><span>${AppState.coins}</span></div>
                </div>
                
                <div class="room-area room-${this.currentRoom}">
                    <div class="room-background"></div>
                    <div class="room-items" id="petRoomItems"></div>
                    <div class="plates-container" id="petPlatesContainer" style="display: none;"></div>
                    <div class="pet-character pet-type-${pet.type}" id="petCharacter">
                        <span class="pet-base">${petEmoji}</span>
                        ${pet.outfit.hat ? `<span class="pet-hat">${pet.outfit.hat}</span>` : ''}
                        ${pet.outfit.glasses ? `<span class="pet-glasses">${pet.outfit.glasses}</span>` : ''}
                        ${pet.outfit.scarf ? `<span class="pet-scarf">${pet.outfit.scarf}</span>` : ''}
                        ${pet.outfit.bow ? `<span class="pet-bow">${pet.outfit.bow}</span>` : ''}
                    </div>
                </div>
                
                <div class="bottom-panel">
                    <div class="room-tab ${this.currentRoom === 'bedroom' ? 'active' : ''}" data-room="bedroom">
                        <span class="tab-icon">😴</span><span class="tab-label">Спальня</span>
                        <div class="tab-indicator">⚡${pet.energy}%</div>
                    </div>
                    <div class="room-tab ${this.currentRoom === 'kitchen' ? 'active' : ''}" data-room="kitchen">
                        <span class="tab-icon">🍴</span><span class="tab-label">Кухня</span>
                        <div class="tab-indicator">🍖${pet.hunger}%</div>
                    </div>
                    <div class="room-tab ${this.currentRoom === 'living' ? 'active' : ''}" data-room="living">
                        <span class="tab-icon">🛋️</span><span class="tab-label">Гостиная</span>
                        <div class="tab-indicator">😊${pet.happiness}%</div>
                    </div>
                    <div class="room-tab ${this.currentRoom === 'street' ? 'active' : ''}" data-room="street">
                        <span class="tab-icon">🏞️</span><span class="tab-label">Улица</span>
                        <div class="tab-indicator">🎮</div>
                    </div>
                </div>
            </div>
            <button class="back-button" id="backFromPetRoomBtn">↩️ Назад</button>
        `;
        
        this.renderRoomItems();
        this.attachEvents();
    }
    
    // ==================== РЕНДЕР ПРЕДМЕТОВ КОМНАТЫ ====================
    renderRoomItems() {
        const items = document.getElementById('petRoomItems');
        const plates = document.getElementById('petPlatesContainer');
        
        if (this.currentRoom === 'bedroom') {
            items.innerHTML = `
                <div class="cozy-window"></div>
                <div class="cozy-picture"></div>
                <div class="cozy-rug"></div>
                <div class="cozy-bed" data-action="sleep"><div class="cozy-pillow"></div></div>
                <div class="cozy-wardrobe" data-action="wardrobe"></div>
            `;
        } else if (this.currentRoom === 'kitchen') {
            items.innerHTML = `
                <div class="cozy-window" style="right: 30px; left: auto;"></div>
                <div class="cozy-fridge" data-action="foodShop"></div>
                <div class="cozy-table"></div>
            `;
            plates.style.display = 'flex';
            this.renderPlates();
        } else if (this.currentRoom === 'living') {
            items.innerHTML = `
                <div class="cozy-picture" style="left: 20px;"></div>
                <div class="cozy-rug"></div>
                <div class="cozy-sofa" data-action="sofa">
                    <div class="sofa-pillow"></div>
                    <div class="sofa-pillow2"></div>
                </div>
                <div class="cozy-tv" data-action="tv"></div>
                <div class="cozy-vase-stand"></div>
            `;
            const vaseDiv = document.createElement('div');
            vaseDiv.className = 'vase-container';
            vaseDiv.setAttribute('data-action', 'vase');
            vaseDiv.innerHTML = `<span class="vase">⚱️</span><span class="flower-inside">${this.vaseFlower}</span>`;
            items.appendChild(vaseDiv);
        } else if (this.currentRoom === 'street') {
            items.innerHTML = `
                <div class="item-sun">☀️</div>
                <div class="item-cloud item-cloud1">☁️</div>
                <div class="item-cloud item-cloud2">☁️</div>
                <div class="cozy-fence"></div>
                <div class="cozy-tree"><div class="tree-trunk"></div><div class="tree-crown"></div></div>
                <div class="cozy-chest" data-action="games"></div>
            `;
        }
    }
    
    renderPlates() {
        const container = document.getElementById('petPlatesContainer');
        container.innerHTML = '';
        this.plates.forEach((plate, i) => {
            const div = document.createElement('div');
            div.className = `plate ${plate.food ? '' : 'empty'}`;
            div.innerHTML = `<div class="plate-emoji">${plate.emoji}</div>${plate.quantity > 0 ? `<div class="plate-quantity">${plate.quantity}</div>` : ''}`;
            div.draggable = !!plate.food;
            div.dataset.plateIndex = i;
            div.addEventListener('dragstart', (e) => {
                if (!plate.food || plate.quantity <= 0) { e.preventDefault(); return; }
                e.dataTransfer.setData('text/plain', i.toString());
            });
            container.appendChild(div);
        });
    }
    
    // ==================== СОБЫТИЯ ====================
    attachEvents() {
        // Переключение комнат
        document.querySelectorAll('.room-tab').forEach(tab => {
            tab.onclick = () => {
                this.currentRoom = tab.dataset.room;
                this.render();
            };
        });
        
        // Назад
        document.getElementById('backFromPetRoomBtn').onclick = () => {
            EventBus.emit('navigate', 'main');
        };
        
        // Drag & Drop кормление
        const petChar = document.getElementById('petCharacter');
        petChar.addEventListener('dragover', e => e.preventDefault());
        petChar.addEventListener('drop', e => {
            e.preventDefault();
            const idx = e.dataTransfer.getData('text/plain');
            if (idx === '') return;
            const plate = this.plates[parseInt(idx)];
            if (!plate?.food || plate.quantity <= 0) return;
            
            const food = FOOD.find(f => f.id === plate.food);
            updatePetHunger(food.nutrition);
            if (food.happiness) updatePetHappiness(food.happiness);
            
            plate.quantity--;
            if (plate.quantity <= 0) { plate.food = null; plate.emoji = '🍽️'; }
            
            showNotification(`${AppState.pet?.name || 'Питомец'} съел ${food.name}!`, 'success');
            this.renderPlates();
            saveState();
        });
        
        // Клики по предметам
        document.addEventListener('click', (e) => {
            const item = e.target.closest('[data-action]');
            if (!item) return;
            const action = item.dataset.action;
            
            if (action === 'sleep') this.handleSleep();
            else if (action === 'wardrobe') this.openWardrobe();
            else if (action === 'foodShop') this.openFoodShop();
            else if (action === 'tv') this.openTV();
            else if (action === 'vase') this.openVase();
            else if (action === 'games') this.openGames();
            else if (action === 'sofa') {
                updatePetEnergy(10);
                updatePetHappiness(5);
                showNotification('🛋️ Отдохнул на диване!', 'success');
                this.render();
            }
        });
        
        // Поглаживание
        petChar.addEventListener('click', () => {
            updatePetHappiness(3);
            showNotification('😊 Мурлычет!', 'success');
            this.render();
        });
    }
    
    // ==================== ДЕЙСТВИЯ ====================
    handleSleep() {
        const pet = AppState.pet;
        if (pet.isSleeping) {
            pet.isSleeping = false;
            pet.energy = 100;
            showNotification('☀️ Проснулся!', 'success');
        } else {
            pet.isSleeping = true;
            showNotification('😴 Уснул...', 'success');
        }
        saveState();
        this.render();
    }
    
    openWardrobe() {
        showNotification('🚪 Гардероб скоро откроется!', 'info');
    }
    
    openFoodShop() {
        showNotification('🧊 Холодильник скоро откроется!', 'info');
    }
    
    openTV() {
        const games = [
            { name: '🏁 Гонки', action: () => startRacing() },
            { name: '🎮 Аркада', action: () => startArcadeGame() },
            { name: '🎯 Стрелялка', action: () => startShooting() }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">📺 Телевизор</div>
                <div class="games-menu">
                    ${games.map(g => `<div class="game-option">${g.name}</div>`).join('')}
                </div>
                <button class="close-btn">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.game-option').forEach((opt, i) => {
            opt.onclick = () => { modal.remove(); games[i].action(); };
        });
        modal.querySelector('.close-btn').onclick = () => modal.remove();
    }
    
    openVase() {
        showNotification('⚱️ Выбор цветка скоро откроется!', 'info');
    }
    
    openGames() {
        const games = [
            { name: '🏀 Баскетбол', action: startBasketball },
            { name: '🎾 Поймай', action: startCatch },
            { name: '🦴 Найди косточку', action: startFind }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">🎮 Мини-игры</div>
                <div class="games-menu">
                    ${games.map(g => `<div class="game-option">${g.name}</div>`).join('')}
                </div>
                <button class="close-btn">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.game-option').forEach((opt, i) => {
            opt.onclick = () => { modal.remove(); games[i].action(); };
        });
        modal.querySelector('.close-btn').onclick = () => modal.remove();
    }
  }

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
export function initPetModule() {
    if (!AppState.pet) {
        AppState.pet = {
            type: 'cat',
            name: 'Мурка',
            hunger: 100,
            happiness: 100,
            energy: 100,
            age: 0,
            isSleeping: false,
            outfit: { hat: null, glasses: null, scarf: null, bow: null },
            inventory: { food: [], accessories: [] }
        };
    }
}

export function updatePetStatus() {
    const pet = AppState.pet;
    if (!pet) return;
    
    if (pet.isSleeping) {
        pet.energy = Math.min(100, pet.energy + 5);
    } else {
        pet.energy = Math.max(0, pet.energy - 2);
        pet.hunger = Math.max(0, pet.hunger - 3);
        if (pet.hunger < 30 || pet.energy < 20) {
            pet.happiness = Math.max(0, pet.happiness - 2);
        }
        if (pet.energy <= 0) {
            pet.isSleeping = true;
        }
    }
    saveState();
}

// Запуск автообновления
setInterval(updatePetStatus, 15000);

export default PetModule;
