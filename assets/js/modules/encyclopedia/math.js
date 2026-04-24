// ==================== ЭНЦИКЛОПЕДИЯ — МАТЕМАТИКА ====================
import { Screens, navigateTo } from '../../core/router.js';
import { renderEncyclopedia } from '../encyclopedia.js';

const TABS = [
    { id: 'addition', name: '➕ Сложение' },
    { id: 'subtraction', name: '➖ Вычитание' },
    { id: 'multiplication', name: '✖️ Умножение' },
    { id: 'division', name: '➗ Деление' },
    { id: 'fractions', name: '🍕 Дроби' },
    { id: 'geometry', name: '📐 Геометрия' },
    { id: 'units', name: '📏 Единицы' },
    { id: 'tricks', name: '🧠 Хитрости' }
];

export const MathEncyclopedia = {
    currentTab: 'addition',

    render(app, tab = 'addition') {
        this.currentTab = tab;
        
        app.innerHTML = `
            <div class="card encyclopedia-container">
                <div class="screen-header">
                    <button class="back-btn" id="backToEncyclopediaBtn">↩️ К энциклопедии</button>
                    <h2>📐 МАТЕМАТИКА</h2>
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
            case 'addition': this.renderAddition(container); break;
            case 'subtraction': this.renderSubtraction(container); break;
            case 'multiplication': this.renderMultiplication(container); break;
            case 'division': this.renderDivision(container); break;
            case 'fractions': this.renderFractions(container); break;
            case 'geometry': this.renderGeometry(container); break;
            case 'units': this.renderUnits(container); break;
            case 'tricks': this.renderTricks(container); break;
        }
    },

    renderAddition(container) {
        // Генерируем таблицу сложения
        let tableHtml = '<tr><th>+</th>';
        for (let i = 1; i <= 10; i++) tableHtml += `<th>${i}</th>`;
        tableHtml += '</tr>';
        for (let i = 1; i <= 10; i++) {
            tableHtml += `<tr><th>${i}</th>`;
            for (let j = 1; j <= 10; j++) {
                const sum = i + j;
                const color = sum <= 10 ? '#e8f5e9' : '#fff3e0';
                tableHtml += `<td style="background:${color};">${sum}</td>`;
            }
            tableHtml += '</tr>';
        }
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">➕</span> Сложение</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Знак «+» придумали в <strong>1489 году</strong> немецкие математики. До этого сложение записывали словом «plus»!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">📖 Что такое сложение?</div>
                    <p>Сложение — это <strong>объединение</strong> двух или более чисел в одно целое.</p>
                    <p style="font-size:1.3rem;text-align:center;margin:10px 0;"><strong>Слагаемое + Слагаемое = Сумма</strong></p>
                    <p>Пример: 3 + 2 = 5 (3 и 2 — слагаемые, 5 — сумма)</p>
                </div>
                
                <h3>📊 Таблица сложения (1-10)</h3>
                <div style="overflow-x:auto;">
                    <table class="encyclopedia-table">${tableHtml}</table>
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак</div>
                    <p>От перестановки слагаемых <strong>сумма не меняется</strong>! 3 + 2 = 2 + 3 = 5</p>
                    <p>Если нужно сложить 9 + 5 — можно мысленно сделать 10 + 4 = 14! (забрали 1 у 5 и отдали 9)</p>
                </div>
            </div>
        `;
    },

    renderSubtraction(container) {
        let tableHtml = '<tr><th>-</th>';
        for (let i = 1; i <= 10; i++) tableHtml += `<th>${i}</th>`;
        tableHtml += '</tr>';
        for (let i = 10; i >= 1; i--) {
            tableHtml += `<tr><th>${i}</th>`;
            for (let j = 1; j <= 10; j++) {
                if (i >= j) {
                    const diff = i - j;
                    tableHtml += `<td>${diff}</td>`;
                } else {
                    tableHtml += `<td style="background:#f5f5f5;">-</td>`;
                }
            }
            tableHtml += '</tr>';
        }
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">➖</span> Вычитание</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Вычитание — <strong>обратное действие</strong> сложению. Если 3 + 2 = 5, то 5 - 2 = 3!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">📖 Что такое вычитание?</div>
                    <p style="font-size:1.3rem;text-align:center;margin:10px 0;"><strong>Уменьшаемое - Вычитаемое = Разность</strong></p>
                    <p>Пример: 7 - 3 = 4 (7 — уменьшаемое, 3 — вычитаемое, 4 — разность)</p>
                </div>
                
                <h3>📊 Таблица вычитания</h3>
                <div style="overflow-x:auto;">
                    <table class="encyclopedia-table">${tableHtml}</table>
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак</div>
                    <p>Чтобы проверить вычитание — <strong>сложи результат с вычитаемым</strong>. Должно получиться уменьшаемое!</p>
                    <p>7 - 3 = 4 → проверка: 4 + 3 = 7 ✅</p>
                </div>
            </div>
        `;
    },

    renderMultiplication(container) {
        let tableHtml = '<tr><th>×</th>';
        for (let i = 1; i <= 9; i++) tableHtml += `<th style="background:#667eea;color:white;">${i}</th>`;
        tableHtml += '</tr>';
        for (let i = 1; i <= 9; i++) {
            tableHtml += `<tr><th style="background:#667eea;color:white;">${i}</th>`;
            for (let j = 1; j <= 9; j++) {
                const p = i * j;
                const color = i === j ? '#ffeb3b' : (p % 2 === 0 ? '#f5f5f5' : '#fff');
                tableHtml += `<td style="background:${color};">${p}</td>`;
            }
            tableHtml += '</tr>';
        }
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">✖️</span> Умножение (Таблица Пифагора)</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Таблицу умножения придумал древнегреческий математик <strong>Пифагор</strong> 2500 лет назад!</p>
                    <p>Квадраты чисел (1×1, 2×2, 3×3...) находятся на <strong>диагонали</strong> таблицы!</p>
                </div>
                
                <h3>📊 Таблица умножения (1-9)</h3>
                <div style="overflow-x:auto;">
                    <table class="encyclopedia-table">${tableHtml}</table>
                </div>
                
                <h3>🎵 Стихи для запоминания</h3>
                <div class="example-card">
                    <p>6 × 4 = <strong>24</strong> — «Шестью четыре — двадцать четыре»</p>
                    <p>6 × 6 = <strong>36</strong> — «Шестью шесть — тридцать шесть»</p>
                    <p>6 × 8 = <strong>48</strong> — «Шестью восемь — сорок восемь»</p>
                    <p>7 × 8 = <strong>56</strong> — «Семью восемь — пятьдесят шесть»</p>
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхаки для таблицы умножения</div>
                    <p><strong>На 9:</strong> загни палец! 9×3 — загибаем 3-й палец, слева 2, справа 7 = 27!</p>
                    <p><strong>На 5:</strong> все ответы заканчиваются на 0 или 5!</p>
                    <p><strong>На 2:</strong> просто удвоить число!</p>
                    <p><strong>На 4:</strong> удвоить дважды! 4×3 = (3×2)×2 = 12</p>
                </div>
            </div>
        `;
    },

    renderDivision(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">➗</span> Деление</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Деление — <strong>обратное действие</strong> умножению. Если 6 × 3 = 18, то 18 ÷ 3 = 6!</p>
                    <p>На <strong>0 делить НЕЛЬЗЯ</strong>! Это математический закон.</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">📖 Что такое деление?</div>
                    <p style="font-size:1.3rem;text-align:center;margin:10px 0;"><strong>Делимое ÷ Делитель = Частное</strong></p>
                    <p>Пример: 12 ÷ 3 = 4 (12 — делимое, 3 — делитель, 4 — частное)</p>
                </div>
                
                <h3>📊 Виды деления</h3>
                <table class="encyclopedia-table">
                    <tr><th>Вид</th><th>Описание</th><th>Пример</th></tr>
                    <tr><td>Деление нацело</td><td>Делится без остатка</td><td>12 ÷ 3 = 4</td></tr>
                    <tr><td>Деление с остатком</td><td>Остаётся «хвостик»</td><td>14 ÷ 3 = 4 (ост. 2)</td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак</div>
                    <p>Чтобы проверить деление — <strong>умножь частное на делитель</strong> и прибавь остаток!</p>
                    <p>14 ÷ 3 = 4 (ост. 2) → проверка: 4 × 3 + 2 = 14 ✅</p>
                </div>
            </div>
        `;
    },

    renderFractions(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🍕</span> Дроби и доли</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Дроби придумали в Древнем Египте 4000 лет назад! Они использовали их для раздела земли.</p>
                </div>
                
                <div class="scheme-box">
                    <div class="scheme-title">🍕 Доли — это части целого</div>
                    <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;">
                        <div style="text-align:center;">
                            <div style="font-size:4rem;">🟤</div>
                            <div>Целое = 1</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:4rem;">🟤🔸</div>
                            <div>1/2 — половина</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:4rem;">🍕🍕🍕🍕</div>
                            <div>1/4 — четверть</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:4rem;">🍫🍫🍫</div>
                            <div>1/3 — треть</div>
                        </div>
                    </div>
                </div>
                
                <div class="example-card">
                    <div class="example-title">📖 Как читать дроби</div>
                    <p style="font-size:1.3rem;text-align:center;"><strong>Числитель</strong> (сверху) / <strong>Знаменатель</strong> (снизу)</p>
                    <p>1/2 — одна вторая (половина)</p>
                    <p>3/4 — три четвёртых</p>
                </div>
                
                <h3>📊 Сравнение дробей</h3>
                <table class="encyclopedia-table">
                    <tr><th>Правило</th><th>Пример</th></tr>
                    <tr><td>Из двух дробей с одинаковым знаменателем больше та, у которой числитель больше</td><td>3/4 > 1/4</td></tr>
                    <tr><td>Из двух дробей с одинаковым числителем больше та, у которой знаменатель меньше</td><td>1/2 > 1/4</td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Запомни!</div>
                    <p>1/2 = 0.5 (половина), 1/4 = 0.25 (четверть), 3/4 = 0.75</p>
                    <p>Процент — это сотая часть: 1% = 1/100, 50% = 1/2!</p>
                </div>
            </div>
        `;
    },

    renderGeometry(container) {
        const shapes = [
            { name: 'Квадрат', emoji: '🟥', sides: 4, angles: '4 прямых (90°)', perimeter: 'P = 4 × a', area: 'S = a × a' },
            { name: 'Прямоугольник', emoji: '🟩', sides: 4, angles: '4 прямых (90°)', perimeter: 'P = 2 × (a + b)', area: 'S = a × b' },
            { name: 'Треугольник', emoji: '🔺', sides: 3, angles: 'Сумма = 180°', perimeter: 'P = a + b + c', area: 'S = (a × h) / 2' },
            { name: 'Круг', emoji: '🟡', sides: '0 (бесконечно)', angles: '360°', perimeter: 'L = 2 × π × r', area: 'S = π × r²' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">📐</span> Геометрические фигуры</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Слово «геометрия» пришло из греческого: «гео» — земля, «метрия» — измерение. Изначально геометрия нужна была для измерения полей!</p>
                </div>
                
                ${shapes.map(s => `
                    <div class="example-card" style="margin:20px 0;">
                        <div style="display:flex;align-items:center;gap:15px;">
                            <div style="font-size:4rem;">${s.emoji}</div>
                            <div>
                                <div class="example-title">${s.name}</div>
                                <p>Сторон: <strong>${s.sides}</strong> | Углы: <strong>${s.angles}</strong></p>
                                <p><strong>Периметр:</strong> ${s.perimeter}</p>
                                <p><strong>Площадь:</strong> ${s.area}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Запомни!</div>
                    <p>Периметр — это <strong>сумма длин всех сторон</strong> (как забор вокруг участка).</p>
                    <p>Площадь — это <strong>сколько места внутри</strong> (как ковёр на полу).</p>
                    <p>Число <strong>π (пи)</strong> ≈ 3.14 — оно нужно для расчётов с кругом!</p>
                </div>
            </div>
        `;
    },

    renderUnits(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">📏</span> Единицы измерения</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Раньше люди измеряли длину <strong>локтями, ладонями и ступнями</strong>! Поэтому у разных народов были разные меры.</p>
                </div>
                
                <h3>📏 Длина</h3>
                <table class="encyclopedia-table">
                    <tr><th>Единица</th><th>Сокращение</th><th>Соотношение</th></tr>
                    <tr><td>Миллиметр</td><td>мм</td><td>1 см = 10 мм</td></tr>
                    <tr><td>Сантиметр</td><td>см</td><td>1 дм = 10 см</td></tr>
                    <tr><td>Дециметр</td><td>дм</td><td>1 м = 10 дм</td></tr>
                    <tr><td>Метр</td><td>м</td><td>1 км = 1000 м</td></tr>
                    <tr><td>Километр</td><td>км</td><td>1000 м</td></tr>
                </table>
                
                <h3>⚖️ Масса</h3>
                <table class="encyclopedia-table">
                    <tr><th>Единица</th><th>Соотношение</th></tr>
                    <tr><td>Грамм (г)</td><td>1 кг = 1000 г</td></tr>
                    <tr><td>Килограмм (кг)</td><td>1 ц = 100 кг</td></tr>
                    <tr><td>Центнер (ц)</td><td>1 т = 10 ц = 1000 кг</td></tr>
                    <tr><td>Тонна (т)</td><td>1000 кг</td></tr>
                </table>
                
                <h3>🧪 Объём</h3>
                <table class="encyclopedia-table">
                    <tr><th>Единица</th><th>Соотношение</th></tr>
                    <tr><td>Миллилитр (мл)</td><td>1 л = 1000 мл</td></tr>
                    <tr><td>Литр (л)</td><td>1000 мл</td></tr>
                </table>
                
                <h3>⏰ Время</h3>
                <table class="encyclopedia-table">
                    <tr><th>Единица</th><th>Соотношение</th></tr>
                    <tr><td>Секунда (с)</td><td>1 мин = 60 с</td></tr>
                    <tr><td>Минута (мин)</td><td>1 ч = 60 мин</td></tr>
                    <tr><td>Час (ч)</td><td>1 сут = 24 ч</td></tr>
                    <tr><td>Сутки</td><td>1 нед = 7 сут</td></tr>
                    <tr><td>Месяц</td><td>28-31 день</td></tr>
                    <tr><td>Год</td><td>12 мес = 365 дней</td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак для запоминания</div>
                    <p>КИЛО — всегда 1000! (километр = 1000 метров, килограмм = 1000 граммов)</p>
                    <p>САНТИ — одна сотая! (сантиметр = 1/100 метра)</p>
                    <p>ДЕЦИ — одна десятая! (дециметр = 1/10 метра)</p>
                </div>
            </div>
        `;
    },

    renderTricks(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🧠</span> Математические хитрости</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Математика — это магия чисел!</div>
                    <p>Эти хитрости помогут считать быстрее калькулятора!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">🎯 Умножение на 9 на пальцах</div>
                    <p>Хочешь умножить 9 × 4? Загни 4-й палец слева.</p>
                    <p>Слева от загнутого — <strong>3</strong> пальца (это десятки).</p>
                    <p>Справа — <strong>6</strong> пальцев (это единицы).</p>
                    <p>Ответ: <strong>36</strong>!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">🎯 Умножение на 11</div>
                    <p>Чтобы умножить двузначное число на 11 — раздвинь цифры и вставь их сумму!</p>
                    <p>23 × 11 → 2 _ 3 → 2 + 3 = 5 → <strong>253</strong>!</p>
                    <p>54 × 11 → 5 _ 4 → 5 + 4 = 9 → <strong>594</strong>!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">🎯 Умножение на 5</div>
                    <p>Чтобы умножить на 5 — раздели число на 2 и умножь на 10!</p>
                    <p>24 × 5 → 24 ÷ 2 = 12 → 12 × 10 = <strong>120</strong>!</p>
                    <p>17 × 5 → 17 ÷ 2 = 8.5 → × 10 = <strong>85</strong>!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">🎯 Делимость на 3</div>
                    <p>Число делится на 3, если <strong>сумма его цифр</strong> делится на 3!</p>
                    <p>123 → 1 + 2 + 3 = 6 → 6 делится на 3 → <strong>123 делится на 3!</strong></p>
                    <p>123 ÷ 3 = <strong>41</strong></p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">🎯 Возведение в квадрат чисел, заканчивающихся на 5</div>
                    <p>25² → 2 × (2+1) = 6, и дописать 25 → <strong>625</strong>!</p>
                    <p>35² → 3 × (3+1) = 12, и дописать 25 → <strong>1225</strong>!</p>
                    <p>75² → 7 × 8 = 56, и дописать 25 → <strong>5625</strong>!</p>
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Секрет быстрого счёта</div>
                    <p>Складывать проще, если <strong>дополнять до десятка</strong>!</p>
                    <p>48 + 27 → 48 + 2 = 50, осталось 25 → <strong>75</strong>!</p>
                    <p>Вычитать тоже: 83 - 47 → 83 - 3 = 80, осталось 44 → <strong>36</strong>!</p>
                </div>
            </div>
        `;
    }
};