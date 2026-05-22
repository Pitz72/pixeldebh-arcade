# Changelog

Tutti i cambiamenti significativi a questo progetto sono documentati in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [1.1.0] - 2026-05-22

### Fixed — Criticità GRAVISSIME

- **Memory leak da timer infiniti in `GameScene`**
  - I timer `loop: true` per nemici BUG/HATER/LAG (`client/src/game/scenes/GameScene.ts`) restavano attivi anche dopo la distruzione del nemico o il cambio di livello, causando crescita progressiva della RAM e accumulo di closure.
  - Introdotto tracking per-nemico (`enemyTimers: Map<Sprite, TimerEvent[]>`) e cancellazione automatica dei timer al `DESTROY` dello sprite.
  - Aggiunto handler `SHUTDOWN`/`DESTROY` di scena che esegue `tweens.killAll()` e libera tutti i timer attivi, evitando l'accumulo di tween `repeat: -1` (collectibles fluttuanti, pattern GLITCH/DRM, rotazione power-up) ad ogni transizione di livello.
  - Hardening minore: i `delayedCall` annidati ora verificano `enemy.active` / `projectile.active` prima di operare.

- **Variabili d'ambiente non configurate**
  - `client/index.html` referenziava `%VITE_APP_LOGO%`, `%VITE_APP_TITLE%`, `%VITE_ANALYTICS_ENDPOINT%`, `%VITE_ANALYTICS_WEBSITE_ID%` ma il progetto non conteneva alcun `.env` né `.env.example`: i placeholder restavano letterali nel build di produzione e lo script analytics generava una richiesta a un URL malformato.
  - Aggiunto `.env.example` documentato con `VITE_APP_TITLE` e `VITE_APP_LOGO`.
  - Aggiunto `.env` locale (già coperto da `.gitignore`).
  - Rimosso lo `<script>` Umami con placeholder non risolti da `client/index.html`. Il tracking può essere reintrodotto in modo opzionale tramite plugin Vite quando sarà presente una vera configurazione analytics.

### Notes

- Branch primario del repository rinominato da `master` a `main`.
- Pubblicazione iniziale del repository su GitHub: `Pitz72/pixeldebh-arcade`.

## [1.0.0] - 2025-11-02

- Prima release pubblica: 9 livelli (ere del videogioco), 5 tipi di nemici, 4 power-up, sistema di high score su `localStorage`, sprite procedurali via `SpriteGenerator`, audio Web Audio API.
