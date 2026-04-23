// ==================== ГЕНЕРАТОР ЗАДАНИЙ ДЛЯ ВСЕХ ПРЕДМЕТОВ ====================

// ==================== БАЗЫ ДАННЫХ (ЗАГРУЖАЮТСЯ АСИНХРОННО) ====================
let vocabularyEN = null;
let worldFacts = null;

export async function loadDatabases() {
    try {
        const [vocabRes, factsRes] = await Promise.all([
            fetch('/data/vocabulary-en.json'),
            fetch('/data/world-facts.json')
        ]);
        
        if (vocabRes.ok) vocabularyEN = await vocabRes.json();
        if (factsRes.ok) worldFacts = await factsRes.json();
        
        console.log('✅ Базы данных загружены');
    } catch (e) {
        console.warn('⚠️ Базы данных не загружены, используем встроенные');
        vocabularyEN = getDefaultVocabulary();
        worldFacts = getDefaultWorldFacts();
    }
}

function getDefaultVocabulary() {
    return {
        animals: [
            { en: 'CAT', ru: 'Кошка' }, { en: 'DOG', ru: 'Собака' },
            { en: 'BIRD', ru: 'Птица' }, { en: 'FISH', ru: 'Рыба' },
            { en: 'RABBIT', ru: 'Кролик' }, { en: 'LION', ru: 'Лев' }
        ],
        colors: [
            { en: 'RED', ru: 'Красный' }, { en: 'BLUE', ru: 'Синий' },
            { en: 'GREEN', ru: 'Зелёный' }, { en: 'YELLOW', ru: 'Жёлтый' },
            { en: 'BLACK', ru: 'Чёрный' }, { en: 'WHITE', ru: 'Белый' }
        ],
        family: [
            { en: 'MOTHER', ru: 'Мама' }, { en: 'FATHER', ru: 'Папа' },
            { en: 'SISTER', ru: 'Сестра' }, { en: 'BROTHER', ru: 'Брат' }
        ],
        food: [
            { en: 'APPLE', ru: 'Яблоко' }, { en: 'BANANA', ru: 'Банан' },
            { en: 'BREAD', ru: 'Хлеб' }, { en: 'MILK', ru: 'Молоко' }
        ],
        school: [
            { en: 'BOOK', ru: 'Книга' }, { en: 'PEN', ru: 'Ручка' },
            { en: 'PENCIL', ru: 'Карандаш' }, { en: 'TEACHER', ru: 'Учитель' }
        ],
        verbs: [
            { base: 'PLAY', third: 'PLAYS', ing: 'PLAYING', past: 'PLAYED', ru: 'Играть' },
            { base: 'READ', third: 'READS', ing: 'READING', past: 'READ', ru: 'Читать' },
            { base: 'WRITE', third: 'WRITES', ing: 'WRITING', past: 'WROTE', ru: 'Писать' },
            { base: 'RUN', third: 'RUNS', ing: 'RUNNING', past: 'RAN', ru: 'Бегать' },
            { base: 'EAT', third: 'EATS', ing: 'EATING', past: 'ATE', ru: 'Есть' },
            { base: 'GO', third: 'GOES', ing: 'GOING', past: 'WENT', ru: 'Идти' }
        ]
    };
}

function getDefaultWorldFacts() {
    return {
        planets: [
            { name: 'Меркурий', order: 1 }, { name: 'Венера', order: 2 },
            { name: 'Земля', order: 3 }, { name: 'Марс', order: 4 },
            { name: 'Юпитер', order: 5 }, { name: 'Сатурн', order: 6 }
        ],
        bodyParts: [
            { part: 'Сердце', function: 'Качает кровь' },
            { part: 'Лёгкие', function: 'Дышат' },
            { part: 'Мозг', function: 'Думает' },
            { part: 'Желудок', function: 'Переваривает пищу' },
            { part: 'Глаза', function: 'Видят' }
        ],
        animals: [
            { name: 'Белый медведь', habitat: 'Арктика', food: 'Рыба' },
            { name: 'Жираф', habitat: 'Саванна', food: 'Листья' },
            { name: 'Пингвин', habitat: 'Антарктида', food: 'Рыба' },
            { name: 'Кенгуру', habitat: 'Австралия', food: 'Трава' }
        ],
        cities: [
            { city: 'Москва', country: 'Россия' },
            { city: 'Лондон', country: 'Великобритания' },
            { city: 'Париж', country: 'Франция' },
            { city: 'Пекин', country: 'Китай' }
        ]
    };
}

// ==================== МАТЕМАТИКА ====================
const MathGenerator = {
    addition(max) {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * (max - a)) + 1;
        return { text: `${a} + ${b} = ?`, answer: a + b };
    },
    
    subtraction(max) {
        const a = Math.floor(Math.random() * max) + 2;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        return { text: `${a} - ${b} = ?`, answer: a - b };
    },
    
    multiplication(max) {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return { text: `${a} × ${b} = ?`, answer: a * b };
    },
    
    division(max) {
        const b = Math.floor(Math.random() * (max - 1)) + 2;
        const q = Math.floor(Math.random() * max) + 1;
        return { text: `${b * q} ÷ ${b} = ?`, answer: q };
    },
    
    compare(max) {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        const ans = a < b ? '<' : (a > b ? '>' : '=');
        return { text: `${a} ? ${b}`, answer: ans };
    },
    
    divisionRemainder(max) {
        const b = Math.floor(Math.random() * 5) + 2;
        const q = Math.floor(Math.random() * (max / b)) + 1;
        const a = b * q + Math.floor(Math.random() * (b - 1));
        return { text: `${a} ÷ ${b} = ? (остаток)`, answer: a % b };
    },
    
    perimeterArea(max) {
        const w = Math.floor(Math.random() * max) + 2;
        const h = Math.floor(Math.random() * max) + 2;
        if (Math.random() > 0.5) {
            return { text: `Периметр прямоугольника ${w}×${h} = ?`, answer: 2 * (w + h) };
        } else {
            return { text: `Площадь прямоугольника ${w}×${h} = ?`, answer: w * h };
        }
    },
    
    fractions(max) {
        const denom = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        const num = Math.floor(Math.random() * max) + 10;
        return { text: `1/${denom} от ${num} = ?`, answer: Math.floor(num / denom) };
    },
    
    percent(max) {
        const p = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
        const num = Math.floor(Math.random() * max) + 50;
        return { text: `${p}% от ${num} = ?`, answer: (num * p) / 100 };
    },
    
    equation(max) {
        const x = Math.floor(Math.random() * max) + 1;
        const c = Math.floor(Math.random() * max) + 1;
        return { text: `x + ${c} = ${x + c}, x = ?`, answer: x };
    },
    
    placeValue(max) {
        const num = Math.floor(Math.random() * max) + 10;
        return { text: `Сколько десятков в числе ${num}?`, answer: Math.floor(num / 10) };
    },
    
    multiColumn(max) {
        const a = Math.floor(Math.random() * max) + 10;
        const b = Math.floor(Math.random() * 5) + 2;
        return { text: `${a} × ${b} = ? (реши столбиком)`, answer: a * b };
    },
    
    divisionColumn(max) {
        const b = Math.floor(Math.random() * 5) + 2;
        const q = Math.floor(Math.random() * (max / b)) + 1;
        return { text: `${b * q} ÷ ${b} = ? (реши уголком)`, answer: q };
    },
    
    motion(max) {
        const v = Math.floor(Math.random() * max) + 5;
        const t = Math.floor(Math.random() * 5) + 1;
        return { text: `Скорость ${v} км/ч, время ${t} ч. Расстояние?`, answer: v * t };
    },
    
    shapes() {
        const shapes = [
            { q: 'У какой фигуры нет углов?', a: 'круг' },
            { q: 'Сколько сторон у квадрата?', a: '4' },
            { q: 'Сколько углов у треугольника?', a: '3' }
        ];
        const s = shapes[Math.floor(Math.random() * shapes.length)];
        return { text: s.q, answer: s.a };
    }
};

// ==================== РУССКИЙ ЯЗЫК ====================
const RussianGenerator = {
    alphabet() {
        const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
        const idx = Math.floor(Math.random() * (letters.length - 1));
        return { text: `Какая буква после ${letters[idx]}?`, answer: letters[idx + 1] };
    },
    
    vowels() {
        const vowels = 'АЕЁИОУЫЭЮЯ';
        const consonants = 'БВГДЖЗЙКЛМНПРСТФХЦЧШЩ';
        const v = vowels[Math.floor(Math.random() * vowels.length)];
        const c1 = consonants[Math.floor(Math.random() * consonants.length)];
        const c2 = consonants[Math.floor(Math.random() * consonants.length)];
        return { 
            text: `Какая буква гласная? ${[v, c1, c2].sort(() => Math.random() - 0.5).join(', ')}`, 
            answer: v 
        };
    },
    
    syllables() {
        const words = ['МАМА', 'ПАПА', 'КОТ', 'СОБАКА', 'ШКОЛА', 'КНИГА', 'РУЧКА'];
        const word = words[Math.floor(Math.random() * words.length)];
        const count = (word.match(/[АЕЁИОУЫЭЮЯ]/gi) || []).length;
        return { text: `Сколько слогов в слове ${word}?`, answer: count };
    },
    
    spellingRules() {
        const rules = [
            { q: 'Ж_РАФ (вставь букву)', a: 'И' },
            { q: 'Ч_ШКА (вставь букву)', a: 'А' },
            { q: 'Щ_КА (вставь букву)', a: 'У' }
        ];
        const r = rules[Math.floor(Math.random() * rules.length)];
        return { text: r.q, answer: r.a };
    },
    
    partsOfSpeech() {
        const words = [
            { word: 'КРАСИВЫЙ', type: 'Прилагательное' },
            { word: 'БЕЖАТЬ', type: 'Глагол' },
            { word: 'СТОЛ', type: 'Существительное' },
            { word: 'БЫСТРО', type: 'Наречие' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        return { text: `Слово "${w.word}" — это...`, answer: w.type };
    },
    
    cases() {
        const cases = [
            { q: 'Кого? Чего?', a: 'Родительный' },
            { q: 'Кому? Чему?', a: 'Дательный' },
            { q: 'Кем? Чем?', a: 'Творительный' }
        ];
        const c = cases[Math.floor(Math.random() * cases.length)];
        return { text: `"${c.q}" — это какой падеж?`, answer: c.a };
    },
    
    declensions() {
        const words = [
            { word: 'НОЧЬ', decl: '3' }, { word: 'СТОЛ', decl: '2' },
            { word: 'ПАРТА', decl: '1' }, { word: 'ОКНО', decl: '2' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        return { text: `К какому склонению относится слово "${w.word}"?`, answer: w.decl };
    },
    
    conjugations() {
        const verbs = [
            { verb: 'ЧИТАТЬ', conj: 'I' }, { verb: 'СПАТЬ', conj: 'II' },
            { verb: 'РИСОВАТЬ', conj: 'I' }, { verb: 'ЛЮБИТЬ', conj: 'II' }
        ];
        const v = verbs[Math.floor(Math.random() * verbs.length)];
        return { text: `Глагол "${v.verb}" — ... спряжение`, answer: v.conj };
    }
};
// ==================== АНГЛИЙСКИЙ ЯЗЫК ====================
const EnglishGenerator = {
    alphabet() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const idx = Math.floor(Math.random() * (letters.length - 1));
        return { text: `What letter comes after ${letters[idx]}?`, answer: letters[idx + 1] };
    },
    
    numbers(max) {
        const num = Math.floor(Math.random() * max) + 1;
        const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        return { text: `How do you say ${num} in English?`, answer: words[num] };
    },
    
    vocabulary(category) {
        const items = vocabularyEN?.[category] || getDefaultVocabulary()[category] || [];
        if (!items.length) return { text: 'Translate: CAT', answer: 'Кошка' };
        const item = items[Math.floor(Math.random() * items.length)];
        return { text: `Translate: ${item.en}`, answer: item.ru };
    },
    
    presentSimple() {
        const verbs = vocabularyEN?.verbs || getDefaultVocabulary().verbs;
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const subjects = ['I', 'You', 'He', 'She', 'We', 'They'];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const correct = (subject === 'He' || subject === 'She') ? verb.third : verb.base;
        return { text: `${subject} ___ (${verb.base.toLowerCase()}) every day.`, answer: correct };
    },
    
    plural() {
        const words = [
            { s: 'CAT', p: 'CATS' }, { s: 'DOG', p: 'DOGS' },
            { s: 'BOX', p: 'BOXES' }, { s: 'BABY', p: 'BABIES' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        return { text: `Plural of "${w.s}"`, answer: w.p };
    },
    
    presentContinuous() {
        const verbs = vocabularyEN?.verbs || getDefaultVocabulary().verbs;
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const pronouns = ['I', 'He', 'She', 'We', 'You', 'They'];
        const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const beForm = pronoun === 'I' ? 'am' : (['He', 'She'].includes(pronoun) ? 'is' : 'are');
        return { text: `${pronoun} ___ ${verb.ing}.`, answer: beForm };
    },
    
    comparisons() {
        const adjs = [
            { base: 'BIG', comp: 'BIGGER', sup: 'BIGGEST' },
            { base: 'SMALL', comp: 'SMALLER', sup: 'SMALLEST' },
            { base: 'HAPPY', comp: 'HAPPIER', sup: 'HAPPIEST' }
        ];
        const adj = adjs[Math.floor(Math.random() * adjs.length)];
        return { text: `${adj.base} — ___ — ${adj.sup}`, answer: adj.comp };
    },
    
    pastSimple() {
        const verbs = vocabularyEN?.verbs || getDefaultVocabulary().verbs;
        const verb = verbs.filter(v => v.past)[Math.floor(Math.random() * verbs.filter(v => v.past).length)];
        return { text: `Yesterday I ___ (${verb.base.toLowerCase()}).`, answer: verb.past };
    }
};

// ==================== ОКРУЖАЮЩИЙ МИР ====================
const WorldGenerator = {
    seasons() {
        const qs = [
            { q: 'Какое время года после Зимы?', a: 'Весна' },
            { q: 'В какое время года опадают листья?', a: 'Осень' }
        ];
        const q = qs[Math.floor(Math.random() * qs.length)];
        return { text: q.q, answer: q.a };
    },
    
    animals() {
        const facts = worldFacts?.animals || getDefaultWorldFacts().animals;
        const animal = facts[Math.floor(Math.random() * facts.length)];
        if (Math.random() > 0.5) {
            return { text: `Где живёт ${animal.name}?`, answer: animal.habitat };
        } else {
            return { text: `Чем питается ${animal.name}?`, answer: animal.food };
        }
    },
    
    solarSystem() {
        const planets = worldFacts?.planets || getDefaultWorldFacts().planets;
        const planet = planets[Math.floor(Math.random() * planets.length)];
        return { text: `Какая по счёту от Солнца планета ${planet.name}?`, answer: planet.order };
    },
    
    humanBody() {
        const parts = worldFacts?.bodyParts || getDefaultWorldFacts().bodyParts;
        const part = parts[Math.floor(Math.random() * parts.length)];
        return { text: `Какую функцию выполняет ${part.part}?`, answer: part.function };
    },
    
    countries() {
        const cities = worldFacts?.cities || getDefaultWorldFacts().cities;
        const city = cities[Math.floor(Math.random() * cities.length)];
        return { text: `Столицей какой страны является ${city.city}?`, answer: city.country };
    },
    
    safety() {
        const qs = [
            { q: 'На какой свет светофора можно переходить дорогу?', a: 'Зелёный' },
            { q: 'По какому номеру вызывают пожарных?', a: '101' },
            { q: 'По какому номеру вызывают полицию?', a: '102' }
        ];
        const q = qs[Math.floor(Math.random() * qs.length)];
        return { text: q.q, answer: q.a };
    },
    
    ecology() {
        const qs = [
            { q: 'Что нельзя бросать в лесу?', a: 'Мусор' },
            { q: 'Как называется книга редких животных?', a: 'Красная' }
        ];
        const q = qs[Math.floor(Math.random() * qs.length)];
        return { text: q.q, answer: q.a };
    }
};

// ==================== ГЛАВНЫЙ ГЕНЕРАТОР ====================
export function generateTasks(topic, count = 5) {
    const tasks = [];
    const type = topic.type;
    const max = topic.maxNum || 20;
    const subject = topic.subject || 'math';
    const category = topic.category;
    
    for (let i = 0; i < count; i++) {
        let task = null;
        
        try {
            // МАТЕМАТИКА
            if (subject === 'math') {
                const gen = MathGenerator;
                switch (type) {
                    case 'addition': task = gen.addition(max); break;
                    case 'subtraction': task = gen.subtraction(max); break;
                    case 'multiplication': task = gen.multiplication(max); break;
                    case 'division': task = gen.division(max); break;
                    case 'compare': task = gen.compare(max); break;
                    case 'divisionRemainder': task = gen.divisionRemainder(max); break;
                    case 'perimeterArea': task = gen.perimeterArea(max); break;
                    case 'fractions': task = gen.fractions(max); break;
                    case 'percent': task = gen.percent(max); break;
                    case 'equation': task = gen.equation(max); break;
                    case 'placeValue': task = gen.placeValue(max); break;
                    case 'multiColumn': task = gen.multiColumn(max); break;
                    case 'divisionColumn': task = gen.divisionColumn(max); break;
                    case 'motion': task = gen.motion(max); break;
                    case 'shapes': task = gen.shapes(); break;
                    default: task = gen.addition(max);
                }
            }
            
            // РУССКИЙ ЯЗЫК
            else if (subject === 'russian') {
                const gen = RussianGenerator;
                switch (type) {
                    case 'alphabet': task = gen.alphabet(); break;
                    case 'vowels': task = gen.vowels(); break;
                    case 'syllables': task = gen.syllables(); break;
                    case 'spellingRules': task = gen.spellingRules(); break;
                    case 'partsOfSpeech': task = gen.partsOfSpeech(); break;
                    case 'cases': task = gen.cases(); break;
                    case 'declensions': task = gen.declensions(); break;
                    case 'conjugations': task = gen.conjugations(); break;
                    default: task = gen.alphabet();
                }
            }
            
            // АНГЛИЙСКИЙ ЯЗЫК
            else if (subject === 'english') {
                const gen = EnglishGenerator;
                switch (type) {
                    case 'alphabet': task = gen.alphabet(); break;
                    case 'numbers': task = gen.numbers(max); break;
                    case 'vocabulary': task = gen.vocabulary(category); break;
                    case 'presentSimple': task = gen.presentSimple(); break;
                    case 'plural': task = gen.plural(); break;
                    case 'presentContinuous': task = gen.presentContinuous(); break;
                    case 'comparisons': task = gen.comparisons(); break;
                    case 'pastSimple': task = gen.pastSimple(); break;
                    default: task = gen.vocabulary('animals');
                }
            }
            
            // ОКРУЖАЮЩИЙ МИР
            else if (subject === 'world') {
                const gen = WorldGenerator;
                switch (type) {
                    case 'seasons': task = gen.seasons(); break;
                    case 'animals': task = gen.animals(); break;
                    case 'solarSystem': task = gen.solarSystem(); break;
                    case 'humanBody': task = gen.humanBody(); break;
                    case 'countries': task = gen.countries(); break;
                    case 'safety': task = gen.safety(); break;
                    case 'ecology': task = gen.ecology(); break;
                    default: task = gen.seasons();
                }
            }
        } catch (e) {
            console.warn('Ошибка генерации:', e);
            task = { text: '2 + 2 = ?', answer: 4 };
        }
        
        if (task) {
            task.subject = subject;
            task.type = type;
            tasks.push(task);
        } else {
            tasks.push({ text: '2 + 2 = ?', answer: 4, subject, type });
        }
    }
    
    return tasks;
}

// Инициализация при импорте
loadDatabases();
