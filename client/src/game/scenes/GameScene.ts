import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';
import { getLevelConfig, type LevelConfig } from '../data/LevelData';
import { SoundManager } from '../utils/SoundManager';
import { LevelGenerator, type WallSegment } from '../utils/LevelGenerator';
import { HUD } from '../ui/HUD';
import { Player } from '../entities/Player';
import { EnemyManager } from '../entities/EnemyManager';

type ArcadeColliderObject =
  | Phaser.Types.Physics.Arcade.GameObjectWithBody
  | Phaser.Tilemaps.Tile
  | Phaser.Physics.Arcade.Body
  | Phaser.Physics.Arcade.StaticBody;

enum CollectibleType {
  FLOPPY = 'floppy',
  CARTRIDGE = 'cartridge',
  CD = 'cd',
  COMPUTER = 'computer',
  CONSOLE = 'console',
}

enum PowerUpType {
  COFFEE = 'coffee',
  JOYSTICK = 'joystick',
  BUBBLE = 'bubble',
  CRT = 'crt',
}

const PLAYER_BOOST_SPEED = 240;
const PLAYER_BOOST_MS = 8000;
const PLAYER_INVINCIBLE_POWERUP_MS = 10000;
const PLAYER_INVINCIBLE_HIT_MS = 2000;
const CRT_STUN_MS = 3000;

export class GameScene extends Phaser.Scene {
  private isPaused: boolean = false;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private powerUps!: Phaser.Physics.Arcade.Group;

  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  private collectiblesRemaining: number = 0;
  private levelConfig!: LevelConfig;

  private hud!: HUD;
  private soundManager!: SoundManager;
  private wallSegments: WallSegment[] = [];
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  private player!: Player;
  private enemyManager!: EnemyManager;

  private activeTimers: Phaser.Time.TimerEvent[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  /** Stato osservabile per test E2E. Non usare in runtime di gioco. */
  public getDebugState() {
    return {
      score: this.score,
      lives: this.lives,
      level: this.level,
      collectiblesRemaining: this.collectiblesRemaining,
      isPaused: this.isPaused,
      isInvincible: this.player?.isInvincible ?? false,
      hasShield: this.player?.hasShield ?? false,
      playerX: this.player?.x ?? null,
      playerY: this.player?.y ?? null,
    };
  }

  preload() {
    SpriteGenerator.generateAll(this);
  }

  init(data: { level?: number; score?: number; lives?: number }) {
    this.level = data.level || 1;
    this.score = data.score || 0;
    this.lives = data.lives || 3;
    this.levelConfig = getLevelConfig(this.level);
    this.soundManager = new SoundManager();
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(0, 0, width, height, this.levelConfig.backgroundColor).setOrigin(0);
    this.createBackgroundGrid();
    this.createWalls();

    this.player = new Player(this);
    this.player.create(width / 2, height / 2);

    this.createCollectibles();

    this.enemyManager = new EnemyManager(this);
    this.enemyManager.create(this.levelConfig, this.wallSegments, this.player);

    this.createPowerUps();
    this.createUI();
    this.setupCollisions();

    // Pausa: il listener di scena attiva la pausa; il resume e' gestito da un
    // listener DOM dentro showPauseMenu, perche' scene.pause() disabilita
    // l'input plugin della scena stessa.
    this.input.keyboard?.on('keydown-P', () => {
      if (this.isPaused) return;
      this.scene.pause();
      this.isPaused = true;
      this.showPauseMenu();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupScene, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanupScene, this);
  }

  update() {
    this.player?.update();
    this.enemyManager?.update(this.walls);
  }

  private cleanupScene() {
    this.activeTimers.forEach((t) => {
      if (t) this.time.removeEvent(t);
    });
    this.activeTimers = [];

    this.enemyManager?.cleanup();

    // Stoppa tutti i tween della scena (animazioni con repeat:-1)
    this.tweens.killAll();
  }

  private createBackgroundGrid() {
    const { width, height } = this.cameras.main;
    const graphics = this.add.graphics();
    graphics.lineStyle(1, this.levelConfig.gridColor, 0.5);

    for (let x = 0; x < width; x += 40) {
      graphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      graphics.lineBetween(0, y, width, y);
    }
  }

  private createWalls() {
    const { width, height } = this.cameras.main;
    this.wallSegments = LevelGenerator.generateWalls(this.level, width, height);
    const wallColor = this.levelConfig.gridColor + 0x101010;
    this.walls = LevelGenerator.createWallsInScene(this, this.wallSegments, wallColor);
  }

  private createCollectibles() {
    this.collectibles = this.physics.add.group();

    const types = [
      { type: CollectibleType.FLOPPY, points: 10, count: this.levelConfig.collectibles.floppy },
      { type: CollectibleType.CARTRIDGE, points: 15, count: this.levelConfig.collectibles.cartridge },
      { type: CollectibleType.CD, points: 20, count: this.levelConfig.collectibles.cd },
      { type: CollectibleType.COMPUTER, points: 50, count: this.levelConfig.collectibles.computer },
      { type: CollectibleType.CONSOLE, points: 100, count: this.levelConfig.collectibles.console },
    ];

    const { width, height } = this.cameras.main;
    const margin = 80;

    types.forEach(({ type, points, count }) => {
      for (let i = 0; i < count; i++) {
        const pos = LevelGenerator.findFreePosition(this.wallSegments, width, height, margin, 25);
        if (!pos) continue;

        const collectible = this.collectibles.create(pos.x, pos.y, type);
        collectible.setData('points', points);
        collectible.setData('type', type);

        this.tweens.add({
          targets: collectible,
          y: collectible.y - 5,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    });

    this.collectiblesRemaining = this.collectibles.getLength();
  }

  private createPowerUps() {
    this.powerUps = this.physics.add.group();

    if (Math.random() < this.levelConfig.powerUpChance) {
      const types = [PowerUpType.COFFEE, PowerUpType.JOYSTICK, PowerUpType.BUBBLE, PowerUpType.CRT];
      const randomType = Phaser.Utils.Array.GetRandom(types);
      const { width, height } = this.cameras.main;
      const pos = LevelGenerator.findFreePosition(this.wallSegments, width, height, 100, 25);

      if (pos) {
        this.spawnPowerUp(randomType, pos.x, pos.y);
      }
    }
  }

  private spawnPowerUp(type: PowerUpType, x: number, y: number) {
    const powerUp = this.powerUps.create(x, y, `powerup-${type}`);
    powerUp.setData('type', type);

    this.tweens.add({
      targets: powerUp,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  private createUI() {
    this.hud = new HUD(this, this.levelConfig, this.level, this.collectiblesRemaining);
  }

  private setupCollisions() {
    const playerSprite = this.player.getSprite();

    this.physics.add.collider(playerSprite, this.walls);
    this.physics.add.collider(this.enemyManager.getGroup(), this.walls);

    this.physics.add.overlap(playerSprite, this.collectibles, this.collectItem, undefined, this);
    this.physics.add.overlap(
      playerSprite,
      this.enemyManager.getGroup(),
      this.hitEnemy,
      undefined,
      this,
    );
    this.physics.add.overlap(playerSprite, this.powerUps, this.collectPowerUp, undefined, this);
  }

  private collectItem(_player: ArcadeColliderObject, collectible: ArcadeColliderObject) {
    const sprite = collectible as Phaser.Physics.Arcade.Sprite;
    const points = sprite.getData('points') as number;

    this.score += points;
    this.hud.setScore(this.score);

    this.collectiblesRemaining--;
    this.hud.setCollectiblesRemaining(this.collectiblesRemaining);

    sprite.destroy();
    this.soundManager.playCollect();

    const text = this.add.text(sprite.x, sprite.y, `+${points}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffff00',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy(),
    });

    if (this.collectiblesRemaining === 0) {
      this.completeLevel();
    }
  }

  private hitEnemy(_player: ArcadeColliderObject, enemy: ArcadeColliderObject) {
    if (this.player.isInvincible) {
      const sprite = enemy as Phaser.Physics.Arcade.Sprite;
      sprite.destroy();
      this.score += 50;
      this.hud.setScore(this.score);
      this.soundManager.playEnemyDestroyed();
      return;
    }

    if (this.player.hasShield) {
      this.player.consumeShield();
      this.soundManager.playMenuClick();
      return;
    }

    this.lives--;
    this.soundManager.playHit();
    this.hud.setLives(this.lives);

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.player.makeInvincible(PLAYER_INVINCIBLE_HIT_MS);
      const { width, height } = this.cameras.main;
      this.player.resetPosition(width / 2, height / 2);
    }
  }

  private collectPowerUp(_player: ArcadeColliderObject, powerUp: ArcadeColliderObject) {
    const sprite = powerUp as Phaser.Physics.Arcade.Sprite;
    const type = sprite.getData('type') as PowerUpType;

    sprite.destroy();
    this.soundManager.playPowerUp();
    this.activatePowerUp(type);
  }

  private activatePowerUp(type: PowerUpType) {
    switch (type) {
      case PowerUpType.COFFEE:
        this.player.applyTemporarySpeed(PLAYER_BOOST_SPEED, PLAYER_BOOST_MS);
        this.showPowerUpMessage('Velocità aumentata!');
        break;

      case PowerUpType.JOYSTICK:
        this.player.makeInvincible(PLAYER_INVINCIBLE_POWERUP_MS);
        this.showPowerUpMessage('Invincibile!');
        break;

      case PowerUpType.BUBBLE:
        this.player.activateShield();
        this.showPowerUpMessage('Scudo attivo!');
        break;

      case PowerUpType.CRT:
        this.enemyManager.stunAll(CRT_STUN_MS);
        this.showPowerUpMessage('Nemici storditi!');
        break;
    }
  }

  private showPowerUpMessage(message: string) {
    const { width, height } = this.cameras.main;
    const text = this.add.text(width / 2, height / 2, message, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 50,
      duration: 2000,
      onComplete: () => text.destroy(),
    });
  }

  private completeLevel() {
    const { width, height } = this.cameras.main;

    const bonusPoints = this.lives * 100;
    this.score += bonusPoints;

    const message = this.add.text(width / 2, height / 2 - 40, 'LIVELLO COMPLETATO!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '48px',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const bonus = this.add.text(width / 2, height / 2 + 20, `Bonus Vite: +${bonusPoints}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.soundManager.playLevelComplete();

    this.time.delayedCall(3000, () => {
      message.destroy();
      bonus.destroy();

      if (this.level >= 9) {
        this.showVictoryScreen();
      } else {
        this.scene.start('GameScene', {
          level: this.level + 1,
          score: this.score,
          lives: this.lives,
        });
      }
    });
  }

  private gameOver() {
    this.soundManager.playGameOver();
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  private showVictoryScreen() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.9).setOrigin(0);

    this.add.text(width / 2, height / 3, 'VITTORIA!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '64px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Hai salvato la Storia del Videogioco!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 50, `Punteggio Finale: ${this.score}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#00ff00',
    }).setOrigin(0.5);

    const menuButton = this.add.text(width / 2, height * 0.75, 'TORNA AL MENU (SPAZIO)', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4a90e2',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('MenuScene');
    });

    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  private showPauseMenu() {
    const { width, height } = this.cameras.main;

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setDepth(1000);
    const text = this.add.text(width / 2, height / 2, 'PAUSA\n\nPremi P per continuare', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setDepth(1001);

    // Listener DOM: l'input plugin della scena e' disattivato in pausa, quindi
    // intercettiamo P direttamente da window per consentire il resume.
    const onKey = (ev: KeyboardEvent) => {
      if (ev.code !== 'KeyP') return;
      window.removeEventListener('keydown', onKey);
      this.scene.resume();
      this.isPaused = false;
    };
    window.addEventListener('keydown', onKey);

    const resumeListener = () => {
      overlay.destroy();
      text.destroy();
      window.removeEventListener('keydown', onKey);
    };

    this.events.once('resume', resumeListener);
  }
}
