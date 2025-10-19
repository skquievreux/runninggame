# 3D Endless Runner Game 🏃‍♂️

Ein modernes 3D Endless Runner Spiel mit Three.js, das die Herausforderungen eines unendlichen Laufs mit beeindruckenden visuellen Effekten verbindet.

## ✨ Features

- **3D-Grafik**: Vollständig in Three.js implementiert mit Schatten und Beleuchtung
- **Modulare Architektur**: ES6-Module für saubere Code-Organisation
- **Partikelsystem**: Explosive Effekte bei Kollisionen
- **Dynamische Umgebung**: Berge, Wolken und animierte Hintergründe
- **Responsive Steuerung**: Tastatur- und Touch-Unterstützung
- **Score-System**: Punkte sammeln und Leben verwalten

## 🚀 Lokale Entwicklung

### Voraussetzungen

- Moderner Webbrowser mit ES6-Modul-Unterstützung
- Python 3.x (für lokalen Server)

### Installation & Start

1. **Repository klonen:**
   ```bash
   git clone <repository-url>
   cd endless-runner-game
   ```

2. **Lokalen Server starten:**
   ```bash
   npm start
   # oder direkt mit Python:
   python -m http.server 8000
   ```

3. **Spiel öffnen:**
   Öffne `http://localhost:8000` in deinem Browser

## 📦 Deployment

### Automatisiertes Deployment (empfohlen)

```bash
# Vollständiges Deployment mit Tests
node deploy.js

# Oder manuell:
npm run build    # Build testen
npm run deploy   # Auf Vercel deployen
```

### Manuelles Deployment auf Vercel

1. **Vercel CLI installieren:**
   ```bash
   npm install -g vercel
   ```

2. **Projekt deployen:**
   ```bash
   vercel
   # Für Produktion:
   vercel --prod
   ```

3. **Domain konfigurieren** (optional):
   - Gehe zu deinem Vercel-Dashboard
   - Füge eine Custom Domain hinzu

## 🏗️ Projektstruktur

```
endless-runner-game/
├── index.html              # Haupt-HTML-Datei
├── js/                     # ES6-Module
│   ├── main.js            # Anwendungseinstiegspunkt
│   ├── Game.js            # Spiel-Logik & Zustand
│   ├── Scene.js           # Three.js Szene & Renderer
│   ├── Player.js          # Spieler-Charakter
│   ├── Environment.js     # Hintergrund & Umgebung
│   ├── Obstacles.js       # Hindernisse & Power-ups
│   ├── Particles.js       # Partikelsystem
│   ├── UI.js              # Benutzeroberfläche
│   └── Utils.js           # Hilfsfunktionen
├── package.json           # NPM-Konfiguration
├── vercel.json           # Vercel-Deployment-Konfiguration
├── deploy.js             # Automatisiertes Deployment-Skript
└── README.md             # Diese Datei
```

## 🎮 Spielsteuerung

- **Leertaste / Mausklick**: Springen
- **R**: Neustart nach Game Over

## 🛠️ Technologien

- **Three.js**: 3D-Grafik-Engine
- **ES6-Module**: Moderne JavaScript-Modularisierung
- **Vercel**: Hosting & Deployment
- **HTML5 Canvas**: Rendering

## 📈 Entwicklung

### Neue Features hinzufügen

1. Erstelle ein neues Modul in `js/`
2. Importiere es in `main.js`
3. Aktualisiere die Dokumentation

### Code-Qualität

- Verwende ESLint für Code-Qualität
- Führe Tests vor jedem Commit durch
- Halte die modulare Struktur bei

## 🤝 Mitwirken

1. Fork das Projekt
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## 🙏 Danksagungen

- Three.js Community für die hervorragende 3D-Bibliothek
- Vercel für das großartige Hosting