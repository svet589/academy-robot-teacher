// ==================== ГЕНЕРАТОР ЗАДАНИЙ ====================

function generateTask(world, section, maxNum) {
    if (world === '+') {
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * (maxNum - a)) + 1;
        return { text: `${a} + ${b}`, answer: a + b };
    }
    if (world === '-') {
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * a) + 1;
        return { text: `${a} - ${b}`, answer: a - b };
    }
    if (world === '*') {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        if (a * b <= maxNum) return { text: `${a} × ${b}`, answer: a * b };
        return generateTask(world, section, maxNum);
    }
    if (world === '/') {
        const b = Math.floor(Math.random() * 10) + 2;
        const q = Math.floor(Math.random() * 10) + 1;
        const a = b * q;
        if (a <= maxNum) return { text: `${a} ÷ ${b}`, answer: q };
        return generateTask(world, section, maxNum);
    }
    if (world === 'compare') {
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * maxNum) + 1;
        let ans = a < b ? '<' : (a > b ? '>' : '=');
        return { text: `${a} ? ${b}`, answer: ans };
    }
    if (section === 'chain') {
        const a = Math.floor(Math.random() * (maxNum / 3)) + 1;
        const b = Math.floor(Math.random() * (maxNum / 3)) + 1;
        const c = Math.floor(Math.random() * (maxNum / 3)) + 1;
        return { text: `${a} + ${b} + ${c} = ?`, answer: a + b + c };
    }
    if (section === 'neighbors') {
        const a = Math.floor(Math.random() * (maxNum - 1)) + 2;
        return { text: `Какое число перед ${a}?`, answer: a - 1 };
    }
    if (section === 'truefalse') {
        const a = Math.floor(Math.random() * maxNum) + 1;
        const b = Math.floor(Math.random() * maxNum) + 1;
        const sum = a + b;
        const correct = Math.random() > 0.3;
        const wrongSum = sum + Math.floor(Math.random() * 5) + 1;
        return { text: `${a} + ${b} = ${correct ? sum : wrongSum}? (да/нет)`, answer: correct ? "да" : "нет" };
    }
    // Стандартное сложение
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    return { text: `${a} + ${b}`, answer: a + b };
}

// ==================== ЗАПУСК УРОКА ====================
function startLesson() {
    currentStep = 1;
    currentLives = 3;
    currentScore = 0;
    errorCount = 0;
    hintShown = false;
    totalSteps = 5;
    document.getElementById('stepTotal').textContent = totalSteps;
    document.getElementById('difficultyModal').classList.add('active');
}

window.setDifficulty = function(diff) {
    currentDifficulty = diff;
    document.getElementById('difficultyModal').classList.remove('active');
    nextTask();
};

function nextTask() {
    if (currentStep > totalSteps) {
        finishRound();
        return;
    }
    currentTask = generateTask(currentWorld, currentSection, currentDifficulty);
    document.getElementById('taskText').textContent = currentTask.text;
    document.getElementById('stepCur').textContent = currentStep;
    let hearts = '';
    for (let i = 0; i < currentLives; i++) hearts += '❤️';
    for (let i = currentLives; i < 3; i++) hearts += '🩶';
    document.getElementById('livesDisplay').innerHTML = hearts;
    document.getElementById('answerInput').value = '';
    document.getElementById('hintArea').style.display = 'none';
    document.getElementById('bossIndicator').style.display = 'none';
}

function showHint() {
    if (!currentTask) return;
    const hint = typeof currentTask.answer === 'number' 
        ? "💡 Подсказка: посчитай внимательно. Ответ — число."
        : "💡 Подсказка: выбери знак сравнения или напиши да/нет.";
    document.getElementById('hintArea').innerHTML = hint;
    document.getElementById('hintArea').style.display = 'block';
}

function finishRound() {
    if (currentScore === totalSteps) {
        let reward = 5;
        if (data.pet && data.pet.type === 'koala') reward *= 2;
        if (data.pet && data.pet.type === 'dog') reward *= 2;
        if (data.boosters.luck) reward = Math.floor(reward * 1.1);
        data.coins += reward;
        data.coins_earned_total += reward;
        data.perfect_rounds++;
        showNotification(`🎉 Идеальный раунд! +${reward}🪙`, true);
        playSound('coin');
        showConfetti('star');
    }
    checkAllAchievements();
    saveData();
    updateStatsUI();
    showScreen('mainMenu');
}
