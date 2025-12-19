# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

## [1.1.0] - 2025-12-18

### Agregado
- ✨ **League of Legends expandido**: Ahora incluye los 160+ campeones completos (Aatrox a Zyra)
- 🎮 **Selección automática del primer jugador**: 
  - El juego selecciona aleatoriamente quién da la primera pista
  - Probabilidad ponderada: impostores tienen 50% menos probabilidad de ser elegidos
  - Se muestra en pantalla final antes de la discusión
- 🎨 **Mejoras visuales**: 
  - Nuevo componente visual para mostrar el primer jugador
  - Estilo con gradiente púrpura y efecto de brillo
  - Animaciones mejoradas en pantalla final

### Modificado
- Actualizado el backend para calcular y devolver el primer jugador
- Mejorada la lógica de ponderación de probabilidades
- Optimizada la pantalla final con nueva información

### Técnico
- Actualizado `app.py` con lista completa de campeones de LoL
- Agregada lógica de selección ponderada en `startGame()`
- Nuevo endpoint incluye `first_player` en respuesta
- Nuevos estilos CSS: `.first-player-container`, `.first-player-label`, `.first-player-name`
- Compatibilidad completa con versiones web y APK Android

---

## [1.0.0] - 2025-12-15

### Primera versión estable

- 12 temáticas predefinidas (General, Chilenas, Comida, Videojuegos, Anime, Películas, Música, Deportes, Animales, Tecnología, League of Legends, Clash Royale)
- Sistema de temáticas personalizadas
- Selección aleatoria de temática
- Captura de fotos de jugadores vía webcam
- Múltiples impostores configurables (1 a N-2)
- Interfaz moderna con animaciones CSS
- Diseño responsive
- Persistencia local de datos
- Tres versiones disponibles: EXE, Web desplegable, APK Android
- Branding personalizado: imposWHO con ícono de "?"
