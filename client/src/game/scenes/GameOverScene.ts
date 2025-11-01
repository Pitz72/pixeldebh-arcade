import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private finalScore: number = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score: number }) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Sfondo semi-trasparente
    this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

    // Titolo Game Over
    this.add.text(width / 2, height / 3, 'GAME OVER', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '64px',
      color: '#ff3333',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Punteggio finale
    this.add.text(width / 2, height / 2, `Punteggio: ${this.finalScore}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Pulsante riprova
    const retryButton = this.add.text(width / 2, height * 0.7, 'RIPROVA (SPAZIO)', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4a90e2',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    // Pulsante menu
    const menuButton = this.add.text(width / 2, height * 0.82, 'MENU (ESC)', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#666666',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    // Input
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard?.once('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });

    retryButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
