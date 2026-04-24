// ==================== ЕЖЕДНЕВНЫЕ ЗАДАНИЯ + РАСТЕНИЕ ====================

// Пулы заданий для генерации
const TASK_POOLS = {
    solve: [
        { desc: 'Реши {target} примера', target: 3, reward: 8 },
        { desc: 'Реши {target} примеров', target: 5, reward: 12 },
        { desc: 'Реши {target} примеров', target: 7, reward: 18 },
        { desc: 'Пройди {target} тему на 3 звезды', target: 1, reward: 20 }
    ],
    games: [
        { desc: 'Сыграй в {target} игру', target: 1, reward: 5 },
        { desc: 'Сыграй в {target} игры', target: 2, reward: 10 },
        { desc: 'Сыграй в {target} игры', target: 3, reward: 15 },
        { desc: 'Пройди лабиринт {target} раз', target: 1, reward: 15 }
    ],
    pet: [
        { desc: 'Покорми питомца {target} раз', target: 1, reward: 5 },
        { desc: 'Покорми питомца {target} раза', target: 2, reward: 10 },
        { desc: 'Погладь питомца {target} раз', target: 3, reward: 8 },
        { desc: 'Уложи питомца спать', target: 1, reward: 8 }
    ],
    shop: [
        { desc: 'Купи {target} предмет', target: 1, reward: 8 },
        { desc: 'Купи {target} предмета', target: 2, reward: 15 }
    ],
    subjects: [
        { desc: 'Пройди {target} тему по математике', target: 1, reward: 10 },
        { desc: 'Пройди {target} тему по русскому', target: 1, reward: 10 },
        { desc: 'Пройди {target} тему по английскому', target: 1, reward: 10 }
    ]
};

// Иконки для категорий
const POOL_ICONS = {
    solve: '📚',
    games: '🎮',
    pet: '🐾',
    shop: '🛒',
    subjects: '📖'
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function initDailyTasks() {
    // Подписка на события для автообновления прогресса
    EventBus.on('solved:updated', () => updateTaskProgress('solve'));
    EventBus.on('game:ended', () => updateTaskProgress('games'));
    EventBus.on('pet:fed', () => updateTaskProgress('pet'));
    EventBus.on('pet:petted', () => updateTaskProgress('pet'));
    EventBus.on('pet:slept', () => updateTaskProgress('pet'));
    EventBus.on('shop:itemPurchased', () => {
        updateTaskProgress('shop');
        updateTaskProgress('pet');
    });
    EventBus.on('topic:completed', () => updateTaskProgress('subjects'));
    
    // Проверка сброса заданий
    checkDailyReset();
}

// ==================== ПРОВЕРКА СБРОСА ====================
function checkDailyReset() {
    const today = new Date().toDateString();
    
    if (AppState.lastDailyDate !== today) {
        generateDailyTasks();
        AppState.lastDailyDate = today;
        AppState.dailyPlantStage = 0;
        EventBus.emit('dailyTasks:reset');
        EventBus.emit('plant:updated', 0);
    }
}

// ==================== ГЕНЕРАЦИЯ 3 СЛУЧАЙНЫХ ЗАДАНИЙ ====================
function generateDailyTasks() {
    const poolKeys = Object.keys(TASK_POOLS);
    
    // Перемешиваем ключи
    for (let i = poolKeys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [poolKeys[i], poolKeys[j]] = [poolKeys[j], poolKeys[i]];
    }
    
    // Берём первые 3 пула, из каждого по случайному заданию
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
    
    AppState.dailyTasks = tasks;
    AppState.dailyPlantStage = 0;
    
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
}

// ==================== ОБНОВЛЕНИЕ ПРОГРЕССА ====================
function updateTaskProgress(pool) {
    if (!AppState.dailyTasks || AppState.dailyTasks.length === 0) return;
    
    let updated = false;
    
    AppState.dailyTasks.forEach(task => {
        if (task.pool === pool && !task.completed) {
            task.progress = Math.min(task.target, task.progress + 1);
            
            if (task.progress >= task.target) {
                task.completed = true;
                updateCoins(task.reward);
                if (typeof showNotification === 'function') {
                    showNotification(`✅ "${task.desc}" выполнено! +${task.reward} 🪙`, 'success');
                }
                if (typeof playSound === 'function') playSound('achievement');
            }
            updated = true;
        }
    });
    
    if (updated) {
        updateDailyPlant();
        if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
    }
}

// ==================== ОБНОВЛЕНИЕ РАСТЕНИЯ ====================
function updateDailyPlant() {
    const tasks = AppState.dailyTasks || [];
    const completed = tasks.filter(t => t.completed).length;
    AppState.dailyPlantStage = Math.min(3, completed);
    EventBus.emit('plant:updated', AppState.dailyPlantStage);
    
    // Если все 3 задания выполнены
    if (completed >= 3 && !AppState._dailyBonusClaimed) {
        AppState._dailyBonusClaimed = true;
        AppState.dailyAllCount = (AppState.dailyAllCount || 0) + 1;
        if (typeof checkAchievements === 'function') checkAchievements();
        if (typeof showNotification === 'function') {
            showNotification('🌟 Все задания дня выполнены! На дереве созрел плод! 🍎', 'success');
        }
    }
}

// ==================== ПОЛУЧИТЬ ЭМОДЗИ РАСТЕНИЯ ====================
function getPlantEmoji() {
    const stage = AppState.dailyPlantStage || 0;
    switch (stage) {
        case 0: return '🌳';           // Ничего не выполнено
        case 1: return '🌳🌸';         // 1 задание
        case 2: return '🌳🌸🌸';       // 2 задания
        case 3: return '🌳🍎';         // Все задания — плод!
        default: return '🌳';
    }
}

// ==================== ПОКАЗАТЬ ЗАДАНИЯ ====================
function showDailyTasks(container) {
    checkDailyReset();
    
    const tasks = AppState.dailyTasks || [];
    const completed = tasks.filter(t => t.completed).length;
    
    let html = `
        <div class="daily-container">
            <div class="daily-header">
                <h3>📅 Задания на сегодня</h3>
                <p>Выполнено: <strong>${completed}</strong> из <strong>${tasks.length}</strong></p>
            </div>
            
            <div class="daily-plant" style="text-align:center;font-size:5rem;margin:20px 0;">
                ${getPlantEmoji()}
                <p style="font-size:1rem;">
                    ${AppState.dailyPlantStage < 3 ? 
                        'Выполняй задания — на дереве появятся цветы и плод!' : 
                        '🍎 Плод созрел! Нажми, чтобы собрать урожай!'}
                </p>
                ${AppState.dailyPlantStage >= 3 ? 
                    '<button onclick="harvestFruitAction()" style="font-size:1.2rem;padding:15px 30px;">🍎 Собрать плод</button>' : ''}
            </div>
            
            <div class="daily-tasks-list">
    `;
    
    tasks.forEach(task => {
        html += `
            <div class="daily-task-card ${task.completed ? 'completed' : ''}" style="
                background: ${task.completed ? '#d4edc9' : '#fff7e6'};
                border-radius: 20px;
                padding: 15px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 15px;
                border: 2px solid ${task.completed ? '#4caf50' : '#d4a259'};
            ">
                <div style="font-size: 2rem;">${task.completed ? '✅' : (POOL_ICONS[task.pool] || '📋')}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold;">${task.desc}</div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <div class="progress-bar" style="flex:1; background:#ddd; border-radius:10px; height:8px; overflow:hidden;">
                            <div style="background:#4caf50; height:100%; width:${(task.progress/task.target)*100}%;"></div>
                        </div>
                        <span style="font-size:0.9rem;">${task.progress}/${task.target}</span>
                    </div>
                </div>
                <div style="font-weight: bold; color: #b57c1c;">+${task.reward}🪙</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    if (container) {
        container.innerHTML = html;
    }
    
    return html;
}

// ==================== СОБРАТЬ ПЛОД ====================
function harvestFruitAction() {
    if (AppState.dailyPlantStage < 3) return;
    
    const result = typeof harvestFruit === 'function' ? harvestFruit() : null;
    
    if (result) {
        const rewardText = result.type === 'coins' ? `${result.reward} 🪙` : 
                          result.type === 'token' ? result.reward : 
                          `${result.reward} 🪙`;
        
        if (typeof showNotification === 'function') {
            showNotification(`🍎 Урожай собран! ${rewardText}`, 'success');
        }
        if (typeof showConfetti === 'function') {
            showConfetti('fruit');
        }
        if (typeof playSound === 'function') {
            playSound('achievement');
        }
    }
    
    // Обновляем отображение
    if (typeof checkAchievements === 'function') checkAchievements();
    if (typeof saveState === 'function') saveState(AppState.currentChild?.id);
}

// ==================== СТИЛИ ====================
const dailyStyles = document.createElement('style');
dailyStyles.textContent = `
    .daily-container {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .daily-header {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .daily-plant {
        cursor: default;
    }
    
    .daily-plant button {
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 25px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 5px 0 #2e7d32;
        margin-top: 10px;
    }
    
    .daily-plant button:active {
        transform: translateY(2px);
        box-shadow: 0 3px 0 #2e7d32;
    }
    
    @media (max-width: 480px) {
        .daily-task-card {
            flex-direction: column;
            text-align: center;
        }
    }
`;
document.head.appendChild(dailyStyles);
