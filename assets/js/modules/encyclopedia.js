// ==================== ЭНЦИКЛОПЕДИЯ ЭРУДИТА ====================
import { Screens, navigateTo } from '../core/router.js';
import { MathEncyclopedia } from './encyclopedia/math.js';
import { RussianEncyclopedia } from './encyclopedia/russian.js';
import { EnglishEncyclopedia } from './encyclopedia/english.js';
import { WorldEncyclopedia } from './encyclopedia/world.js';

const SUBJECTS = [
    { id: 'math', name: '📐 Математика', icon: '📐', color: 'math', count: '25+ тем' },
    { id: 'russian', name: '📖 Русский язык', icon: '📖', color: 'russian', count: '23+ тем' },
    { id: 'english', name: '🇬🇧 Английский', icon: '🇬🇧', color: 'english', count: '700+ слов' },
    { id: 'world', name: '🌍 Окружающий мир', icon: '🌍', color: 'world', count: '22+ тем' }
];

export function renderEncyclopedia(app, subject = null) {
    if (!subject) {
        renderSubjectSelection(app);
        return;
    }
    
    switch (subject) {
        case 'math': MathEncyclopedia.render(app); break;
        case 'russian': RussianEncyclopedia.render(app); break;
        case 'english': EnglishEncyclopedia.render(app); break;
        case 'world': WorldEncyclopedia.render(app); break;
        default: renderSubjectSelection(app);
    }
}

function renderSubjectSelection(app) {
    app.innerHTML = `
        <div class="card encyclopedia-container">
            <div class="screen-header">
                <button class="back-btn" id="backFromEncyclopediaBtn">↩️ Назад</button>
                <h2>📚 ЭНЦИКЛОПЕДИЯ ЭРУДИТА</h2>
                <div></div>
            </div>
            
            <div class="encyclopedia-header">
                <h1>📚 Энциклопедия Эрудита</h1>
                <p>Все знания начальной школы в одном месте!</p>
                <p style="margin-top:10px;">Выбери предмет и узнай много нового и интересного!</p>
            </div>
            
            <div class="subjects-grid">
                ${SUBJECTS.map(s => `
                    <div class="subject-encyclopedia-card ${s.color}" data-subject="${s.id}">
                        <div class="subject-encyclopedia-icon">${s.icon}</div>
                        <div class="subject-encyclopedia-name">${s.name}</div>
                        <div class="subject-encyclopedia-count">${s.count}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('backFromEncyclopediaBtn').onclick = () => navigateTo(Screens.MAIN);
    document.querySelectorAll('.subject-encyclopedia-card').forEach(card => {
        card.onclick = () => renderEncyclopedia(app, card.dataset.subject);
    });
}
