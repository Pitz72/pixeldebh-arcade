import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';
import { SoundManager } from '../utils/SoundManager';

/**
 * Scena introduttiva animata stile arcade anni '80
 */
export class IntroScene extends Phaser.Scene {
  private soundManager!: SoundManager;
  private currentStep: number = 0;

  constructor() {
    super({ key: 'IntroScene' });
  }

  preload() {
    // Genera tutti gli sprite
    SpriteGenerator.generateAll(this);
  }

  create() {
    this.soundManager = new SoundManager();
    const { width, height } = this.cameras.main;

    // Sfondo arancione stile arcade
    this.add.rectangle(0, 0, width, height, 0xff9933).setOrigin(0);

    // Bordo decorativo
    const border = this.add.rectangle(width / 2, height / 2, width - 40, height - 40);
    border.setStrokeStyle(8, 0x2d4a3e);
    border.setFillStyle(0xff9933);

    // Testo skip
    this.add.text(width - 20, height - 20, 'SPACE o ESC per saltare', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '8px',
      color: '#2d4a3e'
    }).setOrigin(1, 1).setAlpha(0.7);

    // Permetti skip con SPACE o ESC
    this.input.keyboard?.on('keydown-SPACE', this.skipIntro, this);
    this.input.keyboard?.on('keydown-ESC', this.skipIntro, this);

    this.showIntroSequence();
  }

  private skipIntro() {
    this.soundManager.playMenuClick();
    this.scene.start('MenuScene');
  }

  private showIntroSequence() {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Step 1: Titolo del gioco
    this.time.delayedCall(500, () => {
      this.soundManager.playMenuClick();
      
      const title = this.add.text(centerX, centerY - 180, "PixelDebh's", {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '48px',
        color: '#2d4a3e',
        stroke: '#ffffff',
        strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0);

      const subtitle = this.add.text(centerX, centerY - 120, 'Retro Rescue', {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '42px',
        color: '#2d4a3e',
        stroke: '#ffffff',
        strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: [title, subtitle],
        alpha: 1,
        duration: 800,
        ease: 'Power2'
      });
    });

    // Step 2: Presentazione protagonista
    this.time.delayedCall(2000, () => {
      this.soundManager.playMenuClick();
      
      const playerSprite = this.add.sprite(centerX - 150, centerY - 20, 'player').setScale(2).setAlpha(0);
      const playerLabel = this.add.text(centerX + 20, centerY - 30, 'PIXELDEBH', {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '20px',
        color: '#2d4a3e',
        stroke: '#ffffff',
        strokeThickness: 3
      }).setOrigin(0, 0.5).setAlpha(0);
      
      const playerDesc = this.add.text(centerX + 20, centerY + 10, 'Salva la Storia\ndel Videogioco!', {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '14px',
        color: '#2d4a3e',
        lineSpacing: 8
      }).setOrigin(0, 0.5).setAlpha(0);

      this.tweens.add({
        targets: [playerSprite, playerLabel, playerDesc],
        alpha: 1,
        duration: 600,
        ease: 'Power2'
      });
    });

    // Step 3: Presentazione oggetti da collezione
    this.time.delayedCall(4000, () => {
      this.soundManager.playCollect();
      
      const collectiblesY = centerY + 80;
      const spacing = 80;
      
      const items = [
        { sprite: 'floppy', label: 'FLOPPY\n10 pts', x: centerX - 160 },
        { sprite: 'cartridge', label: 'CARTUCCIA\n15 pts', x: centerX - 80 },
        { sprite: 'cd', label: 'CD\n20 pts', x: centerX },
        { sprite: 'computer', label: 'COMPUTER\n50 pts', x: centerX + 80 },
        { sprite: 'console', label: 'CONSOLE\n100 pts', x: centerX + 160 }
      ];

      items.forEach((item, index) => {
        this.time.delayedCall(index * 200, () => {
          this.soundManager.playMenuClick();
          
          const sprite = this.add.sprite(item.x, collectiblesY, item.sprite).setAlpha(0);
          const label = this.add.text(item.x, collectiblesY + 35, item.label, {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '8px',
            color: '#2d4a3e',
            align: 'center',
            lineSpacing: 4
          }).setOrigin(0.5).setAlpha(0);

          this.tweens.add({
            targets: [sprite, label],
            alpha: 1,
            duration: 400,
            ease: 'Power2'
          });
        });
      });
    });

    // Step 4: Presentazione nemici
    this.time.delayedCall(6500, () => {
      this.soundManager.playHit();
      
      const enemiesY = centerY + 180;
      
      const enemies = [
        { sprite: 'glitch', label: 'GLITCH', x: centerX - 120 },
        { sprite: 'bug', label: 'BUG', x: centerX - 60 },
        { sprite: 'lag', label: 'LAG', x: centerX },
        { sprite: 'drm', label: 'DRM-ONE', x: centerX + 60 },
        { sprite: 'hater', label: 'HATER', x: centerX + 120 }
      ];

      const warningText = this.add.text(centerX, enemiesY - 40, 'GLITCH ARMY - EVITALI!', {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '16px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: warningText,
        alpha: 1,
        duration: 400,
        ease: 'Power2'
      });

      enemies.forEach((enemy, index) => {
        this.time.delayedCall(index * 150, () => {
          this.soundManager.playMenuClick();
          
          const sprite = this.add.sprite(enemy.x, enemiesY, enemy.sprite).setAlpha(0);
          const label = this.add.text(enemy.x, enemiesY + 30, enemy.label, {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '7px',
            color: '#2d4a3e',
            align: 'center'
          }).setOrigin(0.5).setAlpha(0);

          this.tweens.add({
            targets: [sprite, label],
            alpha: 1,
            duration: 300,
            ease: 'Power2'
          });
        });
      });
    });

    // Step 5: Istruzioni finali e avvio
    this.time.delayedCall(9000, () => {
      this.soundManager.playPowerUp();
      
      const startText = this.add.text(centerX, height - 80, 'PREMI SPAZIO PER INIZIARE', {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '18px',
        color: '#d94f2a',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);

      // Effetto lampeggiante
      this.tweens.add({
        targets: startText,
        alpha: 0.3,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Abilita input
      this.input.keyboard?.once('keydown-SPACE', () => {
        this.soundManager.playMenuClick();
        this.scene.start('MenuScene');
      });
    });
  }
}
