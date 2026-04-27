// ==================== ХРАНИЛИЩЕ (STORAGE) ====================
const DB_NAME = 'AcademyRobotTeacher';
const DB_VERSION = 1;
let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains('childState')) {
                database.createObjectStore('childState', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('diplomas')) {
                database.createObjectStore('diplomas', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('photos')) {
                database.createObjectStore('photos', { keyPath: 'id' });
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

async function saveToIDB(storeName, data) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(data);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function loadFromIDB(storeName, id) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result ? request.result.data || request.result : null);
        request.onerror = () => reject(request.error);
    });
}

async function loadAllFromIDB(storeName) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const tx = database.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Хранение состояния игры для ребёнка
async function saveState(childId, stateData) {
    return saveToIDB('childState', { id: childId, data: stateData, timestamp: Date.now() });
}

async function loadState(childId) {
    return loadFromIDB('childState', childId);
}

// Хранение дипломов (для IndexedDB)
async function saveDiploma(diplomaData) {
    return saveToIDB('diplomas', diplomaData);
}

async function loadAllDiplomas() {
    return loadAllFromIDB('diplomas');
}

// Хранение фото (для IndexedDB)
async function savePhoto(photoData) {
    return saveToIDB('photos', photoData);
}

async function loadAllPhotos() {
    return loadAllFromIDB('photos');
}

// Профили детей (маленькие данные — оставляем в localStorage)
function loadProfiles() {
    const saved = localStorage.getItem('academy_profiles');
    return saved ? JSON.parse(saved) : [];
}

function saveProfiles(profiles) {
    localStorage.setItem('academy_profiles', JSON.stringify(profiles));
}

function addProfile(name, password) {
    const profiles = loadProfiles();
    const newProfile = {
        id: 'child_' + Date.now(),
        name: name,
        password: password || '',
        avatar: '🧑‍🎓',
        photo: null,
        createdAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    saveProfiles(profiles);
    return newProfile;
}

function loadMasterPassword() {
    return localStorage.getItem('academy_master_password') || '0000';
}

function saveMasterPassword(password) {
    localStorage.setItem('academy_master_password', password);
}
