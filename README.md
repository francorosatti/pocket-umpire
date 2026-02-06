# 🎾 Pocket Umpire

A voice-controlled tennis score tracking web app for players and coaches. Keep track of your match scores hands-free using voice commands in English or Spanish.

[English](#english) | [Español](#español)

---

## English

### Features

- **Voice Commands** - Control scoring hands-free using the Web Speech API
  - Works in English and Spanish
  - Pattern matching (no AI required)
  - Simple, reliable voice recognition

- **Professional Tennis Scoring**
  - Points: 0, 15, 30, 40, Deuce, Advantage
  - Games: First to 4 points with 2-point margin
  - Sets: First to 6 games with 2-game margin
  - **Configurable match length**: 1, 3, or 5 sets
  - **Tie-break support**: Automatic tie-break at 6-6 (first to 7 points with 2-point margin)

- **High Visibility Design**
  - High-contrast colors optimized for outdoor use
  - Large, readable score display
  - Mobile-friendly responsive design
  - Works on any modern smartphone or tablet
  - **5 Themes**: Default, Australian Open, French Open, Wimbledon, US Open

- **Manual Fallback**
  - Tap on score display to add points
  - Manual buttons in menu if needed
  - Keyboard shortcuts for desktop use
  - Undo last point feature
  - Quick match reset

### Themes

Choose from 5 beautiful themes inspired by tennis courts around the world:

- **Default** - High contrast green theme for maximum outdoor visibility
- **🇦🇺 Australian Open** - Electric blue inspired by Melbourne Park's blue hard courts
- **🇫🇷 French Open** - Warm terracotta colors matching Roland Garros' iconic clay
- **🇬🇧 Wimbledon** - Classic green and purple honoring the All England Club's grass courts
- **🇺🇸 US Open** - Bold blue and yellow reflecting Flushing Meadows' atmosphere

Themes are saved automatically and persist across sessions.

### Voice Commands

| English | Spanish | Action |
|---------|---------|--------|
| "point one" | "punto uno" | Add point to Player 1 |
| "point two" | "punto dos" | Add point to Player 2 |
| "fifteen zero" | "quince cero" | Set exact score (works with any score) |
| "game" | "juego" | Award game to player one point from winning |
| "undo" | "deshacer" | Undo last point |
| "reset" | "reiniciar" | Reset match |

### Keyboard Shortcuts

- **1** - Point to Player 1
- **2** - Point to Player 2
- **U** or **Ctrl+Z** - Undo last point

### Usage

1. Open `index.html` in a modern web browser (Chrome, Edge, Safari recommended)
2. Click "Start Listening" to enable voice commands
3. Grant microphone permission when prompted
4. Use voice commands or tap buttons to track your match
5. The app will automatically track points, games, and sets

### Browser Support

Voice commands require a browser with Web Speech API support:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (limited support)

Manual button controls work in all modern browsers.

### Installation

1. Clone or download this repository
2. Open `index.html` in your browser
3. No build process or dependencies required!

Or use it online by hosting on any web server or GitHub Pages.

### Technical Details

- **Pure vanilla JavaScript** - No frameworks or dependencies
- **Web Speech API** - Built-in browser speech recognition
- **Responsive CSS** - Mobile-first design with flexbox/grid
- **localStorage** - (Future: persist match history)

### Future Enhancements

- [ ] Match history and statistics
- [ ] Match timer
- [ ] Export match results
- [ ] Progressive Web App (PWA) support
- [ ] Multiple language support expansion
- [ ] Championship tie-break (at 6-6 in final set)

### Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

### License

MIT License - See [LICENSE](LICENSE) file for details.

---

## Español

### Características

- **Comandos de Voz** - Controla el marcador manos libres usando la API Web Speech
  - Funciona en inglés y español
  - Reconocimiento por patrones (no requiere IA)
  - Reconocimiento de voz simple y confiable

- **Puntuación Profesional de Tenis**
  - Puntos: 0, 15, 30, 40, Deuce, Ventaja
  - Juegos: Primero en ganar 4 puntos con margen de 2 puntos
  - Sets: Primero en ganar 6 juegos con margen de 2 juegos
  - **Duración de partido configurable**: 1, 3 o 5 sets
  - **Soporte de tie-break**: Tie-break automático a 6-6 (primero en 7 puntos con margen de 2 puntos)

- **Diseño de Alta Visibilidad**
  - Colores de alto contraste optimizados para uso al aire libre
  - Pantalla de puntuación grande y legible
  - Diseño responsivo compatible con móviles
  - Funciona en cualquier smartphone o tablet moderno
  - **5 Temas**: Por Defecto, Abierto de Australia, Roland Garros, Wimbledon, US Open

- **Botones Manuales de Respaldo**
  - Toca en la pantalla de puntuación para agregar puntos
  - Botones manuales en el menú si es necesario
  - Atajos de teclado para uso en escritorio
  - Función de deshacer último punto
  - Reinicio rápido de partido

### Temas

Elige entre 5 hermosos temas inspirados en canchas de tenis de todo el mundo:

- **Por Defecto** - Tema verde de alto contraste para máxima visibilidad al aire libre
- **🇦🇺 Abierto de Australia** - Azul eléctrico inspirado en las canchas duras azules de Melbourne Park
- **🇫🇷 Roland Garros** - Colores terracota cálidos que coinciden con la icónica arcilla de Roland Garros
- **🇬🇧 Wimbledon** - Verde y púrpura clásicos honrando las canchas de césped del All England Club
- **🇺🇸 US Open** - Azul y amarillo audaces que reflejan la atmósfera de Flushing Meadows

Los temas se guardan automáticamente y persisten entre sesiones.

### Comandos de Voz

| Inglés | Español | Acción |
|--------|---------|--------|
| "point one" | "punto uno" | Agregar punto al Jugador 1 |
| "point two" | "punto dos" | Agregar punto al Jugador 2 |
| "fifteen zero" | "quince cero" | Establecer puntaje exacto (funciona con cualquier puntaje) |
| "game" | "juego" | Otorgar juego al jugador a un punto de ganar |
| "undo" | "deshacer" | Deshacer último punto |
| "reset" | "reiniciar" | Reiniciar partido |

### Atajos de Teclado

- **1** - Punto para el Jugador 1
- **2** - Punto para el Jugador 2
- **U** o **Ctrl+Z** - Deshacer último punto

### Uso

1. Abre `index.html` en un navegador web moderno (Chrome, Edge, Safari recomendados)
2. Haz clic en "Start Listening" para habilitar comandos de voz
3. Otorga permiso de micrófono cuando se solicite
4. Usa comandos de voz o toca los botones para rastrear tu partido
5. La aplicación rastreará automáticamente puntos, juegos y sets

### Compatibilidad de Navegadores

Los comandos de voz requieren un navegador con soporte de Web Speech API:
- ✅ Chrome/Edge (Escritorio y Móvil)
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (soporte limitado)

Los controles de botones manuales funcionan en todos los navegadores modernos.

### Instalación

1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador
3. ¡No se requiere proceso de compilación ni dependencias!

O úsalo en línea alojándolo en cualquier servidor web o GitHub Pages.

### Detalles Técnicos

- **JavaScript vanilla puro** - Sin frameworks ni dependencias
- **Web Speech API** - Reconocimiento de voz integrado en el navegador
- **CSS responsivo** - Diseño mobile-first con flexbox/grid
- **localStorage** - (Futuro: persistir historial de partidos)

### Mejoras Futuras

- [ ] Historial de partidos y estadísticas
- [ ] Temporizador de partido
- [ ] Exportar resultados de partidos
- [ ] Soporte para Progressive Web App (PWA)
- [ ] Expansión de soporte multiidioma
- [ ] Tie-break de campeonato (a 6-6 en el set final)

### Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Reportar errores
- Sugerir características
- Enviar pull requests

### Licencia

Licencia MIT - Ver archivo [LICENSE](LICENSE) para detalles.

---

Made with ❤️ for tennis lovers | Hecho con ❤️ para los amantes del tenis
