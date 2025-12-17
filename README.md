# Impostor Game

Juego de rol social donde uno o más impostores deben pasar desapercibidos mientras los demás jugadores conocen la palabra secreta.

## Características

- 12 temáticas predefinidas (General, Cosas Chilenas, Comida, Videojuegos, Anime, Películas, Música, Deportes, Animales, Tecnología, League of Legends y Clash Royale)
- Sistema de temáticas personalizadas con un mínimo de 10 palabras
- Selección aleatoria de temática
- Captura de fotos de jugadores mediante cámara web
- Soporte para múltiples impostores (configurable de 1 a N-2)
- Persistencia de temáticas personalizadas en localStorage
- Interfaz con animaciones y transiciones
- Diseño responsive

## Cómo Jugar

1. Selecciona una temática predefinida, crea una personalizada o elige una aleatoria
2. Ingresa los nombres de los jugadores (mínimo 3)
3. Configura la cantidad de impostores
4. Opcionalmente, activa la cámara para capturar fotos de cada jugador
5. Cada jugador revela su rol de forma privada
6. Los jugadores normales ven la palabra secreta, los impostores no
7. Los jugadores discuten y votan quién es el impostor
8. Se revela la identidad del impostor

## Instalación

### Requisitos

- Python 3.8+
- pip

```powershell
# Clonar el repositorio
git clone https://github.com/tu-usuario/impostor-game.git
cd impostor-game

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Windows CMD:
.\.venv\Scripts\activate.bat
# Linux/Mac:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar aplicación
python app.py
```

La aplicación estará disponible en `http://localhost:5000`

## Despliegue en Render

### Configuración

1. Crea un repositorio en GitHub con el código del proyecto
2. Registra una cuenta en [render.com](https://render.com)
3. Crea un nuevo Web Service y conecta el repositorio
4. Configura el servicio:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Despliega el servicio

La aplicación estará disponible en una URL pública proporcionada por Render.

> Nota: El plan gratuito suspende la aplicación después de 15 minutos de inactividad. La reactivación puede tomar 30-50 segundos.

## Stack Tecnológico

- Backend: Flask
- Frontend: HTML5, CSS3, JavaScript
- Server: Gunicorn
- Storage: LocalStorage para temáticas personalizadas

## Estructura del Proyecto

```
impostor-game/
├── app.py                 # Aplicación Flask principal
├── impostor_game.py       # Versión Tkinter (escritorio)
├── requirements.txt       # Dependencias Python
├── .gitignore            # Archivos ignorados por Git
├── README.md             # Este archivo
├── static/
│   ├── script.js         # Lógica del juego (frontend)
│   └── style.css         # Estilos y animaciones
└── templates/
    └── index.html        # Plantilla HTML principal
```

## Reglas del Juego

### Jugadores Normales
- Al revelar la carta, verán la palabra secreta
- Deben describir la palabra sin mencionarla directamente
- Objetivo: identificar al impostor

### Impostor
- No verá la palabra secreta
- Debe simular que conoce la palabra basándose en las descripciones de otros
- Objetivo: evitar ser descubierto

## Changelog v1.0

### Características
- Sistema de temáticas personalizadas
- Captura de fotos de jugadores vía webcam
- Configuración de múltiples impostores
- Selección aleatoria de temática
- 12 temáticas predefinidas
- Interfaz con animaciones CSS
- Sistema de notificaciones
- Persistencia de sesión
- Diseño responsive

### Mejoras Técnicas
- Arquitectura API REST
- Validaciones client-side y server-side
- Manejo robusto de errores
- Código modularizado

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

MIT License

## Reportar Issues

Para reportar bugs o solicitar nuevas características, abre un issue en el repositorio de GitHub.
