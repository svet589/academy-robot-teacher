// ==================== МОДУЛЬ МИРОВ ====================
import { AppState, EventBus } from '../core/state.js';
import { showNotification } from '../core/notifications.js';

let currentSubject = null;
let worldsData = null;

// ==================== ЗАГРУЗКА МИРОВ ====================
export async function loadWorlds(subject) {
    currentSubject = subject;
    
    try {
        const response = await fetch(`/data/${subject}-worlds.json`);
        if (response.ok) {
            worldsData = await response.json();
        }
    } catch (e) {
        console.warn(`⚠️ Миры для ${subject} не загружены, используем заглушку`);
        worldsData = { worlds: [] };
    }
    
    return worldsData;
}

// ==================== РЕНДЕРИНГ ЭКРАНА МИРОВ ====================
export function renderWorldsScreen(container, subject) {
    const subjectNames = {
        math: { name: '📐 Математика', emoji: '📐' },
        russian: { name: '📖 Русский язык', emoji: '📖' },
        english: { name: '🇬🇧 Английский', emoji: '🇬🇧' },
        world: { name: '🌍 Окружающий мир', emoji: '🌍' }
    };
    
    const subjectInfo = subjectNames[subject] || { name: subject, emoji: '📚' };
    
    let worldsHtml = '';
    
    if (worldsData && worldsData.worlds) {
        worldsData.worlds.forEach(world => {
            const progress = getWorldProgress(subject, world.id);
            const completed = progress.completed === progress.total && progress.total > 0;
            
            worldsHtml += `
                <div class="world-card ${completed ? 'completed' : ''}" data-world-id="${world.id}">
                    <div class="world-icon">${world.icon}</div>
                    <div class="world-name">${world.name}</div>
                    <div class="world-desc">${world.description}</div>
                    <div class="world-progress">
                        ${progress.completed}/${progress.total} тем
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = `
        <div class="card worlds-container">
            <div class="worlds-header">
                <button class="back-btn" id="backToSubjectsBtn">↩️ К предметам</button>
                <h2 class="worlds-title">${subjectInfo.emoji} ${subjectInfo.name}</h2>
                <div style="width: 100px;"></div>
            </div>
            
            <p style="text-align: center; margin-bottom: 10px; color: var(--text-secondary);">
                🌍 Выбери мир для изучения!
            </p>
            
            <div class="worlds-grid">
                ${worldsHtml || '<p style="grid-column: 1/-1; text-align: center;">Загрузка миров...</p>'}
            </div>
        </div>
    `;
    
    // Обработчики
    document.getElementById('backToSubjectsBtn').onclick = () => {
        EventBus.emit('navigate', 'main');
    };
    
    document.querySelectorAll('.world-card').forEach(card => {
        card.onclick = () => {
            const worldId = card.dataset.worldId;
            const world = worldsData.worlds.find(w => w.id === worldId);
            if (world) {
                AppState.currentWorld = world;
                EventBus.emit('world:selected', { subject, world });
            }
        };
    });
}

// ==================== ПРОГРЕСС ПО МИРУ ====================
function getWorldProgress(subject, worldId) {
    const progress = AppState.progress[subject];
    if (!progress) return { completed: 0, total: 0 };
    
    // Здесь должна быть логика подсчёта тем в мире
    // Пока заглушка
    const worldTopics = Object.entries(progress.topics || {}).filter(([id, data]) => {
        return id.startsWith(worldId) || true; // Временная логика
    });
    
    const completed = worldTopics.filter(([_, data]) => data.completed).length;
    const total = worldTopics.length || 5; // Заглушка
    
    return { completed, total };
}

// ==================== ПОЛУЧЕНИЕ ТЕМ МИРА ====================
export function getWorldTopics(subject, worldId) {
    // Загружаем темы для конкретного мира
    // Это будет использоваться при переходе к карте жизни внутри мира
    return [];
      }
