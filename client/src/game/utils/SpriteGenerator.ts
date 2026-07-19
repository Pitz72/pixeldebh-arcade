import Phaser from 'phaser';

type DrawFn = (g: Phaser.GameObjects.Graphics) => void;

/** Mappa carattere -> colore per gli sprite definiti come matrice di pixel. */
type PixelPalette = Record<string, number>;

/**
 * PixelDebh: ragazza castana con occhi marroni, cuffie rosse, maglietta
 * arancione, pantaloncini blu e scarpe da ginnastica bianche.
 * Ogni riga e' una scanline di 32 caratteri; '.' = pixel trasparente.
 *
 * I frame di animazione condividono le righe 0-22 (testa+busto) e variano
 * solo le 8 righe di gambe/scarpe: l'allineamento tra frame e' garantito
 * per costruzione.
 */
const PLAYER_PALETTE: PixelPalette = {
  H: 0x5c4033, // capelli castani
  h: 0x7a5a42, // capelli, riflesso
  S: 0xffd4a3, // pelle
  s: 0xe0ac78, // pelle, ombra
  E: 0x3a2513, // occhi marroni
  M: 0xb5654a, // bocca
  O: 0xff9933, // maglietta arancione
  o: 0xcc721c, // maglietta, ombra
  B: 0x3366cc, // pantaloncini blu
  b: 0x26509e, // pantaloncini, ombra
  K: 0xf2f2f2, // scarpe bianche
  k: 0xb8b8b8, // scarpe, suola
  P: 0xd94f2a, // cuffie
  p: 0x8f2f16, // cuffie, ombra
};

/** Righe 0-22: testa e busto, condivise da tutti i frame. */
const PLAYER_UPPER: readonly string[] = [
  '................................',
  '.............PPPPPP.............',
  '...........PPPPPPPPPP...........',
  '..........PHHhhHHHHHHP..........',
  '.........PHHhhHHHHHHHHP.........',
  '.........PHHHHHHHHHHHHP.........',
  '........PPHHHHHHHHHHHHPP........',
  '........PPHSSSSSSSSSSHPP........',
  '........ppHSSESSSSESSHpp........',
  '..........HSSESSSSESSH..........',
  '..........HSSSSMMSSSSH..........',
  '..........HHSSSSSSSSHH..........',
  '..........HHsSSSSSSsHH..........',
  '..........OOOOOOOOOOOO..........',
  '..........OOOOOOOOOOOO..........',
  '.........OOOOOOOOOOOOOO.........',
  '.........OOOOOOOOOOOOOO.........',
  '.........SSOOOOOOOOOOSS.........',
  '.........SSOOOOOOOOOOSS.........',
  '.........ssoOOOOOOOOoss.........',
  '...........BBBBBBBBBB...........',
  '...........BBBBBBBBBB...........',
  '...........BBBBbbBBBB...........',
];

/** Righe 23-30: gambe in appoggio (frame di riposo). */
const PLAYER_LEGS_STAND: readonly string[] = [
  '...........BBBB..BBBB...........',
  '............SSS..SSS............',
  '............SSS..SSS............',
  '............SSS..SSS............',
  '............sss..sss............',
  '............KKK..KKK............',
  '...........KKKK..KKKK...........',
  '...........kkkk..kkkk...........',
];

/** Passo con gamba sinistra sollevata. */
const PLAYER_LEGS_WALK_A: readonly string[] = [
  '...........BBBB..BBBB...........',
  '............SSS..SSS............',
  '............sss..SSS............',
  '............KKK..SSS............',
  '...........KKKK..sss............',
  '...........kkkk..KKK............',
  '.................KKKK...........',
  '.................kkkk...........',
];

/** Passo con gamba destra sollevata (speculare al precedente). */
const PLAYER_LEGS_WALK_B: readonly string[] = [
  '...........BBBB..BBBB...........',
  '............SSS..SSS............',
  '............SSS..sss............',
  '............SSS..KKK............',
  '............sss..KKKK...........',
  '............KKK..kkkk...........',
  '...........KKKK.................',
  '...........kkkk.................',
];

const PLAYER_EMPTY_ROW = '................................';

/** Compone un frame 32x32: busto condiviso + variante gambe (+ blink). */
function playerFrame(legs: readonly string[], blink: boolean): string[] {
  const upper = blink
    ? PLAYER_UPPER.map((row, i) =>
        i === 8 || i === 9 ? row.replace(/E/g, i === 8 ? 'S' : 's') : row
      )
    : [...PLAYER_UPPER];
  return [...upper, ...legs, PLAYER_EMPTY_ROW];
}

export class SpriteGenerator {
  /**
   * Helper: crea un Graphics temporaneo, esegue `draw`, genera la texture
   * con `key`/`width`/`height` e distrugge il Graphics. Centralizza il
   * pattern ripetuto add.graphics() -> draw -> generateTexture -> destroy.
   */
  private static withTexture(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    draw: DrawFn
  ): void {
    const g = scene.add.graphics();
    draw(g);
    g.generateTexture(key, width, height);
    g.destroy();
  }

  /**
   * Helper: genera una texture da una matrice di pixel (una stringa per
   * scanline, carattere -> colore via palette, '.' o carattere ignoto =
   * trasparente). L'allineamento nel box e' garantito per costruzione:
   * la texture ha esattamente le dimensioni della matrice.
   */
  private static fromPixelMatrix(
    scene: Phaser.Scene,
    key: string,
    pixels: readonly string[],
    palette: PixelPalette
  ): void {
    const height = pixels.length;
    const width = pixels[0]?.length ?? 0;
    this.withTexture(scene, key, width, height, (g) => {
      pixels.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          const color = palette[row[x]];
          if (color === undefined) continue;
          g.fillStyle(color, 1);
          g.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  /**
   * Genera le texture di PixelDebh (protagonista): frame di riposo,
   * due frame di camminata e blink. Tutte 32x32 con lo stesso ancoraggio.
   */
  static generatePlayer(scene: Phaser.Scene): void {
    this.fromPixelMatrix(scene, 'player', playerFrame(PLAYER_LEGS_STAND, false), PLAYER_PALETTE);
    this.fromPixelMatrix(scene, 'player-walk-a', playerFrame(PLAYER_LEGS_WALK_A, false), PLAYER_PALETTE);
    this.fromPixelMatrix(scene, 'player-walk-b', playerFrame(PLAYER_LEGS_WALK_B, false), PLAYER_PALETTE);
    this.fromPixelMatrix(scene, 'player-blink', playerFrame(PLAYER_LEGS_STAND, true), PLAYER_PALETTE);
  }

  /**
   * Genera gli sprite dei nemici
   */
  static generateEnemies(scene: Phaser.Scene): void {
    // Glitch (rosa/magenta con effetto glitch)
    this.withTexture(scene, 'glitch', 24, 24, (g) => {
      g.fillStyle(0xff0066, 1);
      g.fillRect(4, 4, 16, 16);
      g.fillStyle(0x00ffff, 0.5);
      g.fillRect(6, 6, 12, 2);
      g.fillRect(6, 16, 12, 2);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(10, 12, 2);
      g.fillCircle(14, 12, 2);
    });

    // Bug (verde con antenne)
    this.withTexture(scene, 'bug', 24, 24, (g) => {
      g.fillStyle(0x00ff66, 1);
      g.fillCircle(12, 14, 10);
      g.fillStyle(0x00cc44, 1);
      g.fillCircle(12, 14, 6);
      g.lineStyle(2, 0x00ff66);
      g.lineBetween(8, 8, 6, 2);
      g.lineBetween(16, 8, 18, 2);
      g.fillCircle(6, 2, 2);
      g.fillCircle(18, 2, 2);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(9, 13, 2);
      g.fillCircle(15, 13, 2);
    });

    // Lag (giallo pixelato)
    this.withTexture(scene, 'lag', 24, 24, (g) => {
      g.fillStyle(0xffff00, 1);
      g.fillRect(2, 2, 4, 4);
      g.fillRect(6, 6, 4, 4);
      g.fillRect(10, 2, 4, 4);
      g.fillRect(14, 6, 4, 4);
      g.fillRect(18, 2, 4, 4);
      g.fillRect(6, 10, 12, 8);
      g.fillStyle(0x000000, 1);
      g.fillRect(10, 14, 2, 2);
      g.fillRect(14, 14, 2, 2);
    });

    // DRM-one (grigio metallico con lucchetto)
    this.withTexture(scene, 'drm', 24, 24, (g) => {
      g.fillStyle(0x708090, 1);
      g.fillRect(4, 8, 16, 12);
      g.fillStyle(0x505050, 1);
      g.fillRect(6, 10, 12, 8);
      g.lineStyle(3, 0xffd700);
      g.strokeCircle(12, 10, 4);
      g.fillStyle(0xffd700, 1);
      g.fillRect(10, 12, 4, 6);
      g.fillCircle(12, 15, 2);
    });

    // Hater (rosso scuro con bocca arrabbiata)
    this.withTexture(scene, 'hater', 24, 24, (g) => {
      g.fillStyle(0x8b0000, 1);
      g.fillCircle(12, 12, 10);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(12, 12, 7);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(8, 10, 3);
      g.fillCircle(16, 10, 3);
      g.fillStyle(0x000000, 1);
      g.fillCircle(8, 10, 2);
      g.fillCircle(16, 10, 2);
      g.lineStyle(2, 0x000000);
      g.lineBetween(8, 16, 16, 16);
    });
  }

  /**
   * Genera gli sprite degli oggetti da collezione
   */
  static generateCollectibles(scene: Phaser.Scene): void {
    // Floppy disk (blu)
    this.withTexture(scene, 'floppy', 16, 16, (g) => {
      g.fillStyle(0x4a90e2, 1);
      g.fillRect(0, 0, 14, 16);
      g.fillStyle(0x2d5a8e, 1);
      g.fillRect(2, 2, 10, 4);
      g.fillStyle(0x000000, 1);
      g.fillRect(5, 12, 4, 2);
    });

    // Cartuccia (rosso)
    this.withTexture(scene, 'cartridge', 16, 16, (g) => {
      g.fillStyle(0xe74c3c, 1);
      g.fillRect(2, 0, 12, 16);
      g.fillStyle(0xc0392b, 1);
      g.fillRect(4, 2, 8, 6);
      g.fillStyle(0xffffff, 1);
      g.fillRect(6, 4, 4, 2);
    });

    // CD (viola con riflesso)
    this.withTexture(scene, 'cd', 16, 16, (g) => {
      g.fillStyle(0x9b59b6, 1);
      g.fillCircle(8, 8, 8);
      g.fillStyle(0x000000, 1);
      g.fillCircle(8, 8, 3);
      g.fillStyle(0xffffff, 0.5);
      g.fillCircle(6, 6, 2);
    });

    // Computer (arancione/beige)
    this.withTexture(scene, 'computer', 16, 16, (g) => {
      g.fillStyle(0xf39c12, 1);
      g.fillRect(0, 4, 16, 10);
      g.fillStyle(0x2c3e50, 1);
      g.fillRect(2, 6, 12, 6);
      g.fillStyle(0x00ff00, 0.7);
      g.fillRect(3, 7, 10, 4);
      g.fillStyle(0xd68910, 1);
      g.fillRect(6, 14, 4, 2);
    });

    // Console (verde)
    this.withTexture(scene, 'console', 16, 16, (g) => {
      g.fillStyle(0x2ecc71, 1);
      g.fillRect(2, 4, 12, 8);
      g.fillStyle(0x27ae60, 1);
      g.fillRect(4, 6, 8, 4);
      g.fillStyle(0x000000, 1);
      g.fillCircle(6, 8, 1);
      g.fillCircle(10, 8, 1);
    });
  }

  /**
   * Genera gli sprite dei power-up
   */
  static generatePowerUps(scene: Phaser.Scene): void {
    // Caffè (marrone)
    this.withTexture(scene, 'powerup-coffee', 20, 20, (g) => {
      g.fillStyle(0x8b4513, 1);
      g.fillRect(4, 8, 12, 10);
      g.fillStyle(0x6b3410, 1);
      g.fillRect(6, 10, 8, 6);
      g.lineStyle(2, 0x8b4513);
      g.strokeCircle(17, 13, 3);
      g.lineStyle(1, 0xffffff, 0.7);
      g.lineBetween(8, 6, 8, 2);
      g.lineBetween(12, 6, 12, 2);
    });

    // Joystick d'oro
    this.withTexture(scene, 'powerup-joystick', 20, 20, (g) => {
      g.fillStyle(0xffd700, 1);
      g.fillRect(6, 12, 8, 6);
      g.fillCircle(10, 8, 4);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(8, 15, 2);
      g.fillStyle(0x00ff00, 1);
      g.fillCircle(12, 15, 2);
    });

    // Bolla retrò (azzurra trasparente)
    this.withTexture(scene, 'powerup-bubble', 20, 20, (g) => {
      g.lineStyle(2, 0x87ceeb);
      g.strokeCircle(10, 10, 8);
      g.fillStyle(0x87ceeb, 0.3);
      g.fillCircle(10, 10, 8);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(7, 7, 2);
    });

    // Tubo catodico (grigio con schermo)
    this.withTexture(scene, 'powerup-crt', 20, 20, (g) => {
      g.fillStyle(0x708090, 1);
      g.fillRect(2, 2, 16, 14);
      g.fillStyle(0x2c3e50, 1);
      g.fillRect(4, 4, 12, 10);
      g.fillStyle(0x00ff00, 0.5);
      g.fillRect(5, 5, 10, 8);
      g.lineStyle(2, 0x708090);
      g.lineBetween(10, 2, 8, 0);
      g.lineBetween(10, 2, 12, 0);
    });
  }

  /**
   * Genera tutti gli sprite del gioco
   */
  static generateAll(scene: Phaser.Scene): void {
    this.generatePlayer(scene);
    this.generateEnemies(scene);
    this.generateCollectibles(scene);
    this.generatePowerUps(scene);
  }
}
