// ==================== ЭНЦИКЛОПЕДИЯ — АНГЛИЙСКИЙ ЯЗЫК ====================
import { Screens, navigateTo } from '../../core/router.js';
import { renderEncyclopedia } from '../encyclopedia.js';

const TABS = [
    { id: 'alphabet', name: '🔤 Алфавит' },
    { id: 'animals', name: '🐾 Животные' },
    { id: 'food', name: '🍎 Еда' },
    { id: 'family', name: '👨‍👩‍👧 Семья' },
    { id: 'home', name: '🏠 Дом' },
    { id: 'school', name: '📚 Школа' },
    { id: 'clothes', name: '👕 Одежда' },
    { id: 'body', name: '🧠 Тело' },
    { id: 'nature', name: '🌿 Природа' },
    { id: 'verbs', name: '⚡ Глаголы' },
    { id: 'grammar', name: '📖 Грамматика' },
    { id: 'phrases', name: '💬 Фразы' }
];

export const EnglishEncyclopedia = {
    currentTab: 'alphabet',

    render(app, tab = 'alphabet') {
        this.currentTab = tab;
        
        app.innerHTML = `
            <div class="card encyclopedia-container">
                <div class="screen-header">
                    <button class="back-btn" id="backToEncyclopediaBtn">↩️ К энциклопедии</button>
                    <h2>🇬🇧 АНГЛИЙСКИЙ ЯЗЫК</h2>
                    <div class="encyclopedia-search">
                        <input type="text" id="searchVocab" placeholder="🔍 Поиск по словарю...">
                    </div>
                </div>
                
                <div class="encyclopedia-tabs" style="flex-wrap:wrap;">
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
        
        // Поиск по словарю
        const searchInput = document.getElementById('searchVocab');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchVocabulary(e.target.value);
            });
        }
    },

    renderContent(tab) {
        const container = document.getElementById('topicContent');
        
        switch (tab) {
            case 'alphabet': this.renderAlphabet(container); break;
            case 'animals': this.renderVocabulary(container, 'animals', '🐾 Животные'); break;
            case 'food': this.renderVocabulary(container, 'food', '🍎 Еда и напитки'); break;
            case 'family': this.renderVocabulary(container, 'family', '👨‍👩‍👧 Семья'); break;
            case 'home': this.renderVocabulary(container, 'home', '🏠 Дом и мебель'); break;
            case 'school': this.renderVocabulary(container, 'school', '📚 Школа'); break;
            case 'clothes': this.renderVocabulary(container, 'clothes', '👕 Одежда'); break;
            case 'body': this.renderVocabulary(container, 'body', '🧠 Тело человека'); break;
            case 'nature': this.renderVocabulary(container, 'nature', '🌿 Природа'); break;
            case 'verbs': this.renderVerbs(container); break;
            case 'grammar': this.renderGrammar(container); break;
            case 'phrases': this.renderPhrases(container); break;
        }
    },

    renderAlphabet(container) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const words = ['Apple', 'Banana', 'Cat', 'Dog', 'Elephant', 'Fish', 'Giraffe', 'House', 'Ice', 'Juice', 'Kite', 'Lion', 'Monkey', 'Nose', 'Orange', 'Pig', 'Queen', 'Rabbit', 'Sun', 'Tiger', 'Umbrella', 'Van', 'Wolf', 'X-ray', 'Yellow', 'Zebra'];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">🔤</span> English Alphabet</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Did you know?</div>
                    <p>В английском алфавите <strong>26 букв</strong>: 5 гласных (A, E, I, O, U) и 21 согласная.</p>
                    <p>Самая частая буква — <strong>E</strong>, самая редкая — <strong>Z</strong>!</p>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin:20px 0;">
                    ${letters.split('').map((letter, i) => `
                        <div style="background:linear-gradient(135deg,#2196f3,#1565c0);color:white;border-radius:15px;padding:15px;text-align:center;">
                            <div style="font-size:2.5rem;font-weight:bold;">${letter}</div>
                            <div style="font-size:0.8rem;margin-top:5px;">${words[i]}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tip-card">
                    <div class="tip-title">🎵 ABC Song</div>
                    <p style="font-size:1.2rem;">A-B-C-D-E-F-G, H-I-J-K-L-M-N-O-P, Q-R-S, T-U-V, W-X, Y and Z. Now I know my ABCs, next time won't you sing with me!</p>
                </div>
            </div>
        `;
    },

    renderVocabulary(container, category, title) {
        const vocab = this.getVocabulary(category);
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">${title.split(' ')[0]}</span> ${title}</div>
                <div class="vocabulary-grid">
                    ${vocab.map(word => `
                        <div class="vocab-card">
                            <div class="word-emoji">${word.emoji || '📝'}</div>
                            <div class="word-en">${word.en}</div>
                            <div class="word-ru">${word.ru}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    getVocabulary(category) {
        const vocabularies = {
            animals: [
                { en: 'Cat', ru: 'Кошка', emoji: '🐱' }, { en: 'Dog', ru: 'Собака', emoji: '🐶' },
                { en: 'Bird', ru: 'Птица', emoji: '🐦' }, { en: 'Fish', ru: 'Рыба', emoji: '🐟' },
                { en: 'Rabbit', ru: 'Кролик', emoji: '🐰' }, { en: 'Horse', ru: 'Лошадь', emoji: '🐴' },
                { en: 'Cow', ru: 'Корова', emoji: '🐮' }, { en: 'Pig', ru: 'Свинья', emoji: '🐷' },
                { en: 'Chicken', ru: 'Курица', emoji: '🐔' }, { en: 'Sheep', ru: 'Овца', emoji: '🐑' },
                { en: 'Lion', ru: 'Лев', emoji: '🦁' }, { en: 'Tiger', ru: 'Тигр', emoji: '🐯' },
                { en: 'Bear', ru: 'Медведь', emoji: '🐻' }, { en: 'Fox', ru: 'Лиса', emoji: '🦊' },
                { en: 'Wolf', ru: 'Волк', emoji: '🐺' }, { en: 'Elephant', ru: 'Слон', emoji: '🐘' },
                { en: 'Monkey', ru: 'Обезьяна', emoji: '🐵' }, { en: 'Giraffe', ru: 'Жираф', emoji: '🦒' },
                { en: 'Zebra', ru: 'Зебра', emoji: '🦓' }, { en: 'Penguin', ru: 'Пингвин', emoji: '🐧' },
                { en: 'Duck', ru: 'Утка', emoji: '🦆' }, { en: 'Frog', ru: 'Лягушка', emoji: '🐸' },
                { en: 'Mouse', ru: 'Мышь', emoji: '🐭' }, { en: 'Snake', ru: 'Змея', emoji: '🐍' },
                { en: 'Turtle', ru: 'Черепаха', emoji: '🐢' }, { en: 'Whale', ru: 'Кит', emoji: '🐋' },
                { en: 'Shark', ru: 'Акула', emoji: '🦈' }, { en: 'Owl', ru: 'Сова', emoji: '🦉' },
                { en: 'Parrot', ru: 'Попугай', emoji: '🦜' }, { en: 'Butterfly', ru: 'Бабочка', emoji: '🦋' }
            ],
            food: [
                { en: 'Apple', ru: 'Яблоко', emoji: '🍎' }, { en: 'Banana', ru: 'Банан', emoji: '🍌' },
                { en: 'Orange', ru: 'Апельсин', emoji: '🍊' }, { en: 'Grapes', ru: 'Виноград', emoji: '🍇' },
                { en: 'Watermelon', ru: 'Арбуз', emoji: '🍉' }, { en: 'Strawberry', ru: 'Клубника', emoji: '🍓' },
                { en: 'Cherry', ru: 'Вишня', emoji: '🍒' }, { en: 'Peach', ru: 'Персик', emoji: '🍑' },
                { en: 'Bread', ru: 'Хлеб', emoji: '🍞' }, { en: 'Cheese', ru: 'Сыр', emoji: '🧀' },
                { en: 'Egg', ru: 'Яйцо', emoji: '🥚' }, { en: 'Milk', ru: 'Молоко', emoji: '🥛' },
                { en: 'Butter', ru: 'Масло', emoji: '🧈' }, { en: 'Meat', ru: 'Мясо', emoji: '🥩' },
                { en: 'Chicken', ru: 'Курица', emoji: '🍗' }, { en: 'Fish', ru: 'Рыба', emoji: '🐟' },
                { en: 'Soup', ru: 'Суп', emoji: '🍜' }, { en: 'Rice', ru: 'Рис', emoji: '🍚' },
                { en: 'Pasta', ru: 'Паста', emoji: '🍝' }, { en: 'Pizza', ru: 'Пицца', emoji: '🍕' },
                { en: 'Cake', ru: 'Торт', emoji: '🎂' }, { en: 'Ice cream', ru: 'Мороженое', emoji: '🍦' },
                { en: 'Chocolate', ru: 'Шоколад', emoji: '🍫' }, { en: 'Candy', ru: 'Конфета', emoji: '🍬' },
                { en: 'Cookie', ru: 'Печенье', emoji: '🍪' }, { en: 'Juice', ru: 'Сок', emoji: '🧃' },
                { en: 'Tea', ru: 'Чай', emoji: '🍵' }, { en: 'Coffee', ru: 'Кофе', emoji: '☕' },
                { en: 'Water', ru: 'Вода', emoji: '💧' }, { en: 'Honey', ru: 'Мёд', emoji: '🍯' }
            ],
            family: [
                { en: 'Mother', ru: 'Мама', emoji: '👩' }, { en: 'Father', ru: 'Папа', emoji: '👨' },
                { en: 'Sister', ru: 'Сестра', emoji: '👧' }, { en: 'Brother', ru: 'Брат', emoji: '👦' },
                { en: 'Grandmother', ru: 'Бабушка', emoji: '👵' }, { en: 'Grandfather', ru: 'Дедушка', emoji: '👴' },
                { en: 'Aunt', ru: 'Тётя', emoji: '👩‍🦰' }, { en: 'Uncle', ru: 'Дядя', emoji: '👨‍🦰' },
                { en: 'Cousin', ru: 'Двоюродный', emoji: '🧒' }, { en: 'Baby', ru: 'Малыш', emoji: '👶' },
                { en: 'Son', ru: 'Сын', emoji: '👦' }, { en: 'Daughter', ru: 'Дочь', emoji: '👧' },
                { en: 'Parents', ru: 'Родители', emoji: '👫' }, { en: 'Family', ru: 'Семья', emoji: '👨‍👩‍👧‍👦' }
            ],
            home: [
                { en: 'House', ru: 'Дом', emoji: '🏠' }, { en: 'Room', ru: 'Комната', emoji: '🚪' },
                { en: 'Bedroom', ru: 'Спальня', emoji: '🛏️' }, { en: 'Kitchen', ru: 'Кухня', emoji: '🍳' },
                { en: 'Bathroom', ru: 'Ванная', emoji: '🛁' }, { en: 'Living room', ru: 'Гостиная', emoji: '🛋️' },
                { en: 'Door', ru: 'Дверь', emoji: '🚪' }, { en: 'Window', ru: 'Окно', emoji: '🪟' },
                { en: 'Table', ru: 'Стол', emoji: '🪑' }, { en: 'Chair', ru: 'Стул', emoji: '💺' },
                { en: 'Bed', ru: 'Кровать', emoji: '🛏️' }, { en: 'Sofa', ru: 'Диван', emoji: '🛋️' },
                { en: 'Lamp', ru: 'Лампа', emoji: '💡' }, { en: 'Clock', ru: 'Часы', emoji: '🕐' },
                { en: 'Mirror', ru: 'Зеркало', emoji: '🪞' }, { en: 'Carpet', ru: 'Ковёр', emoji: '🧶' },
                { en: 'Fridge', ru: 'Холодильник', emoji: '🧊' }, { en: 'Stove', ru: 'Плита', emoji: '🔥' },
                { en: 'Cupboard', ru: 'Шкаф', emoji: '🗄️' }, { en: 'Garden', ru: 'Сад', emoji: '🌳' }
            ],
            school: [
                { en: 'Book', ru: 'Книга', emoji: '📕' }, { en: 'Pen', ru: 'Ручка', emoji: '🖊️' },
                { en: 'Pencil', ru: 'Карандаш', emoji: '✏️' }, { en: 'Ruler', ru: 'Линейка', emoji: '📏' },
                { en: 'Eraser', ru: 'Ластик', emoji: '🧹' }, { en: 'Notebook', ru: 'Тетрадь', emoji: '📓' },
                { en: 'Bag', ru: 'Рюкзак', emoji: '🎒' }, { en: 'Desk', ru: 'Парта', emoji: '🪑' },
                { en: 'Board', ru: 'Доска', emoji: '🖥️' }, { en: 'Teacher', ru: 'Учитель', emoji: '👩‍🏫' },
                { en: 'Student', ru: 'Ученик', emoji: '🧑‍🎓' }, { en: 'Classroom', ru: 'Класс', emoji: '🏫' },
                { en: 'Homework', ru: 'Домашка', emoji: '📝' }, { en: 'Lesson', ru: 'Урок', emoji: '📖' },
                { en: 'Mark', ru: 'Оценка', emoji: '⭐' }, { en: 'Break', ru: 'Перемена', emoji: '🔔' }
            ],
            clothes: [
                { en: 'Shirt', ru: 'Рубашка', emoji: '👔' }, { en: 'T-shirt', ru: 'Футболка', emoji: '👕' },
                { en: 'Dress', ru: 'Платье', emoji: '👗' }, { en: 'Skirt', ru: 'Юбка', emoji: '👘' },
                { en: 'Jeans', ru: 'Джинсы', emoji: '👖' }, { en: 'Trousers', ru: 'Брюки', emoji: '👖' },
                { en: 'Shorts', ru: 'Шорты', emoji: '🩳' }, { en: 'Shoes', ru: 'Туфли', emoji: '👞' },
                { en: 'Boots', ru: 'Ботинки', emoji: '👢' }, { en: 'Sneakers', ru: 'Кроссовки', emoji: '👟' },
                { en: 'Hat', ru: 'Шляпа', emoji: '🎩' }, { en: 'Cap', ru: 'Кепка', emoji: '🧢' },
                { en: 'Jacket', ru: 'Куртка', emoji: '🧥' }, { en: 'Coat', ru: 'Пальто', emoji: '🧥' },
                { en: 'Scarf', ru: 'Шарф', emoji: '🧣' }, { en: 'Gloves', ru: 'Перчатки', emoji: '🧤' },
                { en: 'Socks', ru: 'Носки', emoji: '🧦' }, { en: 'Sweater', ru: 'Свитер', emoji: '👚' }
            ],
            body: [
                { en: 'Head', ru: 'Голова', emoji: '🗣️' }, { en: 'Face', ru: 'Лицо', emoji: '😊' },
                { en: 'Eye', ru: 'Глаз', emoji: '👁️' }, { en: 'Ear', ru: 'Ухо', emoji: '👂' },
                { en: 'Nose', ru: 'Нос', emoji: '👃' }, { en: 'Mouth', ru: 'Рот', emoji: '👄' },
                { en: 'Tooth', ru: 'Зуб', emoji: '🦷' }, { en: 'Tongue', ru: 'Язык', emoji: '👅' },
                { en: 'Hair', ru: 'Волосы', emoji: '💇' }, { en: 'Arm', ru: 'Рука (от плеча)', emoji: '💪' },
                { en: 'Hand', ru: 'Рука (кисть)', emoji: '✋' }, { en: 'Finger', ru: 'Палец', emoji: '👆' },
                { en: 'Leg', ru: 'Нога', emoji: '🦵' }, { en: 'Foot', ru: 'Ступня', emoji: '🦶' },
                { en: 'Heart', ru: 'Сердце', emoji: '❤️' }, { en: 'Brain', ru: 'Мозг', emoji: '🧠' },
                { en: 'Stomach', ru: 'Живот', emoji: '🔵' }, { en: 'Back', ru: 'Спина', emoji: '🔙' }
            ],
            nature: [
                { en: 'Sun', ru: 'Солнце', emoji: '☀️' }, { en: 'Moon', ru: 'Луна', emoji: '🌙' },
                { en: 'Star', ru: 'Звезда', emoji: '⭐' }, { en: 'Sky', ru: 'Небо', emoji: '🌤️' },
                { en: 'Cloud', ru: 'Облако', emoji: '☁️' }, { en: 'Rain', ru: 'Дождь', emoji: '🌧️' },
                { en: 'Snow', ru: 'Снег', emoji: '❄️' }, { en: 'Wind', ru: 'Ветер', emoji: '💨' },
                { en: 'Tree', ru: 'Дерево', emoji: '🌳' }, { en: 'Flower', ru: 'Цветок', emoji: '🌸' },
                { en: 'Grass', ru: 'Трава', emoji: '🌿' }, { en: 'River', ru: 'Река', emoji: '🏞️' },
                { en: 'Lake', ru: 'Озеро', emoji: '🏝️' }, { en: 'Sea', ru: 'Море', emoji: '🌊' },
                { en: 'Mountain', ru: 'Гора', emoji: '⛰️' }, { en: 'Forest', ru: 'Лес', emoji: '🌲' },
                { en: 'Rainbow', ru: 'Радуга', emoji: '🌈' }, { en: 'Storm', ru: 'Шторм', emoji: '⛈️' }
            ]
        };
        return vocabularies[category] || [];
    },

    renderVerbs(container) {
        const verbs = [
            { base: 'Be', past: 'Was/Were', ing: 'Being', ru: 'Быть', emoji: '✨' },
            { base: 'Have', past: 'Had', ing: 'Having', ru: 'Иметь', emoji: '🤲' },
            { base: 'Do', past: 'Did', ing: 'Doing', ru: 'Делать', emoji: '🔧' },
            { base: 'Go', past: 'Went', ing: 'Going', ru: 'Идти', emoji: '🚶' },
            { base: 'Come', past: 'Came', ing: 'Coming', ru: 'Приходить', emoji: '📥' },
            { base: 'See', past: 'Saw', ing: 'Seeing', ru: 'Видеть', emoji: '👀' },
            { base: 'Eat', past: 'Ate', ing: 'Eating', ru: 'Есть', emoji: '🍽️' },
            { base: 'Drink', past: 'Drank', ing: 'Drinking', ru: 'Пить', emoji: '🥤' },
            { base: 'Sleep', past: 'Slept', ing: 'Sleeping', ru: 'Спать', emoji: '😴' },
            { base: 'Run', past: 'Ran', ing: 'Running', ru: 'Бегать', emoji: '🏃' },
            { base: 'Read', past: 'Read', ing: 'Reading', ru: 'Читать', emoji: '📖' },
            { base: 'Write', past: 'Wrote', ing: 'Writing', ru: 'Писать', emoji: '✍️' },
            { base: 'Speak', past: 'Spoke', ing: 'Speaking', ru: 'Говорить', emoji: '🗣️' },
            { base: 'Listen', past: 'Listened', ing: 'Listening', ru: 'Слушать', emoji: '👂' },
            { base: 'Play', past: 'Played', ing: 'Playing', ru: 'Играть', emoji: '🎮' },
            { base: 'Like', past: 'Liked', ing: 'Liking', ru: 'Нравиться', emoji: '❤️' },
            { base: 'Love', past: 'Loved', ing: 'Loving', ru: 'Любить', emoji: '💕' },
            { base: 'Want', past: 'Wanted', ing: 'Wanting', ru: 'Хотеть', emoji: '🙏' },
            { base: 'Can', past: 'Could', ing: '-', ru: 'Мочь', emoji: '💪' },
            { base: 'Make', past: 'Made', ing: 'Making', ru: 'Делать/создавать', emoji: '🛠️' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">⚡</span> Глаголы (Verbs)</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Важно!</div>
                    <p>В английском языке есть <strong>правильные</strong> глаголы (+ed в прошлом) и <strong>неправильные</strong> (меняются по-разному).</p>
                    <p>Неправильные глаголы нужно <strong>запомнить</strong> — их около 200, но 20-30 самых частых хватит для разговора!</p>
                </div>
                
                <h3>📋 20 самых важных глаголов</h3>
                <table class="encyclopedia-table">
                    <tr><th>Глагол</th><th>Прошлое</th><th>Длительное</th><th>Перевод</th></tr>
                    ${verbs.map(v => `
                        <tr>
                            <td><strong>${v.base}</strong></td>
                            <td>${v.past}</td>
                            <td>${v.ing}</td>
                            <td>${v.emoji} ${v.ru}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    },

    renderGrammar(container) {
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">📖</span> Грамматика</div>
                
                <h3>⏰ Времена глаголов</h3>
                <table class="encyclopedia-table">
                    <tr><th>Время</th><th>Формула</th><th>Пример</th><th>Перевод</th></tr>
                    <tr><td>Present Simple</td><td>I/You/We/They + V<br>He/She/It + Vs</td><td>I play. He plays.</td><td>Я играю. Он играет.</td></tr>
                    <tr><td>Past Simple</td><td>Ved / V2</td><td>I played. I went.</td><td>Я играл. Я пошёл.</td></tr>
                    <tr><td>Future Simple</td><td>Will + V</td><td>I will play.</td><td>Я буду играть.</td></tr>
                    <tr><td>Present Continuous</td><td>Am/Is/Are + Ving</td><td>I am playing.</td><td>Я играю (сейчас).</td></tr>
                </table>
                
                <h3>📝 Множественное число</h3>
                <table class="encyclopedia-table">
                    <tr><th>Правило</th><th>Пример</th></tr>
                    <tr><td>Обычно +s</td><td>Cat → Cat<strong>s</strong></td></tr>
                    <tr><td>После -s, -sh, -ch, -x, -o +es</td><td>Box → Box<strong>es</strong></td></tr>
                    <tr><td>Согласная + y → ies</td><td>Baby → Bab<strong>ies</strong></td></tr>
                    <tr><td>-f/-fe → ves</td><td>Wolf → Wol<strong>ves</strong></td></tr>
                </table>
                
                <h3>📏 Степени сравнения</h3>
                <table class="encyclopedia-table">
                    <tr><th>Тип</th><th>Сравнительная</th><th>Превосходная</th></tr>
                    <tr><td>Короткие (1 слог)</td><td>+er (bigger)</td><td>+est (biggest)</td></tr>
                    <tr><td>Длинные (2+ слога)</td><td>more + (more beautiful)</td><td>most + (most beautiful)</td></tr>
                    <tr><td>Исключения</td><td>Good → better</td><td>Bad → worst</td></tr>
                </table>
            </div>
        `;
    },

    renderPhrases(container) {
        const phrases = [
            { en: 'Hello!', ru: 'Привет!', emoji: '👋' },
            { en: 'How are you?', ru: 'Как дела?', emoji: '😊' },
            { en: 'I\'m fine, thank you!', ru: 'У меня хорошо, спасибо!', emoji: '👍' },
            { en: 'What\'s your name?', ru: 'Как тебя зовут?', emoji: '📛' },
            { en: 'My name is...', ru: 'Меня зовут...', emoji: '🏷️' },
            { en: 'Nice to meet you!', ru: 'Приятно познакомиться!', emoji: '🤝' },
            { en: 'Good morning!', ru: 'Доброе утро!', emoji: '🌅' },
            { en: 'Good night!', ru: 'Спокойной ночи!', emoji: '🌙' },
            { en: 'Thank you!', ru: 'Спасибо!', emoji: '🙏' },
            { en: 'You\'re welcome!', ru: 'Пожалуйста!', emoji: '😊' },
            { en: 'Excuse me', ru: 'Извините', emoji: '🤚' },
            { en: 'I\'m sorry', ru: 'Прости', emoji: '😔' },
            { en: 'I don\'t understand', ru: 'Я не понимаю', emoji: '🤷' },
            { en: 'Can you help me?', ru: 'Можешь помочь?', emoji: '🆘' },
            { en: 'I like it!', ru: 'Мне нравится!', emoji: '❤️' },
            { en: 'Let\'s go!', ru: 'Пойдём!', emoji: '🚶' },
            { en: 'See you later!', ru: 'Увидимся!', emoji: '👋' },
            { en: 'Good luck!', ru: 'Удачи!', emoji: '🍀' },
            { en: 'Happy birthday!', ru: 'С днём рождения!', emoji: '🎂' },
            { en: 'I love you!', ru: 'Я тебя люблю!', emoji: '💕' }
        ];
        
        container.innerHTML = `
            <div class="encyclopedia-topic-card">
                <div class="topic-title"><span class="emoji">💬</span> Повседневные фразы</div>
                
                <div class="fact-card">
                    <div class="fact-title">💡 Совет</div>
                    <p>Эти 20 фраз помогут в <strong>любой ситуации</strong> — от приветствия до прощания!</p>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin:20px 0;">
                    ${phrases.map(p => `
                        <div style="background:linear-gradient(135deg,#e3f2fd,#bbdefb);border-radius:15px;padding:15px;text-align:center;">
                            <div style="font-size:2rem;margin-bottom:8px;">${p.emoji}</div>
                            <div style="font-size:1.2rem;font-weight:bold;color:#1565c0;">${p.en}</div>
                            <div style="font-size:1rem;color:#555;margin-top:5px;">${p.ru}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    searchVocabulary(query) {
        if (!query) return;
        const categories = ['animals', 'food', 'family', 'home', 'school', 'clothes', 'body', 'nature'];
        const container = document.getElementById('topicContent');
        
        let results = [];
        categories.forEach(cat => {
            const vocab = this.getVocabulary(cat);
            vocab.forEach(word => {
                if (word.en.toLowerCase().includes(query.toLowerCase()) || 
                    word.ru.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ ...word, category: cat });
                }
            });
        });
        
        if (results.length > 0) {
            container.innerHTML = `
                <div class="encyclopedia-topic-card">
                    <div class="topic-title"><span class="emoji">🔍</span> Результаты поиска: "${query}"</div>
                    <div class="vocabulary-grid">
                        ${results.map(word => `
                            <div class="vocab-card">
                                <div class="word-emoji">${word.emoji || '📝'}</div>
                                <div class="word-en">${word.en}</div>
                                <div class="word-ru">${word.ru}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="encyclopedia-topic-card">
                    <p style="text-align:center;padding:20px;">Ничего не найдено по запросу "${query}"</p>
                </div>
            `;
        }
    }
};