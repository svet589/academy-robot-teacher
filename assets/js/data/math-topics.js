const MATH_TOPICS = {
    classes: [
        {
            id: 'grade1', name: '📘 1 класс', topics: [
                { id: 'm1_1', name: 'Числа от 1 до 10', type: 'addition', maxNum: 10, story: 'Считаем до 10!', rule: 'Сложение — объединение чисел' },
                { id: 'm1_2', name: 'Числа от 11 до 20', type: 'addition', maxNum: 20, story: 'Двузначные числа!', rule: '15 = 1 десяток + 5 единиц' },
                { id: 'm1_3', name: 'Сложение до 20', type: 'addition', maxNum: 20, story: 'Складываем!', rule: 'Единицы с единицами' },
                { id: 'm1_4', name: 'Вычитание до 20', type: 'subtraction', maxNum: 20, story: 'Вычитаем!', rule: 'Обратно сложению' },
                { id: 'm1_5', name: 'Сравнение чисел', type: 'compare', maxNum: 20, story: 'Сравниваем!', rule: '> < =' },
                { id: 'm1_6', name: 'Геометрические фигуры', type: 'shapes', story: 'Фигуры вокруг!', rule: 'Круг, квадрат, треугольник' }
            ]
        },
        {
            id: 'grade2', name: '📗 2 класс', topics: [
                { id: 'm2_1', name: 'Сложение до 100', type: 'addition', maxNum: 100, story: 'Двузначные!', rule: '34 + 25 = 59' },
                { id: 'm2_2', name: 'Вычитание до 100', type: 'subtraction', maxNum: 100, story: 'Вычитаем!', rule: '58 - 23 = 35' },
                { id: 'm2_3', name: 'Таблица ×2 ×3', type: 'multiplication', maxNum: 3, story: 'Умножение!', rule: '2×3 = 2+2+2 = 6' },
                { id: 'm2_4', name: 'Уравнения', type: 'equation', maxNum: 50, story: 'Найди X!', rule: 'x + 5 = 12 → x = 7' },
                { id: 'm2_5', name: 'Периметр', type: 'perimeterArea', maxNum: 20, story: 'Измеряем!', rule: 'Сумма сторон' }
            ]
        },
        {
            id: 'grade3', name: '📙 3 класс', topics: [
                { id: 'm3_1', name: 'Числа до 1000', type: 'placeValue', maxNum: 1000, story: 'Трёхзначные!', rule: 'Сотни, десятки, единицы' },
                { id: 'm3_2', name: 'Таблица × до 9', type: 'multiplication', maxNum: 9, story: 'Вся таблица!', rule: '6×7=42, 8×9=72' },
                { id: 'm3_3', name: 'Внетабличное ×', type: 'multiColumn', maxNum: 100, story: '23×4 = 92', rule: 'По разрядам' },
                { id: 'm3_4', name: 'Деление с остатком', type: 'divisionRemainder', maxNum: 50, story: 'Делим!', rule: '17÷5 = 3 (ост.2)' },
                { id: 'm3_5', name: 'Доли', type: 'fractions', maxNum: 10, story: 'Части!', rule: '1/2 — половина' },
                { id: 'm3_6', name: 'Площадь', type: 'perimeterArea', maxNum: 20, story: 'Измеряем!', rule: 'S = a × b' }
            ]
        },
        {
            id: 'grade4', name: '📕 4 класс', topics: [
                { id: 'm4_1', name: 'Числа > 1000', type: 'placeValue', maxNum: 1000000, story: 'Большие числа!', rule: 'Классы и разряды' },
                { id: 'm4_2', name: '× столбиком', type: 'multiColumn', maxNum: 1000, story: 'Умножаем!', rule: 'Поразрядно' },
                { id: 'm4_3', name: '÷ уголком', type: 'divisionColumn', maxNum: 1000, story: 'Делим!', rule: 'По цифрам' },
                { id: 'm4_4', name: 'Задачи на движение', type: 'motion', maxNum: 100, story: 'Скорость!', rule: 'S = v × t' },
                { id: 'm4_5', name: 'Дроби', type: 'fractions', maxNum: 20, story: 'Сравнение!', rule: '1/2 + 1/4 = 3/4' },
                { id: 'm4_6', name: 'Проценты', type: 'percent', maxNum: 1000, story: 'Сотые части!', rule: '1% = 1/100' }
            ]
        }
    ]
};
