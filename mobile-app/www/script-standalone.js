// Versión standalone para APK Android - sin dependencia de servidor Flask
// Estado de la aplicación almacenado localmente
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
    impostorCount: 1,
    impostors: [],
    secretWord: null,
    revealedPlayers: []
};

// Temáticas predefinidas (copiadas del servidor)
const wordThemes = {
    'general': [
        "Perro", "Gato", "Casa", "Auto", "Bici", "Pizza", "Café",
        "Teléfono", "Computador", "Silla", "Mesa", "Cama", "Puerta",
        "Playa", "Montaña", "Río", "Árbol", "Sol", "Luna", "Estrella",
        "Avión", "Barco", "Tren", "Libro", "Película", "Música",
        "Pelota", "Zapato", "Reloj", "Paraguas", "Mochila"
    ],
    'chilenas': [
        "Empanada", "Completo", "Mote con huesillo", "Sopaipilla", "Pisco",
        "Terremoto", "Caluga", "Alfajor", "Manjar", "Pastel de choclo",
        "Cazuela", "Curanto", "Choripán", "Humita", "Pebre",
        "Chirimoya", "Copihue", "Moai", "Cueca", "Chupalla",
        "Poncho", "Mate", "Pudú", "Huemul", "Cóndor"
    ],
    'comida': [
        "Pizza", "Hamburguesa", "Sushi", "Tacos", "Pasta",
        "Arroz", "Pan", "Queso", "Chocolate", "Helado",
        "Pollo", "Carne", "Pescado", "Huevo", "Ensalada",
        "Sopa", "Sandwich", "Hot Dog", "Papas fritas", "Galletas",
        "Torta", "Donas", "Palomitas", "Yogurt", "Cereal"
    ],
    'videojuegos': [
        "Mario", "Sonic", "Pikachu", "Minecraft", "Fortnite",
        "Among Us", "Roblox", "Pokemon", "Zelda", "GTA",
        "FIFA", "Call of Duty", "Pac-Man", "Tetris", "Doom",
        "Street Fighter", "Mortal Kombat", "God of War", "Halo", "Overwatch",
        "League of Legends", "Valorant", "Counter Strike", "Apex Legends", "Free Fire"
    ],
    'anime': [
        "Naruto", "Goku", "Pikachu", "Luffy", "Sasuke",
        "Dragon Ball", "One Piece", "Death Note", "Attack on Titan", "Demon Slayer",
        "My Hero Academia", "Bleach", "Hunter x Hunter", "Fullmetal Alchemist", "Tokyo Ghoul",
        "Sword Art Online", "Sailor Moon", "Pokémon", "Jujutsu Kaisen", "Chainsaw Man",
        "Spy x Family", "Cowboy Bebop", "Evangelion", "One Punch Man", "Mob Psycho"
    ],
    'peliculas': [
        "Titanic", "Avatar", "Star Wars", "Harry Potter", "Marvel",
        "Batman", "Superman", "Spider-Man", "Iron Man", "Avengers",
        "Toy Story", "Frozen", "Shrek", "El Rey León", "Buscando a Nemo",
        "Jurassic Park", "Matrix", "Terminator", "Rocky", "Fast and Furious",
        "James Bond", "Indiana Jones", "Piratas del Caribe", "Transformers", "Minions"
    ],
    'musica': [
        "Guitarra", "Piano", "Batería", "Violín", "Trompeta",
        "Saxofón", "Flauta", "Bajo", "Micrófono", "Rock",
        "Pop", "Reggaeton", "Hip Hop", "Jazz", "Salsa",
        "Beatles", "Michael Jackson", "Madonna", "Queen", "Coldplay",
        "Bad Bunny", "Shakira", "Daddy Yankee", "BTS", "Taylor Swift"
    ],
    'deportes': [
        "Fútbol", "Basketball", "Tenis", "Volleyball", "Natación",
        "Boxeo", "Golf", "Baseball", "Rugby", "Hockey",
        "Ski", "Surf", "Atletismo", "Gimnasia", "Ciclismo",
        "Messi", "Cristiano Ronaldo", "Neymar", "LeBron James", "Federer",
        "Nadal", "Serena Williams", "Usain Bolt", "Michael Phelps", "Tiger Woods"
    ],
    'animales': [
        "Perro", "Gato", "León", "Tigre", "Elefante",
        "Jirafa", "Mono", "Oso", "Lobo", "Zorro",
        "Caballo", "Vaca", "Cerdo", "Oveja", "Gallina",
        "Pato", "Águila", "Delfín", "Tiburón", "Ballena",
        "Pingüino", "Koala", "Panda", "Canguro", "Cocodrilo"
    ],
    'tecnologia': [
        "iPhone", "Android", "Windows", "Mac", "Internet",
        "WiFi", "Bluetooth", "USB", "YouTube", "Facebook",
        "Instagram", "WhatsApp", "TikTok", "Twitter", "Google",
        "Netflix", "Spotify", "Amazon", "PlayStation", "Xbox",
        "Nintendo", "Tesla", "Samsung", "Apple", "Microsoft"
    ],
    'league of legends': [
        "Yasuo", "Zed", "Ahri", "Lux", "Jinx",
        "Ezreal", "Lee Sin", "Thresh", "Vayne", "Riven",
        "Katarina", "Darius", "Garen", "Teemo", "Master Yi",
        "Blitzcrank", "Jhin", "Draven", "Lucian", "Caitlyn",
        "Morgana", "Kayn", "Yone", "Akali", "Ekko"
    ],
    'clash royale': [
        "Caballero", "Arqueras", "Gigante", "PEKKA", "Globo",
        "Minero", "Mago", "Dragón Infernal", "Bruja", "Golem",
        "Sabueso de Lava", "Montapuercos", "Príncipe", "Príncipe Oscuro", "Megacaballero",
        "Bandida", "Leñador", "Verdugo", "Bárbaro de Elite", "Pandilla de Duendes",
        "Esqueletos", "Bola de Fuego", "Rayo", "Flechas", "Veneno"
    ]
};

// El resto del código es igual al script.js original, pero adaptado para trabajar sin servidor
// Copio todo el contenido de script.js aquí y adapto las funciones de API

