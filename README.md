# Impostor Game v1.0

Juego de rol social donde uno o más impostores deben pasar desapercibidos mientras los demás jugadores conocen la palabra secreta.

## Características

- 12 temáticas predefinidas
- Sistema de temáticas personalizadas (mínimo 10 palabras)
- Selección aleatoria de temática
- Captura de fotos de jugadores vía webcam
- Múltiples impostores configurables (1 a N-2)
- Interfaz moderna con animaciones CSS
- Diseño responsive
- Persistencia local de datos

## Versiones Disponibles

Este proyecto tiene tres formas de uso:

1. **EXE Portable** - Ejecutable para compartir (no requiere instalación)
2. **Web Desplegable** - Para hospedar en servicios como Render
3. **Desarrollo Local** - Para ejecutar localmente con Python

---

## 1. EXE Portable (Windows)

### Para Usuarios Finales

**No requiere instalación de nada. Solo descarga y ejecuta.**

#### Uso

1. Descarga `ImpostorGameWeb.exe`
2. Doble clic en el archivo
3. Se abre automáticamente en tu navegador
4. Para cerrar: cierra la ventana de consola

#### Características

- Archivo único (~12-15 MB)
- No requiere Python ni instalación
- Funciona offline
- Compatible con Windows 10/11

> **Nota:** Algunos antivirus pueden detectarlo como amenaza (falso positivo de PyInstaller).

### Para Desarrolladores

#### Generar el EXE

```powershell
# Instalar dependencias
pip install -r requirements.txt

# Crear ejecutable
pyinstaller --onefile --windowed --name "ImpostorGameWeb" --add-data "templates;templates" --add-data "static;static" launcher.py
```

El ejecutable se genera en `dist/ImpostorGameWeb.exe`

#### Archivos necesarios

- `launcher.py` - Script principal del ejecutable
- `templates/` - Plantillas HTML
- `static/` - Archivos CSS/JS

---

## 2. Desarrollo Local

### Requisitos

- Python 3.8+
- pip

### Instalación

```powershell
# Clonar repositorio
git clone https://github.com/tu-usuario/impostor-game.git
cd impostor-game

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual (Windows)
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar aplicación
python app.py
```

Abrir en navegador: `http://localhost:5000`

### Archivos principales

- `app.py` - Aplicación Flask principal
- `templates/index.html` - Interfaz del juego
- `static/script.js` - Lógica del frontend
- `static/style.css` - Estilos y animaciones

---

## 3. Despliegue Web (Render)

### Configuración

1. Sube el código a GitHub
2. Crea cuenta en [render.com](https://render.com)
3. Nuevo Web Service → Conecta tu repositorio
4. Configuración:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Deploy

Tu aplicación estará disponible en una URL pública.

> El plan gratuito suspende la app tras 15 minutos de inactividad.

### Archivos necesarios para deployment

- `app.py` - Servidor Flask
- `requirements.txt` - Dependencias (sin pyinstaller)
- `templates/` y `static/` - Archivos web

---

## Cómo Jugar

1. Selecciona una temática
2. Ingresa nombres de jugadores (mínimo 3)
3. Configura cantidad de impostores
4. Cada jugador revela su rol en privado
5. Jugadores normales ven la palabra, impostores no
6. Discutan y voten quién es el impostor
7. Revelen al impostor

## Stack Tecnológico

- Backend: Flask
- Frontend: HTML5, CSS3, JavaScript
- Deployment: Gunicorn
- Storage: Session + LocalStorage

## Estructura del Proyecto

```
impostor-game/
├── app.py                 # Servidor Flask (local/web)
├── launcher.py            # Launcher para EXE
├── requirements.txt       # Dependencias
├── .gitignore
├── README.md
├── static/
│   ├── script.js         # Lógica del juego
│   └── style.css         # Estilos
└── templates/
    └── index.html        # Interfaz principal
```

## Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agrega funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

MIT License

## Soporte

Reporta bugs o solicita features abriendo un issue en GitHub.
