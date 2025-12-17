// Versión standalone para APK Android - sin dependencia de servidor Flask
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    selectedCardIndex: null,
    selectedTheme: null,
    themes: [],
    customThemes: JSON.parse(localStorage.getItem('customThemes') || '[]'),
    tempThemeWords: [],
    impostorCount: 1,
    impostors: [],
    secretWord: null,
    revealedPlayers: []
};

// Temáticas predefinidas
const THEMES = {
    "Animales": ["Perro", "Gato", "Elefante", "León", "Tigre", "Jirafa", "Cebra", "Mono", "Oso", "Lobo", "Zorro", "Conejo", "Ardilla", "Caballo", "Vaca", "Cerdo", "Oveja", "Gallina", "Pato", "Águila"],
    "Países": ["España", "Francia", "Italia", "Alemania", "Inglaterra", "Portugal", "Grecia", "Suiza", "Holanda", "Bélgica", "Austria", "Noruega", "Suecia", "Dinamarca", "Finlandia", "Polonia", "Rusia", "Turquía", "Japón", "China"],
    "Profesiones": ["Médico", "Enfermero", "Profesor", "Ingeniero", "Arquitecto", "Abogado", "Policía", "Bombero", "Chef", "Camarero", "Electricista", "Fontanero", "Carpintero", "Pintor", "Mecánico", "Piloto", "Azafata", "Taxista", "Conductor", "Agricultor"],
    "Deportes": ["Fútbol", "Baloncesto", "Tenis", "Voleibol", "Natación", "Atletismo", "Ciclismo", "Boxeo", "Karate", "Judo", "Esquí", "Snowboard", "Surf", "Golf", "Rugby", "Hockey", "Béisbol", "Pádel", "Escalada", "Gimnasia"],
    "Comidas": ["Pizza", "Hamburguesa", "Pasta", "Arroz", "Ensalada", "Sopa", "Sandwich", "Taco", "Burrito", "Sushi", "Paella", "Tortilla", "Empanada", "Croqueta", "Jamón", "Queso", "Pan", "Tarta", "Helado", "Chocolate"],
    "Películas": ["Titanic", "Avatar", "Matrix", "Inception", "Gladiador", "Forrest Gump", "Pulp Fiction", "Star Wars", "El Padrino", "Jurassic Park", "Harry Potter", "Señor de los Anillos", "Piratas del Caribe", "Avengers", "Spider-Man", "Batman", "Superman", "Iron Man", "Thor", "Joker"],
    "Colores": ["Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado", "Rosa", "Marrón", "Negro", "Blanco", "Gris", "Turquesa", "Violeta", "Índigo", "Cian", "Magenta", "Dorado", "Plateado", "Beige", "Coral"],
    "Instrumentos": ["Guitarra", "Piano", "Batería", "Violín", "Flauta", "Saxofón", "Trompeta", "Trombón", "Clarinete", "Oboe", "Arpa", "Bajo", "Ukelele", "Banjo", "Acordeón", "Armónica", "Xilófono", "Maracas", "Tambor", "Pandereta"],
    "Ropa": ["Camisa", "Pantalón", "Vestido", "Falda", "Jersey", "Chaqueta", "Abrigo", "Zapatos", "Botas", "Zapatillas", "Calcetines", "Bufanda", "Gorro", "Guantes", "Cinturón", "Corbata", "Pañuelo", "Gafas", "Reloj", "Bolso"],
    "Tecnología": ["Ordenador", "Móvil", "Tablet", "Televisión", "Radio", "Cámara", "Impresora", "Escáner", "Ratón", "Teclado", "Monitor", "Altavoz", "Auriculares", "Micrófono", "Router", "USB", "Disco Duro", "Procesador", "Memoria RAM", "Placa Base"],
    "League of Legends": ["Yasuo", "Zed", "Ahri", "Lux", "Jinx", "Ezreal", "Lee Sin", "Thresh", "Vayne", "Riven", "Katarina", "Darius", "Garen", "Teemo", "Master Yi", "Blitzcrank", "Jhin", "Draven", "Lucian", "Caitlyn"],
    "Clash Royale": ["Caballero", "Arqueras", "Gigante", "PEKKA", "Globo", "Minero", "Mago", "Dragón Infernal", "Bruja", "Golem", "Sabueso de Lava", "Montapuercos", "Príncipe", "Príncipe Oscuro", "Megacaballero", "Bandida", "Leñador", "Verdugo", "Bárbaro de Elite", "Pandilla de Duendes"]
};

// Elementos del DOM - se inicializarán después de que el DOM esté listo
let themeScreen, setupScreen, revealScreen, roleScreen, finalScreen, createThemeScreen;
let themeGrid, selectedThemeDisplay, playerNameInput, addPlayerBtn, deletePlayerBtn;
let startGameBtn, backToThemesBtn, playerDeck;
let currentPlayerName, revealBtn, progressCount;
let roleCard, rolePlayerName, cardFront, nextPlayerBtn;
let newGameBtn;
let playAgainBtn, randomThemeBtn;
let createThemeBtn, themeNameInput, themeWordsInput, addWordBtn, saveThemeBtn, cancelThemeBtn, wordsList, wordCount;

// Inicialización - esperar a que Cordova esté listo
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('DOMContentLoaded', onDOMReady, false);

let deviceReadyFired = false;
let domReadyFired = false;

function onDeviceReady() {
    console.log('Cordova device ready');
    deviceReadyFired = true;
    initializeApp();
}

function onDOMReady() {
    console.log('DOM ready');
    domReadyFired = true;
    initializeApp();
}

function initializeApp() {
    if (deviceReadyFired || domReadyFired) {
        console.log('App inicializada - Versión Standalone');
        
        // Inicializar elementos del DOM
        themeScreen = document.getElementById('theme-screen');
        setupScreen = document.getElementById('setup-screen');
        revealScreen = document.getElementById('reveal-screen');
        roleScreen = document.getElementById('role-screen');
        finalScreen = document.getElementById('final-screen');
        impostorScreen = document.getElementById('impostor-screen');
        createThemeScreen = document.getElementById('create-theme-screen');
        
        themeGrid = document.getElementById('theme-grid');
        selectedThemeDisplay = document.getElementById('selected-theme-display');
        playerNameInput = document.getElementById('player-name');
        addPlayerBtn = document.getElementById('add-player-btn');
        deletePlayerBtn = document.getElementById('delete-player-btn');
        startGameBtn = document.getElementById('start-game-btn');
        backToThemesBtn = document.getElementById('back-to-themes-btn');
        playerDeck = document.getElementById('player-deck');
        
        currentPlayerName = document.getElementById('current-player-name');
        revealBtn = document.getElementById('reveal-card');
        progressCount = document.getElementById('progress-count');
        
        roleCard = document.getElementById('role-card');
        rolePlayerName = document.getElementById('role-player-name');
        cardFront = document.getElementById('card-front');
        nextPlayerBtn = document.getElementById('next-player-btn');
        
        newGameBtn = document.getElementById('new-game-btn');
        playAgainBtn = document.getElementById('play-again-btn');
        randomThemeBtn = document.getElementById('random-theme-btn');
        
        // Elementos de crear temática
        createThemeBtn = document.getElementById('create-theme-btn');
        themeNameInput = document.getElementById('theme-name-input');
        themeWordsInput = document.getElementById('theme-words-input');
        addWordBtn = document.getElementById('add-word-btn');
        saveThemeBtn = document.getElementById('save-theme-btn');
        cancelThemeBtn = document.getElementById('cancel-theme-btn');
        wordsList = document.getElementById('words-list');
        wordCount = document.getElementById('word-count');
        
        loadThemes();
        setupEventListeners();
        updateCustomThemesDropdown();
    }
}

function setupEventListeners() {
    randomThemeBtn?.addEventListener('click', selectRandomTheme);
    backToThemesBtn?.addEventListener('click', () => switchScreen(themeScreen));
    addPlayerBtn?.addEventListener('click', addPlayer);
    deletePlayerBtn?.addEventListener('click', deleteLastPlayer);
    startGameBtn?.addEventListener('click', startGame);
    revealBtn?.addEventListener('click', revealRole);
    nextPlayerBtn?.addEventListener('click', nextPlayer);
    newGameBtn?.addEventListener('click', resetGame);
    playAgainBtn?.addEventListener('click', resetGame);
    
    // Botones de cantidad de impostores
    document.getElementById('decrease-impostor-btn')?.addEventListener('click', decreaseImpostorCount);
    document.getElementById('increase-impostor-btn')?.addEventListener('click', increaseImpostorCount);
    
    playerNameInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    
    // Eventos de crear temática
    createThemeBtn?.addEventListener('click', openCreateTheme);
    cancelThemeBtn?.addEventListener('click', cancelCreateTheme);
    saveThemeBtn?.addEventListener('click', saveCustomTheme);
    addWordBtn?.addEventListener('click', addWordToTheme);
    themeWordsInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addWordToTheme();
        }
    });
    
    // Dropdown de temáticas personalizadas
    const dropdownHeader = document.getElementById('dropdown-header');
    dropdownHeader?.addEventListener('click', toggleCustomThemesDropdown);
}

function loadThemes() {
    gameState.themes = Object.keys(THEMES).map(name => ({
        name: name,
        words: THEMES[name]
    }));
    
    gameState.customThemes.forEach(theme => {
        gameState.themes.push(theme);
    });
    
    themeGrid.innerHTML = '';
    
    gameState.themes.forEach(theme => {
        const card = document.createElement('div');
        card.className = 'theme-card';
        card.innerHTML = `<div class="theme-card-name">${theme.name}</div>`;
        card.addEventListener('click', () => selectTheme(theme));
        themeGrid.appendChild(card);
    });
    
    // Animación simple y rápida
    setTimeout(() => animateCardDeck(), 100);
}

function animateCardDeck() {
    const deckWrapper = document.getElementById('card-deck-animation');
    const instruction = document.getElementById('theme-instruction');
    const themeButtons = document.querySelector('.theme-buttons');
    const customDropdown = document.getElementById('custom-themes-dropdown');
    const grid = document.getElementById('theme-grid');
    
    // Ocultar mazo rápidamente
    if (deckWrapper) deckWrapper.style.display = 'none';
    
    // Mostrar todo inmediatamente para mejor rendimiento
    if (grid) grid.style.opacity = '1';
    if (instruction) {
        instruction.style.opacity = '1';
        instruction.style.transform = 'translateY(0)';
    }
    if (themeButtons) {
        themeButtons.style.opacity = '1';
        themeButtons.style.pointerEvents = 'auto';
    }
    if (customDropdown) {
        customDropdown.style.opacity = '1';
        customDropdown.style.pointerEvents = 'auto';
    }
    
    // Mostrar cartas con animación simple
    const cards = document.querySelectorAll('.theme-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 30);
    });
}



function selectTheme(theme) {
    gameState.selectedTheme = theme;
    selectedThemeDisplay.textContent = `Temática: ${theme.name}`;
    switchScreen(setupScreen);
}

function selectRandomTheme() {
    if (gameState.themes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * gameState.themes.length);
    selectTheme(gameState.themes[randomIndex]);
}

function addPlayer() {
    const name = playerNameInput.value.trim();
    if (!name) return;
    
    gameState.players.push({ name });
    playerNameInput.value = '';
    renderPlayerDeck();
    updateStartButton();
}

function deleteLastPlayer() {
    if (gameState.players.length > 0) {
        gameState.players.pop();
        renderPlayerDeck();
        updateStartButton();
    }
}

function renderPlayerDeck() {
    playerDeck.innerHTML = '';
    gameState.players.forEach((player) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="mini-card">
                <div class="player-name">${player.name}</div>
            </div>
        `;
        playerDeck.appendChild(card);
    });
}

function updateStartButton() {
    const minPlayers = 3;
    startGameBtn.disabled = gameState.players.length < minPlayers;
    
    if (gameState.players.length < minPlayers) {
        startGameBtn.textContent = `Agregar más jugadores (${gameState.players.length}/${minPlayers})`;
    } else {
        startGameBtn.textContent = `Iniciar Juego (${gameState.players.length} jugadores)`;
    }
    
    // Actualizar límites de impostores cuando cambia cantidad de jugadores
    updateImpostorLimits();
}

function decreaseImpostorCount() {
    const display = document.getElementById('impostor-count-display');
    let current = parseInt(display?.textContent || 1);
    if (current > 1) {
        current--;
        display.textContent = current;
        gameState.impostorCount = current;
    }
}

function increaseImpostorCount() {
    const display = document.getElementById('impostor-count-display');
    let current = parseInt(display?.textContent || 1);
    const maxImpostors = Math.max(1, gameState.players.length - 2);
    
    if (current < maxImpostors) {
        current++;
        display.textContent = current;
        gameState.impostorCount = current;
    }
}

function updateImpostorLimits() {
    const display = document.getElementById('impostor-count-display');
    const current = parseInt(display?.textContent || 1);
    const maxImpostors = Math.max(1, gameState.players.length - 2);
    
    // Si el valor actual excede el máximo, ajustarlo
    if (current > maxImpostors) {
        display.textContent = maxImpostors;
        gameState.impostorCount = maxImpostors;
    }
}

function startGame() {
    if (gameState.players.length < 3) {
        alert('Se necesitan al menos 3 jugadores');
        return;
    }
    
    if (!gameState.selectedTheme) {
        alert('Selecciona una temática primero');
        return;
    }
    
    // Obtener la cantidad de impostores del display
    const impostorCountDisplay = document.getElementById('impostor-count-display');
    gameState.impostorCount = parseInt(impostorCountDisplay?.textContent || 1);
    
    const playerIndices = Array.from({ length: gameState.players.length }, (_, i) => i);
    gameState.impostors = [];
    
    for (let i = 0; i < gameState.impostorCount; i++) {
        const randomIndex = Math.floor(Math.random() * playerIndices.length);
        gameState.impostors.push(playerIndices[randomIndex]);
        playerIndices.splice(randomIndex, 1);
    }
    
    const words = gameState.selectedTheme.words;
    gameState.secretWord = words[Math.floor(Math.random() * words.length)];
    
    gameState.currentPlayerIndex = 0;
    gameState.revealedPlayers = [];
    
    switchScreen(revealScreen);
    updateRevealScreen();
}

function updateRevealScreen() {
    const player = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayerName) {
        currentPlayerName.textContent = player.name;
    }
    if (progressCount) {
        progressCount.textContent = `Jugador ${gameState.currentPlayerIndex + 1} de ${gameState.players.length}`;
    }
}

function revealRole() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const isImpostor = gameState.impostors.includes(gameState.currentPlayerIndex);
    
    if (rolePlayerName) {
        rolePlayerName.textContent = player.name;
    }
    
    if (cardFront) {
        if (isImpostor) {
            cardFront.innerHTML = `
                <div class="role-title impostor">IMPOSTOR</div>
                <div class="role-subtitle">Averigua cuál es la palabra secreta</div>
            `;
            cardFront.classList.add('impostor');
        } else {
            cardFront.innerHTML = `
                <div class="role-title">JUGADOR</div>
                <div class="role-word">${gameState.secretWord}</div>
            `;
            cardFront.classList.remove('impostor');
        }
    }
    
    switchScreen(roleScreen);
    
    if (roleCard) {
        roleCard.classList.remove('flipped');
        setTimeout(() => {
            roleCard.classList.add('flipped');
        }, 100);
    }
}

function nextPlayer() {
    gameState.revealedPlayers.push(gameState.currentPlayerIndex);
    gameState.currentPlayerIndex++;
    
    if (gameState.currentPlayerIndex < gameState.players.length) {
        switchScreen(revealScreen);
        updateRevealScreen();
    } else {
        // Mostrar resultado final directamente
        showGameResults();
    }
}

function showGameResults() {
    // Simplemente mostrar la pantalla final sin popup
    switchScreen(finalScreen);
}

function resetGame() {
    // NO borrar los jugadores para mantenerlos entre partidas
    gameState.currentPlayerIndex = 0;
    gameState.selectedTheme = null;
    gameState.impostors = [];
    gameState.secretWord = null;
    gameState.revealedPlayers = [];
    
    // Mantener los jugadores pero re-renderizar
    renderPlayerDeck();
    updateStartButton();
    switchScreen(themeScreen);
    loadThemes();
}

function switchScreen(targetScreen) {
    if (!targetScreen) {
        console.error('switchScreen: targetScreen es null/undefined');
        return;
    }
    
    // Remover active de todas las pantallas
    [themeScreen, setupScreen, revealScreen, roleScreen, finalScreen, createThemeScreen].forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    
    // Agregar active a la pantalla objetivo
    targetScreen.classList.add('active');
}

// ==================== FUNCIONES DE CREAR TEMÁTICA ====================

function openCreateTheme() {
    gameState.tempThemeWords = [];
    if (themeNameInput) themeNameInput.value = '';
    if (themeWordsInput) themeWordsInput.value = '';
    if (wordsList) wordsList.innerHTML = '';
    if (wordCount) wordCount.textContent = '0';
    switchScreen(createThemeScreen);
}

function cancelCreateTheme() {
    gameState.tempThemeWords = [];
    switchScreen(themeScreen);
}

function addWordToTheme() {
    const word = themeWordsInput?.value.trim();
    if (!word) return;
    
    if (gameState.tempThemeWords.includes(word)) {
        showNotification('Esta palabra ya fue agregada', 'warning');
        return;
    }
    
    gameState.tempThemeWords.push(word);
    themeWordsInput.value = '';
    
    const wordTag = document.createElement('div');
    wordTag.className = 'word-tag';
    wordTag.innerHTML = `
        <span>${word}</span>
        <button class="remove-word-btn" onclick="removeWord('${word}')">&times;</button>
    `;
    wordsList.appendChild(wordTag);
    
    wordCount.textContent = gameState.tempThemeWords.length;
    themeWordsInput.focus();
}

function removeWord(word) {
    const index = gameState.tempThemeWords.indexOf(word);
    if (index > -1) {
        gameState.tempThemeWords.splice(index, 1);
    }
    
    const wordTags = wordsList.querySelectorAll('.word-tag');
    wordTags.forEach(tag => {
        if (tag.textContent.includes(word)) {
            tag.remove();
        }
    });
    
    wordCount.textContent = gameState.tempThemeWords.length;
}

function saveCustomTheme() {
    const themeName = themeNameInput?.value.trim();
    
    if (!themeName) {
        showNotification('Debes ingresar un nombre para la temática', 'error');
        return;
    }
    
    if (gameState.tempThemeWords.length < 10) {
        showNotification('Debes agregar al menos 10 palabras', 'error');
        return;
    }
    
    const newTheme = {
        name: themeName,
        words: [...gameState.tempThemeWords]
    };
    
    gameState.customThemes.push(newTheme);
    localStorage.setItem('customThemes', JSON.stringify(gameState.customThemes));
    
    showNotification('Temática guardada correctamente', 'success');
    
    gameState.tempThemeWords = [];
    loadThemes();
    updateCustomThemesDropdown();
    switchScreen(themeScreen);
}

function updateCustomThemesDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    if (!dropdownContent) return;
    
    if (gameState.customThemes.length === 0) {
        dropdownContent.innerHTML = '<p style="padding: 20px; color: #707080; text-align: center; font-size: 14px;">No hay ninguna temática creada</p>';
    } else {
        dropdownContent.innerHTML = '';
        gameState.customThemes.forEach((theme, index) => {
            const themeItem = document.createElement('div');
            themeItem.className = 'custom-theme-item';
            themeItem.innerHTML = `
                <div class="custom-theme-name">${theme.name}</div>
                <div class="custom-theme-actions">
                    <button class="btn-icon" onclick="selectCustomTheme(${index})">▶</button>
                    <button class="btn-icon btn-delete" onclick="deleteCustomTheme(${index})">🗑️</button>
                </div>
            `;
            dropdownContent.appendChild(themeItem);
        });
    }
}

function toggleCustomThemesDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    const dropdownHeader = document.getElementById('dropdown-header');
    const arrow = dropdownHeader?.querySelector('.dropdown-arrow');
    
    if (dropdownContent.style.maxHeight) {
        dropdownContent.style.maxHeight = null;
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
}

function selectCustomTheme(index) {
    const theme = gameState.customThemes[index];
    selectTheme(theme);
}

function deleteCustomTheme(index) {
    if (confirm('¿Estás seguro de eliminar esta temática?')) {
        gameState.customThemes.splice(index, 1);
        localStorage.setItem('customThemes', JSON.stringify(gameState.customThemes));
        updateCustomThemesDropdown();
        loadThemes();
        showNotification('Temática eliminada', 'success');
    }
}

// ==================== SISTEMA DE NOTIFICACIONES ====================

function showNotification(message, type = 'info') {
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Agregar estilos inline si no están en el CSS
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff4757' : type === 'warning' ? '#ffa502' : '#2ed573'};
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

console.log('Script standalone cargado');
