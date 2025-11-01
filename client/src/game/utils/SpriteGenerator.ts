import Phaser from 'phaser';

export class SpriteGenerator {
  /**
   * Genera lo sprite di PixelDebh (protagonista)
   */
  static generatePlayer(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();
    
    // Corpo (arancione)
    graphics.fillStyle(0xff9933, 1);
    graphics.fillCircle(16, 20, 12);
    
    // Testa (pelle)
    graphics.fillStyle(0xffd4a3, 1);
    graphics.fillCircle(16, 12, 8);
    
    // Capelli (marrone scuro)
    graphics.fillStyle(0x5c4033, 1);
    graphics.fillRect(10, 6, 12, 6);
    
    // Occhi
    graphics.fillStyle(0x2d4a3e, 1);
    graphics.fillCircle(13, 12, 2);
    graphics.fillCircle(19, 12, 2);
    
    // Cuffie (arancione scuro)
    graphics.fillStyle(0xd94f2a, 1);
    graphics.fillCircle(8, 12, 4);
    graphics.fillCircle(24, 12, 4);
    
    // Controller (grigio)
    graphics.fillStyle(0x4a4a4a, 1);
    graphics.fillRect(12, 26, 8, 4);
    
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();
  }

  /**
   * Genera gli sprite dei nemici
   */
  static generateEnemies(scene: Phaser.Scene): void {
    // Glitch (rosa/magenta con effetto glitch)
    const glitchGraphics = scene.add.graphics();
    glitchGraphics.fillStyle(0xff0066, 1);
    glitchGraphics.fillRect(4, 4, 16, 16);
    glitchGraphics.fillStyle(0x00ffff, 0.5);
    glitchGraphics.fillRect(6, 6, 12, 2);
    glitchGraphics.fillRect(6, 16, 12, 2);
    glitchGraphics.fillStyle(0xffffff, 1);
    glitchGraphics.fillCircle(10, 12, 2);
    glitchGraphics.fillCircle(14, 12, 2);
    glitchGraphics.generateTexture('glitch', 24, 24);
    glitchGraphics.destroy();

    // Bug (verde con antenne)
    const bugGraphics = scene.add.graphics();
    bugGraphics.fillStyle(0x00ff66, 1);
    bugGraphics.fillCircle(12, 14, 10);
    bugGraphics.fillStyle(0x00cc44, 1);
    bugGraphics.fillCircle(12, 14, 6);
    // Antenne
    bugGraphics.lineStyle(2, 0x00ff66);
    bugGraphics.lineBetween(8, 8, 6, 2);
    bugGraphics.lineBetween(16, 8, 18, 2);
    bugGraphics.fillCircle(6, 2, 2);
    bugGraphics.fillCircle(18, 2, 2);
    // Occhi
    bugGraphics.fillStyle(0xff0000, 1);
    bugGraphics.fillCircle(9, 13, 2);
    bugGraphics.fillCircle(15, 13, 2);
    bugGraphics.generateTexture('bug', 24, 24);
    bugGraphics.destroy();

    // Lag (giallo con forma pixelata)
    const lagGraphics = scene.add.graphics();
    lagGraphics.fillStyle(0xffff00, 1);
    lagGraphics.fillRect(2, 2, 4, 4);
    lagGraphics.fillRect(6, 6, 4, 4);
    lagGraphics.fillRect(10, 2, 4, 4);
    lagGraphics.fillRect(14, 6, 4, 4);
    lagGraphics.fillRect(18, 2, 4, 4);
    lagGraphics.fillRect(6, 10, 12, 8);
    lagGraphics.fillStyle(0x000000, 1);
    lagGraphics.fillRect(10, 14, 2, 2);
    lagGraphics.fillRect(14, 14, 2, 2);
    lagGraphics.generateTexture('lag', 24, 24);
    lagGraphics.destroy();

    // DRM-one (grigio metallico con lucchetto)
    const drmGraphics = scene.add.graphics();
    drmGraphics.fillStyle(0x708090, 1);
    drmGraphics.fillRect(4, 8, 16, 12);
    drmGraphics.fillStyle(0x505050, 1);
    drmGraphics.fillRect(6, 10, 12, 8);
    // Lucchetto
    drmGraphics.lineStyle(3, 0xffd700);
    drmGraphics.strokeCircle(12, 10, 4);
    drmGraphics.fillStyle(0xffd700, 1);
    drmGraphics.fillRect(10, 12, 4, 6);
    drmGraphics.fillCircle(12, 15, 2);
    drmGraphics.generateTexture('drm', 24, 24);
    drmGraphics.destroy();

    // Hater (rosso scuro con bocca arrabbiata)
    const haterGraphics = scene.add.graphics();
    haterGraphics.fillStyle(0x8b0000, 1);
    haterGraphics.fillCircle(12, 12, 10);
    haterGraphics.fillStyle(0xff0000, 1);
    haterGraphics.fillCircle(12, 12, 7);
    // Occhi arrabbiati
    haterGraphics.fillStyle(0xffffff, 1);
    haterGraphics.fillCircle(8, 10, 3);
    haterGraphics.fillCircle(16, 10, 3);
    haterGraphics.fillStyle(0x000000, 1);
    haterGraphics.fillCircle(8, 10, 2);
    haterGraphics.fillCircle(16, 10, 2);
    // Bocca arrabbiata
    haterGraphics.lineStyle(2, 0x000000);
    haterGraphics.lineBetween(8, 16, 16, 16);
    haterGraphics.generateTexture('hater', 24, 24);
    haterGraphics.destroy();
  }

  /**
   * Genera gli sprite degli oggetti da collezione
   */
  static generateCollectibles(scene: Phaser.Scene): void {
    // Floppy disk (blu)
    const floppyGraphics = scene.add.graphics();
    floppyGraphics.fillStyle(0x4a90e2, 1);
    floppyGraphics.fillRect(0, 0, 14, 16);
    floppyGraphics.fillStyle(0x2d5a8e, 1);
    floppyGraphics.fillRect(2, 2, 10, 4);
    floppyGraphics.fillStyle(0x000000, 1);
    floppyGraphics.fillRect(5, 12, 4, 2);
    floppyGraphics.generateTexture('floppy', 16, 16);
    floppyGraphics.destroy();

    // Cartuccia (rosso)
    const cartridgeGraphics = scene.add.graphics();
    cartridgeGraphics.fillStyle(0xe74c3c, 1);
    cartridgeGraphics.fillRect(2, 0, 12, 16);
    cartridgeGraphics.fillStyle(0xc0392b, 1);
    cartridgeGraphics.fillRect(4, 2, 8, 6);
    cartridgeGraphics.fillStyle(0xffffff, 1);
    cartridgeGraphics.fillRect(6, 4, 4, 2);
    cartridgeGraphics.generateTexture('cartridge', 16, 16);
    cartridgeGraphics.destroy();

    // CD (viola con riflesso)
    const cdGraphics = scene.add.graphics();
    cdGraphics.fillStyle(0x9b59b6, 1);
    cdGraphics.fillCircle(8, 8, 8);
    cdGraphics.fillStyle(0x000000, 1);
    cdGraphics.fillCircle(8, 8, 3);
    cdGraphics.fillStyle(0xffffff, 0.5);
    cdGraphics.fillCircle(6, 6, 2);
    cdGraphics.generateTexture('cd', 16, 16);
    cdGraphics.destroy();

    // Computer (arancione/beige)
    const computerGraphics = scene.add.graphics();
    computerGraphics.fillStyle(0xf39c12, 1);
    computerGraphics.fillRect(0, 4, 16, 10);
    computerGraphics.fillStyle(0x2c3e50, 1);
    computerGraphics.fillRect(2, 6, 12, 6);
    computerGraphics.fillStyle(0x00ff00, 0.7);
    computerGraphics.fillRect(3, 7, 10, 4);
    computerGraphics.fillStyle(0xd68910, 1);
    computerGraphics.fillRect(6, 14, 4, 2);
    computerGraphics.generateTexture('computer', 16, 16);
    computerGraphics.destroy();

    // Console (verde)
    const consoleGraphics = scene.add.graphics();
    consoleGraphics.fillStyle(0x2ecc71, 1);
    consoleGraphics.fillRect(2, 4, 12, 8);
    consoleGraphics.fillStyle(0x27ae60, 1);
    consoleGraphics.fillRect(4, 6, 8, 4);
    consoleGraphics.fillStyle(0x000000, 1);
    consoleGraphics.fillCircle(6, 8, 1);
    consoleGraphics.fillCircle(10, 8, 1);
    consoleGraphics.generateTexture('console', 16, 16);
    consoleGraphics.destroy();
  }

  /**
   * Genera gli sprite dei power-up
   */
  static generatePowerUps(scene: Phaser.Scene): void {
    // Caffè (marrone)
    const coffeeGraphics = scene.add.graphics();
    coffeeGraphics.fillStyle(0x8b4513, 1);
    coffeeGraphics.fillRect(4, 8, 12, 10);
    coffeeGraphics.fillStyle(0x6b3410, 1);
    coffeeGraphics.fillRect(6, 10, 8, 6);
    // Manico
    coffeeGraphics.lineStyle(2, 0x8b4513);
    coffeeGraphics.strokeCircle(17, 13, 3);
    // Vapore
    coffeeGraphics.lineStyle(1, 0xffffff, 0.7);
    coffeeGraphics.lineBetween(8, 6, 8, 2);
    coffeeGraphics.lineBetween(12, 6, 12, 2);
    coffeeGraphics.generateTexture('powerup-coffee', 20, 20);
    coffeeGraphics.destroy();

    // Joystick d'oro
    const joystickGraphics = scene.add.graphics();
    joystickGraphics.fillStyle(0xffd700, 1);
    joystickGraphics.fillRect(6, 12, 8, 6);
    joystickGraphics.fillCircle(10, 8, 4);
    joystickGraphics.fillStyle(0xff0000, 1);
    joystickGraphics.fillCircle(8, 15, 2);
    joystickGraphics.fillStyle(0x00ff00, 1);
    joystickGraphics.fillCircle(12, 15, 2);
    joystickGraphics.generateTexture('powerup-joystick', 20, 20);
    joystickGraphics.destroy();

    // Bolla retrò (azzurra trasparente)
    const bubbleGraphics = scene.add.graphics();
    bubbleGraphics.lineStyle(2, 0x87ceeb);
    bubbleGraphics.strokeCircle(10, 10, 8);
    bubbleGraphics.fillStyle(0x87ceeb, 0.3);
    bubbleGraphics.fillCircle(10, 10, 8);
    bubbleGraphics.fillStyle(0xffffff, 0.8);
    bubbleGraphics.fillCircle(7, 7, 2);
    bubbleGraphics.generateTexture('powerup-bubble', 20, 20);
    bubbleGraphics.destroy();

    // Tubo catodico (grigio con schermo)
    const crtGraphics = scene.add.graphics();
    crtGraphics.fillStyle(0x708090, 1);
    crtGraphics.fillRect(2, 2, 16, 14);
    crtGraphics.fillStyle(0x2c3e50, 1);
    crtGraphics.fillRect(4, 4, 12, 10);
    crtGraphics.fillStyle(0x00ff00, 0.5);
    crtGraphics.fillRect(5, 5, 10, 8);
    // Antenna
    crtGraphics.lineStyle(2, 0x708090);
    crtGraphics.lineBetween(10, 2, 8, 0);
    crtGraphics.lineBetween(10, 2, 12, 0);
    crtGraphics.generateTexture('powerup-crt', 20, 20);
    crtGraphics.destroy();
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
