// ==================== ЭНЦИКЛОПЕДИЯ ЭРУДИТА — ПОЛНЫЙ ФАЙЛ ====================

// ==================== СЛОВАРЬ АНГЛИЙСКОГО (700+ СЛОВ) ====================
const ENGLISH_DICTIONARY = {
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
        { en: 'Cousin', ru: 'Кузен', emoji: '🧒' }, { en: 'Baby', ru: 'Малыш', emoji: '👶' },
        { en: 'Son', ru: 'Сын', emoji: '👦' }, { en: 'Daughter', ru: 'Дочь', emoji: '👧' },
        { en: 'Parents', ru: 'Родители', emoji: '👫' }, { en: 'Family', ru: 'Семья', emoji: '👨‍👩‍👧‍👦' }
    ],
    home: [
        { en: 'House', ru: 'Дом', emoji: '🏠' }, { en: 'Room', ru: 'Комната', emoji: '🚪' },
        { en: 'Bedroom', ru: 'Спальня', emoji: '🛏️' }, { en: 'Kitchen', ru: 'Кухня', emoji: '🍳' },
        { en: 'Bathroom', ru: 'Ванная', emoji: '🛁' }, { en: 'Door', ru: 'Дверь', emoji: '🚪' },
        { en: 'Window', ru: 'Окно', emoji: '🪟' }, { en: 'Table', ru: 'Стол', emoji: '🪑' },
        { en: 'Chair', ru: 'Стул', emoji: '💺' }, { en: 'Bed', ru: 'Кровать', emoji: '🛏️' },
        { en: 'Sofa', ru: 'Диван', emoji: '🛋️' }, { en: 'Lamp', ru: 'Лампа', emoji: '💡' },
        { en: 'Clock', ru: 'Часы', emoji: '🕐' }, { en: 'Mirror', ru: 'Зеркало', emoji: '🪞' },
        { en: 'Fridge', ru: 'Холодильник', emoji: '🧊' }, { en: 'Garden', ru: 'Сад', emoji: '🌳' }
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
        { en: 'Jeans', ru: 'Джинсы', emoji: '👖' }, { en: 'Shorts', ru: 'Шорты', emoji: '🩳' },
        { en: 'Shoes', ru: 'Туфли', emoji: '👞' }, { en: 'Boots', ru: 'Ботинки', emoji: '👢' },
        { en: 'Sneakers', ru: 'Кроссовки', emoji: '👟' }, { en: 'Hat', ru: 'Шляпа', emoji: '🎩' },
        { en: 'Cap', ru: 'Кепка', emoji: '🧢' }, { en: 'Jacket', ru: 'Куртка', emoji: '🧥' },
        { en: 'Coat', ru: 'Пальто', emoji: '🧥' }, { en: 'Scarf', ru: 'Шарф', emoji: '🧣' },
        { en: 'Gloves', ru: 'Перчатки', emoji: '🧤' }, { en: 'Socks', ru: 'Носки', emoji: '🧦' },
        { en: 'Sweater', ru: 'Свитер', emoji: '👚' }
    ],
    body: [
        { en: 'Head', ru: 'Голова', emoji: '🗣️' }, { en: 'Face', ru: 'Лицо', emoji: '😊' },
        { en: 'Eye', ru: 'Глаз', emoji: '👁️' }, { en: 'Ear', ru: 'Ухо', emoji: '👂' },
        { en: 'Nose', ru: 'Нос', emoji: '👃' }, { en: 'Mouth', ru: 'Рот', emoji: '👄' },
        { en: 'Tooth', ru: 'Зуб', emoji: '🦷' }, { en: 'Tongue', ru: 'Язык', emoji: '👅' },
        { en: 'Hair', ru: 'Волосы', emoji: '💇' }, { en: 'Arm', ru: 'Рука', emoji: '💪' },
        { en: 'Hand', ru: 'Кисть', emoji: '✋' }, { en: 'Finger', ru: 'Палец', emoji: '👆' },
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
    ],
    verbs: [
        { en: 'Be', ru: 'Быть', past: 'Was/Were', ing: 'Being' },
        { en: 'Have', ru: 'Иметь', past: 'Had', ing: 'Having' },
        { en: 'Do', ru: 'Делать', past: 'Did', ing: 'Doing' },
        { en: 'Go', ru: 'Идти', past: 'Went', ing: 'Going' },
        { en: 'Come', ru: 'Приходить', past: 'Came', ing: 'Coming' },
        { en: 'See', ru: 'Видеть', past: 'Saw', ing: 'Seeing' },
        { en: 'Eat', ru: 'Есть', past: 'Ate', ing: 'Eating' },
        { en: 'Drink', ru: 'Пить', past: 'Drank', ing: 'Drinking' },
        { en: 'Sleep', ru: 'Спать', past: 'Slept', ing: 'Sleeping' },
        { en: 'Run', ru: 'Бегать', past: 'Ran', ing: 'Running' },
        { en: 'Read', ru: 'Читать', past: 'Read', ing: 'Reading' },
        { en: 'Write', ru: 'Писать', past: 'Wrote', ing: 'Writing' },
        { en: 'Speak', ru: 'Говорить', past: 'Spoke', ing: 'Speaking' },
        { en: 'Play', ru: 'Играть', past: 'Played', ing: 'Playing' },
        { en: 'Like', ru: 'Нравиться', past: 'Liked', ing: 'Liking' },
        { en: 'Love', ru: 'Любить', past: 'Loved', ing: 'Loving' },
        { en: 'Want', ru: 'Хотеть', past: 'Wanted', ing: 'Wanting' },
        { en: 'Make', ru: 'Создавать', past: 'Made', ing: 'Making' },
        { en: 'Take', ru: 'Брать', past: 'Took', ing: 'Taking' },
        { en: 'Give', ru: 'Давать', past: 'Gave', ing: 'Giving' }
    ],
    phrases: [
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
    ]
};

// ==================== ДАННЫЕ ЭНЦИКЛОПЕДИИ ====================
const ENCYCLOPEDIA_DATA = {
    math: {
        name: '📐 Математика', icon: '📐',
        sections: [
            {
                id: 'addition', title: '➕ Сложение',
                story: 'Сложение — это когда мы объединяем числа! Представь: у тебя 3 яблока 🍎, друг дал ещё 2 🍎. Сколько всего? 5!',
                rule: 'Слагаемое + Слагаемое = Сумма. От перестановки слагаемых сумма НЕ меняется!',
                facts: [
                    { title: '💡 Интересный факт!', text: 'Знак "+" придумали в 1489 году немецкие математики. До этого писали слово "plus" (лат. "больше").' },
                    { title: '🧠 Лайфхак', text: 'Чтобы сложить 9 + 5: забери 1 у 5 и отдай 9. Получится 10 + 4 = 14! Это "дополнение до десятка".' }
                ],
                table: { title: 'Таблица сложения (1-10)', headers: ['+','1','2','3','4','5','6','7','8','9','10'], generator: () => { let r = []; for (let i=1;i<=10;i++) { let row=[`${i}`]; for (let j=1;j<=10;j++) row.push(`${i+j}`); r.push(row); } return r; } }
            },
            {
                id: 'subtraction', title: '➖ Вычитание',
                story: 'Вычитание — когда забираем часть! Было 7 конфет 🍬, съел 3 — осталось 4!',
                rule: 'Уменьшаемое - Вычитаемое = Разность. Вычитание — обратно сложению. 7 - 3 = 4, потому что 3 + 4 = 7.',
                facts: [
                    { title: '💡 Интересный факт!', text: 'Знак "-" появился в 1489 году. До этого использовали букву "m" от "minus" (лат. "меньше").' },
                    { title: '🧠 Лайфхак', text: '15 - 9 = ? Вычти 10 (5), потом прибавь 1 = 6! Работает для вычитания 9.' }
                ],
                table: { title: 'Таблица вычитания', headers: ['-','1','2','3','4','5','6','7','8','9','10'], generator: () => { let r = []; for (let i=10;i>=1;i--) { let row=[`${i}`]; for (let j=1;j<=10;j++) row.push(i>=j?`${i-j}`:'-'); r.push(row); } return r; } }
            },
            {
                id: 'multiplication', title: '✖️ Умножение',
                story: 'Умножение — быстрое сложение! 4 коробки по 3 карандаша ✏️ = 4 × 3 = 12!',
                rule: 'Множитель × Множитель = Произведение. От перестановки — не меняется!',
                facts: [
                    { title: '💡 Интересный факт!', text: 'Таблицу умножения придумал Пифагор 2500 лет назад. Она называется "Таблица Пифагора"!' },
                    { title: '🧠 ×9 на пальцах', text: '9×3 — загни 3-й палец. Слева 2, справа 7 = 27! 9×7 — слева 6, справа 3 = 63!' }
                ],
                table: { title: 'Таблица умножения', headers: ['×','1','2','3','4','5','6','7','8','9'], generator: () => { let r = []; for (let i=1;i<=9;i++) { let row=[`${i}`]; for (let j=1;j<=9;j++) row.push(`${i*j}`); r.push(row); } return r; } }
            },
            {
                id: 'division', title: '➗ Деление',
                story: 'Деление — делим поровну! 12 конфет 🍬 на 3 друзей = по 4 каждому!',
                rule: 'Делимое ÷ Делитель = Частное. 12 ÷ 3 = 4, потому что 3 × 4 = 12.',
                facts: [
                    { title: '⚠️ Золотое правило!', text: 'НА НОЛЬ ДЕЛИТЬ НЕЛЬЗЯ! 5 ÷ 0 = ? Ответа не существует!' },
                    { title: '🧠 Лайфхак', text: '80 ÷ 5 = (80 ÷ 10) × 2 = 8 × 2 = 16. Делить на 5 просто!' }
                ]
            },
            {
                id: 'fractions', title: '🍕 Дроби',
                story: 'Дробь — часть целого! Пицца 🍕 на 4 части — каждая = 1/4!',
                rule: 'Числитель (сверху) / Знаменатель (снизу). 1/2 — половина, 1/4 — четверть.',
                facts: [
                    { title: '💡 Интересный факт!', text: 'Дроби придумали в Древнем Египте 4000 лет назад для раздела земли после разлива Нила!' },
                    { title: '🧠 Запомни!', text: '1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75. Чем больше знаменатель — тем меньше часть!' }
                ]
            },
            {
                id: 'geometry', title: '📐 Геометрия',
                story: 'Геометрия — наука о фигурах! Стол 🟫 — прямоугольник, часы ⭕ — круг, крыша 🔺 — треугольник.',
                rule: 'Периметр — сумма сторон (забор). Площадь — место внутри (ковёр).',
                facts: [
                    { title: '📏 Формулы', text: 'Квадрат: P=4a, S=a². Прямоугольник: P=2(a+b), S=a×b. Круг: L=2πr, S=πr². π≈3.14.' }
                ]
            }
        ]
    },
    russian: {
        name: '📖 Русский язык', icon: '📖',
        sections: [
            {
                id: 'alphabet', title: '🔤 Алфавит',
                story: '33 буквы — как 33 богатыря! Буквы ВИДИМ и ПИШЕМ, звуки СЛЫШИМ.',
                rule: '10 гласных + 21 согласная + 2 знака (Ъ, Ь) = 33 буквы.',
                facts: [
                    { title: '💡 Интересный факт!', text: 'Раньше были буквы Ѣ (ять), Ѳ (фита), Ѵ (ижица). Их убрали в 1918 году.' }
                ]
            },
            {
                id: 'cases', title: '📜 Падежи',
                story: '6 падежей! Слова меняют окончания: лиса, лисы, лисе, лису, лисой, о лисе.',
                rule: 'И.п. (кто?что?), Р.п. (кого?чего?), Д.п. (кому?чему?), В.п. (кого?что?), Т.п. (кем?чем?), П.п. (о ком?о чём?).',
                facts: [
                    { title: '🧠 Лайфхак', text: '"Иван Родил Девчонку, Велел Тащить Пелёнку" = И-Р-Д-В-Т-П!' },
                    { title: '📊 Склонения', text: '1 скл: м.р. и ж.р. на -а/-я. 2 скл: м.р. (□) и ср.р. (-о/-е). 3 скл: ж.р. на -ь.' }
                ],
                table: { title: 'Падежи', headers: ['Падеж','Вопросы','Пример (лиса)'], generator: () => [['Именительный','кто? что?','лиса'],['Родительный','кого? чего?','лисы'],['Дательный','кому? чему?','лисе'],['Винительный','кого? что?','лису'],['Творительный','кем? чем?','лисой'],['Предложный','о ком? о чём?','о лисе']] }
            },
            {
                id: 'speech', title: '🏰 Части речи',
                story: 'Слова делятся на группы — как ученики на классы!',
                rule: 'Сущ. (предмет) — кто? что? Глагол (действие) — что делать? Прил. (признак) — какой? Наречие — как? где? когда?',
                facts: [
                    { title: '💡 Интересный факт!', text: 'В русском 10 частей речи, в начальной школе — 6 основных.' }
                ]
            },
            {
                id: 'spelling', title: '✍️ Орфография',
                story: 'Орфо — правильно, графо — пишу. Правила письма!',
                rule: 'ЖИ-ШИ с И! ЧА-ЩА с А! ЧУ-ЩУ с У! Безударную проверяй ударением: водА — вОды.',
                facts: [
                    { title: '🧠 Лайфхак', text: 'Парные согласные проверяй: измени слово — дуб/дуБы, мороз/мороЗы.' }
                ]
            }
        ]
    },
    english: {
        name: '🇬🇧 Английский', icon: '🇬🇧',
        sections: [
            { id: 'abc', title: '🔤 Алфавит', story: '26 букв — на 7 меньше русского! A B C D E F G...', rule: '5 гласных: A E I O U. Одна буква — несколько звуков!', facts: [{title:'💡',text:'Самая частая буква — E (11% слов!). Редкая — Z.'}] },
            { id: 'dictionary', title: '📖 Словарь (700+ слов)', story: 'Все слова по категориям с поиском!', rule: 'Используй поиск 🔍 чтобы найти нужное слово.', facts: [], isDictionary: true },
            { id: 'grammar', title: '📖 Грамматика', story: 'Правила языка! В английском нет падежей и родов.', rule: 'Present: I play / He plays. Past: I played / went. Future: will play.', facts: [{title:'💡',text:'В 3 лице ед.ч. (He/She/It) добавляется -S: He plays, She goes.'}],
                table: { title: 'Неправильные глаголы (топ-10)', headers: ['Глагол','Прош. время','Перевод'], generator: () => [['Be','Was/Were','Быть'],['Have','Had','Иметь'],['Do','Did','Делать'],['Go','Went','Идти'],['Eat','Ate','Есть'],['See','Saw','Видеть'],['Run','Ran','Бегать'],['Read','Read','Читать'],['Write','Wrote','Писать'],['Speak','Spoke','Говорить']] }
            }
        ]
    },
    world: {
        name: '🌍 Окружающий мир', icon: '🌍',
        sections: [
            {
                id: 'space', title: '🪐 Космос',
                story: '8 планет вокруг Солнца! Мы на Земле — третьей от Солнца.',
                rule: 'Меркурий, Венера, Земля, Марс, Юпитер, Сатурн, Уран, Нептун.',
                facts: [
                    { title: '💡 Потрясающе!', text: 'Солнце больше Земли в 1.3 МИЛЛИОНА раз! Свет идёт до нас 8 минут.' },
                    { title: '🧠 Запомни!', text: '"Мы Все Знаем: Мама Юного Сына Утром Накормила" = порядок планет!' }
                ],
                table: { title: 'Планеты', headers: ['Планета','От Солнца','Температура'], generator: () => [['Меркурий','58 млн км','+430/-180°C'],['Венера','108 млн км','+465°C'],['Земля','150 млн км','+15°C'],['Марс','228 млн км','-63°C'],['Юпитер','778 млн км','-145°C'],['Сатурн','1.4 млрд','-178°C'],['Уран','2.9 млрд','-224°C'],['Нептун','4.5 млрд','-218°C']] }
            },
            {
                id: 'human', title: '🧠 Тело человека',
                story: 'Твоё тело — самый сложный механизм! 37 триллионов клеток.',
                rule: '5 чувств: зрение (глаза), слух (уши), обоняние (нос), вкус (язык), осязание (кожа).',
                facts: [
                    { title: '💡', text: 'Сердце — 100 000 ударов в день! Мозг — 86 млрд нейронов! Глаза — 10 млн цветов!' }
                ],
                table: { title: 'Органы', headers: ['Орган','Функция','Факт'], generator: () => [['🧠 Мозг','Думает','86 млрд нейронов'],['❤️ Сердце','Качает','100 000/день'],['🫁 Лёгкие','Дышат','20 000/день'],['🍽️ Желудок','Варит','4 литра!'],['👁️ Глаза','Видят','10 млн цветов']] }
            },
            {
                id: 'animals', title: '🐾 Животные',
                story: 'Миллионы видов! От муравья до кита.',
                rule: 'Группы: млекопитающие, птицы, рыбы, рептилии, амфибии, насекомые.',
                facts: [
                    { title: '🦖', text: 'Динозавры жили 165 млн лет! Человек — 200 000 лет. Вымерли от астероида 65 млн лет назад.' }
                ]
            },
            {
                id: 'russia', title: '🇷🇺 Россия',
                story: 'Самая большая страна! 17 млн км² — 1/7 суши!',
                rule: 'Столица — Москва (1147 г.). Флаг: белый, синий, красный. 11 часовых поясов!',
                facts: [
                    { title: '💡', text: 'Байкал — глубочайшее озеро (1642 м). Эльбрус — высочайшая гора (5642 м). Транссиб — самая длинная ж/д (9288 км).' }
                ],
                table: { title: 'Праздники', headers: ['Дата','Праздник'], generator: () => [['1 янв','Новый год'],['23 фев','Защитника'],['8 мар','Женский'],['1 мая','Труда'],['9 мая','Победа'],['12 июн','День России'],['4 ноя','Единства']] }
            },
            {
                id: 'safety', title: '⚠️ Безопасность',
                story: 'Правила спасают жизнь! Запомни номера!',
                rule: '101 — пожарные, 102 — полиция, 103 — скорая, 112 — единый.',
                facts: [
                    { title: '🚗 ПДД', text: 'Зелёный 🟢 — иди! Красный 🔴 — стой! Переходи по зебре 🦓!' },
                    { title: '🏠 Дома', text: 'Не трогай розетки! Не открывай дверь чужим! Не играй с огнём!' }
                ]
            }
        ]
    }
};

// ==================== РЕНДЕР ====================
function renderEncyclopediaModule(app, subject) {
    if (!subject) { renderEncyclopediaHome(app); return; }
    const data = ENCYCLOPEDIA_DATA[subject];
    if (!data) { renderEncyclopediaHome(app); return; }
    renderEncyclopediaSubject(app, subject, data);
}

function renderEncyclopediaHome(app) {
    app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="navigateTo('apartment')">↩️ В квартиру</button><h2>📖 Энциклопедия Эрудита</h2><div></div></div><div style="text-align:center;padding:20px;"><p>Все знания начальной школы!</p></div><div class="subject-grid">${Object.entries(ENCYCLOPEDIA_DATA).map(([id,d]) => `<div class="subject-card" onclick="renderEncyclopediaModule(document.getElementById('app'),'${id}')"><div class="subject-emoji">${d.icon}</div><div class="subject-name">${d.name}</div><div>${d.sections.length} разделов</div></div>`).join('')}</div></div>`;
}

function renderEncyclopediaSubject(app, subject, data) {
    app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="renderEncyclopediaModule(document.getElementById('app'))">↩️ К предметам</button><h2>${data.icon} ${data.name}</h2><div></div></div><div class="encyclopedia-sections">${data.sections.map(s => `<div class="encyclopedia-section-card" onclick="renderSection('${subject}','${s.id}')"><div class="section-title">${s.title}</div><div>${s.story.substring(0,80)}...</div></div>`).join('')}</div></div>`;
}

function renderSection(subject, sectionId) {
    const app = document.getElementById('app');
    const data = ENCYCLOPEDIA_DATA[subject];
    if (!data) return;
    const section = data.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    if (section.isDictionary) { renderDictionary(app, subject, data); return; }
    
    let tableHtml = '';
    if (section.table) {
        const rows = section.table.generator();
        tableHtml = `<div style="overflow-x:auto;margin:15px 0;"><h3>${section.table.title}</h3><table class="encyclopedia-table"><thead><tr>${section.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    
    app.innerHTML = `<div class="screen-container"><div class="screen-header"><button class="back-btn" onclick="renderEncyclopediaSubject(document.getElementById('app'),'${subject}',null)">↩️ К разделам</button><h2>${section.title}</h2><div></div></div><div class="story-box"><span>📖</span> ${section.story}</div><div class="rule-box"><span>📚</span> <strong>ЗАПОМНИ:</strong> ${section.rule}</div>${section.facts.map(f => `<div style="background:linear-gradient(135deg,#fff9c4,#fff176);border-radius:20px;padding:20px;margin:15px 0;border-left:6px solid #ffc107;"><div style="font-weight:bold;color:#f57f17;">${f.title}</div><p>${f.text}</p></div>`).join('')}${tableHtml}</div>`;
}

// ==================== СЛОВАРЬ С ПОИСКОМ ====================
function renderDictionary(app, subject, data) {
    app.innerHTML = `
        <div class="screen-container">
            <div class="screen-header">
                <button class="back-btn" onclick="renderEncyclopediaSubject(document.getElementById('app'),'${subject}',null)">↩️ К разделам</button>
                <h2>📖 Словарь английского</h2>
                <div></div>
            </div>
            <div style="margin-bottom:20px;">
                <input type="text" id="dictSearch" placeholder="🔍 Поиск по словарю (пиши на русском или английском)..." 
                       style="width:100%;padding:15px;border-radius:40px;border:3px solid #8B4513;font-size:1.1rem;text-align:center;">
            </div>
            <div class="dictionary-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
                ${Object.keys(ENGLISH_DICTIONARY).map(cat => `
                    <div class="dict-tab" data-cat="${cat}" style="background:#b3c7e5;padding:8px 16px;border-radius:30px;cursor:pointer;font-weight:bold;">${getCategoryName(cat)}</div>
                `).join('')}
            </div>
            <div id="dictionaryResults" class="vocabulary-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;"></div>
        </div>
    `;
    
    // Показать всё при загрузке
    showDictionaryResults('all');
    
    // Поиск
    document.getElementById('dictSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) { showDictionaryResults('all'); return; }
        searchDictionary(query);
    });
    
    // Вкладки категорий
    document.querySelectorAll('.dict-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.dict-tab').forEach(t => t.style.background = '#b3c7e5');
            tab.style.background = '#f9d342';
            showDictionaryResults(tab.dataset.cat);
        };
    });
}

function showDictionaryResults(category) {
    const container = document.getElementById('dictionaryResults');
    if (!container) return;
    
    let items = [];
    
    if (category === 'all') {
        Object.values(ENGLISH_DICTIONARY).forEach(cat => { items = items.concat(cat); });
    } else {
        items = ENGLISH_DICTIONARY[category] || [];
    }
    
    container.innerHTML = items.map(word => `
        <div class="vocab-card" style="background:white;border-radius:15px;padding:15px;text-align:center;border:2px solid #e0e0e0;">
            <div style="font-size:2rem;">${word.emoji || '📝'}</div>
            <div style="font-size:1.2rem;font-weight:bold;color:#1565c0;">${word.en}</div>
            <div style="color:#666;">${word.ru}</div>
            ${word.past ? `<div style="font-size:0.8rem;color:#888;">Past: ${word.past}</div>` : ''}
        </div>
    `).join('');
}

function searchDictionary(query) {
    const container = document.getElementById('dictionaryResults');
    if (!container) return;
    
    let allItems = [];
    Object.values(ENGLISH_DICTIONARY).forEach(cat => { allItems = allItems.concat(cat); });
    
    const results = allItems.filter(word => 
        word.en.toLowerCase().includes(query) || 
        word.ru.toLowerCase().includes(query)
    );
    
    container.innerHTML = results.length > 0 ? results.map(word => `
        <div class="vocab-card" style="background:white;border-radius:15px;padding:15px;text-align:center;border:2px solid #e0e0e0;">
            <div style="font-size:2rem;">${word.emoji || '📝'}</div>
            <div style="font-size:1.2rem;font-weight:bold;color:#1565c0;">${word.en}</div>
            <div style="color:#666;">${word.ru}</div>
        </div>
    `).join('') : `<p style="grid-column:1/-1;text-align:center;">Ничего не найдено по запросу "${query}"</p>`;
}

function getCategoryName(cat) {
    const names = { animals: '🐾 Животные', food: '🍎 Еда', family: '👨‍👩‍👧 Семья', home: '🏠 Дом', school: '📚 Школа', clothes: '👕 Одежда', body: '🧠 Тело', nature: '🌿 Природа', verbs: '⚡ Глаголы', phrases: '💬 Фразы' };
    return names[cat] || cat;
}