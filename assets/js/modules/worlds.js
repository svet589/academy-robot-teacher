// ==================== МОДУЛЬ МИРОВ ====================
import { AppState, EventBus } from '../core/state.js';
import { Screens, navigateTo } from '../core/router.js';

const SUBJECT_WORLDS = {
    math: 'math-worlds.json',
    russian: 'russian-worlds.json',
    english: 'english-worlds.json',
    world: 'world-worlds.json'
};

const SUBJECT_NAMES = {
    math: { name: '📐 Математика', emoji: '📐' },
    russian: { name: '📖 Русский язык', emoji: '📖' },
    english: { name: '🇬🇧 Английский', emoji: '🇬🇧' },
    world: { name: '🌍 Окружающий мир', emoji: '🌍' }
};

let worldsData = null;

export async function loadWorlds(subject) {
    const fileName = SUBJECT_WORLDS[subject];
    if (!fileName) return { worlds: [] };
    
    try {
        const response = await fetch(`/data/${fileName}`);
        if (response.ok) {
            worldsData = await response.json();
        }
    } catch (e) {
        console.warn(`⚠️ Миры для ${subject} не загружены`);
        worldsData = { worlds: [] };
    }
    
    return worldsData;
}

export function renderWorldsScreen(app, subject) {
    const subjectInfo = SUBJECT_NAMES[subject] || { name: subject, emoji: '📚' };
    
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
                    <div class="world-progress">${progress.completed}/${progress.total} тем</div>
                </div>
            `;
        });
    }
    
    app.innerHTML = `
        <div class="card worlds-container">
            <div class="worlds-header">
                <button class="back-btn" id="backToSubjectsBtn">↩️ К предметам</button>
                <h2 class="worlds-title">${subjectInfo.emoji} ${subjectInfo.name}</h2>
                <div style="width: 100px;"></div>
            </div>
            <p style="text-align: center; margin-bottom: 10px; color: var(--text-secondary);">🌍 Выбери мир для изучения!</p>
            <div class="worlds-grid">${worldsHtml || '<p style="grid-column: 1/-1; text-align: center;">Загрузка миров...</p>'}</div>
        </div>
    `;
    
    document.getElementById('backToSubjectsBtn').onclick = () => navigateTo(Screens.SUBJECT_SELECTION);
    
    document.querySelectorAll('.world-card').forEach(card => {
        card.onclick = () => {
            const worldId = card.dataset.worldId;
            const world = worldsData.worlds.find(w => w.id === worldId);
            if (world) {
                AppState.currentWorld = world;
                navigateTo(Screens.LIFE_MAP, { subject, worldId });
            }
        };
    });
}

function getWorldProgress(subject, worldId) {
    const progress = AppState.progress[subject];
    if (!progress) return { completed: 0, total: 0 };
    
    const topics = progress.topics || {};
    let completed = 0;
    let total = 0;
    
    for (let [id, data] of Object.entries(topics)) {
        if (id.includes(worldId) || worldId === 'marathon') {
            total++;
            if (data.completed) completed++;
        }
    }
    
    if (total === 0) total = Math.floor(Math.random() * 5) + 3;
    
    return { completed, total };
  }
