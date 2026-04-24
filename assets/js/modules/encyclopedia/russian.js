// ==================== ЭНЦИКЛОПЕДИЯ — РУССКИЙ ЯЗЫК ====================
import { Screens, navigateTo } from '../../core/router.js';
import { renderEncyclopedia } from '../encyclopedia.js';

const TABS = [
    { id: 'alphabet', name: '🔤 Алфавит' },
    { id: 'sounds', name: '🎵 Звуки и буквы' },
    { id: 'parts', name: '🏰 Части речи' },
    { id: 'cases', name: '📜 Падежи' },
    { id: 'verb', name: '⏰ Глаголы' },
    { id: 'sentence', name: '📝 Предложение' },
    { id: 'spelling', name: '✍️ Орфография' },
    { id: 'wordpart', name: '🧩 Состав слова' }
];

export const RussianEncyclopedia = {
    currentTab: 'alphabet',

    render(app, tab = 'alphabet') {
        this.currentTab = tab;
        
        app.innerHTML = `
            <div class="card encyclopedia-container">
                <div class="screen-header">
                    <button class="back-btn" id="backToEncyclopediaBtn">↩️ К энциклопедии</button>
                    <h2>📖 РУССКИЙ ЯЗЫК</h2>
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
            case 'alphabet': this.renderAlphabet(container); break;
            case 'sounds': this.renderSounds(container); break;
            case 'parts': this.renderPartsOfSpeech(container); break;
            case 'cases': this.renderCases(container); break;
            case 'verb': this.renderVerbs(container); break;
            case 'sentence': this.renderSentence(container); break;
            case 'spelling': this.renderSpelling(container); break;
            case 'wordpart': this.renderWordParts(container); break;
        }
    },

    // ==================== АЛФАВИТ ====================
    renderAlphabet(container) {
        const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
        const words = [
            'Арбуз', 'Банан', 'Волк', 'Гриб', 'Дом', 'Ель', 'Ёжик', 'Жук',
            'Зебра', 'Игла', 'Йогурт', 'Кот', 'Лиса', 'Мяч', 'Нос', 'Окно',
            'Пень', 'Рак', 'Слон', 'Торт', 'Утка', 'Флаг', 'Хлеб', 'Царь',
            'Часы', 'Шар', 'Щука', 'Ъ-знак', 'Ы', 'Эхо', 'Юла', 'Якорь'
        ];
        
        let html = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🔤</span> Русский алфавит</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>В русском алфавите <strong>33 буквы</strong>: 10 гласных, 21 согласная и 2 знака (Ъ и Ь).</p>
                    <p>Раньше в алфавите было больше букв — например, Ѣ (ять), Ѳ (фита), Ѵ (ижица)!</p>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:12px;margin:20px 0;">
                    ${alphabet.split('').map((letter, i) => `
                        <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:15px;padding:15px;text-align:center;">
                            <div style="font-size:2.5rem;font-weight:bold;">${letter}</div>
                            <div style="font-size:0.9rem;margin-top:5px;">${words[i]}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎵 Запомни!</div>
                    <p>Гласные тянутся в песне звонкой: <strong>А, О, У, Ы, Э, Я, Ё, Ю, И, Е</strong></p>
                    <p>А согласные согласны шелестеть, шипеть, свистеть: <strong>все остальные!</strong></p>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },

    // ==================== ЗВУКИ И БУКВЫ ====================
    renderSounds(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🎵</span> Звуки и буквы</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Звуки мы <strong>слышим и произносим</strong>, а буквы — <strong>видим и пишем</strong>.</p>
                    <p>В русском языке <strong>42 звука</strong>, но всего <strong>33 буквы</strong>! Некоторые буквы дают 2 звука!</p>
                </div>
                
                <div class="example-card">
                    <div class="example-title">📖 Гласные звуки (10 букв, 6 звуков)</div>
                    <table class="encyclopedia-table">
                        <tr><th>Буквы</th><th>Звуки</th><th>Пример</th></tr>
                        <tr><td>А, О, У, Ы, Э</td><td>[а], [о], [у], [ы], [э]</td><td>м<strong>а</strong>к, д<strong>о</strong>м</td></tr>
                        <tr><td>Я, Ё, Ю, И, Е</td><td>[й'а], [й'о], [й'у], [и], [й'э]</td><td><strong>я</strong>ма, <strong>ё</strong>ж</td></tr>
                    </table>
                </div>
                
                <div class="example-card">
                    <div class="example-title">📖 Согласные звуки</div>
                    <table class="encyclopedia-table">
                        <tr><th>Тип</th><th>Какие бывают</th><th>Примеры</th></tr>
                        <tr><td>Звонкие</td><td>Б, В, Г, Д, Ж, З, Л, М, Н, Р</td><td><strong>б</strong>очка, <strong>в</strong>ода</td></tr>
                        <tr><td>Глухие</td><td>П, Ф, К, Т, Ш, С, Х, Ц, Ч, Щ</td><td><strong>п</strong>очка, <strong>ф</strong>лаг</td></tr>
                        <tr><td>Всегда твёрдые</td><td>Ж, Ш, Ц</td><td><strong>ж</strong>ираф, <strong>ш</strong>ар, <strong>ц</strong>арь</td></tr>
                        <tr><td>Всегда мягкие</td><td>Й, Ч, Щ</td><td><strong>й</strong>од, <strong>ч</strong>ай, <strong>щ</strong>ука</td></tr>
                    </table>
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак</div>
                    <p>Чтобы понять, звонкий звук или глухой — положи руку на горло! Если чувствуешь вибрацию — звук <strong>звонкий</strong>!</p>
                </div>
            </div>
        `;
    },

    // ==================== ЧАСТИ РЕЧИ ====================
    renderPartsOfSpeech(container) {
        const parts = [
            { name: 'Существительное', question: 'Кто? Что?', examples: 'Кот, дом, радость', color: '#e74c3c', emoji: '🏷️', desc: 'Обозначает предмет' },
            { name: 'Прилагательное', question: 'Какой? Какая? Какое?', examples: 'Красивый, умный, большой', color: '#3498db', emoji: '🎨', desc: 'Обозначает признак' },
            { name: 'Глагол', question: 'Что делать? Что сделать?', examples: 'Бежать, читать, думать', color: '#2ecc71', emoji: '🏃', desc: 'Обозначает действие' },
            { name: 'Наречие', question: 'Как? Где? Когда?', examples: 'Быстро, вчера, справа', color: '#9b59b6', emoji: '📍', desc: 'Признак действия' },
            { name: 'Местоимение', question: 'Кто? Что? (указывает)', examples: 'Я, ты, он, она, они', color: '#f39c12', emoji: '👤', desc: 'Указывает на предмет' },
            { name: 'Предлог', question: 'Где? Куда? Откуда?', examples: 'В, на, под, над, за, перед', color: '#1abc9c', emoji: '🔗', desc: 'Связывает слова' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🏰</span> Части речи</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>В русском языке <strong>10 частей речи</strong>! Но в начальной школе изучают 6 основных.</p>
                    <p>Самая древняя часть речи — <strong>существительное</strong>. Люди сначала давали имена предметам!</p>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:15px;margin:20px 0;">
                    ${parts.map(p => `
                        <div style="background:${p.color};color:white;border-radius:20px;padding:20px;">
                            <div style="font-size:2.5rem;margin-bottom:10px;">${p.emoji}</div>
                            <div style="font-size:1.4rem;font-weight:bold;margin-bottom:5px;">${p.name}</div>
                            <div style="opacity:0.9;margin-bottom:8px;">${p.desc}</div>
                            <div style="background:rgba(255,255,255,0.2);border-radius:10px;padding:10px;">
                                <div><strong>Вопросы:</strong> ${p.question}</div>
                                <div style="margin-top:5px;"><strong>Примеры:</strong> ${p.examples}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // ==================== ПАДЕЖИ ====================
    renderCases(container) {
        const cases = [
            { name: 'Именительный', question: 'кто? что?', example: '🦊 лиса', word: 'лиса', color: '#e74c3c' },
            { name: 'Родительный', question: 'кого? чего?', example: '🦊 лисы', word: 'лисы', color: '#e67e22' },
            { name: 'Дательный', question: 'кому? чему?', example: '🦊 лисе', word: 'лисе', color: '#f1c40f' },
            { name: 'Винительный', question: 'кого? что?', example: '🦊 лису', word: 'лису', color: '#2ecc71' },
            { name: 'Творительный', question: 'кем? чем?', example: '🦊 лисой', word: 'лисой', color: '#3498db' },
            { name: 'Предложный', question: 'о ком? о чём?', example: '🦊 о лисе', word: 'о лисе', color: '#9b59b6' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">📜</span> Падежи русского языка</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>В русском языке <strong>6 падежей</strong>. В древнерусском их было <strong>больше 10</strong>!</p>
                    <p>В английском языке падежей почти нет, поэтому иностранцам так сложно учить русский!</p>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin:20px 0;">
                    ${cases.map(c => `
                        <div style="background:${c.color};color:white;border-radius:20px;padding:18px;text-align:center;">
                            <div style="font-size:1.3rem;font-weight:bold;margin-bottom:8px;">${c.name}</div>
                            <div style="font-size:1rem;opacity:0.9;margin-bottom:8px;">${c.question}</div>
                            <div style="font-size:2rem;margin-bottom:5px;">${c.example}</div>
                            <div style="font-size:0.9rem;opacity:0.8;">${c.word}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак для запоминания!</div>
                    <p style="font-weight:bold;font-size:1.2rem;">«<span style="color:#e74c3c;">И</span>ван <span style="color:#e67e22;">Р</span>одил <span style="color:#f1c40f;">Д</span>евчонку, <span style="color:#2ecc71;">В</span>елел <span style="color:#3498db;">Т</span>ащить <span style="color:#9b59b6;">П</span>елёнку»</p>
                    <p>Первые буквы: И-Р-Д-В-Т-П = Именительный, Родительный, Дательный, Винительный, Творительный, Предложный!</p>
                </div>
                
                <h3>📊 Таблица падежей</h3>
                <table class="encyclopedia-table">
                    <tr><th>Падеж</th><th>Вопросы</th><th>Слово-помощник</th><th>Предлоги</th></tr>
                    <tr><td>Именительный</td><td>кто? что?</td><td>есть</td><td>—</td></tr>
                    <tr><td>Родительный</td><td>кого? чего?</td><td>нет</td><td>без, для, до, из, от, у, с</td></tr>
                    <tr><td>Дательный</td><td>кому? чему?</td><td>дать</td><td>к, по</td></tr>
                    <tr><td>Винительный</td><td>кого? что?</td><td>вижу</td><td>в, на, за, про, через</td></tr>
                    <tr><td>Творительный</td><td>кем? чем?</td><td>горжусь</td><td>за, над, перед, под, с</td></tr>
                    <tr><td>Предложный</td><td>о ком? о чём?</td><td>думаю</td><td>в, на, о, при</td></tr>
                </table>
                
                <h3>📝 Склонения существительных</h3>
                <table class="encyclopedia-table">
                    <tr><th>Склонение</th><th>Род</th><th>Окончание</th><th>Примеры</th></tr>
                    <tr><td>1 склонение</td><td>Мужской и женский</td><td>-а, -я</td><td>папа, мама, дядя, земля</td></tr>
                    <tr><td>2 склонение</td><td>Мужской и средний</td><td>□, -о, -е</td><td>стол, конь, окно, море</td></tr>
                    <tr><td>3 склонение</td><td>Женский</td><td>-ь</td><td>ночь, мышь, дочь, рожь</td></tr>
                </table>
            </div>
        `;
    },

    // ==================== ГЛАГОЛЫ ====================
    renderVerbs(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">⏰</span> Глаголы и их времена</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Глагол — самая живая часть речи! Он может «путешествовать во времени»: прошлое, настоящее, будущее!</p>
                </div>
                
                <h3>⏳ Времена глаголов</h3>
                <table class="encyclopedia-table">
                    <tr><th>Время</th><th>Вопросы</th><th>Пример</th><th>Как изменяется</th></tr>
                    <tr><td>🔴 Прошедшее</td><td>Что делал? Что сделал?</td><td>Читал, прочитал</td><td>По родам и числам: читал/читала/читали</td></tr>
                    <tr><td>🟡 Настоящее</td><td>Что делает?</td><td>Читает</td><td>По лицам и числам: читаю/читаешь/читает</td></tr>
                    <tr><td>🟢 Будущее</td><td>Что будет делать? Что сделает?</td><td>Будет читать, прочитает</td><td>По лицам и числам</td></tr>
                </table>
                
                <h3>🔄 Спряжения глаголов</h3>
                <table class="encyclopedia-table">
                    <tr><th>Спряжение</th><th>Окончания</th><th>Примеры</th></tr>
                    <tr><td>I спряжение</td><td>-ешь, -ет, -ем, -ете, -ут/-ют</td><td>Читать, писать, играть, думать</td></tr>
                    <tr><td>II спряжение</td><td>-ишь, -ит, -им, -ите, -ат/-ят</td><td>Спать, любить, говорить, сидеть</td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак</div>
                    <p>Ко II спряжению относятся ВСЕ глаголы на <strong>-ить</strong> (кроме брить, стелить) + 11 исключений:</p>
                    <p><strong>Гнать, держать, смотреть и видеть, дышать, слышать, ненавидеть, и обидеть, и терпеть, и зависеть, и вертеть!</strong></p>
                </div>
                
                <h3>👤 Лица глаголов</h3>
                <table class="encyclopedia-table">
                    <tr><th>Лицо</th><th>Кто?</th><th>I спр.</th><th>II спр.</th></tr>
                    <tr><td>1 лицо</td><td>Я, Мы</td><td>читаю, читаем</td><td>сплю, спим</td></tr>
                    <tr><td>2 лицо</td><td>Ты, Вы</td><td>читаешь, читаете</td><td>спишь, спите</td></tr>
                    <tr><td>3 лицо</td><td>Он, Она, Они</td><td>читает, читают</td><td>спит, спят</td></tr>
                </table>
            </div>
        `;
    },

    // ==================== ПРЕДЛОЖЕНИЕ ====================
    renderSentence(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">📝</span> Предложение</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Предложение — это группа слов, которая выражает <strong>законченную мысль</strong>.</p>
                    <p>Самое длинное предложение в русской литературе — у Льва Толстого, больше 200 слов!</p>
                </div>
                
                <h3>🏗️ Члены предложения</h3>
                <table class="encyclopedia-table">
                    <tr><th>Член предложения</th><th>Вопросы</th><th>Что обозначает</th><th>Пример</th></tr>
                    <tr><td><strong>Подлежащее</strong></td><td>Кто? Что?</td><td>О ком/чём говорится</td><td><u>Кот</u> спит</td></tr>
                    <tr><td><strong>Сказуемое</strong></td><td>Что делает? Каков?</td><td>Что говорится</td><td>Кот <u>спит</u></td></tr>
                    <tr><td>Определение</td><td>Какой? Чей?</td><td>Признак предмета</td><td><em>Пушистый</em> кот</td></tr>
                    <tr><td>Дополнение</td><td>Кого? Чего? Кому?</td><td>Предмет</td><td>Люблю <em>кота</em></td></tr>
                    <tr><td>Обстоятельство</td><td>Где? Когда? Как?</td><td>Место, время</td><td>Спит <em>на диване</em></td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Запомни!</div>
                    <p><strong>Подлежащее</strong> и <strong>сказуемое</strong> — это <span style="color:#e74c3c;">главные члены</span> (грамматическая основа).</p>
                    <p>Остальные — <span style="color:#3498db;">второстепенные</span>.</p>
                </div>
                
                <h3>📋 Виды предложений по цели</h3>
                <table class="encyclopedia-table">
                    <tr><th>Вид</th><th>Знак</th><th>Пример</th></tr>
                    <tr><td>Повествовательное</td><td>.</td><td>Сегодня хорошая погода.</td></tr>
                    <tr><td>Вопросительное</td><td>?</td><td>Какая сегодня погода?</td></tr>
                    <tr><td>Побудительное</td><td>! или .</td><td>Посмотри на погоду!</td></tr>
                </table>
                
                <h3>🔗 Однородные члены</h3>
                <div class="example-card">
                    <div class="example-title">📖 Что это?</div>
                    <p>Слова, которые отвечают на <strong>один и тот же вопрос</strong> и относятся к <strong>одному слову</strong>.</p>
                    <p>Пример: На столе лежали <strong>яблоки, груши и сливы</strong>.</p>
                </div>
            </div>
        `;
    },

    // ==================== ОРФОГРАФИЯ ====================
    renderSpelling(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">✍️</span> Орфография</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Слово «орфография» пришло из греческого: «орфо» — правильно, «графо» — пишу.</p>
                </div>
                
                <h3>🦒 ЖИ-ШИ, ЧА-ЩА, ЧУ-ЩУ</h3>
                <table class="encyclopedia-table">
                    <tr><th>Правило</th><th>Примеры</th></tr>
                    <tr><td><strong>ЖИ-ШИ</strong> пиши с <strong>И</strong></td><td>Жираф, шишка, живот, машина, лыжи</td></tr>
                    <tr><td><strong>ЧА-ЩА</strong> пиши с <strong>А</strong></td><td>Чай, чашка, щавель, роща, площадь</td></tr>
                    <tr><td><strong>ЧУ-ЩУ</strong> пиши с <strong>У</strong></td><td>Чудо, щука, чувство, ищу, молчу</td></tr>
                </table>
                
                <h3>🔍 Безударные гласные в корне</h3>
                <div class="example-card">
                    <div class="example-title">📖 Правило</div>
                    <p>Чтобы проверить безударную гласную, нужно <strong>изменить слово</strong> так, чтобы эта гласная стала <strong>под ударением</strong>.</p>
                </div>
                <table class="encyclopedia-table">
                    <tr><th>Слово</th><th>Проверочное слово</th></tr>
                    <tr><td>В<strong>о</strong>да</td><td>в<strong>ó</strong>ды</td></tr>
                    <tr><td>Тр<strong>а</strong>ва</td><td>тр<strong>á</strong>вы</td></tr>
                    <tr><td>Гр<strong>о</strong>за</td><td>гр<strong>ó</strong>зы</td></tr>
                    <tr><td>З<strong>е</strong>мля</td><td>з<strong>é</strong>мли</td></tr>
                </table>
                
                <h3>👂 Парные согласные</h3>
                <div class="example-card">
                    <div class="example-title">📖 Правило</div>
                    <p>Чтобы проверить парную согласную на конце или в середине слова, нужно <strong>подобрать однокоренное слово</strong>, где после согласной стоит <strong>гласная</strong>.</p>
                </div>
                <table class="encyclopedia-table">
                    <tr><th>Слово</th><th>Проверочное слово</th></tr>
                    <tr><td>Ду<strong>б</strong></td><td>ду<strong>б</strong>ы</td></tr>
                    <tr><td>Моро<strong>з</strong></td><td>моро<strong>з</strong>ы</td></tr>
                    <tr><td>Ска<strong>з</strong>ка</td><td>ска<strong>з</strong>очка</td></tr>
                    <tr><td>Ло<strong>ж</strong>ка</td><td>ло<strong>ж</strong>ечка</td></tr>
                </table>
                
                <h3>🚧 Разделительные Ъ и Ь</h3>
                <table class="encyclopedia-table">
                    <tr><th>Знак</th><th>Когда пишется</th><th>Примеры</th></tr>
                    <tr><td><strong>Ъ</strong></td><td>После приставки перед Е, Ё, Ю, Я</td><td>Подъезд, съёмка, объяснение</td></tr>
                    <tr><td><strong>Ь</strong></td><td>В корне слова перед Е, Ё, Ю, Я, И</td><td>Вьюга, семья, ручьи, воробьи</td></tr>
                </table>
            </div>
        `;
    },

    // ==================== СОСТАВ СЛОВА ====================
    renderWordParts(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🧩</span> Состав слова</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Интересный факт!</div>
                    <p>Слово как конструктор — его можно разобрать на части! Каждая часть имеет своё значение.</p>
                </div>
                
                <div class="scheme-box">
                    <div class="scheme-title">🏗️ Схема слова: ПОДВОДНЫЙ</div>
                    <div style="display:flex;align-items:center;justify-content:center;gap:5px;font-size:1.3rem;flex-wrap:wrap;">
                        <span style="background:#e74c3c;color:white;padding:10px 15px;border-radius:10px;">ПОД<br><small>приставка</small></span>
                        <span>+</span>
                        <span style="background:#3498db;color:white;padding:10px 15px;border-radius:10px;">ВОД<br><small>корень</small></span>
                        <span>+</span>
                        <span style="background:#2ecc71;color:white;padding:10px 15px;border-radius:10px;">Н<br><small>суффикс</small></span>
                        <span>+</span>
                        <span style="background:#9b59b6;color:white;padding:10px 15px;border-radius:10px;">ЫЙ<br><small>окончание</small></span>
                    </div>
                </div>
                
                <h3>🧱 Части слова</h3>
                <table class="encyclopedia-table">
                    <tr><th>Часть</th><th>Где находится</th><th>Зачем нужна</th><th>Пример</th></tr>
                    <tr><td><strong>🔴 Приставка</strong></td><td>Перед корнем</td><td>Образует новые слова</td><td>ПРИехал, Уехал, ЗАехал</td></tr>
                    <tr><td><strong>🔵 Корень</strong></td><td>Главная часть</td><td>Общий смысл родственных слов</td><td>ВОДА, ВОДный, подВОДный</td></tr>
                    <tr><td><strong>🟢 Суффикс</strong></td><td>После корня</td><td>Образует новые слова</td><td>ВодИЧКа, водНЫй</td></tr>
                    <tr><td><strong>🟣 Окончание</strong></td><td>В конце слова</td><td>Связывает слова в предложении</td><td>ВодА, водЫ, водЕ</td></tr>
                </table>
                
                <div class="tip-card">
                    <div class="tip-title">🎯 Лайфхак</div>
                    <p>Чтобы найти <strong>корень</strong> — подбери <strong>родственные слова</strong> (с одинаковым смыслом).</p>
                    <p>Чтобы найти <strong>окончание</strong> — измени слово: вод<strong>а</strong> → вод<strong>ы</strong> → вод<strong>е</strong>.</p>
                    <p>Всё, что между корнем и окончанием — <strong>суффикс</strong>.</p>
                    <p>Всё, что перед корнем — <strong>приставка</strong>.</p>
                </div>
                
                <h3>📋 Примеры разбора слов</h3>
                <table class="encyclopedia-table">
                    <tr><th>Слово</th><th>Приставка</th><th>Корень</th><th>Суффикс</th><th>Окончание</th></tr>
                    <tr><td>ПОЕЗДКА</td><td>ПО</td><td>ЕЗД</td><td>К</td><td>А</td></tr>
                    <tr><td>ЗАМОРОЗКИ</td><td>ЗА</td><td>МОРОЗ</td><td>К</td><td>И</td></tr>
                    <tr><td>ПЕРЕЛЕСОК</td><td>ПЕРЕ</td><td>ЛЕС</td><td>ОК</td><td>□</td></tr>
                    <tr><td>БЕЗДОМНЫЙ</td><td>БЕЗ</td><td>ДОМ</td><td>Н</td><td>ЫЙ</td></tr>
                </table>
            </div>
        `;
    }
};