// ==================== ЕЖЕДНЕВНЫЕ ЗАДАНИЯ (ГЕНЕРИРУЕМЫЕ) ====================
import { AppState, EventBus, updateCoins } from './state.js';
import { Screens, navigateTo } from './router.js';
import { showNotification } from './notifications.js';

// ==================== БАЗА ШАБЛОНОВ ЗАДАНИЙ ====================
const TASK_POOLS = {
    // Задания на решение примеров
    solve: [
        { desc: 'Реши {target} примеров', target: 3, reward: 8 },
        { desc: 'Реши {target} примеров', target: 5, reward: 12 },
        { desc: 'Реши {target} примеров', target: 7, reward: 18 },
        { desc: 'Реши {target} примеров', target: 10, reward: 25 },
        { desc: 'Пройди {target} темы на 3 звезды', target: 1, reward: 20 },
        { desc: 'Пройди {target} темы на 3 звезды', target: 2, reward: 35 }
    ],
    
    // Задания на игры
    games: [
        { desc: 'Сыграй в {target} игр', target: 1, reward: 5 },
        { desc: 'Сыграй в {target} игры', target: 2, reward: 10 },
        { desc: 'Сыграй в {target} игры', target: 3, reward: 15 },
        { desc: 'Выиграй {target} раз в любую игру', target: 1, reward: 12 },
        { desc: 'Выиграй {target} раза в любую игру', target: 2, reward: 20 },
        { desc: 'Сыграй в шашки {target} раз', target: 1, reward: 10 },
        { desc: 'Пройди лабиринт {target} раз', target: 1, reward: 15 },
        { desc: 'Набери {target} очков в Аркаде', target: 20, reward: 15 },
        { desc: 'Набери {target} очков в Стрелялке', target: 10, reward: 15 },
        { desc: 'Продержись {target} секунд в Гонках', target: 10, reward: 18 }
    ],
    
    // Задания на питомца
    pet: [
        { desc: 'Покорми питомца {target} раз', target: 1, reward: 5 },
        { desc: 'Покорми питомца {target} раза', target: 2, reward: 10 },
        { desc: 'Покорми питомца {target} раз', target: 3, reward: 15 },
        { desc: 'Погладь питомца {target} раз', target: 3, reward: 8 },
        { desc: 'Погладь питомца {target} раз', target: 5, reward: 12 },
        { desc: 'Уложи питомца спать', target: 1, reward: 8 },
        { desc: 'Поиграй с питомцем {target} раз', target: 1, reward: 10 },
        { desc: 'Поиграй с питомцем {target} раза', target: 2, reward: 18 },
        { desc: 'Смени одежду питомца {target} раз', target: 1, reward: 8 },
        { desc: 'Купи {target} новый предмет для питомца', target: 1, reward: 12 }
    ],
    
    // Задания на магазин
    shop: [
        { desc: 'Купи {target} предмет в магазине', target: 1, reward: 8 },
        { desc: 'Купи {target} предмета в магазине', target: 2, reward: 15 },
        { desc: 'Купи еду для питомца', target: 1, reward: 5 },
        { desc: 'Купи аксессуар для питомца', target: 1, reward: 12 },
        { desc: 'Потрать {target} монет в магазине', target: 30, reward: 15 },
        { desc: 'Потрать {target} монет в магазине', target: 50, reward: 22 }
    ],
    
    // Задания на предметы
    subjects: [
        { desc: 'Пройди {target} тему по математике', target: 1, reward: 10 },
        { desc: 'Пройди {target} темы по математике', target: 2, reward: 20 },
        { desc: 'Пройди {target} тему по русскому', target: 1, reward: 10 },
        { desc: 'Пройди {target} тему по английскому', target: 1, reward: 10 },
        { desc: 'Пройди {target} тему по окружающему миру', target: 1, reward: 10 },
        { desc: 'Пройди по {target} теме в каждом предмете', target: 1, reward: 35 }
    ]
};

// ==================== ГЕНЕРАЦИЯ ЗАДАНИЙ НА ДЕНЬ ====================
export function initDailyTasks() {
    // Подписываемся на события
    EventBus.on('solved:updated', () => updateAllTasks('solve'));
    EventBus.on('game:ended', () => updateAllTasks('games'));
    EventBus.on('pet:fed', () => updateAllTasks('pet'));
    EventBus.on('pet:petted', () => updateAllTasks('pet'));
    EventBus.on('pet:slept', () => updateAllTasks('pet'));
    EventBus.on('pet:played', () => updateAllTasks('pet'));
    EventBus.on('pet:outfitChanged', () => updateAllTasks('pet'));
    EventBus.on('shop:itemPurchased', () => {
        updateAllTasks('shop');
        updateAllTasks('pet');
    });
    EventBus.on('shop:coinsSpent', () => updateAllTasks('shop'));
    EventBus.on('topic:completed', () => updateAllTasks('subjects'));
    
    // Проверяем сброс
    checkDailyReset();
}

function checkDailyReset() {
    const today = new Date().toDateString();
    
    if (AppState.lastDailyDate !== today) {
        generateDailyTasks();
        AppState.lastDailyDate = today;
        EventBus.emit('dailyTasks:reset');
    }
}

// ==================== ГЕНЕРАЦИЯ 3 СЛУЧАЙНЫХ ЗАДАНИЙ ====================
function generateDailyTasks() {
    const allPools = Object.values(TASK_POOLS).flat();
    
    // Выбираем 3 случайных задания из разных пулов
    const selectedPools = [];
    const poolKeys = Object.keys(TASK_POOLS);
    
    // Перемешиваем ключи пулов
    for (let i = poolKeys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [poolKeys[i], poolKeys[j]] = [poolKeys[j], poolKeys[i]];
    }
    
    // Берём первые 3 пула, из каждого по 1 случайному заданию
    const tasks = [];
    for (let i = 0; i < 3; i++) {
        const poolKey = poolKeys[i];
        const pool = TASK_POOLS[poolKey];
        const template = pool[Math.floor(Math.random() * pool.length)];
        
        tasks.push({
            id: `daily_${Date.now()}_${i}`,
            desc: template.desc.replace('{target}', template.target),
            pool: poolKey,
            target: template.target,
            progress: 0,
            reward: template.reward,
            completed: false
        });
    }
    
    // Добавляем бонусное задание (выполнить все 3)
    tasks.push({
        id: `daily_bonus_${Date.now()}`,
        desc: 'Выполни все 3 задания',
        pool: 'bonus',
        target: 1,
        progress: 0,
        reward: 15,
        completed: false,
        isBonus: true
    });
    
    AppState.dailyTasks = tasks;
}

// ==================== ОБНОВЛЕНИЕ ПРОГРЕССА ====================
function updateAllTasks(pool) {
    if (!AppState.dailyTasks) return;
    
    AppState.dailyTasks.forEach(task => {
        if (task.pool === pool && !task.completed) {
            task.progress = Math.min(task.target, task.progress + 1);
            
            if (task.progress >= task.target) {
                task.completed = true;
                updateCoins(task.reward);
                showNotification(`✅ "${task.desc}" выполнено! +${task.reward} 🪙`, 'success');
                EventBus.emit('dailyTasks:completed', task);
                EventBus.emit('sound:achievement');
            }
            
            EventBus.emit('dailyTasks:updated', task);
        }
    });
    
    // Проверка бонусного задания
    checkBonusTask();
}

function checkBonusTask() {
    const bonusTask = AppState.dailyTasks.find(t => t.isBonus);
    if (!bonusTask || bonusTask.completed) return;
    
    const regularTasks = AppState.dailyTasks.filter(t => !t.isBonus);
    const allCompleted = regularTasks.every(t => t.completed);
    
    if (allCompleted) {
        bonusTask.progress = 1;
        bonusTask.completed = true;
        updateCoins(bonusTask.reward);
        showNotification(`🎉 Все задания дня выполнены! Бонус +${bonusTask.reward} 🪙`, 'success');
        EventBus.emit('dailyTasks:completed', bonusTask);
        EventBus.emit('sound:achievement');
    }
}

// ==================== РЕНДЕРИНГ ЭКРАНА ====================
export function renderDailyTasksScreen(container) {
    checkDailyReset();
    
    const tasks = AppState.dailyTasks || [];
    const regularTasks = tasks.filter(t => !t.isBonus);
    const bonusTask = tasks.find(t => t.isBonus);
    const completed = regularTasks.filter(t => t.completed).length;
    
    container.innerHTML = `
        <div class="card">
            <div class="screen-header">
                <button class="back-btn" id="backFromDailyBtn">↩️ Назад</button>
                <h2>📅 Задания на сегодня</h2>
                <div></div>
            </div>
            
            <div class="daily-progress">
                <p>Выполнено: <strong>${completed}</strong> из <strong>${regularTasks.length}</strong></p>
                ${bonusTask?.completed ? '<p class="daily-bonus-text">🎉 Все задания выполнены! Бонус получен!</p>' : ''}
            </div>
            
            <div class="daily-tasks-list">
                ${regularTasks.map(task => `
                    <div class="daily-task-card ${task.completed ? 'completed' : ''}">
                        <div class="daily-task-icon">${task.completed ? '✅' : getPoolIcon(task.pool)}</div>
                        <div class="daily-task-info">
                            <div class="daily-task-desc">${task.desc}</div>
                            <div class="daily-task-progress-bar">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(task.progress/task.target)*100}%"></div>
                                </div>
                                <span class="daily-task-counter">${task.progress}/${task.target}</span>
                            </div>
                        </div>
                        <div class="daily-task-reward">+${task.reward}🪙</div>
                    </div>
                `).join('')}
                
                ${bonusTask ? `
                    <div class="daily-bonus-card ${bonusTask.completed ? 'completed' : 'locked'}">
                        <div class="daily-task-icon">${bonusTask.completed ? '🌟' : '🔒'}</div>
                        <div class="daily-task-info">
                            <div class="daily-task-desc">${bonusTask.desc}</div>
                            <div class="daily-task-progress-bar">
                                <span>${completed}/${regularTasks.length}</span>
                            </div>
                        </div>
                        <div class="daily-task-reward">+${bonusTask.reward}🪙</div>
                    </div>
                ` : ''}
            </div>
            
            ${AppState.chests.available > 0 ? `
                <div class="chests-notification">
                    <p>🎁 У вас <strong>${AppState.chests.available}</strong> сундуков! <button id="openChestsBtn">Открыть</button></p>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('backFromDailyBtn').onclick = () => navigateTo(Screens.MAIN);
    
    const chestsBtn = document.getElementById('openChestsBtn');
    if (chestsBtn) {
        chestsBtn.onclick = () => navigateTo(Screens.CHESTS);
    }
}

function getPoolIcon(pool) {
    const icons = {
        solve: '📚',
        games: '🎮',
        pet: '🐾',
        shop: '🛒',
        subjects: '📖'
    };
    return icons[pool] || '📋';
}

// ==================== СТИЛИ ====================
const style = document.createElement('style');
style.textContent = `
    .daily-tasks-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
    }
    .daily-task-card, .daily-bonus-card {
        background: #ffe0b0;
        border-radius: 20px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 2px solid #d4a259;
    }
    .daily-task-card.completed {
        background: #d4edc9;
        border-color: #4caf50;
    }
    .daily-bonus-card {
        background: #fff0b5;
        border: 3px dashed #ffb347;
    }
    .daily-bonus-card.completed {
        background: linear-gradient(135deg, #ffd700, #ffec8b);
        border: 3px solid #ffb347;
    }
    .daily-bonus-card.locked {
        opacity: 0.6;
    }
    .daily-task-icon {
        font-size: 2rem;
        min-width: 40px;
        text-align: center;
    }
    .daily-task-info {
        flex: 1;
    }
    .daily-task-desc {
        font-weight: bold;
        margin-bottom: 5px;
    }
    .daily-task-progress-bar {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .daily-task-progress-bar .progress-bar {
        flex: 1;
        height: 8px;
    }
    .daily-task-counter {
        font-size: 0.85rem;
        min-width: 30px;
        text-align: right;
    }
    .daily-task-reward {
        font-weight: bold;
        color: #b57c1c;
        font-size: 1.1rem;
        min-width: 60px;
        text-align: right;
    }
    .daily-bonus-text {
        color: #4caf50;
        font-weight: bold;
        margin-top: 10px;
        font-size: 1.1rem;
    }
    .chests-notification {
        margin-top: 20px;
        padding: 15px;
        background: linear-gradient(135deg, #ffd700, #ffec8b);
        border-radius: 20px;
        text-align: center;
        border: 2px solid #ffb347;
    }
    .chests-notification button {
        margin-left: 10px;
        padding: 8px 20px;
        width: auto;
    }
`;
document.head.appendChild(style);
