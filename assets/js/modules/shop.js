// ==================== МАГАЗИН (АВТОНОМНЫЙ МОДУЛЬ) ====================
import { AppState, EventBus, updateCoins, setTheme } from '../core/state.js';
import { Screens, navigateTo } from '../core/router.js';
import { showNotification } from '../core/notifications.js';
import { saveState } from '../core/storage.js';

const SHOP_FOOD = [
    { id: 'apple', emoji: '🍎', name: 'Яблоко', price: 5, desc: '+20 голода' },
    { id: 'banana', emoji: '🍌', name: 'Банан', price: 5, desc: '+20 голода' },
    { id: 'cookie', emoji: '🍪', name: 'Печенье', price: 8, desc: '+15 голода, +5 счастья' },
    { id: 'croissant', emoji: '🥐', name: 'Круассан', price: 10, desc: '+25 голода, +5 счастья' },
    { id: 'bone', emoji: '🦴', name: 'Косточка', price: 10, desc: '+30 голода' },
    { id: 'fish', emoji: '🐟', name: 'Рыбка', price: 12, desc: '+25 голода' },
    { id: 'cake', emoji: '🎂', name: 'Тортик', price: 25, desc: '+50 голода, +20 счастья' },
    { id: 'pizza', emoji: '🍕', name: 'Пицца', price: 20, desc: '+40 голода, +15 счастья' }
];

const SHOP_ACCESSORIES = [
    { id: 'hat_cap', emoji: '🧢', name: 'Кепка', price: 50 },
    { id: 'hat_crown', emoji: '👑', name: 'Корона', price: 150 },
    { id: 'hat_top', emoji: '🎩', name: 'Цилиндр', price: 100 },
    { id: 'glasses', emoji: '👓', name: 'Очки', price: 35 },
    { id: 'scarf', emoji: '🧣', name: 'Шарф', price: 45 },
    { id: 'bow', emoji: '🎀', name: 'Бантик', price: 30 }
];

const SHOP_THEMES = [
    { id: 'default', name: '☀️ Светлая', price: 0 },
    { id: 'dark', name: '🌙 Тёмная', price: 20 },
    { id: 'forest', name: '🌲 Лесная', price: 30 },
    { id: 'ocean', name: '🌊 Морская', price: 35 }
];

export function renderShop(app, tab = 'food') {
    const canShop = AppState.parentControl.enabled ? AppState.parentControl.shopEnabled : true;
    
    app.innerHTML = `
        <div class="card">
            <div class="screen-header">
                <button class="back-btn" id="backFromShopBtn">↩️ Назад</button>
                <h2>🛒 Магазин</h2>
                <div class="coins-display">🪙 ${AppState.coins}</div>
            </div>
            ${!canShop ? '<p style="text-align:center;color:#e74c3c;">🚫 Магазин отключён родителями</p>' : `
                <div class="shop-tabs">
                    <div class="shop-tab ${tab==='food'?'active':''}" data-tab="food">🍎 Еда</div>
                    <div class="shop-tab ${tab==='accessories'?'active':''}" data-tab="accessories">🎩 Аксессуары</div>
                    <div class="shop-tab ${tab==='themes'?'active':''}" data-tab="themes">🎨 Темы</div>
                    <div class="shop-tab ${tab==='tokens'?'active':''}" data-tab="tokens">🎫 Токены</div>
                </div>
                <div class="shop-items" id="shopItems"></div>
                <button id="openInventoryBtn" class="btn-secondary" style="margin-top:20px;">📦 Инвентарь</button>
            `}
        </div>
    `;
    
    if (!canShop) {
        document.getElementById('backFromShopBtn').onclick = () => navigateTo(Screens.MAIN);
        return;
    }
    
    document.getElementById('backFromShopBtn').onclick = () => navigateTo(Screens.MAIN);
    document.getElementById('openInventoryBtn').onclick = () => renderInventory(app);
    document.querySelectorAll('.shop-tab').forEach(t => { t.onclick = () => renderShop(app, t.dataset.tab); });
    
    const container = document.getElementById('shopItems');
    
    if (tab === 'food') {
        container.innerHTML = SHOP_FOOD.map(item => `
            <div class="shop-item-card">
                <div class="shop-item-emoji">${item.emoji}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-desc">${item.desc}</div>
                <div class="shop-item-price">${item.price} 🪙</div>
                <button class="buy-btn">Купить</button>
            </div>
        `).join('');
        container.querySelectorAll('.buy-btn').forEach((btn, i) => {
            btn.onclick = () => {
                const item = SHOP_FOOD[i];
                if (AppState.coins >= item.price) {
                    updateCoins(-item.price);
                    const existing = AppState.inventory.food.find(f => f.id === item.id);
                    if (existing) existing.quantity++; else AppState.inventory.food.push({ ...item, quantity: 1 });
                    showNotification(`✅ ${item.name}!`, 'success');
                    EventBus.emit('shop:itemPurchased');
                    saveState(AppState.currentChild?.id);
                    renderShop(app, tab);
                } else showNotification('❌ Не хватает монет!', 'error');
            };
        });
    } else if (tab === 'accessories') {
        container.innerHTML = SHOP_ACCESSORIES.map(item => {
            const owned = AppState.inventory.accessories.includes(item.id);
            return `<div class="shop-item-card ${owned?'owned':''}"><div class="shop-item-emoji">${item.emoji}</div><div class="shop-item-name">${item.name}</div><div class="shop-item-price">${owned?'✅ Куплено':item.price+' 🪙'}</div>${!owned?'<button class="buy-btn">Купить</button>':''}</div>`;
        }).join('');
        container.querySelectorAll('.buy-btn').forEach((btn, i) => {
            btn.onclick = () => {
                const item = SHOP_ACCESSORIES[i];
                if (!AppState.inventory.accessories.includes(item.id) && AppState.coins >= item.price) {
                    updateCoins(-item.price);
                    AppState.inventory.accessories.push(item.id);
                    showNotification(`✅ ${item.name}!`, 'success');
                    EventBus.emit('shop:itemPurchased');
                    saveState(AppState.currentChild?.id);
                    renderShop(app, tab);
                } else showNotification('❌ Не хватает монет!', 'error');
            };
        });
    } else if (tab === 'themes') {
        container.innerHTML = SHOP_THEMES.map(theme => {
            const owned = AppState.inventory.themes.includes(theme.id);
            const current = AppState.settings.theme === theme.id;
            return `<div class="shop-item-card ${owned?'owned':''} ${current?'current':''}"><div class="shop-item-name">${theme.name}</div><div class="shop-item-price">${owned?(current?'✅ Текущая':'Куплено'):theme.price+' 🪙'}</div>${owned&&!current?'<button class="apply-btn">Применить</button>':''}${!owned?'<button class="buy-btn">Купить</button>':''}</div>`;
        }).join('');
        container.querySelectorAll('.buy-btn').forEach((btn, i) => {
            btn.onclick = () => {
                const theme = SHOP_THEMES[i];
                if (!AppState.inventory.themes.includes(theme.id) && AppState.coins >= theme.price) {
                    updateCoins(-theme.price);
                    AppState.inventory.themes.push(theme.id);
                    showNotification(`✅ Тема "${theme.name}"!`, 'success');
                    EventBus.emit('shop:itemPurchased');
                    saveState(AppState.currentChild?.id);
                    renderShop(app, tab);
                } else showNotification('❌ Не хватает монет!', 'error');
            };
        });
        container.querySelectorAll('.apply-btn').forEach((btn, i) => {
            btn.onclick = () => { setTheme(SHOP_THEMES[i].id); saveState(AppState.currentChild?.id); renderShop(app, tab); };
        });
    } else if (tab === 'tokens') {
        container.innerHTML = `
            <div class="shop-item-card"><div class="shop-item-emoji">⏭️</div><div class="shop-item-name">Пропуск задания</div><div class="shop-item-price">50 🪙</div><button class="buy-btn" id="buySkipBtn">Купить</button></div>
            <div class="shop-item-card"><div class="shop-item-emoji">♻️</div><div class="shop-item-name">Воскрешение</div><div class="shop-item-price">60 🪙</div><button class="buy-btn" id="buyReviveBtn">Купить</button></div>
        `;
        document.getElementById('buySkipBtn').onclick = () => { if (AppState.coins >= 50) { updateCoins(-50); AppState.inventory.skipTokens++; saveState(AppState.currentChild?.id); renderShop(app, tab); } else showNotification('❌ Не хватает монет!', 'error'); };
        document.getElementById('buyReviveBtn').onclick = () => { if (AppState.coins >= 60) { updateCoins(-60); AppState.inventory.reviveTokens++; saveState(AppState.currentChild?.id); renderShop(app, tab); } else showNotification('❌ Не хватает монет!', 'error'); };
    }
}

export function renderInventory(app) {
    app.innerHTML = `
        <div class="card">
            <div class="screen-header"><button class="back-btn" id="backFromInvBtn">↩️ В магазин</button><h2>📦 Инвентарь</h2><div></div></div>
            <h3>🍎 Еда</h3>${AppState.inventory.food.length>0?AppState.inventory.food.map(f=>`<span style="margin:5px;">${f.emoji}×${f.quantity}</span>`).join(''):'<p>Пусто</p>'}
            <h3>🎩 Аксессуары</h3>${AppState.inventory.accessories.length>0?AppState.inventory.accessories.map(id=>`<span style="margin:5px;">${(SHOP_ACCESSORIES.find(a=>a.id===id)||{}).emoji||'?'}</span>`).join(''):'<p>Пусто</p>'}
            <h3>🎨 Темы</h3>${AppState.inventory.themes.map(t=>`<span style="margin:5px;">${t}</span>`).join('')}
            <h3>🎫 Токены</h3><p>⏭️ ${AppState.inventory.skipTokens} | ♻️ ${AppState.inventory.reviveTokens}</p>
        </div>
    `;
    document.getElementById('backFromInvBtn').onclick = () => renderShop(app);
          }
