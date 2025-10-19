# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-19

### ✨ Added
- **Modulare Architektur**: Vollständige Refaktorierung der monolithischen `script.js` (795 Zeilen) in 9 separate ES6-Module:
  - `Game.js`: Kernspiel-Logik und Zustandsverwaltung
  - `Scene.js`: Three.js Szene, Kamera, Renderer und Beleuchtung
  - `Player.js`: Spieler-Charakter und Bewegungssteuerung
  - `Environment.js`: Hintergrund, Boden und Wolken mit Animationen
  - `Obstacles.js`: Hindernisse und Power-ups mit vertikaler Bewegung
  - `Particles.js`: Vollständiges Partikelsystem für Effekte
  - `UI.js`: Score-Anzeige und Game-Over-Bildschirm
  - `Utils.js`: Hilfsfunktionen, Kollisionserkennung und Input-Management
  - `main.js`: Anwendungseinstiegspunkt und Game-Loop

- **Deployment-Infrastruktur**:
  - `package.json`: NPM-Konfiguration für statische Websites
  - `vercel.json`: Optimierte Vercel-Konfiguration mit Sicherheits-Headern
  - `deploy.js`: Automatisiertes Deployment-Skript mit Pre-Deployment-Tests

- **Verbesserte Code-Qualität**:
  - ES6-Module für saubere Abhängigkeitsverwaltung
  - Klassen-basierte Architektur für bessere Kapselung
  - Separation of Concerns für einfachere Wartung
  - Null-Pointer-Sicherheit in Obstacle-Generierung

### 🔧 Changed
- **Architektur**: Von monolithischer Struktur zu modularer ES6-Architektur
- **Build-System**: Von direkter HTML-Datei zu NPM-gestütztem Workflow
- **Deployment**: Von manuellem Hosting zu automatisiertem Vercel-Deployment

### 🐛 Fixed
- Null-Pointer-Fehler in `Obstacles.js` bei der Positionierung von Hindernissen
- Sicherheitslücken durch Hinzufügung von HTTP-Sicherheits-Headern

### 📚 Documentation
- Vollständige Überarbeitung der `README.md` mit:
  - Detaillierte Installations- und Deployment-Anweisungen
  - Projektstruktur-Dokumentation
  - Technologie-Stack-Beschreibung
  - Mitwirkungsrichtlinien

## [1.0.0] - 2025-10-19

### ✨ Added
- Erstes Release des 3D Endless Runner Spiels
- Grundlegende Spielmechanik mit Three.js
- Spieler-Charakter mit farbigen Würfelseiten
- Automatische Hindernisgenerierung
- Score-System und Leben-Verwaltung
- Grundlegende 3D-Umgebung mit Bergen und Wolken
- Partikeleffekte bei Kollisionen
- Responsive Steuerung (Tastatur und Touch)

### 🛠️ Technical
- Three.js für 3D-Rendering
- HTML5 Canvas für Performance
- Modulare JavaScript-Architektur (bereits für Erweiterungen vorbereitet)