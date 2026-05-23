# PixelDebh's Retro Rescue - TODO

## Core Gameplay
- [x] Integrazione Phaser 3 framework
- [x] Setup canvas di gioco e configurazione base
- [x] Implementazione movimento protagonista (4 direzioni)
- [x] Sistema di collisione
- [x] Meccanica raccolta oggetti
- [x] Sistema punteggio

## Personaggi e Nemici
- [x] Sprite e animazioni PixelDebh (protagonista)
- [x] Nemico: Glitch (movimento prevedibile)
- [x] Nemico: Bug (insegue il giocatore)
- [x] Nemico: Lag (movimento a scatti)
- [x] Nemico: DRM-one (invincibile, movimento lento)
- [x] Nemico: Hater (lancia proiettili rallentanti)
- [x] AI e pattern di movimento nemici

## Oggetti da Collezione
- [x] Floppy disk (oggetto standard)
- [x] Cartucce NES/SNES/Mega Drive (oggetti standard)
- [x] CD PlayStation/Saturn (oggetti standard)
- [x] Commodore 64/Amiga (oggetti rari)
- [x] Console Atari/Game Boy/Neo Geo (oggetti rari)
- [x] Sistema spawn oggetti nei livelli

## Power-ups
- [x] Tazzina di Caffè (velocità aumentata)
- [x] Joystick d'Oro (invincibilità + debug nemici)
- [x] Bolla Retrò (scudo protettivo)
- [x] Tubo Catodico (stordimento nemici)
- [x] Sistema attivazione e timer power-ups

## Livelli e Progressione
- [x] Era 8-Bit: design livelli e grafica
- [x] Era 16-Bit: design livelli e grafica
- [x] Era 32/64-Bit: design livelli e grafica
- [ ] Livelli Bonus (raccolta a tempo)
- [x] Sistema portale tra livelli
- [x] Progressione difficoltà

## UI e HUD
- [x] Visualizzazione punteggio
- [x] Indicatore vite/salute
- [x] Contatore oggetti rimanenti
- [x] Menu principale
- [x] Schermata game over
- [x] Schermata vittoria livello
- [x] Pausa gioco
- [ ] Controlli touch per mobile

## Asset Grafici
- [x] Sprite PixelDebh (basato su immagine fornita)
- [x] Sprite nemici Glitch Army
- [x] Sprite oggetti da collezione
- [x] Sprite power-ups
- [x] Tileset Era 8-Bit
- [x] Tileset Era 16-Bit
- [x] Tileset Era 32/64-Bit
- [x] Elementi UI (icone, font pixel)

## Asset Audio
- [ ] Musica di sottofondo Era 8-Bit
- [ ] Musica di sottofondo Era 16-Bit
- [ ] Musica di sottofondo Era 32/64-Bit
- [x] SFX: raccolta oggetto
- [x] SFX: power-up attivato
- [x] SFX: morte/game over
- [x] SFX: completamento livello
- [x] SFX: eliminazione nemici
- [x] SFX: menu/selezione

## Ottimizzazione e Polish
- [x] Responsive design (desktop e mobile)
- [x] Ottimizzazione performance
- [x] Sistema salvataggio punteggio locale (HighScoreManager + Zod, v1.3.0)
- [x] Classifica high scores (top 10, MAX_SCORES)
- [x] Effetti particellari
- [x] Screen shake e juice
- [x] Tutorial/istruzioni

## Documentazione
- [x] README con istruzioni di gioco
- [x] Documentazione codice
- [x] Credits e attributions

## Miglioramenti Richiesti
- [x] Sfondi colorati diversi per ogni livello (non solo per era)
- [x] Sistema di barriere e ostacoli nei livelli
- [x] Generazione procedurale layout livelli con percorsi variabili
- [x] Sprite PixelDebh migliorato e più dettagliato
- [x] Fix bug blocco gioco dopo completamento livello 1
- [x] Risoluzione errori di console (erano errori esterni di analytics bloccati da adblocker)

## Nuovi Miglioramenti Richiesti
- [x] Labirinti complessi stile Pac-Man con corridoi e percorsi obbligati
- [x] Sistema posizionamento intelligente oggetti (evita sovrapposizioni con muri)
- [x] Fix toggle pausa (P deve attivare/disattivare)
- [x] Font intro simile al logo PixelDebh fornito (Press Start 2P style)
- [x] Intro animata stile arcade anni '80 con presentazione sprite
- [x] Supporto controlli WASD oltre alle frecce direzionali
- [x] Fix bug blocco al secondo livello (String.repeat con valore negativo)

## Problemi Critici da Risolvere
- [x] Caricare font Press Start 2P nell'HTML
- [x] Aggiornare MenuScene con font retro
- [x] Aggiornare testo controlli (WASD + Frecce + P)
- [x] Fixare movimento nemici attraverso muri
- [x] Aggiungere logica aggiornamento nemici in update()

## Problemi Moderati da Risolvere
- [x] Rendere intro skippabile
- [x] Aggiungere contatore oggetti rimanenti nell'HUD
- [ ] Migliorare sprite PixelDebh (confronto con logo)
- [ ] Bilanciare spawn power-up

## Problemi Minori da Risolvere
- [ ] Aggiungere feedback visivo collisione muri (opzionale - non critico)
- [x] Implementare salvataggio high score localStorage
- [x] Migliorare GameOverScene con statistiche

## Documentazione GitHub
- [x] README.md completo (allineato in v1.6.0)
- [x] CONTRIBUTING.md (allineato in v1.6.0)
- [x] LICENSE
- [x] .gitignore
- [x] CHANGELOG.md (Keep a Changelog, dalla v1.1.0)
- [x] CI GitHub Actions (check + lint + test + build + audit)
- [x] ESLint flat config (v1.4.0)
- [x] Test suite Vitest (HighScoreManager + LevelData, v1.5.0)

## Roadmap aperta (feature, non bug)
- [ ] Controlli touch per mobile
- [ ] Livelli Bonus (raccolta a tempo)
- [ ] Musica di sottofondo per le 3 ere
- [ ] Migliorare sprite PixelDebh (confronto con logo)
- [ ] Bilanciare spawn power-up
- [ ] Feedback visivo collisione muri (opzionale)
- [x] E2E Playwright (smoke suite chromium, v1.8.0) — sblocca refactor Player/EnemyManager
- [x] E2E gameplay + debug hook + fix bug pausa P (v1.9.0)
- [x] Split GameScene in entities/Player.ts + entities/EnemyManager.ts (v2.0.0)
- [ ] Estendere E2E: scenari specifici (collisione nemico → life-, raccolta oggetto → score+, completamento livello → portale)
- [ ] Bundle code-splitting (estrarre Phaser in chunk vendor)
- [ ] Coverage Vitest (`@vitest/coverage-v8`)
- [ ] Server-side high score (richiede auth)
- [ ] i18n (EN/ES/FR/DE)
