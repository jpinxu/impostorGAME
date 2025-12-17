# 🎮 Impostor Game v1.0 - Release Notes

## 📦 Descargas Disponibles

### Para Usuarios (Sin instalación)
- **ImpostorGameWeb.exe** (~12 MB) - Ejecutable portable para Windows
  - No requiere instalación de Python
  - Solo doble clic y juega
  - Compatible con Windows 10/11

### Para Desarrolladores
- **Source code (zip)** - Código fuente completo
- **Source code (tar.gz)** - Código fuente completo

---

## ✨ Características v1.0

### 🎯 Jugabilidad
- Juego de rol social inspirado en Among Us
- Mínimo 3 jugadores
- Múltiples impostores configurables (1 a N-2)
- Sistema de turnos para revelar roles

### 🎨 Temáticas
- **12 temáticas predefinidas:**
  - General, Comida chilena, Comida internacional
  - Videojuegos, Anime, Películas
  - Música, Deportes, Animales
  - Tecnología, League of Legends, Clash Royale
- **Temáticas personalizadas** (mínimo 10 palabras)
- **Selección aleatoria** de temática
- Persistencia local de temas personalizados

### 📸 Características Especiales
- Captura de fotos vía webcam
- Galería de jugadores con imágenes
- Interfaz moderna con animaciones CSS
- Diseño responsive
- Persistencia de datos en localStorage

### 🚀 Modos de Uso
1. **EXE Portable** - Para compartir con amigos
2. **Servidor Local** - Para desarrollo
3. **Web Deploy** - Para hospedar online (Render, Heroku, etc.)

---

## 🎯 Cómo Usar el EXE

1. Descarga `ImpostorGameWeb.exe`
2. Doble clic en el archivo
3. Se abrirá automáticamente en tu navegador
4. Para cerrar: cierra la ventana de consola

> **Nota:** Algunos antivirus pueden alertar (falso positivo). El archivo es seguro.

---

## 💻 Instalación para Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/jpinxu/impostorGAME.git
cd impostorGAME

# Crear entorno virtual
python -m venv .venv

# Activar entorno (Windows)
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar
python app.py
```

Accede en: `http://localhost:5000`

---

## 🛠️ Stack Tecnológico

- **Backend:** Flask 3.0.0
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Empaquetado:** PyInstaller 6.17.0
- **Servidor Web:** Gunicorn 21.2.0
- **Storage:** Session + LocalStorage

---

## 📁 Estructura del Proyecto

```
impostorGAME/
├── app.py                 # Servidor Flask principal
├── launcher.py            # Entry point para EXE
├── requirements.txt       # Dependencias producción
├── requirements-dev.txt   # Dependencias desarrollo
├── build-exe.ps1          # Script de build automatizado
├── static/
│   ├── script.js         # Lógica del juego
│   └── style.css         # Estilos y animaciones
├── templates/
│   └── index.html        # Interfaz principal
└── docs/
    ├── README.md         # Documentación completa
    ├── QUICKSTART.md     # Guía rápida
    ├── PROJECT_STRUCTURE.md
    └── HELP.md           # Comandos útiles
```

---

## 🐛 Problemas Conocidos

- El EXE puede tardar 5-10 segundos en abrir en primera ejecución
- Algunos antivirus marcan falso positivo (es común con PyInstaller)
- El servidor web debe cerrarse desde la consola (no desde el navegador)

---

## 🔄 Próximas Versiones

- [ ] Sistema de estadísticas
- [ ] Modo de juego por rondas
- [ ] Chat integrado
- [ ] Sonidos y música
- [ ] Más temáticas predefinidas
- [ ] Modo multijugador online

---

## 📝 Licencia

MIT License - Uso libre para proyectos personales y comerciales

---

## 🤝 Contribuir

¿Tienes ideas? ¡Abre un issue o pull request!

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agrega funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 👨‍💻 Autor

**jpinxu** - [GitHub](https://github.com/jpinxu)

---

## ⭐ Dale una estrella si te gustó el proyecto!
