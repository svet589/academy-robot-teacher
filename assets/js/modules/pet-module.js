// ==================== ПОЛНЫЙ МОДУЛЬ ПИТОМЦА ====================
import { AppState, EventBus, updateCoins, updatePetHunger, updatePetHappiness, updatePetEnergy, petGoToSleep, petWakeUp } from '../core/state.js';
import { Screens, navigateTo } from '../core/router.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

const PETS = {
    cat: { name: 'Кошка', emoji: '🐱' },
    dog: { name: 'Собака', emoji: '🐶' },
    rabbit: { name: 'Кролик', emoji: '🐰' },
    fox: { name: 'Лис', emoji: '🦊' },
    koala: { name: 'Коала', emoji: '🐨' },
    pig: { name: 'Свинка', emoji: '🐷' }
};

export class PetModule {
    constructor() {
        this.currentRoom = AppState.petRoom || 'bedroom';
    }

    renderFullRoom(app) {
        this.app = app;
        this.render();
    }

    render() {
        const pet = AppState.pet || { type: 'cat', name: 'Мурка', hunger: 100, happiness: 100, energy: 100, isSleeping: false, outfit: {}, room: { vaseFlower: '🌻' } };
        const petEmoji = PETS[pet.type]?.emoji || '🐱';
        const room = this.currentRoom;

        this.app.innerHTML = `
            <div class="pet-module-container">
                <div class="top-panel">
                    <div class="age-badge"><span>🎂</span><span>${pet.age || 0} дн.</span></div>
                    <div class="coins-badge"><span>🪙</span><span>${AppState.coins}</span></div>
                </div>
                <div class="room-area room-${room}">
                    <div class="room-background"></div>
                    <div class="room-items" id="petRoomItems"></div>
                    <div class="plates-container" id="petPlatesContainer" style="display:none;"></div>
                    <div class="pet-character pet-type-${pet.type}${pet.isSleeping ? ' sleeping' : ''}" id="petCharacter">
                        <span class="pet-base">${petEmoji}</span>
                        ${pet.outfit.hat ? `<span class="pet-hat">${pet.outfit.hat}</span>` : ''}
                        ${pet.outfit.glasses ? `<span class="pet-glasses">${pet.outfit.glasses}</span>` : ''}
                        ${pet.outfit.scarf ? `<span class="pet-scarf">${pet.outfit.scarf}</span>` : ''}
                        ${pet.outfit.bow ? `<span class="pet-bow">${pet.outfit.bow}</span>` : ''}
                        ${pet.isSleeping ? '<span class="sleeping-zzz">💤</span>' : ''}
                    </div>
                </div>
                <div class="bottom-panel">
                    ${['bedroom','kitchen','living','street'].map(r => `
                        <div class="room-tab ${room === r ? 'active' : ''}" data-room="${r}">
                            <span class="tab-icon">${{bedroom:'😴',kitchen:'🍴',living:'🛋️',street:'🏞️'}[r]}</span>
                            <span class="tab-label">${{bedroom:'Спальня',kitchen:'Кухня',living:'Гостиная',street:'Улица'}[r]}</span>
                            <div class="tab-indicator" style="background:conic-gradient(${{bedroom:'#2196f3',kitchen:'#4caf50',living:'#ff9800',street:'#9c27b0'}[r]} ${r==='bedroom'?pet.energy:r==='kitchen'?pet.hunger:r==='living'?pet.happiness:100}%, #ddd ${r==='bedroom'?pet.energy:r==='kitchen'?pet.hunger:r==='living'?pet.happiness:100}%)">
                                ${{bedroom:`⚡${pet.energy}%`,kitchen:`🍖${pet.hunger}%`,living:`😊${pet.happiness}%`,street:'🎮'}[r]}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="back-button" id="backFromPetRoomBtn">↩️ Назад</button>
            </div>
        `;

        document.getElementById('backFromPetRoomBtn').onclick = () => navigateTo(Screens.MAIN);
        document.querySelectorAll('.room-tab').forEach(tab => {
            tab.onclick = () => {
                this.currentRoom = tab.dataset.room;
                AppState.petRoom = this.currentRoom;
                this.render();
            };
        });

        this.renderRoomItems(pet, room);
        this.setupEvents(pet);
    }

    renderRoomItems(pet, room) {
        const items = document.getElementById('petRoomItems');
        const plates = document.getElementById('petPlatesContainer');

        if (room === 'bedroom') {
            items.innerHTML = `<div class="cozy-window"></div><div class="cozy-picture"></div><div class="cozy-rug"></div><div class="cozy-bed" data-action="sleep"><div class="cozy-pillow"></div></div><div class="cozy-wardrobe" data-action="wardrobe"></div>`;
            plates.style.display = 'none';
        } else if (room === 'kitchen') {
            items.innerHTML = `<div class="cozy-window" style="right:30px;left:auto;"></div><div class="cozy-fridge" data-action="foodShop"></div><div class="cozy-table"></div>`;
            plates.style.display = 'flex';
            this.renderPlates();
        } else if (room === 'living') {
            items.innerHTML = `<div class="cozy-picture" style="left:20px;"></div><div class="cozy-rug"></div><div class="cozy-sofa" data-action="sofa"><div class="sofa-pillow"></div><div class="sofa-pillow2"></div></div><div class="cozy-tv" data-action="tv"></div><div class="cozy-vase-stand"></div>`;
            plates.style.display = 'none';
            const vaseDiv = document.createElement('div');
            vaseDiv.className = 'vase-container';
            vaseDiv.setAttribute('data-action', 'vase');
            vaseDiv.innerHTML = `<span class="vase">⚱️</span><span class="flower-inside">${pet.room?.vaseFlower || '🌻'}</span>`;
            items.appendChild(vaseDiv);
        } else if (room === 'street') {
            items.innerHTML = `<div class="item-sun">☀️</div><div class="item-cloud item-cloud1">☁️</div><div class="item-cloud item-cloud2">☁️</div><div class="cozy-fence"></div><div class="cozy-tree"><div class="tree-trunk"></div><div class="tree-crown"></div></div><div class="cozy-chest" data-action="games"></div>`;
            plates.style.display = 'none';
        }
    }

    renderPlates() {
        const container = document.getElementById('petPlatesContainer');
        const plates = AppState.petPlates || [
            { food: 'apple', emoji: '🍎', quantity: 3 },
            { food: 'cookie', emoji: '🍪', quantity: 5 },
            { food: null, emoji: '🍽️', quantity: 0 }
        ];
        container.innerHTML = plates.map((plate, i) => `
            <div class="plate ${plate.food ? '' : 'empty'}" data-plate-index="${i}">
                <div class="plate-emoji">${plate.emoji}</div>
                ${plate.quantity > 0 ? `<div class="plate-quantity">${plate.quantity}</div>` : ''}
            </div>
        `).join('');
        container.querySelectorAll('.plate').forEach((plate, i) => {
            plate.draggable = !!plates[i].food;
            plate.addEventListener('dragstart', e => {
                if (!plates[i].food || plates[i].quantity <= 0) { e.preventDefault(); return; }
                e.dataTransfer.setData('text/plain', i.toString());
            });
        });
    }

    setupEvents(pet) {
        const petChar = document.getElementById('petCharacter');
        const self = this;

        petChar.addEventListener('dragover', e => e.preventDefault());
        petChar.addEventListener('drop', e => {
            e.preventDefault();
            const idx = e.dataTransfer.getData('text/plain');
            if (idx === '') return;
            const plates = AppState.petPlates || [];
            const plate = plates[parseInt(idx)];
            if (!plate?.food || plate.quantity <= 0) return;

            const foodMap = { apple: { nutrition: 20 }, cookie: { nutrition: 15, happiness: 5 }, bone: { nutrition: 30 }, fish: { nutrition: 25 }, cake: { nutrition: 50, happiness: 20 } };
            const fd = foodMap[plate.food] || { nutrition: 15 };
            updatePetHunger(fd.nutrition);
            if (fd.happiness) updatePetHappiness(fd.happiness);
            plate.quantity--;
            if (plate.quantity <= 0) { plate.food = null; plate.emoji = '🍽️'; }
            AppState.petPlates = plates;
            showNotification(`${pet.name} съел еду! +${fd.nutrition} 🍖`, 'success');
            self.renderPlates();
            saveState(AppState.currentChild?.id);
        });

        petChar.addEventListener('click', e => {
            if (e.target.closest('[data-action]')) return;
            updatePetHappiness(3);
            saveState(AppState.currentChild?.id);
        });

        document.addEventListener('click', e => {
            const item = e.target.closest('[data-action]');
            if (!item) return;
            const action = item.dataset.action;

            if (action === 'sleep') {
                if (pet.isSleeping) petWakeUp(); else petGoToSleep();
                showNotification(pet.isSleeping ? '😴 Уснул...' : '☀️ Проснулся!', 'success');
                saveState(AppState.currentChild?.id);
                setTimeout(() => self.render(), 300);
            } else if (action === 'wardrobe') {
                self.showWardrobe();
            } else if (action === 'foodShop') {
                navigateTo(Screens.SHOP);
            } else if (action === 'tv') {
                self.showTVGames();
            } else if (action === 'vase') {
                self.showVaseFlowers();
            } else if (action === 'games') {
                self.showOutdoorGames();
            } else if (action === 'sofa') {
                updatePetEnergy(10);
                updatePetHappiness(5);
                showNotification('🛋️ Отдохнул на диване!', 'success');
                saveState(AppState.currentChild?.id);
            }
        });
    }

    showWardrobe() {
        const acc = [{ id: 'hat_cap', emoji: '🧢', slot: 'hat' }, { id: 'hat_crown', emoji: '👑', slot: 'hat' }, { id: 'hat_top', emoji: '🎩', slot: 'hat' }, { id: 'glasses', emoji: '👓', slot: 'glasses' }, { id: 'scarf', emoji: '🧣', slot: 'scarf' }, { id: 'bow', emoji: '🎀', slot: 'bow' }];
        const owned = acc.filter(a => AppState.inventory.accessories.includes(a.id));
        const c = document.getElementById('modal-container');
        const m = document.createElement('div'); m.className = 'modal-overlay';
        m.innerHTML = `<div class="modal-card"><h3>🚪 Гардероб</h3>${owned.length > 0 ? `<div style="display:flex;gap:15px;flex-wrap:wrap;justify-content:center;margin:20px 0;">${owned.map(a => `<div class="wardrobe-item" data-emoji="${a.emoji}" data-slot="${a.slot}" style="font-size:3rem;cursor:pointer;padding:10px;border-radius:15px;background:#ffe0b0;">${a.emoji}</div>`).join('')}</div>` : '<p>Купи аксессуары в магазине!</p>'}<button class="close-btn" id="closeWardrobeBtn">Закрыть</button><button class="btn-danger" id="removeAllBtn" style="margin-top:10px;">🗑️ Снять всё</button></div>`;
        c.appendChild(m);
        const self = this;
        m.querySelectorAll('.wardrobe-item').forEach(item => {
            item.onclick = () => {
                const emoji = item.dataset.emoji;
                const slot = item.dataset.slot;
                if (!AppState.pet.outfit) AppState.pet.outfit = {};
                AppState.pet.outfit[slot] = AppState.pet.outfit[slot] === emoji ? null : emoji;
                m.remove();
                self.render();
                showNotification(AppState.pet.outfit[slot] ? 'Надето!' : 'Снято!', 'success');
                saveState(AppState.currentChild?.id);
            };
        });
        document.getElementById('closeWardrobeBtn').onclick = () => m.remove();
        document.getElementById('removeAllBtn').onclick = () => { AppState.pet.outfit = {}; m.remove(); self.render(); showNotification('Всё снято!', 'success'); saveState(AppState.currentChild?.id); };
        m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    }

    showTVGames() {
        const c = document.getElementById('modal-container');
        const m = document.createElement('div'); m.className = 'modal-overlay';
        m.innerHTML = `<div class="modal-card"><h3>📺 Видео-игры</h3>${['🏁 Гонки','🎮 Аркада','🎯 Стрелялка'].map((g, i) => `<div class="game-option" data-game="${['racing','arcadeGame','shooting'][i]}" style="background:#ffe0b0;border-radius:20px;padding:15px;margin:10px 0;cursor:pointer;border:2px solid #d4a259;">${g}</div>`).join('')}<button class="close-btn" id="closeTVBtn">Закрыть</button></div>`;
        c.appendChild(m);
        m.querySelectorAll('.game-option').forEach(opt => { opt.onclick = () => { const game = opt.dataset.game; m.remove(); import(`../games/pet/${game}.js`).then(mod => { if (mod.default?.start) mod.default.start(); }); }; });
        document.getElementById('closeTVBtn').onclick = () => m.remove();
        m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    }

    showOutdoorGames() {
        const c = document.getElementById('modal-container');
        const m = document.createElement('div'); m.className = 'modal-overlay';
        m.innerHTML = `<div class="modal-card"><h3>🎮 Мини-игры</h3>${['🏀 Баскетбол','🎾 Поймай','🦴 Найди косточку'].map((g, i) => `<div class="game-option" data-game="${['basketball','catch','find'][i]}" style="background:#ffe0b0;border-radius:20px;padding:15px;margin:10px 0;cursor:pointer;border:2px solid #d4a259;">${g}</div>`).join('')}<button class="close-btn" id="closeOutdoorBtn">Закрыть</button></div>`;
        c.appendChild(m);
        m.querySelectorAll('.game-option').forEach(opt => { opt.onclick = () => { const game = opt.dataset.game; m.remove(); import(`../games/pet/${game}.js`).then(mod => { if (mod.default?.start) mod.default.start(); }); }; });
        document.getElementById('closeOutdoorBtn').onclick = () => m.remove();
        m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    }

    showVaseFlowers() {
        const flowers = ['🌻', '🌷', '🌹', '🌸'];
        const c = document.getElementById('modal-container');
        const m = document.createElement('div'); m.className = 'modal-overlay';
        m.innerHTML = `<div class="modal-card"><h3>⚱️ Выбери цветок</h3><div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin:20px 0;">${flowers.map(f => `<div class="flower-option" data-flower="${f}" style="font-size:3rem;cursor:pointer;padding:10px;">${f}</div>`).join('')}</div><button class="close-btn" id="closeVaseBtn">Закрыть</button></div>`;
        c.appendChild(m);
        const self = this;
        m.querySelectorAll('.flower-option').forEach(opt => { opt.onclick = () => { if (!AppState.pet.room) AppState.pet.room = {}; AppState.pet.room.vaseFlower = opt.dataset.flower; m.remove(); self.render(); showNotification('🌸 Цветок поставлен!', 'success'); saveState(AppState.currentChild?.id); }; });
        document.getElementById('closeVaseBtn').onclick = () => m.remove();
        m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    }
}

export function renderPetModule(app) {
    const petModule = new PetModule();
    petModule.renderFullRoom(app);
}

export default PetModule;