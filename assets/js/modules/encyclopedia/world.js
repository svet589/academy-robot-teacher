// ==================== ЭНЦИКЛОПЕДИЯ — ОКРУЖАЮЩИЙ МИР ====================
import { Screens, navigateTo } from '../../core/router.js';
import { renderEncyclopedia } from '../encyclopedia.js';

const TABS = [
    { id: 'space', name: '🪐 Космос' },
    { id: 'earth', name: '🌍 Земля' },
    { id: 'animals', name: '🐾 Животные' },
    { id: 'plants', name: '🌿 Растения' },
    { id: 'human', name: '🧠 Человек' },
    { id: 'russia', name: '🇷🇺 Россия' },
    { id: 'safety', name: '⚠️ Безопасность' },
    { id: 'ecology', name: '♻️ Экология' }
];

export const WorldEncyclopedia = {
    currentTab: 'space',

    render(app, tab = 'space') {
        this.currentTab = tab;
        
        app.innerHTML = `
            <div class="card encyclopedia-container">
                <div class="screen-header">
                    <button class="back-btn" id="backToEncyclopediaBtn">↩️ К энциклопедии</button>
                    <h2>🌍 ОКРУЖАЮЩИЙ МИР</h2>
                    <div></div>
                </div>
                
                <div class="encyclopedia-tabs">
                    ${TABS.map(t => `
                        <div class="encyclopedia-tab ${tab === t.id ? 'active' : ''}" data-tab="${t.id}">
                            ${t.name}
                        </div>
                    `).join('')}
                </div>
                
                <div class="encyclopedia-topics" id="topicContent"></div>
            </div>
        `;
        
        document.getElementById('backToEncyclopediaBtn').onclick = () => renderEncyclopedia(app);
        document.querySelectorAll('.encyclopedia-tab').forEach(tabEl => {
            tabEl.onclick = () => this.render(app, tabEl.dataset.tab);
        });
        this.renderContent(tab);
    },

    renderContent(tab) {
        const container = document.getElementById('topicContent');
        switch (tab) {
            case 'space': this.renderSpace(container); break;
            case 'earth': this.renderEarth(container); break;
            case 'animals': this.renderAnimals(container); break;
            case 'plants': this.renderPlants(container); break;
            case 'human': this.renderHuman(container); break;
            case 'russia': this.renderRussia(container); break;
            case 'safety': this.renderSafety(container); break;
            case 'ecology': this.renderEcology(container); break;
        }
    },

    // ==================== КОСМОС ====================
    renderSpace(container) {
        const planets = [
            { name: 'Меркурий', emoji: '☿️', distance: '58 млн км', temp: '+430°C / -180°C', fact: 'Самая быстрая планета — год длится 88 дней!' },
            { name: 'Венера', emoji: '♀️', distance: '108 млн км', temp: '+465°C', fact: 'Самая горячая планета! День длиннее года!' },
            { name: 'Земля', emoji: '🌍', distance: '150 млн км', temp: '+15°C (средняя)', fact: 'Единственная планета с жизнью! 71% покрыта водой' },
            { name: 'Марс', emoji: '♂️', distance: '228 млн км', temp: '-63°C', fact: 'Красная планета! Есть самая высокая гора — Олимп (27 км!)' },
            { name: 'Юпитер', emoji: '♃', distance: '778 млн км', temp: '-145°C', fact: 'Самая большая планета! Больше Земли в 1300 раз!' },
            { name: 'Сатурн', emoji: '🪐', distance: '1.4 млрд км', temp: '-178°C', fact: 'Знаменит кольцами из льда и камней!' },
            { name: 'Уран', emoji: '⛢', distance: '2.9 млрд км', temp: '-224°C', fact: 'Вращается «лёжа на боку»!' },
            { name: 'Нептун', emoji: '♆', distance: '4.5 млрд км', temp: '-218°C', fact: 'Самая ветреная планета — скорость ветра до 2100 км/ч!' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🪐</span> Солнечная система</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>Солнечной системе <strong>4.6 миллиарда лет</strong>! Солнце настолько большое, что в него поместится <strong>1.3 миллиона планет Земля</strong>!</p>
                </div>
                
                <div class="scheme-box">
                    <div class="scheme-title">☀️ Солнце и планеты (по порядку от Солнца)</div>
                    <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;justify-content:center;">
                        <span style="font-size:3rem;">☀️</span><span>→</span>
                        ${planets.map((p, i) => `<span style="font-size:2rem;">${p.emoji}</span><span>→</span>`).join('')}
                    </div>
                </div>
                
                <h3>📊 Все планеты (карточки)</h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:15px;margin:20px 0;">
                    ${planets.map(p => `
                        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;border-radius:20px;padding:20px;">
                            <div style="font-size:3rem;text-align:center;">${p.emoji}</div>
                            <div style="font-size:1.3rem;font-weight:bold;text-align:center;margin:10px 0;">${p.name}</div>
                            <div style="background:rgba(255,255,255,0.1);border-radius:10px;padding:10px;">
                                <p>📏 До Солнца: <strong>${p.distance}</strong></p>
                                <p>🌡️ Температура: <strong>${p.temp}</strong></p>
                                <p>💡 ${p.fact}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Запомни порядок планет!</div>
                    <p>«<strong>М</strong>ы <strong>В</strong>се <strong>З</strong>наем: <strong>М</strong>ама <strong>Ю</strong>ного <strong>С</strong>ына <strong>У</strong>тром <strong>Н</strong>акормила»</p>
                    <p>Меркурий, Венера, Земля, Марс, Юпитер, Сатурн, Уран, Нептун!</p>
                </div>
            </div>
        `;
    },

    // ==================== ЗЕМЛЯ ====================
    renderEarth(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🌍</span> Наша планета Земля</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>Земля — <strong>единственная планета</strong> в Солнечной системе, где есть жизнь! Её возраст — около <strong>4.5 миллиардов лет</strong>.</p>
                </div>
                
                <h3>🌊 Океаны и континенты</h3>
                <table class="encyclopedia-table">
                    <tr><th>Океан</th><th>Площадь</th><th>Интересный факт</th></tr>
                    <tr><td>🌊 Тихий</td><td>178 млн км²</td><td>Самый большой и глубокий! Марианская впадина — 11 км!</td></tr>
                    <tr><td>🌊 Атлантический</td><td>106 млн км²</td><td>Второй по величине, пересекает экватор</td></tr>
                    <tr><td>🌊 Индийский</td><td>73 млн км²</td><td>Самый тёплый океан</td></tr>
                    <tr><td>❄️ Северный Ледовитый</td><td>14 млн км²</td><td>Самый маленький и холодный</td></tr>
                </table>
                
                <h3>🏔️ Континенты (от большего к меньшему)</h3>
                <table class="encyclopedia-table">
                    <tr><th>Континент</th><th>Площадь</th><th>Особенность</th></tr>
                    <tr><td>🌏 Евразия</td><td>55 млн км²</td><td>Самый большой! Здесь находится Россия</td></tr>
                    <tr><td>🌍 Африка</td><td>30 млн км²</td><td>Самый жаркий континент</td></tr>
                    <tr><td>🌎 Сев. Америка</td><td>24 млн км²</td><td>Здесь находится США и Канада</td></tr>
                    <tr><td>🌎 Юж. Америка</td><td>18 млн км²</td><td>Здесь протекает Амазонка</td></tr>
                    <tr><td>❄️ Антарктида</td><td>14 млн км²</td><td>Самый холодный! -89°C</td></tr>
                    <tr><td>🦘 Австралия</td><td>7.7 млн км²</td><td>Самый маленький континент</td></tr>
                </table>
                
                <h3>💧 Круговорот воды в природе</h3>
                <div class="scheme-box">
                    <div style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;">
                        <span style="font-size:3rem;">🌊</span><span>→</span>
                        <span style="font-size:3rem;">💨</span><span>→</span>
                        <span style="font-size:3rem;">☁️</span><span>→</span>
                        <span style="font-size:3rem;">🌧️</span><span>→</span>
                        <span style="font-size:3rem;">🏞️</span><span>→</span>
                        <span style="font-size:3rem;">🌊</span>
                    </div>
                    <p style="margin-top:10px;">Вода испаряется → образует облака → выпадает дождём → течёт в реки → возвращается в океан!</p>
                </div>
                
                <h3>🌍 Природные зоны России</h3>
                <table class="encyclopedia-table">
                    <tr><th>Зона</th><th>Где находится</th><th>Кто живёт</th></tr>
                    <tr><td>❄️ Арктика</td><td>Крайний север</td><td>Белый медведь, морж, тюлень</td></tr>
                    <tr><td>🌲 Тундра</td><td>Север</td><td>Северный олень, песец, лемминг</td></tr>
                    <tr><td>🌲 Тайга</td><td>Сибирь</td><td>Медведь, волк, рысь, лось</td></tr>
                    <tr><td>🌳 Смешанные леса</td><td>Центр</td><td>Лиса, заяц, белка, кабан</td></tr>
                    <tr><td>🌾 Степи</td><td>Юг</td><td>Суслик, хомяк, дрофа</td></tr>
                    <tr><td>🏜️ Пустыни</td><td>Прикаспий</td><td>Верблюд, ящерица, скорпион</td></tr>
                </table>
            </div>
        `;
    },

    // ==================== ЖИВОТНЫЕ ====================
    renderAnimals(container) {
        const animals = [
            { name: '🐘 Слон', type: 'Млекопитающее', habitat: 'Африка, Азия', food: 'Трава, листья', fact: 'Самое большое сухопутное животное! Весит до 7 тонн!', class: 'mammal' },
            { name: '🦒 Жираф', type: 'Млекопитающее', habitat: 'Африка', food: 'Листья акации', fact: 'Самое высокое животное! Рост до 6 метров!', class: 'mammal' },
            { name: '🐅 Тигр', type: 'Млекопитающее', habitat: 'Азия', food: 'Мясо (хищник)', fact: 'Самая большая кошка! Полоски уникальны, как отпечатки пальцев!', class: 'mammal' },
            { name: '🐧 Пингвин', type: 'Птица', habitat: 'Антарктида', food: 'Рыба', fact: 'Не летает, но отлично плавает! Высиживает яйцо на лапах!', class: 'bird' },
            { name: '🦅 Орёл', type: 'Птица', habitat: 'Горы, леса', food: 'Мясо (хищник)', fact: 'Видит добычу с высоты 3 км! Размах крыльев до 2.5 метров!', class: 'bird' },
            { name: '🐊 Крокодил', type: 'Рептилия', habitat: 'Африка, Азия', food: 'Мясо (хищник)', fact: 'Живёт до 100 лет! Зубы меняются 50 раз за жизнь!', class: 'reptile' },
            { name: '🐢 Черепаха', type: 'Рептилия', habitat: 'Везде', food: 'Растения', fact: 'Живёт до 150 лет! Самая долгоживущая — 250 лет!', class: 'reptile' },
            { name: '🐸 Лягушка', type: 'Амфибия', habitat: 'Около воды', food: 'Насекомые', fact: 'Дышит кожей! Может менять цвет!', class: 'amphibian' },
            { name: '🐟 Акула', type: 'Рыба', habitat: 'Океаны', food: 'Рыба, мясо', fact: 'Появилась 400 млн лет назад! Никогда не спит!', class: 'fish' },
            { name: '🦋 Бабочка', type: 'Насекомое', habitat: 'Везде', food: 'Нектар', fact: 'Пробует пищу лапками! Видит ультрафиолет!', class: 'insect' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🐾</span> Удивительные животные</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>На Земле обитает более <strong>8 миллионов видов</strong> животных! Учёные открывают новые виды каждый год!</p>
                </div>
                
                <h3>📊 Классификация животных</h3>
                <table class="encyclopedia-table">
                    <tr><th>Класс</th><th>Признаки</th><th>Примеры</th></tr>
                    <tr><td>🐾 Млекопитающие</td><td>Кормят детёнышей молоком, дышат лёгкими</td><td>Слон, кит, собака, человек</td></tr>
                    <tr><td>🐦 Птицы</td><td>Есть перья и крылья, откладывают яйца</td><td>Орёл, пингвин, воробей, курица</td></tr>
                    <tr><td>🦎 Рептилии</td><td>Покрыты чешуёй, холоднокровные</td><td>Крокодил, змея, черепаха, ящерица</td></tr>
                    <tr><td>🐸 Амфибии</td><td>Живут и в воде, и на суше</td><td>Лягушка, жаба, тритон</td></tr>
                    <tr><td>🐟 Рыбы</td><td>Живут в воде, дышат жабрами</td><td>Акула, карась, щука, лосось</td></tr>
                    <tr><td>🐛 Насекомые</td><td>6 ног, тело из 3 частей</td><td>Бабочка, муравей, пчела, жук</td></tr>
                </table>
                
                <h3>🌟 Интересные животные</h3>
                ${animals.map(a => `
                    <div class="example-card">
                        <div style="display:flex;align-items:center;gap:15px;">
                            <div style="font-size:3rem;">${a.name.split(' ')[0]}</div>
                            <div>
                                <div class="example-title">${a.name}</div>
                                <p>Тип: <strong>${a.type}</strong> | Живёт: <strong>${a.habitat}</strong> | Ест: <strong>${a.food}</strong></p>
                                <p>💡 <em>${a.fact}</em></p>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <h3>🍽️ Пищевые цепочки</h3>
                <div class="scheme-box">
                    <div style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;">
                        <span>🌱 Трава</span><span>→</span>
                        <span>🐰 Заяц</span><span>→</span>
                        <span>🦊 Лиса</span>
                    </div>
                    <p style="margin-top:10px;">Растения → Травоядные → Хищники — это <strong>пищевая цепочка</strong>!</p>
                </div>
            </div>
        `;
    },

    // ==================== РАСТЕНИЯ ====================
    renderPlants(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🌿</span> Удивительные растения</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>Растения производят <strong>кислород</strong>, которым мы дышим! Одно большое дерево даёт кислород для <strong>4 человек</strong>!</p>
                </div>
                
                <h3>🌱 Части растения</h3>
                <table class="encyclopedia-table">
                    <tr><th>Часть</th><th>Функция</th><th>Эмодзи</th></tr>
                    <tr><td>Корень</td><td>Держит растение в земле, всасывает воду</td><td>🪴</td></tr>
                    <tr><td>Стебель</td><td>Проводит воду к листьям</td><td>🌱</td></tr>
                    <tr><td>Листья</td><td>Производят кислород (фотосинтез)</td><td>🍃</td></tr>
                    <tr><td>Цветок</td><td>Привлекает насекомых для опыления</td><td>🌸</td></tr>
                    <tr><td>Плод</td><td>Защищает семена</td><td>🍎</td></tr>
                    <tr><td>Семена</td><td>Из них вырастает новое растение</td><td>🌰</td></tr>
                </table>
                
                <h3>🌳 Какие бывают растения</h3>
                <table class="encyclopedia-table">
                    <tr><th>Группа</th><th>Признаки</th><th>Примеры</th></tr>
                    <tr><td>🌳 Деревья</td><td>Один ствол, высокие</td><td>Дуб, сосна, берёза, яблоня</td></tr>
                    <tr><td>🌿 Кустарники</td><td>Много стволов, ниже деревьев</td><td>Сирень, шиповник, малина</td></tr>
                    <tr><td>🌱 Травы</td><td>Мягкий стебель, невысокие</td><td>Ромашка, пшеница, клевер</td></tr>
                </table>
                
                <h3>🌍 Как распространяются семена</h3>
                <table class="encyclopedia-table">
                    <tr><th>Способ</th><th>Как работает</th><th>Пример</th></tr>
                    <tr><td>💨 Ветром</td><td>Лёгкие семена с крылышками</td><td>Одуванчик, клён</td></tr>
                    <tr><td>💧 Водой</td><td>Плывут по воде</td><td>Кокос, кувшинка</td></tr>
                    <tr><td>🐾 Животными</td><td>Цепляются к шерсти</td><td>Репейник, череда</td></tr>
                    <tr><td>🍎 Через плоды</td><td>Животные едят плоды</td><td>Яблоко, вишня</td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Фотосинтез — просто!</div>
                    <p>Растения берут <strong>воду + углекислый газ + солнечный свет</strong> и производят <strong>кислород + питание</strong>!</p>
                    <p>☀️ + 💧 + 💨 = 🍃 + 🫁 (кислород для нас!)</p>
                </div>
            </div>
        `;
    },

    // ==================== ЧЕЛОВЕК ====================
    renderHuman(container) {
        const organs = [
            { name: '🧠 Мозг', function: 'Думает, управляет телом', fact: 'Содержит 86 миллиардов нейронов! Потребляет 20% всей энергии!' },
            { name: '❤️ Сердце', function: 'Качает кровь', fact: 'Бьётся 100 000 раз в день! За жизнь — 3 миллиарда ударов!' },
            { name: '🫁 Лёгкие', function: 'Дышат', fact: 'Площадь лёгких = теннисный корт! Делаем 20 000 вдохов в день!' },
            { name: '🍽️ Желудок', function: 'Переваривает пищу', fact: 'Вмещает до 4 литров! Кислота может растворить металл!' },
            { name: '🦴 Кости', function: 'Опора тела', fact: 'У ребёнка 300 костей, у взрослого — 206! Некоторые срастаются!' },
            { name: '👁️ Глаза', function: 'Видят', fact: 'Различают 10 миллионов цветов! Мышцы глаз двигаются 100 000 раз в день!' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🧠</span> Тело человека</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>Тело человека — это <strong>самый сложный механизм</strong> во Вселенной! В нём 37 триллионов клеток!</p>
                </div>
                
                <h3>🫀 Органы чувств</h3>
                <table class="encyclopedia-table">
                    <tr><th>Орган</th><th>Чувство</th><th>Как работает</th></tr>
                    <tr><td>👁️ Глаза</td><td>Зрение</td><td>Свет попадает на сетчатку → сигнал в мозг</td></tr>
                    <tr><td>👂 Уши</td><td>Слух</td><td>Звуковые волны → колебания → сигнал в мозг</td></tr>
                    <tr><td>👃 Нос</td><td>Обоняние</td><td>Частицы запаха → рецепторы → сигнал в мозг</td></tr>
                    <tr><td>👅 Язык</td><td>Вкус</td><td>5 вкусов: сладкий, кислый, солёный, горький, умами</td></tr>
                    <tr><td>✋ Кожа</td><td>Осязание</td><td>Рецепторы давления, температуры, боли</td></tr>
                </table>
                
                <h3>🫀 Важные органы</h3>
                ${organs.map(o => `
                    <div class="example-card">
                        <div class="example-title">${o.name}</div>
                        <p><strong>Функция:</strong> ${o.function}</p>
                        <p>💡 ${o.fact}</p>
                    </div>
                `).join('')}
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Как сохранить здоровье</div>
                    <p>🥗 <strong>Правильно питайся</strong> — больше овощей и фруктов!</p>
                    <p>🏃 <strong>Двигайся</strong> — хотя бы 30 минут в день!</p>
                    <p>😴 <strong>Спи</strong> — детям нужно 9-11 часов сна!</p>
                    <p>💧 <strong>Пей воду</strong> — 6-8 стаканов в день!</p>
                </div>
            </div>
        `;
    },

    // ==================== РОССИЯ ====================
    renderRussia(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🇷🇺</span> Россия — наша Родина</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>Россия — <strong>самая большая страна</strong> в мире! Её площадь — <strong>17 млн км²</strong>, это 1/7 всей суши Земли!</p>
                    <p>В России <strong>11 часовых поясов</strong>! Когда в Москве утро, на Камчатке уже вечер!</p>
                </div>
                
                <h3>📋 Символы России</h3>
                <table class="encyclopedia-table">
                    <tr><th>Символ</th><th>Описание</th></tr>
                    <tr><td>🇷🇺 Флаг</td><td>Три полосы: белая (мир), синяя (небо), красная (отвага)</td></tr>
                    <tr><td>🦅 Герб</td><td>Двуглавый орёл — смотрит на Запад и Восток</td></tr>
                    <tr><td>🎵 Гимн</td><td>«Россия — священная наша держава...»</td></tr>
                    <tr><td>💰 Валюта</td><td>Рубль (₽). 1 рубль = 100 копеек</td></tr>
                    <tr><td>🏙️ Столица</td><td>Москва — основана в 1147 году, более 12 млн жителей</td></tr>
                    <tr><td>🗣️ Язык</td><td>Русский — один из 6 официальных языков ООН</td></tr>
                </table>
                
                <h3>🏙️ Крупнейшие города</h3>
                <table class="encyclopedia-table">
                    <tr><th>Город</th><th>Население</th><th>Известен</th></tr>
                    <tr><td>🏙️ Москва</td><td>12.6 млн</td><td>Кремль, Красная площадь, метро</td></tr>
                    <tr><td>🏙️ Санкт-Петербург</td><td>5.3 млн</td><td>Эрмитаж, разводные мосты, белые ночи</td></tr>
                    <tr><td>🏙️ Новосибирск</td><td>1.6 млн</td><td>Академгородок, самая длинная прямая улица</td></tr>
                    <tr><td>🏙️ Екатеринбург</td><td>1.5 млн</td><td>Граница Европы и Азии</td></tr>
                </table>
                
                <h3>📅 Государственные праздники</h3>
                <table class="encyclopedia-table">
                    <tr><th>Дата</th><th>Праздник</th></tr>
                    <tr><td>🎄 1 января</td><td>Новый год</td></tr>
                    <tr><td>🎅 7 января</td><td>Рождество Христово</td></tr>
                    <tr><td>🇷🇺 23 февраля</td><td>День защитника Отечества</td></tr>
                    <tr><td>🌷 8 марта</td><td>Международный женский день</td></tr>
                    <tr><td>🎉 1 мая</td><td>Праздник Весны и Труда</td></tr>
                    <tr><td>🎖️ 9 мая</td><td>День Победы (1945 год)</td></tr>
                    <tr><td>🇷🇺 12 июня</td><td>День России</td></tr>
                    <tr><td>🤝 4 ноября</td><td>День народного единства</td></tr>
                </table>
                
                <h3>📜 Важные даты истории</h3>
                <table class="encyclopedia-table">
                    <tr><th>Дата</th><th>Событие</th></tr>
                    <tr><td>📅 862 год</td><td>Призвание варягов — начало Руси</td></tr>
                    <tr><td>📅 988 год</td><td>Крещение Руси (князь Владимир)</td></tr>
                    <tr><td>📅 1147 год</td><td>Первое упоминание Москвы</td></tr>
                    <tr><td>📅 1380 год</td><td>Куликовская битва</td></tr>
                    <tr><td>📅 1703 год</td><td>Основание Санкт-Петербурга (Пётр I)</td></tr>
                    <tr><td>📅 1812 год</td><td>Отечественная война (Бородино)</td></tr>
                    <tr><td>📅 1941-1945</td><td>Великая Отечественная война</td></tr>
                    <tr><td>📅 1961 год</td><td>Полёт Гагарина в космос!</td></tr>
                </table>
            </div>
        `;
    },

    // ==================== БЕЗОПАСНОСТЬ ====================
    renderSafety(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">⚠️</span> Правила безопасности</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Важно знать!</div>
                    <p>Знание правил безопасности может <strong>спасти жизнь</strong>! Запомни эти номера:</p>
                    <p style="font-size:1.3rem;text-align:center;"><strong>📞 101</strong> — Пожарные | <strong>📞 102</strong> — Полиция | <strong>📞 103</strong> — Скорая | <strong>📞 112</strong> — Единый</p>
                </div>
                
                <h3>🚗 Правила дорожного движения (ПДД)</h3>
                <table class="encyclopedia-table">
                    <tr><th>Правило</th><th>Объяснение</th></tr>
                    <tr><td>🟢 Зелёный свет</td><td>Можно переходить дорогу</td></tr>
                    <tr><td>🟡 Жёлтый свет</td><td>Внимание! Приготовиться</td></tr>
                    <tr><td>🔴 Красный свет</td><td>Стоять! Нельзя переходить!</td></tr>
                    <tr><td>🦓 Зебра</td><td>Переходи дорогу только по пешеходному переходу</td></tr>
                    <tr><td>👀 Посмотри</td><td>Сначала налево, потом направо — убедись, что машин нет!</td></tr>
                </table>
                
                <h3>🏠 Безопасность дома</h3>
                <table class="encyclopedia-table">
                    <tr><th>Опасность</th><th>Что делать</th></tr>
                    <tr><td>🔥 Пожар</td><td>Звони 101, не прячься, выходи на улицу!</td></tr>
                    <tr><td>⚡ Электричество</td><td>Не трогай розетки мокрыми руками!</td></tr>
                    <tr><td>🔪 Острые предметы</td><td>Ножи, ножницы — только со взрослыми!</td></tr>
                    <tr><td>💊 Лекарства</td><td>Не пробуй незнакомые таблетки!</td></tr>
                    <tr><td>🚪 Незнакомцы</td><td>Не открывай дверь чужим! Спроси: «Кто там?»</td></tr>
                </table>
                
                <h3>🌳 Безопасность на улице и природе</h3>
                <table class="encyclopedia-table">
                    <tr><th>Ситуация</th><th>Что делать</th></tr>
                    <tr><td>🧑‍🦱 Незнакомец</td><td>Не разговаривай, не садись в машину, кричи «Я тебя не знаю!»</td></tr>
                    <tr><td>🌊 Вода</td><td>Купайся только со взрослыми, не заплывай далеко!</td></tr>
                    <tr><td>🌲 Лес</td><td>Не уходи один, если потерялся — стой на месте и зови на помощь!</td></tr>
                    <tr><td>🍄 Грибы</td><td>Не трогай незнакомые грибы и ягоды — они могут быть ядовиты!</td></tr>
                    <tr><td>⛈️ Гроза</td><td>Не стой под деревом, не купайся, выключи телефон!</td></tr>
                </table>
            </div>
        `;
    },

    // ==================== ЭКОЛОГИЯ ====================
    renderEcology(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">♻️</span> Экология</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Потрясающий факт!</div>
                    <p>Каждый год в океан попадает <strong>8 миллионов тонн пластика</strong>! Это как один мусоровоз каждую минуту!</p>
                    <p>Одна пластиковая бутылка разлагается <strong>450 лет</strong>!</p>
                </div>
                
                <h3>♻️ Правило 3R: Reduce, Reuse, Recycle</h3>
                <table class="encyclopedia-table">
                    <tr><th>Правило</th><th>Значение</th><th>Пример</th></tr>
                    <tr><td>🔽 Reduce</td><td>Сокращай потребление</td><td>Не бери лишний пакет, выключай свет</td></tr>
                    <tr><td>🔄 Reuse</td><td>Используй повторно</td><td>Стеклянные банки, тканевые сумки</td></tr>
                    <tr><td>♻️ Recycle</td><td>Перерабатывай</td><td>Бумага, пластик, стекло, металл — в разные контейнеры!</td></tr>
                </table>
                
                <h3>🗑️ Раздельный сбор мусора</h3>
                <table class="encyclopedia-table">
                    <tr><th>Цвет контейнера</th><th>Что бросать</th></tr>
                    <tr><td>🔵 Синий</td><td>Бумага и картон</td></tr>
                    <tr><td>🟡 Жёлтый</td><td>Пластик и металл</td></tr>
                    <tr><td>🟢 Зелёный</td><td>Стекло</td></tr>
                    <tr><td>⚫ Чёрный</td><td>Пищевые отходы</td></tr>
                </table>
                
                <h3>📕 Красная книга</h3>
                <table class="encyclopedia-table">
                    <tr><th>Животное</th><th>Статус</th><th>Почему исчезает</th></tr>
                    <tr><td>🐅 Амурский тигр</td><td>Редкий</td><td>Браконьеры, вырубка лесов</td></tr>
                    <tr><td>🐆 Снежный барс</td><td>Исчезающий</td><td>Охота, сокращение среды обитания</td></tr>
                    <tr><td>🐻 Белый медведь</td><td>Уязвимый</td><td>Таяние льдов из-за потепления</td></tr>
                    <tr><td>🦅 Беркут</td><td>Редкий</td><td>Разрушение гнёзд, отравление</td></tr>
                </table>
                
                <h3>🌱 Что МОЖЕШ сделать ТЫ</h3>
                <div class="example-card">
                    <div class="example-title">✅ 10 простых шагов</div>
                    <p>1. 🚿 Выключай воду, пока чистишь зубы</p>
                    <p>2. 💡 Выключай свет, выходя из комнаты</p>
                    <p>3. 🛍️ Ходи в магазин со своей сумкой</p>
                    <p>4. 🗑️ Сортируй мусор</p>
                    <p>5. 📄 Используй обе стороны листа</p>
                    <p>6. 🌳 Посади дерево</p>
                    <p>7. 🐦 Сделай кормушку для птиц</p>
                    <p>8. 🚲 Ходи пешком или на велосипеде</p>
                    <p>9. 🔋 Сдавай батарейки в переработку</p>
                    <p>10. 📢 Расскажи друзьям о защите природы!</p>
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🌍 Земля — наш дом!</div>
                    <p>Если каждый человек сделает хоть что-то — вместе мы спасём планету!</p>
                    <p><strong>Ты можешь изменить мир!</strong> Начни прямо сегодня! 💚</p>
                </div>
            </div>
        `;
    }
};