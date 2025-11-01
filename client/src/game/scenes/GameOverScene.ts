import Phaser from 'phaser';
import { SoundManager } from '../utils/SoundManager';
import { HighScoreManager } from '../utils/HighScoreManager';

export class GameOverScene extends Phaser.Scene {
  private soundManager!: SoundManager;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: { score: number; level: number }) {
    this.soundManager = new SoundManager();
    this.soundManager.playGameOver();
    
    const { width, height } = this.cameras.main;

    // Salva il punteggio
    const isNewHighScore = HighScoreManager.isHighScore(data.score);
    if (data.score > 0) {
      HighScoreManager.saveScore(data.score, data.level);
    }

    // Sfondo
    this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

    // Game Over Text
    this.add.text(width / 2, height / 4, 'GAME OVER', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '48px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Nuovo record!
    if (isNewHighScore && data.score > 0) {
      this.add.text(width / 2, height / 3, 'NUOVO RECORD!', {
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        fontSize: '20px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
    }

    // Statistiche
    const topScore = HighScoreManager.getTopScore();
    this.add.text(width / 2, height / 2, `Punteggio: ${data.score}\nLivello: ${data.level}\n\nRecord: ${topScore}`, {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10
    }).setOrigin(0.5);

    // Pulsante restart
    const restartButton = this.add.text(width / 2, height * 0.75, 'SPAZIO\nPER RICOMINCIARE', {
      fontFamily: '"Press Start 2P", "Courier New", monospace',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 15, y: 10 },
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5).setInteractive();

    // Animazione pulsante
    this.tweens.add({
      targets: restartButton,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Input
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.soundManager.playMenuClick();
      this.scene.start('MenuScene');
    });

    restartButton.on('pointerdown', () => {
      this.soundManager.playMenuClick();
      this.scene.start('MenuScene');
    });
  }
}
