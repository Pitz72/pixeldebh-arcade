import Phaser from 'phaser';

type DrawFn = (g: Phaser.GameObjects.Graphics) => void;

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
   * Genera lo sprite di PixelDebh (protagonista)
   */
  static generatePlayer(scene: Phaser.Scene): void {
    this.withTexture(scene, 'player', 32, 32, (g) => {
      // Corpo (maglietta arancione)
      g.fillStyle(0xff9933, 1);
      g.fillRect(10, 16, 12, 10);
      g.fillCircle(16, 20, 7);

      // Braccia
      g.fillStyle(0xffd4a3, 1);
      g.fillRect(8, 18, 3, 6);
      g.fillRect(21, 18, 3, 6);

      // Testa (pelle)
      g.fillStyle(0xffd4a3, 1);
      g.fillCircle(16, 11, 7);

      // Capelli (marrone scuro con dettagli)
      g.fillStyle(0x5c4033, 1);
      g.fillRect(10, 5, 12, 7);
      g.fillCircle(13, 5, 3);
      g.fillCircle(19, 5, 3);

      // Occhi
      g.fillStyle(0xffffff, 1);
      g.fillCircle(13, 11, 2);
      g.fillCircle(19, 11, 2);
      g.fillStyle(0x2d4a3e, 1);
      g.fillCircle(13, 11, 1.5);
      g.fillCircle(19, 11, 1.5);

      // Sopracciglia
      g.lineStyle(1, 0x5c4033);
      g.lineBetween(11, 9, 14, 9);
      g.lineBetween(18, 9, 21, 9);

      // Bocca sorridente
      g.lineStyle(1, 0x2d4a3e);
      g.arc(16, 13, 3, 0.3, 2.8);

      // Cuffie
      g.fillStyle(0xd94f2a, 1);
      g.fillCircle(8, 11, 4);
      g.fillCircle(24, 11, 4);
      g.lineStyle(2, 0xd94f2a);
      g.arc(16, 11, 9, Math.PI, 0, true);
      g.fillStyle(0x000000, 1);
      g.fillCircle(8, 11, 2);
      g.fillCircle(24, 11, 2);

      // Controller
      g.fillStyle(0x4a4a4a, 1);
      g.fillRect(11, 24, 10, 5);
      g.fillStyle(0x6a6a6a, 1);
      g.fillRect(12, 25, 8, 3);
      g.fillStyle(0xff0000, 1);
      g.fillCircle(14, 26, 1);
      g.fillStyle(0x00ff00, 1);
      g.fillCircle(18, 26, 1);

      // Gambe/piedi
      g.fillStyle(0x4a4a4a, 1);
      g.fillRect(12, 26, 3, 4);
      g.fillRect(17, 26, 3, 4);
    });
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
