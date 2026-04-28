// ==================== МОДУЛЬ ПИТОМЦА ====================

// ==================== ОТОБРАЖЕНИЕ ПИТОМЦА ====================
function renderPetScreen() {
    const d = document.getElementById('petDisplay');
    if (!d) return;
    if (!data.pet) {
        d.innerHTML = `<div class="pet-card"><p>😢 Нет питомца. Купи в магазине!</p></div>`;
        return;
    }
    const emoji = { dog: '🐕', cat: '🐈', hamster: '🐹', fox: '🦊', penguin: '🐧', koala: '🐨' }[data.pet.type] || '🐾';
    const abilityDesc = petsList.find(p => p.type === data.pet.type)?.abilityDesc || '';
    d.innerHTML = `
        <div class="pet-card">
            <div style="font-size:5rem;">${emoji}</div>
            <h3>${data.pet.name}</h3>
            <div>Уровень: ${data.pet.level || 1}</div>
            <div>🍖 Кормёжек: ${data.pet.feedCount || 0}</div>
            <div>🤗 Поглаживаний: ${data.pet.petCount || 0}</div>
            <div style="background:#fff0b5; border-radius:20px; padding:10px; margin-top:10px;">✨ Способность: ${abilityDesc}</div>
            <div style="margin-top:15px;">
                <button id="feedPetBtn">🍖 Кормить (5🪙)</button>
                <button id="petPetBtn">🤗 Гладить</button>
                <button id="renamePetBtn">✏️ Переименовать</button>
            </div>
        </div>
    `;
    document.getElementById('feedPetBtn')?.addEventListener('click', () => {
        if (data.coins >= 5) {
            data.coins -= 5;
            data.pet.feedCount = (data.pet.feedCount || 0) + 1;
            data.pet.level = Math.floor(data.pet.feedCount / 3) + 1;
            saveData();
            updateStatsUI();
            renderPetScreen();
            showNotification("🍖 Питомец сыт!", true);
            playSound('coin');
            checkAllAchievements();
        } else {
            showNotification('Не хватает монет!', false);
        }
    });
    document.getElementById('petPetBtn')?.addEventListener('click', () => {
        data.pet.petCount = (data.pet.petCount || 0) + 1;
        saveData();
        showNotification("🤗 Питомец рад!", true);
        playSound('move');
        renderPetScreen();
    });
    document.getElementById('renamePetBtn')?.addEventListener('click', () => {
        document.getElementById('petNameInput').value = data.pet.name || '';
        document.getElementById('petNameModal').classList.add('active');
    });
}
