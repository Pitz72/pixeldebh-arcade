import Phaser from 'phaser';
import { getEraName, type LevelConfig } from '../data/LevelData';

const HUD_FONT = 'Arial Black, sans-serif';

const TITLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: HUD_FONT,
  fontSize: '18px',
  color: '#ffffff',
  stroke: '#000000',
  strokeThickness: 3,
};

const COUNTER_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: HUD_FONT,
  fontSize: '16px',
  color: '#ffcc00',
  stroke: '#000000',
  strokeThickness: 3,
};

/**
 * HUD del gioco: punteggio, vite, livello, contatore oggetti.
 * Estratto da GameScene per separare la presentazione dalla logica di gameplay.
 */
export class HUD {
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private collectiblesText: Phaser.GameObjects.Text;
  private totalCollectibles: number;

  constructor(
    scene: Phaser.Scene,
    levelConfig: LevelConfig,
    level: number,
    totalCollectibles: number
  ) {
    const { width } = scene.cameras.main;
    this.totalCollectibles = totalCollectibles;

    this.scoreText = scene.add.text(16, 16, 'Punteggio: 0', TITLE_STYLE);

    this.livesText = scene.add
      .text(width / 2, 16, 'Vite: ❤️❤️❤️', TITLE_STYLE)
      .setOrigin(0.5, 0);

    this.levelText = scene.add
      .text(
        width - 16,
        16,
        `${getEraName(levelConfig.era)} - Livello ${level}`,
        TITLE_STYLE
      )
      .setOrigin(1, 0);

    this.collectiblesText = scene.add.text(
      16,
      45,
      `Oggetti: ${totalCollectibles}/${totalCollectibles}`,
      COUNTER_STYLE
    );
  }

  setScore(score: number): void {
    this.scoreText.setText(`Punteggio: ${score}`);
  }

  setLives(lives: number): void {
    const hearts = '❤️'.repeat(Math.max(0, lives));
    this.livesText.setText(`Vite: ${hearts}`);
  }

  setCollectiblesRemaining(remaining: number): void {
    this.collectiblesText.setText(
      `Oggetti: ${remaining}/${this.totalCollectibles}`
    );
  }
}
