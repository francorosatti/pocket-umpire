# Development Guide - Pocket Umpire

## Quick Start

This is a pure vanilla JavaScript project with **no build process required**! Just open `index.html` in your browser and you're ready to go.

## Prerequisites

- A modern web browser (Chrome, Edge, Safari, or Firefox)
- That's it! No Node.js, npm, or build tools needed.

## Running Locally

### Option 1: Direct File Access (Simplest)
```bash
# Clone the repository
git clone https://github.com/francorosatti/pocket-umpire.git
cd pocket-umpire

# Open in your default browser (macOS)
open index.html

# Or (Linux)
xdg-open index.html

# Or (Windows)
start index.html
```

### Option 2: Local Web Server (Recommended for Development)

While the app works by opening `index.html` directly, using a local server is recommended for development:

#### Using Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then open http://localhost:8000
```

#### Using Node.js (if you have it):
```bash
# Install a simple server globally
npm install -g http-server

# Run from project directory
http-server -p 8000

# Or use npx (no installation needed)
npx http-server -p 8000
```

#### Using PHP:
```bash
php -S localhost:8000
```

## Project Structure

```
pocket-umpire/
├── index.html          # Main HTML file
├── style.css           # All styles including themes and responsive design
├── app.js              # Complete application logic
├── README.md           # User documentation
├── DEVELOPMENT.md      # This file
└── LICENSE             # MIT License
```

### Key Features Implementation

- **No Build Process**: Pure vanilla JavaScript, CSS, and HTML
- **No Dependencies**: Everything runs in the browser
- **No Package Manager**: No npm, yarn, or other package managers needed
- **Local Storage**: Player names and theme preferences persist automatically
- **Web Speech API**: Built-in browser feature for voice recognition

## Development

### Making Changes

1. **HTML (`index.html`)**
   - Main structure and modals
   - Set score display (supports 1-5 sets)
   - Voice control button
   - Menu panel with controls

2. **CSS (`style.css`)**
   - 5 Grand Slam themes (lines 8-81)
   - Responsive design with landscape mode support
   - High-contrast colors for outdoor visibility
   - Touch-friendly button sizing (48px minimum)

3. **JavaScript (`app.js`)**
   - `TennisMatch` class handles all game logic
   - Voice recognition with Spanish/English support
   - Tie-break logic (at 6-6)
   - Undo functionality with state history
   - Theme management with localStorage

### Testing Voice Commands

Voice recognition requires HTTPS (except for localhost). If testing voice commands:

1. **On localhost**: Works automatically
2. **On a deployed site**: Must use HTTPS

Supported browsers:
- ✅ Chrome/Edge (Desktop & Mobile) - Best support
- ✅ Safari (iOS 14.5+) - Good support
- ⚠️ Firefox - Limited support

### Debugging

Open browser DevTools (F12) to see console logs:
- Voice recognition status
- Commands received
- Score updates
- State changes

The match object is available globally:
```javascript
// In browser console
window.tennisMatch.score
window.tennisMatch.tiebreak
window.tennisMatch.totalSets
```

## Deployment

### GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from main branch
   - Directory: / (root)
   - Save

2. **Your site will be live at**:
   ```
   https://[username].github.io/pocket-umpire/
   ```

### Netlify

1. **Drag and Drop**:
   - Go to [netlify.com](https://www.netlify.com/)
   - Drag the entire folder to Netlify Drop
   - Done!

2. **From Git**:
   ```bash
   # No build command needed!
   Build command: [leave empty]
   Publish directory: . [root]
   ```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# No configuration needed!
```

### Any Static Host

Since there's no build process, you can deploy to:
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Your own web server

Just upload all files to the hosting directory.

## Adding New Features

### Adding a New Theme

1. **Define color variables in `style.css`**:
```css
body.theme-your-theme {
    --bg-primary: #your-color;
    --bg-secondary: #your-color;
    --accent-green: #your-color;
    /* ... other variables ... */
}
```

2. **Add theme button in `index.html`**:
```html
<button class="btn theme-btn" data-theme="your-theme">
    <span class="theme-name">🎾 Your Theme</span>
    <span class="theme-desc">Description</span>
</button>
```

3. **Update theme removal in `app.js`**:
```javascript
document.body.classList.remove(
    'theme-australian-open',
    'theme-french-open',
    'theme-wimbledon',
    'theme-us-open',
    'theme-your-theme'  // Add here
);
```

### Adding a New Voice Command

1. **Add pattern in `processVoiceCommand()` method**:
```javascript
else if (normalized.match(/your-pattern|alternative/)) {
    this.yourMethod();
    this.showFeedback('✓ Your action', 'success');
}
```

2. **Implement your method**:
```javascript
yourMethod() {
    // Your logic here
}
```

3. **Update help section in `index.html`**

4. **Update README.md**

## Performance Considerations

- **No bundling needed**: Browsers cache individual files efficiently
- **No minification needed**: Files are already small (< 100KB total)
- **Fast load times**: No JavaScript framework overhead
- **Minimal dependencies**: Only Web Speech API (browser built-in)

## Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Core App | ✅ | ✅ | ✅ | ✅ |
| Voice Commands | ✅ | ✅ | ⚠️ | ✅ |
| Touch Interaction | ✅ | ✅ | ✅ | ✅ |
| Themes | ✅ | ✅ | ✅ | ✅ |

## Contributing

1. Fork the repository
2. Make your changes
3. Test on multiple browsers/devices
4. Submit a pull request

### Code Style

- Use consistent indentation (4 spaces)
- Keep functions focused and small
- Comment complex logic
- Use descriptive variable names
- Follow existing patterns

## Troubleshooting

### Voice Recognition Not Working

1. **Check HTTPS**: Voice recognition requires HTTPS (except localhost)
2. **Check permissions**: Browser must have microphone access
3. **Check browser**: Chrome/Edge work best
4. **Check language**: Set to Spanish (es-ES) by default

### Score Display Issues

1. **Clear localStorage**: `localStorage.clear()` in console
2. **Hard refresh**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
3. **Check console**: F12 → Console for errors

### Responsive Layout Issues

1. **Test on actual device**: Mobile browsers differ from desktop simulation
2. **Check viewport**: Ensure viewport meta tag is present
3. **Test landscape**: Specific styles for landscape orientation

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/francorosatti/pocket-umpire/issues)
- 💡 Feature requests: [GitHub Issues](https://github.com/francorosatti/pocket-umpire/issues)
- 📖 Documentation: [README.md](README.md)

---

Made with ❤️ for tennis lovers | Hecho con ❤️ para los amantes del tenis
