# PixelDebh's Retro Rescue 🎮

Un videogioco arcade retro sviluppato per il canale **PixelDebh**, dove devi salvare la storia del videogioco dall'Oblio Digitale!

## 📖 Storia

Un'entità malvagia conosciuta come **"L'Oblio Digitale"** minaccia di cancellare la storia del videogioco per imporre un futuro fatto solo di titoli tutti uguali, pieni di bug e microtransazioni. Guidata dai suoi generali, la **Glitch Army**, questa forza sta rubando tutte le console, i computer e i giochi del passato.

**PixelDebh**, nella sua forma pixellata, è l'unica che può avventurarsi nei labirinti digitali per recuperare tutti i reperti della storia videoludica e sconfiggere L'Oblio!

## 🎯 Gameplay

**PixelDebh's Retro Rescue** è un gioco arcade single-screen che unisce:
- **Raccolta oggetti** in stile Pac-Man
- **Azione frenetica** con nemici da evitare/sconfiggere in stile Bubble Bobble
- **Progressione attraverso le ere videoludiche** (8-bit, 16-bit, 32/64-bit)

### Obiettivo
Raccogli tutti gli oggetti da collezione presenti nel livello per aprire un portale verso il livello successivo, evitando o utilizzando power-up per sconfiggere i nemici della Glitch Army!

## 🕹️ Controlli

- **Frecce direzionali**: Muovi PixelDebh (su, giù, sinistra, destra)
- **Spazio**: Inizia il gioco / Riprova dopo Game Over
- **P**: Pausa
- **ESC**: Torna al menu (da Game Over)

## 🎨 Caratteristiche

### Protagonista: PixelDebh
- Movimento a 4 direzioni
- Abilità speciali tramite power-up
- 3 vite iniziali

### Oggetti da Collezione
- **Floppy Disk** (10 punti) - Oggetto standard
- **Cartucce** NES/SNES/Mega Drive (15 punti) - Oggetto standard
- **CD** PlayStation/Saturn (20 punti) - Oggetto standard
- **Computer** Commodore 64/Amiga (50 punti) - Oggetto raro
- **Console** Atari/Game Boy/Neo Geo (100 punti) - Oggetto raro

### Nemici della Glitch Army
1. **Glitch** (rosa) - Movimento prevedibile su percorsi predefiniti
2. **Bug** (verde) - Insegue attivamente PixelDebh
3. **Lag** (giallo) - Si muove a scatti imprevedibili
4. **DRM-one** (grigio) - Invincibile, movimento lento, da evitare
5. **Hater** (rosso scuro) - Lancia proiettili rallentanti

### Power-ups
- ☕ **Tazzina di Caffè**: Aumenta la velocità per 8 secondi
- 🎮 **Joystick d'Oro**: Invincibilità per 10 secondi (elimina nemici al tocco)
- 🫧 **Bolla Retrò**: Scudo protettivo (assorbe un colpo)
- 📺 **Tubo Catodico**: Stordisce tutti i nemici per 3 secondi

## 🌍 Livelli

Il gioco è diviso in **3 Ere Videoludiche**, ognuna con la propria estetica e difficoltà crescente:

### Era 8-Bit (Livelli 1-3)
- Sfondo blu scuro con griglia circuitale
- Nemici base: Glitch e Bug
- Introduzione alle meccaniche di gioco

### Era 16-Bit (Livelli 4-6)
- Sfondo viola con colori più brillanti
- Introduzione di Lag, DRM-one e Hater
- Maggior numero di oggetti e nemici

### Era 32/64-Bit (Livelli 7-9)
- Sfondo blu intenso
- Tutti i tipi di nemici presenti
- Massima difficoltà e velocità

## 🏆 Sistema di Punteggio

- Punti base per ogni oggetto raccolto
- Bonus di 50 punti per ogni nemico eliminato (con invincibilità)
- Bonus vite al completamento livello: **100 punti × vite rimanenti**
- Punteggio finale mostrato alla vittoria

## 🎵 Audio

Il gioco utilizza effetti sonori procedurali generati con **Web Audio API**:
- Suono raccolta oggetti
- Suono power-up
- Suono colpo ricevuto
- Suono completamento livello
- Suono game over
- Suono eliminazione nemico
- Suono menu/click

## 🛠️ Tecnologie Utilizzate

- **Phaser 3** - Framework per giochi HTML5
- **React 19** - UI framework
- **TypeScript** - Linguaggio di programmazione
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Web Audio API** - Effetti sonori procedurali

## 📦 Struttura del Progetto

```
client/
├── src/
│   ├── game/
│   │   ├── config.ts              # Configurazione Phaser
│   │   ├── scenes/
│   │   │   ├── MenuScene.ts       # Scena menu principale
│   │   │   ├── GameScene.ts       # Scena di gioco
│   │   │   └── GameOverScene.ts   # Scena game over
│   │   ├── utils/
│   │   │   ├── SpriteGenerator.ts # Generazione sprite procedurali
│   │   │   └── SoundManager.ts    # Gestione effetti sonori
│   │   └── data/
│   │       └── LevelData.ts       # Configurazione livelli
│   ├── components/
│   │   └── Game.tsx               # Componente React wrapper
│   └── pages/
│       └── Home.tsx               # Pagina principale
└── public/
    └── PixelDebh.jpg              # Logo/immagine PixelDebh
```

## 🚀 Installazione e Avvio

```bash
# Installa le dipendenze
pnpm install

# Avvia il server di sviluppo
pnpm dev

# Build per produzione
pnpm build
```

## 🎮 Come Giocare

1. Apri il gioco nel browser
2. Premi **SPAZIO** o clicca su "PREMI SPAZIO PER INIZIARE"
3. Usa le **frecce direzionali** per muovere PixelDebh
4. Raccogli tutti gli oggetti evitando i nemici
5. Raccogli i power-up per ottenere abilità speciali
6. Completa tutti i 9 livelli per salvare la storia del videogioco!

## 🎯 Strategie di Gioco

- **Priorità agli oggetti rari**: Computer e Console valgono molti più punti
- **Usa i power-up al momento giusto**: L'invincibilità è perfetta quando sei circondato
- **Studia i pattern dei nemici**: Glitch e DRM-one sono prevedibili
- **Evita gli Hater**: I loro proiettili ti rallentano, rendendo più difficile sfuggire agli altri nemici
- **Conserva le vite**: Ogni vita vale 100 punti bonus al completamento del livello

## 📝 Credits

- **Concept e Design**: Basato sul Game Design Document per PixelDebh
- **Sviluppo**: Manus AI
- **Framework**: Phaser 3 Community
- **Ispirazione**: Pac-Man, Bubble Bobble, e i classici arcade degli anni '80-'90

## 📄 Licenza

Questo progetto è stato sviluppato per il canale **PixelDebh**.

---

**Buon divertimento e salva la storia del videogioco! 🎮✨**
