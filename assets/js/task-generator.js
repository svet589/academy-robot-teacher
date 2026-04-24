// ==================== ГЕНЕРАТОР ЗАДАНИЙ ДЛЯ ВСЕХ ПРЕДМЕТОВ + ЛОГИКА ====================

// ==================== МАТЕМАТИКА ====================
const MathGenerator = {
    addition(max) {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * (max - a)) + 1;
        return { text: `${a} + ${b} = ?`, answer: a + b, type: 'math' };
    },
    subtraction(max) {
        const a = Math.floor(Math.random() * max) + 2;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        return { text: `${a} - ${b} = ?`, answer: a - b, type: 'math' };
    },
    multiplication(max) {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        return { text: `${a} × ${b} = ?`, answer: a * b, type: 'math' };
    },
    division(max) {
        const b = Math.floor(Math.random() * (max - 1)) + 2;
        const q = Math.floor(Math.random() * max) + 1;
        return { text: `${b * q} ÷ ${b} = ?`, answer: q, type: 'math' };
    },
    compare(max) {
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        const ans = a < b ? '<' : (a > b ? '>' : '=');
        return { text: `${a} ? ${b}`, answer: ans, type: 'math' };
    },
    divisionRemainder(max) {
        const b = Math.floor(Math.random() * 5) + 2;
        const q = Math.floor(Math.random() * (max / b)) + 1;
        const a = b * q + Math.floor(Math.random() * (b - 1));
        return { text: `${a} ÷ ${b} = ? (остаток)`, answer: a % b, type: 'math' };
    },
    perimeterArea(max) {
        const w = Math.floor(Math.random() * max) + 2;
        const h = Math.floor(Math.random() * max) + 2;
        if (Math.random() > 0.5) {
            return { text: `Периметр прямоугольника ${w}×${h} = ?`, answer: 2 * (w + h), type: 'math' };
        } else {
            return { text: `Площадь прямоугольника ${w}×${h} = ?`, answer: w * h, type: 'math' };
        }
    },
    fractions(max) {
        const d = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        const num = Math.floor(Math.random() * max) + 10;
        return { text: `1/${d} от ${num} = ?`, answer: Math.floor(num / d), type: 'math' };
    },
    percent(max) {
        const p = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
        const num = Math.floor(Math.random() * max) + 50;
        return { text: `${p}% от ${num} = ?`, answer: (num * p) / 100, type: 'math' };
    },
    equation(max) {
        const x = Math.floor(Math.random() * max) + 1;
        const c = Math.floor(Math.random() * max) + 1;
        return { text: `x + ${c} = ${x + c}, x = ?`, answer: x, type: 'math' };
    },
    placeValue(max) {
        const num = Math.floor(Math.random() * max) + 10;
        return { text: `Сколько десятков в числе ${num}?`, answer: Math.floor(num / 10), type: 'math' };
    },
    multiColumn(max) {
        const a = Math.floor(Math.random() * max) + 10;
        const b = Math.floor(Math.random() * 5) + 2;
        return { text: `${a} × ${b} = ? (столбиком)`, answer: a * b, type: 'math' };
    },
    divisionColumn(max) {
        const b = Math.floor(Math.random() * 5) + 2;
        const q = Math.floor(Math.random() * (max / b)) + 1;
        return { text: `${b * q} ÷ ${b} = ? (уголком)`, answer: q, type: 'math' };
    },
    motion(max) {
        const v = Math.floor(Math.random() * max) + 5;
        const t = Math.floor(Math.random() * 5) + 1;
        return { text: `Скорость ${v} км/ч, время ${t} ч. Расстояние?`, answer: v * t, type: 'math' };
    },
    shapes() {
        const shapes = [
            { q: 'У какой фигуры нет углов?', a: 'круг' },
            { q: 'Сколько сторон у квадрата?', a: '4' },
            { q: 'Сколько углов у треугольника?', a: '3' }
        ];
        const s = shapes[Math.floor(Math.random() * shapes.length)];
        return { text: s.q, answer: s.a, type: 'math' };
    }
};

// ==================== РУССКИЙ ЯЗЫК ====================
const RussianGenerator = {
    alphabet() {
        const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
        const idx = Math.floor(Math.random() * (letters.length - 1));
        return { text: `Какая буква после ${letters[idx]}?`, answer: letters[idx + 1], type: 'russian' };
    },
    vowels() {
        const vowels = 'АЕЁИОУЫЭЮЯ';
        const consonants = 'БВГДЖЗЙКЛМНПРСТФХЦЧШЩ';
        const v = vowels[Math.floor(Math.random() * vowels.length)];
        const c1 = consonants[Math.floor(Math.random() * consonants.length)];
        const c2 = consonants[Math.floor(Math.random() * consonants.length)];
        const options = [v, c1, c2].sort(() => Math.random() - 0.5);
        return { text: `Какая буква гласная? ${options.join(', ')}`, answer: v, type: 'russian' };
    },
    syllables() {
        const words = ['МАМА', 'ПАПА', 'КОТ', 'СОБАКА', 'ШКОЛА', 'КНИГА', 'РУЧКА', 'ТЕТРАДЬ'];
        const word = words[Math.floor(Math.random() * words.length)];
        const count = (word.match(/[АЕЁИОУЫЭЮЯ]/gi) || []).length;
        return { text: `Сколько слогов в слове ${word}?`, answer: count, type: 'russian' };
    },
    spellingRules() {
        const rules = [
            { q: 'Ж_РАФ (вставь букву)', a: 'И' },
            { q: 'Ч_ШКА (вставь букву)', a: 'А' },
            { q: 'Щ_КА (вставь букву)', a: 'У' },
            { q: 'Ч_ДО (вставь букву)', a: 'У' }
        ];
        const r = rules[Math.floor(Math.random() * rules.length)];
        return { text: r.q, answer: r.a, type: 'russian' };
    },
    partsOfSpeech() {
        const words = [
            { word: 'КРАСИВЫЙ', type: 'Прилагательное' },
            { word: 'БЕЖАТЬ', type: 'Глагол' },
            { word: 'СТОЛ', type: 'Существительное' },
            { word: 'БЫСТРО', type: 'Наречие' },
            { word: 'ОН', type: 'Местоимение' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        return { text: `Слово "${w.word}" — это...`, answer: w.type, type: 'russian' };
    },
    cases() {
        const cases = [
            { q: 'Кого? Чего?', a: 'Родительный' },
            { q: 'Кому? Чему?', a: 'Дательный' },
            { q: 'Кем? Чем?', a: 'Творительный' },
            { q: 'О ком? О чём?', a: 'Предложный' }
        ];
        const c = cases[Math.floor(Math.random() * cases.length)];
        return { text: `"${c.q}" — какой падеж?`, answer: c.a, type: 'russian' };
    },
    declensions() {
        const words = [
            { word: 'НОЧЬ', decl: '3' },
            { word: 'СТОЛ', decl: '2' },
            { word: 'ПАРТА', decl: '1' },
            { word: 'ОКНО', decl: '2' },
            { word: 'МЫШЬ', decl: '3' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        return { text: `Склонение слова "${w.word}"?`, answer: w.decl, type: 'russian' };
    },
    conjugations() {
        const verbs = [
            { verb: 'ЧИТАТЬ', conj: 'I' },
            { verb: 'СПАТЬ', conj: 'II' },
            { verb: 'РИСОВАТЬ', conj: 'I' },
            { verb: 'ЛЮБИТЬ', conj: 'II' },
            { verb: 'СМОТРЕТЬ', conj: 'II' }
        ];
        const v = verbs[Math.floor(Math.random() * verbs.length)];
        return { text: `Спряжение глагола "${v.verb}"?`, answer: v.conj, type: 'russian' };
    }
};

// ==================== АНГЛИЙСКИЙ ЯЗЫК ====================
const EnglishGenerator = {
    alphabet() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const idx = Math.floor(Math.random() * (letters.length - 1));
        return { text: `What letter comes after ${letters[idx]}?`, answer: letters[idx + 1], type: 'english' };
    },
    numbers(max) {
        const num = Math.floor(Math.random() * max) + 1;
        const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        return { text: `How do you say ${num} in English?`, answer: words[num], type: 'english' };
    },
    vocabulary(category) {
        const vocab = VOCABULARY_EN ? (VOCABULARY_EN[category] || VOCABULARY_EN.animals) : [{ en: 'CAT', ru: 'Кошка' }];
        const item = vocab[Math.floor(Math.random() * vocab.length)];
        return { text: `Translate: ${item.en}`, answer: item.ru, type: 'english' };
    },
    presentSimple() {
        const verbs = (typeof VOCABULARY_EN !== 'undefined' && VOCABULARY_EN.verbs) || [{ base: 'PLAY', third: 'PLAYS' }];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const subjects = ['I', 'You', 'He', 'She', 'We', 'They'];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const correct = (subject === 'He' || subject === 'She') ? (verb.third || verb.base + 'S') : verb.base;
        return { text: `${subject} ___ (${verb.base.toLowerCase()}) every day.`, answer: correct, type: 'english' };
    },
    plural() {
        const words = [
            { s: 'CAT', p: 'CATS' }, { s: 'DOG', p: 'DOGS' },
            { s: 'BOX', p: 'BOXES' }, { s: 'BABY', p: 'BABIES' },
            { s: 'LEAF', p: 'LEAVES' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        return { text: `Plural of "${w.s}"`, answer: w.p, type: 'english' };
    },
    presentContinuous() {
        const verbs = (typeof VOCABULARY_EN !== 'undefined' && VOCABULARY_EN.verbs) || [{ ing: 'PLAYING' }];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const pronouns = ['I', 'He', 'She', 'We', 'You', 'They'];
        const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const beForm = pronoun === 'I' ? 'am' : (['He', 'She'].includes(pronoun) ? 'is' : 'are');
        return { text: `${pronoun} ___ ${verb.ing || verb.base + 'ING'}.`, answer: beForm, type: 'english' };
    },
    comparisons() {
        const adjs = [
            { base: 'BIG', comp: 'BIGGER', sup: 'BIGGEST' },
            { base: 'SMALL', comp: 'SMALLER', sup: 'SMALLEST' },
            { base: 'HAPPY', comp: 'HAPPIER', sup: 'HAPPIEST' }
        ];
        const adj = adjs[Math.floor(Math.random() * adjs.length)];
        return { text: `${adj.base} — ___ — ${adj.sup}`, answer: adj.comp, type: 'english' };
    },
    pastSimple() {
        const verbs = (typeof VOCABULARY_EN !== 'undefined' && VOCABULARY_EN.verbs) || [{ base: 'PLAY', past: 'PLAYED' }];
        const verb = verbs.filter(v => v.past)[Math.floor(Math.random() * Math.max(1, verbs.filter(v => v.past).length))] || verbs[0];
        return { text: `Yesterday I ___ (${verb.base.toLowerCase()}).`, answer: verb.past || verb.base + 'ED', type: 'english' };
    }
};

// ==================== ОКРУЖАЮЩИЙ МИР ====================
const WorldGenerator = {
    seasons() {
        const qs = [
            { q: 'Какое время года после Зимы?', a: 'Весна' },
            { q: 'В какое время года опадают листья?', a: 'Осень' },
            { q: 'Когда тает снег?', a: 'Весна' },
            { q: 'В какое время года самый длинный день?', a: 'Лето' }
        ];
        const q = qs[Math.floor(Math.random() * qs.length)];
        return { text: q.q, answer: q.a, type: 'world' };
    },
    animals() {
        const facts = (typeof WORLD_FACTS !== 'undefined' && WORLD_FACTS.animals) || [{ name: 'Белый медведь', habitat: 'Арктика', food: 'Рыба' }];
        const a = facts[Math.floor(Math.random() * facts.length)];
        if (Math.random() > 0.5) {
            return { text: `Где живёт ${a.name}?`, answer: a.habitat, type: 'world' };
        } else {
            return { text: `Чем питается ${a.name}?`, answer: a.food, type: 'world' };
        }
    },
    solarSystem() {
        const planets = (typeof WORLD_FACTS !== 'undefined' && WORLD_FACTS.planets) || [{ name: 'Земля', order: 3 }];
        const p = planets[Math.floor(Math.random() * planets.length)];
        return { text: `Какая по счёту от Солнца планета ${p.name}?`, answer: p.order, type: 'world' };
    },
    humanBody() {
        const parts = (typeof WORLD_FACTS !== 'undefined' && WORLD_FACTS.bodyParts) || [{ part: 'Сердце', function: 'Качает кровь' }];
        const p = parts[Math.floor(Math.random() * parts.length)];
        return { text: `Какую функцию выполняет ${p.part}?`, answer: p.function, type: 'world' };
    },
    countries() {
        const cities = (typeof WORLD_FACTS !== 'undefined' && WORLD_FACTS.cities) || [{ city: 'Москва', country: 'Россия' }];
        const c = cities[Math.floor(Math.random() * cities.length)];
        return { text: `Столицей какой страны является ${c.city}?`, answer: c.country, type: 'world' };
    },
    safety() {
        const qs = [
            { q: 'На какой свет переходить дорогу?', a: 'Зелёный' },
            { q: 'Номер пожарных?', a: '101' },
            { q: 'Номер полиции?', a: '102' },
            { q: 'Номер скорой помощи?', a: '103' }
        ];
        const q = qs[Math.floor(Math.random() * qs.length)];
        return { text: q.q, answer: q.a, type: 'world' };
    },
    ecology() {
        const qs = [
            { q: 'Что нельзя бросать в лесу?', a: 'Мусор' },
            { q: 'Как называется книга редких животных?', a: 'Красная' },
            { q: 'Что дают деревья для дыхания?', a: 'Кислород' }
        ];
        const q = qs[Math.floor(Math.random() * qs.length)];
        return { text: q.q, answer: q.a, type: 'world' };
    }
};

// ==================== ЛОГИКА ====================
const LogicGenerator = {
    patterns() {
        const patterns = [
            { seq: [2, 4, 8, 16, '?'], answer: 32, rule: 'Каждое число ×2', hint: 'Умножай на 2' },
            { seq: [1, 4, 9, 16, '?'], answer: 25, rule: 'Квадраты чисел', hint: '1², 2², 3², 4²...' },
            { seq: [1, 1, 2, 3, 5, 8, '?'], answer: 13, rule: 'Фибоначчи: сумма двух предыдущих', hint: 'Сложи последние два числа' },
            { seq: [1, 3, 7, 15, '?'], answer: 31, rule: '×2+1', hint: 'Удвой и прибавь 1' },
            { seq: [3, 6, 7, 14, 15, '?'], answer: 30, rule: '+3, +1, ×2, +1, ×2', hint: 'Чередование действий' },
            { seq: [100, 90, 81, 73, '?'], answer: 66, rule: '-10, -9, -8, -7', hint: 'Вычитание уменьшается на 1' }
        ];
        const p = patterns[Math.floor(Math.random() * patterns.length)];
        const display = p.seq.join(', ');
        return { text: `Продолжи ряд: ${display}`, answer: p.answer, hint: p.hint, explanation: p.rule, type: 'logic' };
    },
    
    truthLie() {
        const puzzles = [
            {
                q: 'Петя говорит: «Я всегда вру». Врёт ли Петя в этот раз?',
                a: 'Парадокс (неразрешимо)',
                hint: 'Может ли это быть правдой? А ложью?',
                exp: 'Если правда — он всегда врёт (противоречие). Если ложь — он не всегда врёт (противоречие).'
            },
            {
                q: 'Аня, Боря и Вера. Один съел 1 пирожное, другой 2, третий 3. Аня: «Я не ела 1». Боря: «Я съел 2». Вера: «Я съела не 3». Кто сколько съел, если Аня и Вера солгали, а Боря сказал правду?',
                a: 'Аня-1, Боря-2, Вера-3',
                hint: 'Начни с того, кто точно сказал правду',
                exp: 'Боря прав → у него 2. Аня солгала («я не ела 1») → она съела 1. Вере осталось 3.'
            }
        ];
        const p = puzzles[Math.floor(Math.random() * puzzles.length)];
        return { text: p.q, answer: p.a, hint: p.hint, explanation: p.exp, type: 'logic' };
    },
    
    weighing() {
        const puzzles = [
            {
                q: 'Из 9 монет одна фальшивая (легче). За сколько взвешиваний можно её найти?',
                a: 2,
                hint: 'Дели на 3 группы по 3',
                exp: '1) 3 vs 3 → определяем группу. 2) 1 vs 1 из этой группы → находим монету.'
            },
            {
                q: 'Как отмерить 4 литра, имея 5-литровое и 3-литровое вёдра?',
                a: '4',
                hint: 'Наливай и переливай',
                exp: 'Налить 5л → перелить в 3л → осталось 2л → вылить 3л → перелить 2л → налить 5л → долить 3л → осталось 4л.'
            }
        ];
        const p = puzzles[Math.floor(Math.random() * puzzles.length)];
        return { text: p.q, answer: p.a, hint: p.hint, explanation: p.exp, type: 'logic' };
    },
    
    family() {
        const puzzles = [
            {
                q: 'Сын моего отца, но не мой брат. Кто это?',
                a: 'Я сам',
                hint: 'Кто такой «сын моего отца»?',
                exp: 'Сын отца — это либо я, либо мой брат. «Не брат» → значит я.'
            },
            {
                q: 'У двух сестёр по одному брату. Сколько детей в семье?',
                a: 3,
                hint: 'Брат у них общий!',
                exp: '2 сестры + 1 общий брат = 3 детей.'
            }
        ];
        const p = puzzles[Math.floor(Math.random() * puzzles.length)];
        return { text: p.q, answer: p.a, hint: p.hint, explanation: p.exp, type: 'logic' };
    },
    
    combinatorics() {
        const puzzles = [
            {
                q: 'Сколько рукопожатий между 5 людьми, если каждый жмёт руку каждому?',
                a: 10,
                hint: 'Первый жмёт 4, второй 3 (с первым уже), и т.д.',
                exp: '4 + 3 + 2 + 1 = 10'
            },
            {
                q: 'Сколько разных вариантов рассадить 4 гостей на 4 стула?',
                a: 24,
                hint: 'На первый стул 4 варианта, на второй 3...',
                exp: '4 × 3 × 2 × 1 = 24'
            }
        ];
        const p = puzzles[Math.floor(Math.random() * puzzles.length)];
        return { text: p.q, answer: p.a, hint: p.hint, explanation: p.exp, type: 'logic' };
    }
};

// ==================== ГЛАВНЫЙ ГЕНЕРАТОР ====================
function generateTasks(topic, count = 5) {
    const tasks = [];
    const type = topic.type;
    const max = topic.maxNum || 20;
    const subject = topic.subject || 'math';
    const category = topic.category;
    
    for (let i = 0; i < count; i++) {
        let task = null;
        
        try {
            if (subject === 'math') {
                const g = MathGenerator;
                switch (type) {
                    case 'addition': task = g.addition(max); break;
                    case 'subtraction': task = g.subtraction(max); break;
                    case 'multiplication': task = g.multiplication(max); break;
                    case 'division': task = g.division(max); break;
                    case 'compare': task = g.compare(max); break;
                    case 'divisionRemainder': task = g.divisionRemainder(max); break;
                    case 'perimeterArea': task = g.perimeterArea(max); break;
                    case 'fractions': task = g.fractions(max); break;
                    case 'percent': task = g.percent(max); break;
                    case 'equation': task = g.equation(max); break;
                    case 'placeValue': task = g.placeValue(max); break;
                    case 'multiColumn': task = g.multiColumn(max); break;
                    case 'divisionColumn': task = g.divisionColumn(max); break;
                    case 'motion': task = g.motion(max); break;
                    case 'shapes': task = g.shapes(); break;
                    default: task = g.addition(max);
                }
            } else if (subject === 'russian') {
                const g = RussianGenerator;
                switch (type) {
                    case 'alphabet': task = g.alphabet(); break;
                    case 'vowels': task = g.vowels(); break;
                    case 'syllables': task = g.syllables(); break;
                    case 'spellingRules': task = g.spellingRules(); break;
                    case 'partsOfSpeech': task = g.partsOfSpeech(); break;
                    case 'cases': task = g.cases(); break;
                    case 'declensions': task = g.declensions(); break;
                    case 'conjugations': task = g.conjugations(); break;
                    default: task = g.alphabet();
                }
            } else if (subject === 'english') {
                const g = EnglishGenerator;
                switch (type) {
                    case 'alphabet': task = g.alphabet(); break;
                    case 'numbers': task = g.numbers(max); break;
                    case 'vocabulary': task = g.vocabulary(category); break;
                    case 'presentSimple': task = g.presentSimple(); break;
                    case 'plural': task = g.plural(); break;
                    case 'presentContinuous': task = g.presentContinuous(); break;
                    case 'comparisons': task = g.comparisons(); break;
                    case 'pastSimple': task = g.pastSimple(); break;
                    default: task = g.vocabulary('animals');
                }
            } else if (subject === 'world') {
                const g = WorldGenerator;
                switch (type) {
                    case 'seasons': task = g.seasons(); break;
                    case 'animals': task = g.animals(); break;
                    case 'solarSystem': task = g.solarSystem(); break;
                    case 'humanBody': task = g.humanBody(); break;
                    case 'countries': task = g.countries(); break;
                    case 'safety': task = g.safety(); break;
                    case 'ecology': task = g.ecology(); break;
                    default: task = g.seasons();
                }
            } else if (subject === 'logic') {
                const g = LogicGenerator;
                switch (type) {
                    case 'patterns': task = g.patterns(); break;
                    case 'truthLie': task = g.truthLie(); break;
                    case 'weighing': task = g.weighing(); break;
                    case 'family': task = g.family(); break;
                    case 'combinatorics': task = g.combinatorics(); break;
                    default: task = g.patterns();
                }
            }
        } catch (e) {
            task = { text: '2 + 2 = ?', answer: 4, type: 'math' };
        }
        
        if (task) {
            task.subject = subject;
            tasks.push(task);
        } else {
            tasks.push({ text: '2 + 2 = ?', answer: 4, type: 'math', subject: 'math' });
        }
    }
    
    return tasks;
}