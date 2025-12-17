import os
import sys
import webbrowser
import threading
import time
from flask import Flask, render_template, jsonify, request, session
import random

# Configurar rutas para PyInstaller
if getattr(sys, 'frozen', False):
    # Si está ejecutándose como ejecutable
    base_path = sys._MEIPASS
else:
    # Si está ejecutándose como script
    base_path = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__,
            template_folder=os.path.join(base_path, 'templates'),
            static_folder=os.path.join(base_path, 'static'))
app.secret_key = 'impostor-game-secret-key-' + str(random.randint(100000, 999999))

# Función para obtener el estado del juego de la sesión actual
def get_game_state():
    if 'game_state' not in session:
        session['game_state'] = {
            'players': [],
            'impostors': [],
            'secret_word': None,
            'current_player_index': 0,
            'revealed_players': [],
            'theme': 'general',
            'impostor_count': 1
        }
    return session['game_state']

def save_game_state(state):
    session['game_state'] = state
    session.modified = True

# Listas de palabras por temática
word_themes = {
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
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/players', methods=['GET'])
def get_players():
    game_state = get_game_state()
    return jsonify({'players': game_state['players']})

@app.route('/api/players', methods=['POST'])
def add_player():
    game_state = get_game_state()
    data = request.json
    name = data.get('name', '').strip()
    
    if not name:
        return jsonify({'success': False, 'error': 'Nombre vacío'}), 400
    
    if name in game_state['players']:
        return jsonify({'success': False, 'error': 'El jugador ya existe'}), 400
    
    game_state['players'].append(name)
    save_game_state(game_state)
    return jsonify({'success': True, 'players': game_state['players']})

@app.route('/api/players/<name>', methods=['DELETE'])
def delete_player(name):
    game_state = get_game_state()
    if name in game_state['players']:
        game_state['players'].remove(name)
        save_game_state(game_state)
    return jsonify({'success': True, 'players': game_state['players']})

@app.route('/api/themes', methods=['GET'])
def get_themes():
    themes = [
        {'id': 'general', 'name': 'General'},
        {'id': 'chilenas', 'name': 'Cosas Chilenas'},
        {'id': 'comida', 'name': 'Comida'},
        {'id': 'videojuegos', 'name': 'Videojuegos'},
        {'id': 'anime', 'name': 'Anime'},
        {'id': 'peliculas', 'name': 'Películas'},
        {'id': 'musica', 'name': 'Música'},
        {'id': 'deportes', 'name': 'Deportes'},
        {'id': 'animales', 'name': 'Animales'},
        {'id': 'tecnologia', 'name': 'Tecnología'},
        {'id': 'league of legends', 'name': 'League of Legends'},
        {'id': 'clash royale', 'name': 'Clash Royale'}
    ]
    return jsonify({'themes': themes})

@app.route('/api/game/start', methods=['POST'])
def start_game():
    game_state = get_game_state()
    if len(game_state['players']) < 3:
        return jsonify({'success': False, 'error': 'Se necesitan al menos 3 jugadores'}), 400
    
    data = request.json
    theme = data.get('theme', 'general')
    custom_words = data.get('custom_words', None)
    impostor_count = data.get('impostor_count', 1)
    
    # Validar cantidad de impostores
    max_impostors = max(1, len(game_state['players']) - 2)
    impostor_count = min(max(1, impostor_count), max_impostors)
    game_state['impostor_count'] = impostor_count
    
    # Seleccionar impostores aleatorios
    game_state['impostors'] = random.sample(game_state['players'], impostor_count)
    
    # Si es una temática personalizada con palabras
    if custom_words and isinstance(custom_words, list) and len(custom_words) >= 10:
        game_state['secret_word'] = random.choice(custom_words)
        game_state['theme'] = 'custom'
    elif theme in word_themes:
        game_state['secret_word'] = random.choice(word_themes[theme])
        game_state['theme'] = theme
    else:
        game_state['secret_word'] = random.choice(word_themes['general'])
        game_state['theme'] = 'general'
    
    game_state['current_player_index'] = 0
    game_state['revealed_players'] = []
    
    save_game_state(game_state)
    
    return jsonify({
        'success': True,
        'total_players': len(game_state['players']),
        'theme': theme,
        'impostor_count': impostor_count
    })

@app.route('/api/game/reveal', methods=['POST'])
def reveal_role():
    game_state = get_game_state()
    data = request.json
    player_index = data.get('player_index', 0)
    
    if player_index >= len(game_state['players']):
        return jsonify({'success': False, 'error': 'Índice inválido'}), 400
    
    player_name = game_state['players'][player_index]
    is_impostor = player_name in game_state['impostors']
    
    if player_index not in game_state['revealed_players']:
        game_state['revealed_players'].append(player_index)
    
    save_game_state(game_state)
    
    return jsonify({
        'success': True,
        'player': player_name,
        'is_impostor': is_impostor,
        'word': None if is_impostor else game_state['secret_word']
    })

@app.route('/api/game/impostor', methods=['GET'])
def get_impostor():
    game_state = get_game_state()
    return jsonify({
        'impostors': game_state['impostors'],
        'word': game_state['secret_word']
    })

@app.route('/api/game/reset', methods=['POST'])
def reset_game():
    session.clear()
    return jsonify({'success': True})

def open_browser():
    """Espera a que el servidor esté listo y abre el navegador"""
    time.sleep(1.5)
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    # Abrir navegador en un thread separado
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Iniciar servidor Flask
    print("Iniciando Impostor Game...")
    print("El juego se abrirá automáticamente en tu navegador")
    print("Para cerrar el juego, cierra esta ventana")
    app.run(debug=False, host='127.0.0.1', port=5000, use_reloader=False)
