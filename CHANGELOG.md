# Changelog

Tutti i cambiamenti significativi a questo progetto sono documentati in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [1.8.0] - 2026-05-23

### Added — E2E Playwright (smoke suite)

- **Setup Playwright su Chromium only**
  - Nuova devDep `@playwright/test`; browser Chromium scaricato via `playwright install`.
  - `playwright.config.ts`: `webServer` avvia `pnpm dev` su `http://localhost:3000` (porta reale di Vite, non 5173); `reuseExistingServer` in locale, `retries: 2` in CI.
  - **Target unico Chromium**: scelta motivata dal fatto che il gioco è destinato a diventare app desktop confezionata con **Tauri** (WebView2 su Windows è Chromium-based). Testare Firefox/WebKit sarebbe lavoro sprecato.

- **Smoke test suite `e2e/smoke.spec.ts`** — 4 test, ~8s totali
  - Canvas Phaser montato in `#game-container` con dimensioni > 0.
  - Skip intro con SPACE non genera errori `pageerror` né `console.error`.
  - Input frecce direzionali (Right/Down/Left/Up) non crasha il game loop.
  - localStorage `pixeldebh_highscores`: scrittura via `page.evaluate` + reload + rilettura → dati persistono e schema Zod resta valido.

- **Integrazione CI** (`.github/workflows/ci.yml`)
  - Cache `~/.cache/ms-playwright` su `hashFiles('pnpm-lock.yaml')` per evitare il download dei browser ad ogni run.
  - `pnpm exec playwright install --with-deps chromium` solo dopo cache miss.
  - Nuovo step `pnpm test:e2e` in coda alla pipeline (dopo build).

- **Script package.json**
  - `test:e2e` → `playwright test`
  - `test:e2e:ui` → `playwright test --ui` (debugging locale)

- **`.gitignore`**
  - Esclusi `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`.

### Notes

- Le E2E **sbloccano il prossimo refactor**: split di `GameScene` (803 righe) in `entities/Player.ts` + `entities/EnemyManager.ts`, finora deferito perché il game loop non aveva smoke test automatico.
- Nessuna modifica al codice di gioco: i test sono black-box (canvas presence, keyboard input, localStorage roundtrip).

## [1.7.0] - 2026-05-23

### Changed — Hygiene release

- **Toolchain pinning**
  - Aggiunto `engines: { node: ">=22", pnpm: ">=10" }` in `package.json`.
  - Aggiunto `.nvmrc` (Node 22): allinea dev locale e CI.
  - `@types/node` ridimensionato da `^24.7.0` a `^22.10.0` per matchare la versione di Node effettivamente usata in CI.

- **CI: security audit**
  - Aggiunto step `pnpm audit --prod --audit-level=high` in `.github/workflows/ci.yml` (non bloccante via `continue-on-error: true`): nuove vulnerabilità note finiscono nel log della build senza fallire la pipeline finché non vengono valutate.

- **Repository hygiene**
  - Rimosso remote orfano `manus-s3` (s3://vida-prod-gitrepo/...) dal clone locale. `origin` è ora l'unico remote ed è GitHub.
  - Date in `CHANGELOG.md` corrette da `2026-05-22` a `2026-05-23` (l'intera serie 1.1.0–1.6.0 era stata pushata nell'arco della stessa sessione del 23/05).

- **`todo.md` riconciliato col codice reale**
  - Risolta incoerenza: "Sistema salvataggio punteggio locale" e "Classifica high scores" erano segnati `[ ]` mentre erano implementati da tempo (e hardened con Zod in v1.3.0).
  - Rimosso riferimento a `ANALISI_CRITICA.md` (file mai esistito nel repo).
  - Sezione finale "Roadmap aperta" separa esplicitamente feature future dal debito chiuso, in modo che un nuovo contributore veda solo task realmente aperti.

## [1.6.0] - 2026-05-23

### Changed — Criticità LIEVI (polish: dedup sprite + docs allineate)

- **SpriteGenerator deduplicato**
  - Introdotto helper privato `SpriteGenerator.withTexture(scene, key, width, height, drawFn)` che incapsula il pattern ripetuto `add.graphics() → draw → generateTexture(key, w, h) → destroy()`.
  - 15 occorrenze del pattern sostituite (player, 5 nemici, 5 collectibles, 4 power-up): ~75 righe di boilerplate rimosse, ogni sprite ora dichiara solo *cosa* disegna, non *come* registrare la texture.
  - Comportamento runtime identico; nessun cambio alle texture key esposte alle scene.

- **README.md allineato al codice reale**
  - Sezione "Script Disponibili": rimosso `pnpm type-check` (mai esistito → ora correttamente documentato come `pnpm check`); aggiunti `pnpm test`, `pnpm test:watch`, `pnpm start`, `pnpm format`.
  - Sezione "Struttura del Progetto": riscritta da zero (la versione precedente citava ancora `components/ui/` shadcn rimosso in v1.4.0, e file storici tipo `ANALISI_CRITICA.md`). Ora riflette davvero il layout corrente, inclusi `game/ui/HUD.ts`, i file `.test.ts`, `server/`, `eslint.config.js`, `vitest.config.ts`.
  - Sezione "Testing": rimossi script inesistenti `test:coverage` / `test:e2e`, sostituiti con la descrizione effettiva dello stato (Vitest + jsdom, e2e marcata come future work in CHANGELOG).

- **CONTRIBUTING.md allineato**
  - Rimosso `pnpm format:check` (non esisteva).
  - Rimosso `pnpm test:coverage` (non esiste), aggiunta nota su come abilitarlo (`@vitest/coverage-v8`) quando servirà.

### Notes — decisioni esplicite

- **Mix lingue IT/EN nei commenti**: lasciato invariato. Il progetto è italiano (UI, dialoghi, nomi di nemici come "Hater"/"DRM"/"Glitch" sono volutamente narrativi), i commenti in italiano sono coerenti col target dell'autore. Non è un bug da risolvere ma una scelta editoriale.
- **ADR (Architecture Decision Records)**: non introdotti. Per un progetto solo-developer con CHANGELOG già dettagliato, gli ADR sarebbero overhead di processo senza beneficio reale. Le decisioni architetturali significative restano tracciate nei changelog di versione (es. v1.4.0 per la rimozione di shadcn, v1.5.0 per il deferimento del refactor di GameScene).
- **Hardcoded UI strings in GameScene**: parzialmente affrontato in v1.5.0 con `HUD.ts` (costanti di stile estratte come `TITLE_STYLE`/`COUNTER_STYLE`). Il residuo (testi di livello completato, vittoria, pause menu) è confinato in 3 punti — non vale l'astrazione.

## [1.5.0] - 2026-05-23

### Changed — Criticità MEDIE (bucket C: estrazione HUD + test suite)

- **HUD estratto da GameScene** (`client/src/game/ui/HUD.ts`)
  - Spostati i 4 `Phaser.GameObjects.Text` (score, lives, level, collectibles) e i relativi updater in una classe dedicata con API minimale: `setScore(n)`, `setLives(n)`, `setCollectiblesRemaining(n)`.
  - `GameScene` non manipola più direttamente nodi visuali HUD; il metodo `updateLivesDisplay` è stato rimosso.
  - GameScene: 815 → 803 righe (la maggior parte del codice rimosso era boilerplate di stile); separation of concerns chiara fra logica di gameplay e presentazione HUD.
  - L'estrazione completa di Player ed EnemyManager **non è stata fatta in questo bucket**: vedi note finali.

- **Test suite con Vitest** (`client/src/**/*.test.ts`)
  - Nuovo `vitest.config.ts` con `environment: 'jsdom'`, alias `@`/`@shared` allineati a Vite.
  - `HighScoreManager.test.ts` — 13 test:
    - roundtrip save→retrieve, default `playerName`
    - ordinamento decrescente
    - troncamento a `MAX_SCORES = 10`
    - `isHighScore` (sotto-piena e piena)
    - `getTopScore` (vuoto + popolato)
    - recovery su JSON corrotto, schema invalido, valori out-of-range (verifica anche reset effettivo dello storage)
    - `clearHighScores`
    - `QuotaExceededError` → `saveScore` ritorna `false`
  - `LevelData.test.ts` — 10 test:
    - `getLevelConfig` clamp basso/alto, level 1-based, mai null
    - `getEraName` mapping completo + fallback
    - dataset `LEVELS`: ≥9 livelli, numeri consecutivi, `powerUpChance ∈ [0,1]`, `enemySpeedMultiplier > 0`, almeno un collectible per livello
  - **23/23 test passano** in ~13ms (jsdom).
  - Aggiunti script `pnpm test` (run one-shot) e `pnpm test:watch`.
  - Aggiunto step "Unit tests" in `.github/workflows/ci.yml` fra Lint e Build.
  - Dipendenza nuova: `jsdom ^25` (devDep, necessaria per `Storage`/`DOMException`).

### Notes / Debito tecnico residuo

- **Split completo di GameScene (Player / EnemyManager) deferred.**
  Il refactor avrebbe toccato il loop di gioco (movimento, AI nemici, gestione timer/tween) che era già stato hardened in v1.1.0 ma resta privo di test di integrazione automatici. Procedere senza la possibilità di smoke-test manuale in browser su tutti i 9 livelli + 5 tipi di nemici sarebbe stato un rischio sproporzionato rispetto al beneficio (la criticità è "manutenibilità", non "correttezza"). Marcato come future work in un bucket dedicato quando ci sarà copertura E2E (Playwright).

## [1.4.0] - 2026-05-23

### Changed — Criticità MEDIE (bucket B: slim bundle + lint)

- **Rimossi 60+ componenti shadcn/ui inutilizzati**
  - Cancellata `client/src/components/ui/` interamente (chart, sidebar, carousel, calendar, table, command, drawer, sheet, form, ecc.): nessuno era importato dal runtime del game.
  - Cancellati `client/src/hooks/`, `client/src/lib/utils.ts`, `client/src/components/ManusDialog.tsx`, `client/src/const.ts`, `components.json` (configurazione shadcn-cli) — tutti consumati solo dai componenti UI rimossi o artefatti di tooling esterno.
  - Riscritti senza shadcn:
    - `App.tsx`: rimossi `Toaster` (sonner) e `TooltipProvider`, mantenuti `ErrorBoundary` + `ThemeProvider` + Router.
    - `pages/NotFound.tsx`: Tailwind puro, niente `Card`/`Button`/`lucide-react`.
    - `components/ErrorBoundary.tsx`: rimossi `cn`, `lucide-react` (AlertTriangle/RotateCcw), classi colorate inline.

- **Dipendenze rimosse da `package.json` (24 totali)**
  - Radix UI (28 pacchetti `@radix-ui/*`), `recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `react-day-picker`, `framer-motion`, `react-hook-form`, `react-resizable-panels`, `sonner`, `streamdown`, `input-otp`, `next-themes`, `lucide-react`, `@tanstack/react-query`, `axios`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, `tw-animate-css`, `@tailwindcss/typography`, `nanoid`, `add`, `pnpm` (devDep), `tsx` (devDep), `autoprefixer` (devDep), `@builder.io/vite-plugin-jsx-loc`, `vite-plugin-manus-runtime`.
  - Runtime ridotto a: `phaser`, `react`, `react-dom`, `express`, `wouter`, `zod`.

- **Bundle size dopo cleanup** (`pnpm build`):
  - JS: **1783 kB → 1466 kB** (-317 kB raw, gzip 434 → 410 kB)
  - CSS: **112 kB → 17 kB** (-77%, gzip 17.5 → 4.0 kB)
  - HTML inline asset (font preload + dati): 365 kB → 0 (era artefatto di manus-runtime, ora niente)
  - Nessuna funzionalita' del gioco intaccata; il grosso del JS residuo è Phaser stesso.

- **`vite.config.ts` ripulito**
  - Rimossi `@builder.io/vite-plugin-jsx-loc` e `vite-plugin-manus-runtime` (entrambi tooling esterno proprietario di un IDE di terze parti).
  - Rimossi gli `allowedHosts` `.manus*.computer` dalla config server (esponevano l'app a domini di tooling esterno).
  - Rimosso alias `@assets` non utilizzato.

- **ESLint flat config** (nuovo `eslint.config.js`)
  - `@eslint/js` + `typescript-eslint` + `eslint-plugin-react-hooks` (flat config, ESLint 9).
  - Regole attive: `react-hooks/rules-of-hooks` (error), `exhaustive-deps` (warn), `no-explicit-any` (warn), `no-unused-vars` con escape `^_` (warn), `no-empty` con `allowEmptyCatch` (error).
  - Script `pnpm lint` e step "Lint" aggiunto a `.github/workflows/ci.yml` fra `check` e `build`.
  - Pulite 2 variabili inutilizzate (`spacing` in `IntroScene`, `title` in `MenuScene`); 0 errori, 0 warning sul codice corrente.

## [1.3.0] - 2026-05-23

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

## [1.2.0] - 2026-05-23

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

## [1.1.0] - 2026-05-23

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
