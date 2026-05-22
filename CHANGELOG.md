# Changelog

Tutti i cambiamenti significativi a questo progetto sono documentati in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [1.3.0] - 2026-05-22

### Changed — Criticità MEDIE (bucket A: hardening dati e audio)

- **HighScoreManager — validazione Zod + gestione quota**
  - Tutti i dati letti da `localStorage` passano da `HighScoreListSchema` (Zod): `score` intero 0–9_999_999, `level` 1–99, `playerName` 1–32 char, `date` stringa.
  - Se il JSON è corrotto o lo schema fallisce, lo storage viene azzerato in modo controllato (`clearHighScores`) e si ritorna lista vuota anziché propagare oggetti malformati al gioco.
  - `saveScore` distingue esplicitamente `QuotaExceededError` da errori generici nei log, in modo che un utente con storage pieno o disabilitato sia visibile in console.
  - Esportato il tipo `HighScore` (inferito dallo schema) per riuso lato UI.

- **SoundManager — AudioContext singleton + fallback esplicito**
  - L'`AudioContext` è ora un singleton statico (`SoundManager.sharedContext`) condiviso fra le quattro scene del gioco (Intro/Menu/Game/GameOver). Prima ogni `new SoundManager()` in `init()` di scena allocava un context nuovo: risorsa costosa, soggetta al limite di context per tab.
  - L'inizializzazione viene tentata una sola volta (`initAttempted`); se Web Audio non è disponibile (vecchi browser, contesti embedded) viene loggato un warning **una sola volta** e il gioco prosegue in modalità muta in modo deterministico anziché silenziosamente.
  - Rimosso `(window as any).webkitAudioContext`: tipizzato con `WebkitWindow & { webkitAudioContext?: typeof AudioContext }`.

## [1.2.0] - 2026-05-22

### Fixed — Criticità GRAVI

- **Type safety nelle callback fisiche di Phaser**
  - Sostituito `any` con il tipo ufficiale `Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile` (alias `ArcadeColliderObject`) nei callback di collisione `collectItem`, `hitEnemy`, `collectPowerUp` in `client/src/game/scenes/GameScene.ts`.
  - Tipizzato anche `updateEnemies` (iterazione su `enemies.children.entries`) con `Phaser.GameObjects.GameObject`.
  - `tsc --strict --noEmit` ora copre i punti di collisione critici.

- **Server Express senza security headers**
  - Aggiunto middleware `securityHeaders` in `server/index.ts` (nessuna nuova dipendenza) che imposta:
    - `X-Frame-Options: DENY` (anti-clickjacking)
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` restrittivo (camera/microphone/geolocation/payment disabilitati)
    - `Content-Security-Policy` coerente con i Google Fonts realmente usati (`fonts.googleapis.com`, `fonts.gstatic.com`)
  - Disabilitato `X-Powered-By` per ridurre il fingerprinting.

- **CI/CD assente**
  - Aggiunto workflow `.github/workflows/ci.yml`: su `push`/`pull_request` verso `main` esegue `pnpm install --frozen-lockfile`, `pnpm check` e `pnpm build` su Ubuntu + Node 22 + pnpm 10.4.1.

- **Patch wouter sospetta rimossa**
  - Rimossa la directory `patches/` e l'entry `pnpm.patchedDependencies` da `package.json`. La patch iniettava `window.__WOUTER_ROUTES__` (artefatto di un tool di build esterno) ed era inoltre incoerente con la versione `wouter@3.3.5` realmente installata: superficie d'attacco eliminata.

### Notes

- I tween con `repeat: -1` erano già stati indirizzati in v1.1.0 dal cleanup `SHUTDOWN`/`DESTROY` di scena (`tweens.killAll()`).

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
