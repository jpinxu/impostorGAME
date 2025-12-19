# Impostor Game v1.1

Juego de rol social donde uno o más impostores deben pasar desapercibidos mientras los demás jugadores conocen la palabra secreta.

## Características

- 12 temáticas predefinidas
  - **League of Legends** con 160+ campeones completos
  - **Clash Royale** y otras temáticas populares
- Sistema de temáticas personalizadas (mínimo 10 palabras)
- Selección aleatoria de temática
- **Selección automática del primer jugador** (los impostores tienen 50% menos probabilidad)
- Captura de fotos de jugadores vía webcam
- Múltiples impostores configurables (1 a N-2)
- Interfaz moderna con animaciones CSS
- Diseño responsive
- Persistencia local de datos

## Novedades v1.1

- **League of Legends expandido**: Ahora incluye todos los campeones (160+)
- **Primer jugador automático**: El juego selecciona quién da la primera pista con probabilidad ponderada (impostores tienen menos chance)
- Mejoras visuales en la pantalla final

## Versiones Disponibles

Este proyecto tiene cuatro formas de uso:

1. **APK Android** - Aplicación nativa para dispositivos Android (imposWHO)
2. **EXE Portable** - Ejecutable para compartir (no requiere instalación)
3. **Web Desplegable** - Para hospedar en servicios como Render
4. **Desarrollo Local** - Para ejecutar localmente con Python

---

## 1. APK Android (imposWHO)

### Para Usuarios Finales

**Aplicación Android nativa, funciona offline sin servidor.**

#### Instalación

1. Descarga `imposWHO.apk` desde la sección Releases
2. Habilita "Instalar apps de fuentes desconocidas" en Android
3. Abre el archivo APK y acepta la instalación
4. Listo para jugar offline

#### Características

- Aplicación standalone (sin necesidad de servidor)
- 12 temáticas integradas con 160+ campeones de LoL
- Selección automática del primer jugador
- Tamaño: ~3.3 MB
- Compatible con Android 7.0+ (API 24+)
- Optimizado para dispositivos móviles

### Para Desarrolladores

#### Requisitos

- Node.js 18+
- Java JDK 11 o superior
- Android SDK (API 35)
- Gradle 8.5+
- Cordova CLI

#### Construir APK

```powershell
# Opción 1: Script automatizado (recomendado)
.\build-apk.ps1

# Opción 2: Manual
cd mobile-app
cordova build android --release
```

El APK se genera en:
- Debug: `mobile-app/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `mobile-app/platforms/android/app/build/outputs/apk/release/app-release.apk`
- Copia final: `dist-android/imposWHO.apk`

#### Archivos del proyecto Android

- `mobile-app/www/` - Código web standalone (HTML/CSS/JS)
- `mobile-app/config.xml` - Configuración de Cordova
- `mobile-app/res/icon/` - Íconos de la app
- `build-apk.ps1` - Script de compilación automatizado

> **Nota:** La versión APK usa `mobile-app/www/script.js` que es standalone y NO depende del backend Flask.

---

## 2. EXE Portable (Windows)

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

## 3. Desarrollo Local

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

## 4. Despliegue Web (Render)

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

1. Selecciona una temática (12 disponibles, incluyendo League of Legends con 160+ campeones)
2. Ingresa nombres de jugadores (mínimo 3)
3. Configura cantidad de impostores (hasta N-2)
4. Cada jugador revela su rol en privado
5. Jugadores normales ven la palabra, impostores no
6. El juego selecciona automáticamente quién empieza dando la primera pista
7. Discutan y voten quién es el impostor
8. Revelen al impostor

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
