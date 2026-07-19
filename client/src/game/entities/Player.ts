import Phaser from 'phaser';

const BASE_SPEED = 160;

/**
 * Incapsula il giocatore: sprite fisico, input (frecce + WASD),
 * stati temporanei (velocita', invincibilita', scudo).
 * Estratto da GameScene in v2.0.0.
 */
export class Player {
  private sprite!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private speed: number = BASE_SPEED;
  private invincible: boolean = false;
  private shield: boolean = false;

  constructor(private scene: Phaser.Scene) {}

  create(x: number, y: number): void {
    this.sprite = this.scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.createAnimations();

    const kb = this.scene.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  /**
   * Registra le animazioni del player (manager globale: la guardia evita
   * la ri-registrazione al restart della scena).
   */
  private createAnimations(): void {
    const anims = this.scene.anims;
    if (anims.exists('player-walk')) return;

    anims.create({
      key: 'player-walk',
      frames: [
        { key: 'player' },
        { key: 'player-walk-a' },
        { key: 'player' },
        { key: 'player-walk-b' },
      ],
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: 'player-idle',
      frames: [
        { key: 'player', duration: 2400 },
        { key: 'player-blink', duration: 120 },
      ],
      repeat: -1,
    });
  }

  update(): void {
    if (!this.sprite || !this.cursors) return;
    this.sprite.setVelocity(0);

    let moving = false;
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.sprite.setVelocityX(-this.speed);
      moving = true;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.sprite.setVelocityX(this.speed);
      moving = true;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.sprite.setVelocityY(-this.speed);
      moving = true;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.sprite.setVelocityY(this.speed);
      moving = true;
    }

    this.sprite.anims.play(moving ? 'player-walk' : 'player-idle', true);
  }

  getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  get x(): number {
    return this.sprite?.x ?? 0;
  }

  get y(): number {
    return this.sprite?.y ?? 0;
  }

  get isInvincible(): boolean {
    return this.invincible;
  }

  get hasShield(): boolean {
    return this.shield;
  }

  resetPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  applyTemporarySpeed(targetSpeed: number, duration: number): void {
    this.speed = targetSpeed;
    this.scene.time.delayedCall(duration, () => {
      this.speed = BASE_SPEED;
    });
  }

  makeInvincible(duration: number): void {
    this.invincible = true;

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 200,
      yoyo: true,
      repeat: duration / 400,
    });

    this.scene.time.delayedCall(duration, () => {
      this.invincible = false;
      this.sprite.setAlpha(1);
    });
  }

  activateShield(): void {
    this.shield = true;
  }

  consumeShield(): void {
    this.shield = false;
  }
}
