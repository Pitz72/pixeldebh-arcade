# Guida alla Contribuzione

Grazie per il tuo interesse nel contribuire a **PixelDebh's Retro Rescue**! Questo documento fornisce linee guida e best practices per contribuire efficacemente al progetto.

## 📋 Indice

- [Codice di Condotta](#codice-di-condotta)
- [Come Contribuire](#come-contribuire)
- [Setup Ambiente di Sviluppo](#setup-ambiente-di-sviluppo)
- [Convenzioni Codice](#convenzioni-codice)
- [Processo Pull Request](#processo-pull-request)
- [Segnalazione Bug](#segnalazione-bug)
- [Richiesta Feature](#richiesta-feature)

## 📜 Codice di Condotta

Questo progetto aderisce a un codice di condotta basato sul rispetto reciproco. Partecipando, ti impegni a mantenere un ambiente accogliente e inclusivo per tutti i contributori.

### Comportamenti Attesi

- Utilizzare linguaggio accogliente e inclusivo
- Rispettare punti di vista ed esperienze diverse
- Accettare critiche costruttive con grazia
- Concentrarsi su ciò che è meglio per la comunità
- Mostrare empatia verso altri membri della comunità

### Comportamenti Inaccettabili

- Linguaggio o immagini sessualizzate
- Trolling, commenti insultan ti o attacchi personali
- Molestie pubbliche o private
- Pubblicazione di informazioni private altrui senza permesso
- Altre condotte considerate inappropriate in un contesto professionale

## 🚀 Come Contribuire

Ci sono molti modi per contribuire a PixelDebh's Retro Rescue:

### Segnalare Bug

Se trovi un bug, apri una [Issue](https://github.com/tuousername/pixeldebh-arcade/issues/new) includendo:

- Descrizione chiara del problema
- Passi per riprodurre il bug
- Comportamento atteso vs comportamento effettivo
- Screenshot o video (se applicabile)
- Informazioni ambiente (browser, OS, versione Node.js)

### Proporre Nuove Feature

Per proporre una nuova feature:

1. Verifica che non esista già una Issue simile
2. Apri una nuova Issue con label `enhancement`
3. Descrivi dettagliatamente la feature proposta
4. Spiega perché sarebbe utile al progetto
5. Fornisci esempi d'uso se possibile

### Contribuire Codice

1. Fork del repository
2. Crea un branch dalla `main` (`git checkout -b feature/nome-feature`)
3. Implementa le modifiche seguendo le convenzioni di codice
4. Scrivi test per le nuove funzionalità
5. Assicurati che tutti i test passino (`pnpm test`)
6. Commit con messaggi descrittivi
7. Push al tuo fork
8. Apri una Pull Request verso `main`

## 🛠️ Setup Ambiente di Sviluppo

### Prerequisiti

- Node.js 22.x o superiore
- pnpm 9.x o superiore
- Git
- Editor con supporto TypeScript (consigliato: VS Code)

### Installazione

```bash
# Clone del repository
git clone https://github.com/tuousername/pixeldebh-arcade.git
cd pixeldebh-arcade

# Installazione dipendenze
pnpm install

# Avvio server di sviluppo
pnpm dev
```

### Estensioni VS Code Consigliate

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

## 📝 Convenzioni Codice

### TypeScript

- Usa TypeScript per tutto il nuovo codice
- Evita `any`, preferisci tipi espliciti o `unknown`
- Usa interfacce per oggetti complessi
- Documenta funzioni pubbliche con JSDoc

```typescript
/**
 * Genera uno sprite procedurale per un nemico
 * @param scene - La scena Phaser corrente
 * @param type - Il tipo di nemico da generare
 * @returns La chiave della texture generata
 */
function generateEnemySprite(scene: Phaser.Scene, type: EnemyType): string {
  // Implementazione...
}
```

### Naming Conventions

- **File**: PascalCase per componenti React e classi (`GameScene.ts`)
- **Variabili**: camelCase (`playerSpeed`, `isInvincible`)
- **Costanti**: UPPER_SNAKE_CASE (`MAX_LIVES`, `DEFAULT_SPEED`)
- **Interfacce**: PascalCase con prefisso `I` opzionale (`LevelConfig`, `IEnemyData`)
- **Enum**: PascalCase per nome ed elementi (`enum EnemyType { GLITCH, BUG }`)

### Struttura File

Organizza il codice in modo logico:

```typescript
// 1. Import esterni
import Phaser from 'phaser';
import { SomeLibrary } from 'some-library';

// 2. Import interni
import { LevelConfig } from '../data/LevelData';
import { SpriteGenerator } from '../utils/SpriteGenerator';

// 3. Tipi e interfacce
interface GameState {
  score: number;
  lives: number;
}

// 4. Costanti
const MAX_ENEMIES = 10;

// 5. Classe/Funzione principale
export class GameScene extends Phaser.Scene {
  // Implementazione...
}
```

### Commenti

- Commenta il "perché", non il "cosa"
- Usa JSDoc per funzioni pubbliche
- Evita commenti ovvi o ridondanti

```typescript
// ❌ Male
let x = 10; // Imposta x a 10

// ✅ Bene
// Offset orizzontale per centrare lo sprite nel canvas
const centerOffset = (canvasWidth - spriteWidth) / 2;
```

### Formattazione

Il progetto usa Prettier per formattazione automatica:

```bash
# Formatta tutto il codice
pnpm format

# Controlla formattazione senza modificare
pnpm format:check
```

Configurazione Prettier (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 🔄 Processo Pull Request

### Prima di Aprire una PR

1. Assicurati che il codice compili senza errori TypeScript
2. Esegui `pnpm lint` e risolvi eventuali warning
3. Esegui `pnpm test` e assicurati che tutti i test passino
4. Testa manualmente le modifiche nel browser
5. Aggiorna la documentazione se necessario

### Checklist PR

- [ ] Il codice segue le convenzioni del progetto
- [ ] I test esistenti passano
- [ ] Nuovi test sono stati aggiunti per nuove funzionalità
- [ ] La documentazione è stata aggiornata
- [ ] I commit hanno messaggi descrittivi
- [ ] Non ci sono conflitti con `main`

### Formato Messaggio Commit

Usa il formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipi**:
- `feat`: Nuova feature
- `fix`: Bug fix
- `docs`: Modifiche documentazione
- `style`: Formattazione, punto e virgola mancanti, ecc.
- `refactor`: Refactoring codice
- `test`: Aggiunta o modifica test
- `chore`: Modifiche build, dipendenze, ecc.

**Esempi**:
```
feat(enemies): add new boss enemy type

Implement new boss enemy with unique attack patterns
and increased health for end-of-era levels.

Closes #42
```

```
fix(collision): prevent player from passing through walls

Update collision detection to use body.blocked instead
of overlap callback for more reliable wall collision.
```

### Review Process

1. Un maintainer revisionerà la tua PR
2. Potrebbero essere richieste modifiche
3. Apporta le modifiche richieste e fai push al tuo branch
4. Una volta approvata, la PR verrà merged

## 🐛 Segnalazione Bug

### Template Issue Bug

```markdown
**Descrizione Bug**
Descrizione chiara e concisa del bug.

**Passi per Riprodurre**
1. Vai a '...'
2. Clicca su '....'
3. Scorri fino a '....'
4. Vedi errore

**Comportamento Atteso**
Descrizione di cosa ti aspettavi accadesse.

**Screenshot**
Se applicabile, aggiungi screenshot per spiegare il problema.

**Ambiente**
- OS: [es. Windows 11]
- Browser: [es. Chrome 120]
- Versione Node.js: [es. 22.0.0]

**Informazioni Aggiuntive**
Qualsiasi altro contesto sul problema.
```

## ✨ Richiesta Feature

### Template Issue Feature

```markdown
**La tua feature risolve un problema? Descrivilo.**
Descrizione chiara del problema. Es. "Sono sempre frustrato quando [...]"

**Descrivi la soluzione che vorresti**
Descrizione chiara di cosa vorresti accadesse.

**Descrivi alternative considerate**
Descrizione di soluzioni alternative o feature che hai considerato.

**Contesto Aggiuntivo**
Aggiungi qualsiasi altro contesto o screenshot sulla richiesta feature.
```

## 🧪 Testing

### Scrivere Test

Usa Vitest per test unitari:

```typescript
import { describe, it, expect } from 'vitest';
import { HighScoreManager } from './HighScoreManager';

describe('HighScoreManager', () => {
  it('should save and retrieve high scores', () => {
    HighScoreManager.saveScore(1000, 5, 'Player1');
    const scores = HighScoreManager.getHighScores();
    
    expect(scores).toHaveLength(1);
    expect(scores[0].score).toBe(1000);
    expect(scores[0].playerName).toBe('Player1');
  });

  it('should keep only top 10 scores', () => {
    for (let i = 0; i < 15; i++) {
      HighScoreManager.saveScore(i * 100, 1, `Player${i}`);
    }
    
    const scores = HighScoreManager.getHighScores();
    expect(scores).toHaveLength(10);
  });
});
```

### Eseguire Test

```bash
# Tutti i test
pnpm test

# Test in watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📚 Risorse Utili

- [Documentazione Phaser 3](https://phaser.io/docs)
- [Guida TypeScript](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 🙏 Riconoscimenti

Tutti i contributori saranno riconosciuti nel README del progetto. Grazie per il tuo contributo!

## 📞 Domande?

Se hai domande sul processo di contribuzione:
- Apri una [Discussion](https://github.com/tuousername/pixeldebh-arcade/discussions)
- Contatta i maintainer via Issue
- Consulta la documentazione esistente

---

**Grazie per contribuire a PixelDebh's Retro Rescue! 🎮✨**
