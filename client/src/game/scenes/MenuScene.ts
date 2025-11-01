import Phaser from 'phaser';
import { SoundManager } from '../utils/SoundManager';

export class MenuScene extends Phaser.Scene {
  private soundManager!: SoundManager;

  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Caricamento asset del menu
  }

  create() {
    this.soundManager = new SoundManager();
    const { width, height } = this.cameras.main;

    // Sfondo
    this.add.rectangle(0, 0, width, height, 0xff9933).setOrigin(0);

    // Titolo del gioco
    const title = this.add.text(width / 2, height / 3, "PixelDebh's\nRetro Rescue", {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '48px',
      color: '#2d4a3e',
      align: 'center',
      stroke: '#ffeacc',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Sottotitolo
    this.add.text(width / 2, height / 2, 'Salva la Storia del Videogioco!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#2d4a3e',
      align: 'center'
    }).setOrigin(0.5);

    // Pulsante Start
    const startButton = this.add.text(width / 2, height * 0.65, 'PREMI SPAZIO PER INIZIARE', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#d94f2a',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    // Animazione pulsante
    this.tweens.add({
      targets: startButton,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Controlli
    this.add.text(width / 2, height * 0.85, 'Usa le frecce per muoverti', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#2d4a3e',
      align: 'center'
    }).setOrigin(0.5);

    // Input
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.soundManager.playMenuClick();
      this.scene.start('GameScene');
    });

    startButton.on('pointerdown', () => {
      this.soundManager.playMenuClick();
      this.scene.start('GameScene');
    });
  }
}
