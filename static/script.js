// Estado de la aplicación
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    selectedCardIndex: null,
    selectedTheme: null,
    themes: [],
    customThemes: JSON.parse(localStorage.getItem('customThemes') || '[]'),
    tempThemeWords: [],
    playerPhotos: {},
    cameraEnabled: false,
    cameraStream: null,
    pendingPlayerName: null,
    capturedPhoto: null,
    impostorCount: 1
};

// Elementos del DOM
const themeScreen = document.getElementById('theme-screen');
const setupScreen = document.getElementById('setup-screen');
const revealScreen = document.getElementById('reveal-screen');
const roleScreen = document.getElementById('role-screen');
const finalScreen = document.getElementById('final-screen');
const impostorScreen = document.getElementById('impostor-screen');

const themeGrid = document.getElementById('theme-grid');
const selectedThemeDisplay = document.getElementById('selected-theme-display');
const playerNameInput = document.getElementById('player-name');
const addPlayerBtn = document.getElementById('add-player-btn');
const deletePlayerBtn = document.getElementById('delete-player-btn');
const startGameBtn = document.getElementById('start-game-btn');
const backToThemesBtn = document.getElementById('back-to-themes-btn');
const playerDeck = document.getElementById('player-deck');

const currentPlayerName = document.getElementById('current-player-name');
const revealBtn = document.getElementById('reveal-btn');
const progressCount = document.getElementById('progress-count');

const roleCard = document.getElementById('role-card');
const rolePlayerName = document.getElementById('role-player-name');
const cardFront = document.getElementById('card-front');
const nextPlayerBtn = document.getElementById('next-player-btn');

const revealImpostorBtn = document.getElementById('reveal-impostor-btn');
const newGameBtn = document.getElementById('new-game-btn');

const impostorName = document.getElementById('impostor-name');
const playAgainBtn = document.getElementById('play-again-btn');
const randomThemeBtn = document.getElementById('random-theme-btn');

const cameraToggleInput = document.getElementById('camera-toggle-input');
const confirmModal = document.getElementById('confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesBtn = document.getElementById('confirm-yes-btn');
const confirmNoBtn = document.getElementById('confirm-no-btn');
const cameraModal = document.getElementById('camera-modal');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraPreview = document.getElementById('camera-preview');
const previewImage = document.getElementById('preview-image');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const confirmPhotoBtn = document.getElementById('confirm-photo-btn');
const skipPhotoBtn = document.getElementById('skip-photo-btn');
const cameraCloseBtn = document.getElementById('camera-close-btn');
const cameraPlayerName = document.getElementById('camera-player-name');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
    loadThemes();
    setupEventListeners();
});

function setupEventListeners() {
    addPlayerBtn.addEventListener('click', addPlayer);
    deletePlayerBtn.addEventListener('click', deleteSelectedPlayer);
    startGameBtn.addEventListener('click', startGame);
    backToThemesBtn.addEventListener('click', backToThemes);
    randomThemeBtn.addEventListener('click', selectRandomTheme);
    document.getElementById('create-theme-btn').addEventListener('click', openCreateTheme);
    document.getElementById('save-theme-btn').addEventListener('click', saveCustomTheme);
    document.getElementById('cancel-theme-btn').addEventListener('click', cancelCreateTheme);
    document.getElementById('theme-words-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addWordToTheme();
        }
    });
    document.getElementById('add-word-btn').addEventListener('click', addWordToTheme);
    document.getElementById('dropdown-header').addEventListener('click', toggleDropdown);
    document.getElementById('reveal-card').addEventListener('click', revealRole);
    nextPlayerBtn.addEventListener('click', nextPlayer);
    revealImpostorBtn.addEventListener('click', revealImpostor);
    newGameBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);
    
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    
    // Event listeners de cámara
    cameraToggleInput.addEventListener('change', (e) => {
        gameState.cameraEnabled = e.target.checked;
    });
    
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    confirmPhotoBtn.addEventListener('click', confirmPhoto);
    skipPhotoBtn.addEventListener('click', skipPhoto);
    cameraCloseBtn.addEventListener('click', closeCamera);
    
    // Event listeners del selector de impostores
    document.getElementById('increase-impostor-btn').addEventListener('click', increaseImpostorCount);
    document.getElementById('decrease-impostor-btn').addEventListener('click', decreaseImpostorCount);
}

// Funciones de API
async function loadPlayers() {
    const response = await fetch('/api/players');
    const data = await response.json();
    gameState.players = data.players;
    renderPlayerDeck();
}

async function loadThemes() {
    try {
        const response = await fetch('/api/themes');
        const data = await response.json();
        gameState.themes = data.themes;
        
        themeGrid.innerHTML = '';
        
        data.themes.forEach(theme => {
            const card = document.createElement('div');
            card.className = 'theme-card';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.3) rotateZ(15deg)';
            card.innerHTML = `
                <div class="theme-card-name">${theme.name}</div>
            `;
            
            card.addEventListener('click', () => selectTheme(theme));
            themeGrid.appendChild(card);
        });
        
        console.log('Temas cargados:', gameState.themes.length);
        
        // Iniciar animación del mazo
        setTimeout(() => {
            animateCardDeck();
        }, 500);
    } catch (error) {
        console.error('Error cargando temas:', error);
    }
}

function animateCardDeck() {
    const deckWrapper = document.getElementById('card-deck-animation');
    const deck = document.querySelector('.card-deck');
    const deckCards = document.querySelectorAll('.deck-card');
    
    if (!deck || !deckWrapper) return;
    
    // Configurar offsets aleatorios para cada carta
    deckCards.forEach((card, index) => {
        const xOffset = (Math.random() - 0.5) * 600;
        const rotation = (Math.random() - 0.5) * 360;
        card.style.setProperty('--x-offset', xOffset);
        card.style.setProperty('--rotation', rotation);
    });
    
    // Explotar el mazo
    setTimeout(() => {
        deck.classList.add('exploding');
    }, 800);
    
    // Ocultar el mazo completamente
    setTimeout(() => {
        deckWrapper.classList.add('hidden');
    }, 1600);
    
    // Mostrar y animar las tarjetas de temáticas
    setTimeout(() => {
        deckWrapper.style.display = 'none';
        revealThemeCards();
    }, 2100);
}

function revealThemeCards() {
    const instruction = document.getElementById('theme-instruction');
    const randomBtn = document.getElementById('random-theme-btn');
    const themeCards = document.querySelectorAll('.theme-card');
    
    // Mostrar instrucción
    instruction.style.transition = 'opacity 0.5s ease';
    instruction.style.opacity = '1';
    
    // Mostrar grid
    themeGrid.style.opacity = '1';
    
    // Animar cada carta con delay
    themeCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) rotateZ(0deg)';
        }, index * 80);
    });
    
    // Mostrar botón aleatorio al final
    setTimeout(() => {
        const themeButtons = document.querySelector('.theme-buttons');
        const dropdown = document.getElementById('custom-themes-dropdown');
        
        themeButtons.style.transition = 'opacity 0.5s ease';
        themeButtons.style.opacity = '1';
        themeButtons.style.pointerEvents = 'auto';
        
        // Siempre mostrar dropdown
        dropdown.style.transition = 'opacity 0.5s ease';
        dropdown.style.opacity = '1';
        dropdown.style.pointerEvents = 'auto';
        loadCustomThemesDropdown();
    }, themeCards.length * 80 + 300);
}

function selectTheme(theme) {
    gameState.selectedTheme = theme.id;
    const themeName = gameState.themes.find(t => t.id === theme.id)?.name || theme.name || theme.id;
    selectedThemeDisplay.textContent = `Temática: ${themeName}`;
    showScreen('setup-screen');
    updateImpostorButtons();
    playerNameInput.focus();
}

function increaseImpostorCount() {
    const maxImpostors = Math.max(1, gameState.players.length - 2);
    if (gameState.impostorCount < maxImpostors) {
        gameState.impostorCount++;
        updateImpostorDisplay();
    }
}

function decreaseImpostorCount() {
    if (gameState.impostorCount > 1) {
        gameState.impostorCount--;
        updateImpostorDisplay();
    }
}

function updateImpostorDisplay() {
    document.getElementById('impostor-count-display').textContent = gameState.impostorCount;
    updateImpostorButtons();
}

function updateImpostorButtons() {
    const maxImpostors = Math.max(1, gameState.players.length - 2);
    const decreaseBtn = document.getElementById('decrease-impostor-btn');
    const increaseBtn = document.getElementById('increase-impostor-btn');
    
    decreaseBtn.disabled = gameState.impostorCount <= 1;
    increaseBtn.disabled = gameState.impostorCount >= maxImpostors || gameState.players.length < 3;
    
    // Ajustar si excede el máximo
    if (gameState.impostorCount > maxImpostors) {
        gameState.impostorCount = maxImpostors;
        updateImpostorDisplay();
    }
}

function backToThemes() {
    gameState.selectedTheme = null;
    showScreen('theme-screen');
    
    // Asegurarse de que el dropdown esté visible y actualizado
    const dropdown = document.getElementById('custom-themes-dropdown');
    if (dropdown) {
        dropdown.style.opacity = '1';
        dropdown.style.pointerEvents = 'auto';
        loadCustomThemesDropdown();
    }
}

function openCreateTheme() {
    showScreen('create-theme-screen');
    document.getElementById('theme-name-input').value = '';
    document.getElementById('theme-words-input').value = '';
    gameState.tempThemeWords = [];
    renderWordsList();
    updateWordCount();
}

function cancelCreateTheme() {
    showScreen('theme-screen');
}

function addWordToTheme() {
    const input = document.getElementById('theme-words-input');
    const word = input.value.trim();
    
    if (!word) {
        return;
    }
    
    if (gameState.tempThemeWords.includes(word)) {
        showNotification('Esta palabra ya fue agregada', 'warning');
        input.value = '';
        return;
    }
    
    gameState.tempThemeWords.push(word);
    input.value = '';
    renderWordsList();
    updateWordCount();
    input.focus();
}

function renderWordsList() {
    const wordsList = document.getElementById('words-list');
    wordsList.innerHTML = '';
    
    gameState.tempThemeWords.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.innerHTML = `
            <span class="word-text">${word}</span>
            <button class="word-delete-btn" data-index="${index}">✕</button>
        `;
        
        wordItem.querySelector('.word-delete-btn').addEventListener('click', () => {
            gameState.tempThemeWords.splice(index, 1);
            renderWordsList();
            updateWordCount();
        });
        
        wordsList.appendChild(wordItem);
    });
}

function updateWordCount() {
    const wordCount = document.getElementById('word-count');
    wordCount.textContent = gameState.tempThemeWords.length;
    wordCount.style.color = gameState.tempThemeWords.length >= 10 ? '#5ce7a4' : '#ff4757';
}

function saveCustomTheme() {
    const nameInput = document.getElementById('theme-name-input');
    const themeName = nameInput.value.trim();
    
    if (!themeName) {
        showNotification('Debes ingresar un nombre para la temática', 'error');
        return;
    }
    
    if (gameState.tempThemeWords.length < 10) {
        showNotification('Debes agregar al menos 10 palabras', 'error');
        return;
    }
    
    const themeId = 'custom_' + Date.now();
    const customTheme = {
        id: themeId,
        name: themeName,
        words: [...gameState.tempThemeWords]
    };
    
    gameState.customThemes.push(customTheme);
    localStorage.setItem('customThemes', JSON.stringify(gameState.customThemes));
    
    showNotification('Temática creada exitosamente', 'info');
    
    // Seleccionar automáticamente la temática recién creada
    gameState.selectedTheme = themeId;
    selectedThemeDisplay.textContent = `Temática: ${themeName}`;
    showScreen('setup-screen');
    playerNameInput.focus();
}

function loadCustomThemesDropdown() {
    const dropdownContent = document.getElementById('dropdown-content');
    dropdownContent.innerHTML = '';
    
    if (gameState.customThemes.length === 0) {
        dropdownContent.innerHTML = '<p style="padding: 20px; color: #707080; text-align: center; font-size: 14px;">No hay ninguna temática creada</p>';
        return;
    }
    
    gameState.customThemes.forEach((theme, index) => {
        const themeItem = document.createElement('div');
        themeItem.className = 'dropdown-item';
        
        // Crear elementos separadamente
        const nameSpan = document.createElement('span');
        nameSpan.className = 'dropdown-item-name';
        nameSpan.textContent = theme.name;
        
        const countSpan = document.createElement('span');
        countSpan.className = 'dropdown-item-count';
        countSpan.textContent = `${theme.words.length} palabras`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'dropdown-item-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.type = 'button';
        
        // Event listeners
        nameSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            selectTheme(theme);
        });
        
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            deleteCustomTheme(index);
            return false;
        }, true);
        
        // Agregar elementos al item
        themeItem.appendChild(nameSpan);
        themeItem.appendChild(countSpan);
        themeItem.appendChild(deleteBtn);
        
        dropdownContent.appendChild(themeItem);
    });
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-content');
    const arrow = document.querySelector('.dropdown-arrow');
    dropdown.classList.toggle('open');
    arrow.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
}

function deleteCustomTheme(index) {
    gameState.customThemes.splice(index, 1);
    localStorage.setItem('customThemes', JSON.stringify(gameState.customThemes));
    loadCustomThemesDropdown();
    showNotification('Temática eliminada', 'info');
}

function selectRandomTheme() {
    console.log('Seleccionando tema aleatorio. Temas disponibles:', gameState.themes.length);
    
    if (gameState.themes.length === 0) {
        console.error('No hay temas disponibles');
        showNotification('Cargando temáticas, intenta de nuevo', 'warning');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * gameState.themes.length);
    const randomTheme = gameState.themes[randomIndex];
    
    console.log('Tema aleatorio seleccionado:', randomTheme);
    selectTheme(randomTheme);
}


async function addPlayer() {
    const name = playerNameInput.value.trim();
    if (!name) return;
    
    // Si la cámara está habilitada, abrir modal de cámara
    if (gameState.cameraEnabled) {
        gameState.pendingPlayerName = name;
        gameState.capturedPhoto = null;
        await openCameraModal(name);
        return;
    }
    
    // Si no hay cámara, agregar jugador directamente
    await addPlayerToGame(name, null);
}

async function addPlayerToGame(name, photoData) {
    const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    
    if (response.ok) {
        const data = await response.json();
        gameState.players = data.players;
        
        // Guardar foto si existe
        if (photoData) {
            gameState.playerPhotos[name] = photoData;
        }
        
        playerNameInput.value = '';
        renderPlayerDeck();
        updateImpostorButtons();
        playerNameInput.focus();
    } else {
        const error = await response.json();
        showNotification(error.error, 'warning');
    }
}

async function deleteSelectedPlayer() {
    // Si no hay jugador seleccionado, eliminar todos
    if (gameState.selectedCardIndex === null) {
        if (gameState.players.length === 0) {
            showNotification('No hay jugadores para eliminar', 'info');
            return;
        }
        
        const confirmed = await showConfirm(
            '¿Eliminar todos los jugadores?',
            `¿Estás seguro de eliminar a TODOS los ${gameState.players.length} jugadores de la lista? Esta acción no se puede deshacer.`
        );
        
        if (!confirmed) {
            return;
        }
        
        // Animar todas las cartas saliendo
        const cards = document.querySelectorAll('.player-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('removing');
            }, index * 50);
        });
        
        await sleep(cards.length * 50 + 500);
        
        // Eliminar todos los jugadores
        for (const playerName of [...gameState.players]) {
            await fetch(`/api/players/${encodeURIComponent(playerName)}`, {
                method: 'DELETE'
            });
        }
        
        gameState.players = [];
        gameState.selectedCardIndex = null;
        renderPlayerDeck();
        updateImpostorButtons();
        showNotification('Todos los jugadores han sido eliminados', 'info');
        return;
    }
    
    // Si hay jugador seleccionado, eliminar solo ese
    const playerName = gameState.players[gameState.selectedCardIndex];
    
    const confirmed = await showConfirm(
        '¿Eliminar jugador?',
        `¿Estás seguro de eliminar a ${playerName} de la lista?`
    );
    
    if (!confirmed) {
        return;
    }
    
    const card = document.querySelector(`.player-card[data-index="${gameState.selectedCardIndex}"]`);
    if (card) {
        card.classList.add('removing');
        await sleep(500);
    }
    
    const response = await fetch(`/api/players/${encodeURIComponent(playerName)}`, {
        method: 'DELETE'
    });
    
    if (response.ok) {
        const data = await response.json();
        gameState.players = data.players;
        gameState.selectedCardIndex = null;
        renderPlayerDeck();
        updateImpostorButtons();
    }
}

async function startGame() {
    if (gameState.players.length < 3) {
        showNotification('Se necesitan al menos 3 jugadores para comenzar', 'error');
        return;
    }
    
    // Verificar si es una temática personalizada
    const customTheme = gameState.customThemes.find(t => t.id === gameState.selectedTheme);
    const requestBody = {
        theme: gameState.selectedTheme,
        impostor_count: gameState.impostorCount
    };
    
    // Si es personalizada, enviar las palabras
    if (customTheme) {
        requestBody.custom_words = customTheme.words;
    }
    
    const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });
    
    if (response.ok) {
        gameState.currentPlayerIndex = 0;
        showScreen('reveal-screen');
        updateRevealScreen();
    }
}

async function revealRole() {
    const revealCard = document.getElementById('reveal-card');
    
    // Si ya está volteada, no hacer nada
    if (revealCard.classList.contains('flipped')) {
        return;
    }
    
    const response = await fetch('/api/game/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_index: gameState.currentPlayerIndex })
    });
    
    const data = await response.json();
    
    // Preparar contenido de la carta
    const revealCardFront = document.getElementById('reveal-card-front');
    
    if (data.is_impostor) {
        revealCardFront.className = 'card-front impostor';
        revealCardFront.innerHTML = `
            <h2 class="role-title impostor">IMPOSTOR</h2>
            <div class="divider-small"></div>
            <p class="role-instruction">Trata de que no te descubran<br>No tienes palabra secreta</p>
            <button class="btn btn-card" id="continue-card-btn">CONTINUAR</button>
        `;
    } else {
        revealCardFront.className = 'card-front player';
        revealCardFront.innerHTML = `
            <h2 class="role-title player">JUGADOR</h2>
            <p class="word-label">TU PALABRA</p>
            <h3 class="secret-word">${data.secret_word.toUpperCase()}</h3>
            <div class="divider-small"></div>
            <p class="role-instruction">Descubre quién es el impostor<br>Él no conoce esta palabra</p>
            <button class="btn btn-card" id="continue-card-btn">CONTINUAR</button>
        `;
    }
    
    // Voltear la carta
    revealCard.classList.add('flipped');
    
    // Remover clase clickable y cambiar instrucción
    revealCard.classList.remove('clickable');
    document.getElementById('reveal-instruction').textContent = 'No muestres tu rol a los demás';
    
    // Agregar event listener al botón CONTINUAR después de la animación
    setTimeout(() => {
        document.getElementById('continue-card-btn').addEventListener('click', nextPlayer);
    }, 800);
}

async function nextPlayer() {
    gameState.currentPlayerIndex++;
    
    if (gameState.currentPlayerIndex >= gameState.players.length) {
        // Obtener información del juego incluyendo el primer jugador
        try {
            const response = await fetch('/api/game/impostor');
            if (response.ok) {
                const data = await response.json();
                
                // Mostrar el primer jugador en la pantalla final
                const firstPlayerContainer = document.getElementById('first-player-container');
                const firstPlayerName = document.getElementById('first-player-name');
                if (data.first_player && firstPlayerName) {
                    firstPlayerName.textContent = data.first_player.toUpperCase();
                    if (firstPlayerContainer) {
                        firstPlayerContainer.style.display = 'block';
                    }
                } else if (firstPlayerContainer) {
                    firstPlayerContainer.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error al obtener primer jugador:', error);
        }
        
        showScreen('final-screen');
    } else {
        showScreen('reveal-screen');
        // Esperar un momento antes de actualizar para asegurar que todo se resetee
        setTimeout(() => {
            updateRevealScreen();
        }, 50);
    }
}

async function revealImpostor() {
    try {
        const response = await fetch('/api/game/impostor');
        
        if (!response.ok) {
            const error = await response.json();
            showNotification(error.error || 'No hay impostores asignados. Inicia un nuevo juego.', 'error');
            return;
        }
        
        const data = await response.json();
        
        if (!data.impostors || data.impostors.length === 0) {
            showNotification('No hay impostores asignados. Inicia un nuevo juego.', 'error');
            return;
        }
        
        console.log('Impostores:', data.impostors);
        console.log('Primer jugador:', data.first_player);
        
        // Mostrar el primer jugador
        const firstPlayerContainer = document.getElementById('first-player-container');
        const firstPlayerName = document.getElementById('first-player-name');
        if (data.first_player && firstPlayerName) {
            firstPlayerName.textContent = data.first_player.toUpperCase();
            if (firstPlayerContainer) {
                firstPlayerContainer.style.display = 'block';
            }
        } else if (firstPlayerContainer) {
            firstPlayerContainer.style.display = 'none';
        }
        
        // Configurar el texto según cantidad de impostores
        const impostorLabel = document.querySelector('.impostor-label');
        if (data.impostors.length === 1) {
            impostorLabel.textContent = 'EL IMPOSTOR ERA';
            impostorName.textContent = data.impostors[0].toUpperCase();
            
            // Mostrar foto si existe
            const impostorPhoto = document.getElementById('impostor-photo');
            if (gameState.playerPhotos[data.impostors[0]]) {
                impostorPhoto.src = gameState.playerPhotos[data.impostors[0]];
                impostorPhoto.style.display = 'block';
            } else {
                impostorPhoto.style.display = 'none';
            }
        } else {
            impostorLabel.textContent = 'LOS IMPOSTORES ERAN';
            impostorName.textContent = data.impostors.join(' • ').toUpperCase();
            
            // Ocultar foto cuando hay múltiples impostores
            const impostorPhoto = document.getElementById('impostor-photo');
            impostorPhoto.style.display = 'none';
        }
        
        // Mostrar pantalla
        showScreen('impostor-screen');
        
        // Resetear la carta y luego voltearla
        const impostorCard = document.getElementById('impostor-card');
        if (impostorCard) {
            impostorCard.classList.remove('flipped');
            setTimeout(() => {
                impostorCard.classList.add('flipped');
            }, 500);
        }
    } catch (error) {
        console.error('Error al revelar impostor:', error);
        showNotification('Error al revelar el impostor', 'error');
    }
}

async function resetGame() {
    await fetch('/api/game/reset', { method: 'POST' });
    gameState.currentPlayerIndex = 0;
    gameState.selectedCardIndex = null;
    gameState.impostorCount = 1;
    updateImpostorDisplay();
    gameState.selectedTheme = null;
    // No borrar las fotos para mantenerlas entre juegos
    await loadPlayers();
    showScreen('theme-screen');
    
    // Asegurarse de que el dropdown esté visible y actualizado
    const dropdown = document.getElementById('custom-themes-dropdown');
    if (dropdown) {
        dropdown.style.opacity = '1';
        dropdown.style.pointerEvents = 'auto';
        loadCustomThemesDropdown();
    }
}

// Funciones de UI
function renderPlayerDeck() {
    playerDeck.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.dataset.index = index;
        
        const photoHTML = gameState.playerPhotos[player] 
            ? `<img src="${gameState.playerPhotos[player]}" class="player-photo" alt="${player}">` 
            : '';
        
        card.innerHTML = `
            <div class="mini-card">
                ${photoHTML}
                <span class="player-name-text">${player}</span>
            </div>
        `;
        
        card.addEventListener('click', () => selectCard(index));
        
        playerDeck.appendChild(card);
    });
}

function selectCard(index) {
    // Deseleccionar todas las cartas
    document.querySelectorAll('.player-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar la carta clickeada
    const card = document.querySelector(`.player-card[data-index="${index}"]`);
    if (card) {
        if (gameState.selectedCardIndex === index) {
            gameState.selectedCardIndex = null;
        } else {
            card.classList.add('selected');
            gameState.selectedCardIndex = index;
        }
    }
}

function updateRevealScreen() {
    const playerName = gameState.players[gameState.currentPlayerIndex];
    currentPlayerName.textContent = playerName;
    progressCount.textContent = `${gameState.currentPlayerIndex} / ${gameState.players.length}`;
    
    // Mostrar foto si existe
    const currentPlayerPhoto = document.getElementById('current-player-photo');
    if (gameState.playerPhotos[playerName]) {
        currentPlayerPhoto.src = gameState.playerPhotos[playerName];
        currentPlayerPhoto.style.display = 'block';
    } else {
        currentPlayerPhoto.style.display = 'none';
    }
    
    // Resetear carta (volverla boca abajo)
    const revealCard = document.getElementById('reveal-card');
    const revealCardFront = document.getElementById('reveal-card-front');
    
    revealCard.classList.remove('flipped');
    revealCard.classList.add('clickable');
    
    // Limpiar contenido de la carta
    revealCardFront.innerHTML = '';
    revealCardFront.className = 'card-front';
    
    // Resetear instrucción
    document.getElementById('reveal-instruction').textContent = 'Toca la carta para revelar tu rol';
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenId).classList.add('active');
}

function showNotification(message, type = 'info') {
    // Crear notificación custom
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    
    const colors = {
        'error': { bg: 'linear-gradient(135deg, #ff4757 0%, #e63946 100%)', border: '#ff4757' },
        'warning': { bg: 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)', border: '#ffa502' },
        'info': { bg: 'linear-gradient(135deg, #6c5ce7 0%, #5b4bc7 100%)', border: '#6c5ce7' }
    };
    
    const color = colors[type] || colors['info'];
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-progress"></div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${color.bg};
        color: white;
        border-radius: 12px;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5),
                    0 0 30px ${color.border}40;
        z-index: 10000;
        animation: notificationSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: 2px solid ${color.border};
        min-width: 300px;
        max-width: 400px;
        overflow: hidden;
    `;
    
    document.body.appendChild(notification);
    
    // Animar la barra de progreso
    const progress = notification.querySelector('.notification-progress');
    progress.style.animation = 'notificationProgress 3s linear';
    
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función de confirmación personalizada
function showConfirm(title, message) {
    return new Promise((resolve) => {
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        confirmModal.classList.add('active');
        
        const handleYes = () => {
            confirmModal.classList.remove('active');
            confirmYesBtn.removeEventListener('click', handleYes);
            confirmNoBtn.removeEventListener('click', handleNo);
            resolve(true);
        };
        
        const handleNo = () => {
            confirmModal.classList.remove('active');
            confirmYesBtn.removeEventListener('click', handleYes);
            confirmNoBtn.removeEventListener('click', handleNo);
            resolve(false);
        };
        
        confirmYesBtn.addEventListener('click', handleYes);
        confirmNoBtn.addEventListener('click', handleNo);
    });
}

// Funciones de cámara
async function openCameraModal(playerName) {
    cameraPlayerName.textContent = `Foto de ${playerName}`;
    cameraModal.classList.add('active');
    
    // Resetear estados
    cameraVideo.style.display = 'block';
    cameraPreview.style.display = 'none';
    captureBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'none';
    confirmPhotoBtn.style.display = 'none';
    
    try {
        gameState.cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: 640, height: 480 } 
        });
        cameraVideo.srcObject = gameState.cameraStream;
    } catch (error) {
        console.error('Error accediendo a la cámara:', error);
        showNotification('No se pudo acceder a la cámara', 'error');
        closeCamera();
    }
}

function capturePhoto() {
    // Efecto de flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10001;
        animation: cameraFlash 0.3s ease;
        pointer-events: none;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
    
    const context = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    
    context.drawImage(cameraVideo, 0, 0);
    const photoData = cameraCanvas.toDataURL('image/jpeg', 0.8);
    
    gameState.capturedPhoto = photoData;
    
    // Mostrar preview con animación
    previewImage.src = photoData;
    cameraVideo.style.display = 'none';
    cameraPreview.style.display = 'block';
    cameraPreview.style.animation = 'photoReveal 0.5s ease';
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    confirmPhotoBtn.style.display = 'inline-block';
}

function retakePhoto() {
    cameraVideo.style.display = 'block';
    cameraPreview.style.display = 'none';
    captureBtn.style.display = 'inline-block';
    retakeBtn.style.display = 'none';
    confirmPhotoBtn.style.display = 'none';
    gameState.capturedPhoto = null;
}

async function confirmPhoto() {
    if (gameState.capturedPhoto && gameState.pendingPlayerName) {
        await addPlayerToGame(gameState.pendingPlayerName, gameState.capturedPhoto);
        closeCamera();
    }
}

async function skipPhoto() {
    if (gameState.pendingPlayerName) {
        await addPlayerToGame(gameState.pendingPlayerName, null);
        closeCamera();
    }
}

function closeCamera() {
    if (gameState.cameraStream) {
        gameState.cameraStream.getTracks().forEach(track => track.stop());
        gameState.cameraStream = null;
    }
    cameraModal.classList.remove('active');
    gameState.pendingPlayerName = null;
    gameState.capturedPhoto = null;
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationSlideIn {
        from {
            transform: translateX(450px) rotateZ(10deg);
            opacity: 0;
        }
        to {
            transform: translateX(0) rotateZ(0deg);
            opacity: 1;
        }
    }
    
    @keyframes notificationSlideOut {
        from {
            transform: translateX(0) scale(1);
            opacity: 1;
        }
        to {
            transform: translateX(450px) scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes notificationProgress {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
    
    .custom-notification {
        position: relative;
    }
    
    .custom-notification::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.03) 10px,
            rgba(255, 255, 255, 0.03) 20px
        );
        pointer-events: none;
        border-radius: 12px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 18px 25px;
        position: relative;
        z-index: 1;
    }
    
    .notification-icon {
        font-size: 24px;
        min-width: 30px;
        text-align: center;
        animation: iconPulse 0.6s ease;
    }
    
    @keyframes iconPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
    }
    
    .notification-message {
        flex: 1;
        line-height: 1.4;
    }
    
    .notification-progress {
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0 0 10px 10px;
    }
`;
document.head.appendChild(style);
