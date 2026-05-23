import Phaser from 'phaser';
import type { LevelConfig } from '../data/LevelData';
import { LevelGenerator, type WallSegment } from '../utils/LevelGenerator';
import type { Player } from './Player';

export enum EnemyType {
  GLITCH = 'glitch',
  BUG = 'bug',
  LAG = 'lag',
  DRM = 'drm',
  HATER = 'hater',
}

const HATER_PROJECTILE_SPEED = 150;
const HATER_PROJECTILE_SLOWDOWN_SPEED = 80;
const HATER_PROJECTILE_SLOWDOWN_MS = 3000;
const HATER_PROJECTILE_LIFETIME_MS = 5000;

/**
 * Gestisce spawn, movimento, timer e proiettili di tutti i nemici.
 * Tiene traccia dei timer per-nemico per evitare leak su scene change.
 * Estratto da GameScene in v2.0.0.
 */
export class EnemyManager {
  private group!: Phaser.Physics.Arcade.Group;
  private enemyTimers: Map<Phaser.Physics.Arcade.Sprite, Phaser.Time.TimerEvent[]> = new Map();
  private player!: Player;

  constructor(private scene: Phaser.Scene) {}

  create(levelConfig: LevelConfig, wallSegments: WallSegment[], player: Player): void {
    this.group = this.scene.physics.add.group();
    this.player = player;

    const baseSpeed = levelConfig.enemySpeedMultiplier;
    const enemyTypes: Array<{ type: EnemyType; speed: number; count: number }> = [
      { type: EnemyType.GLITCH, speed: 80 * baseSpeed, count: levelConfig.enemies.glitch },
      { type: EnemyType.BUG, speed: 100 * baseSpeed, count: levelConfig.enemies.bug },
      { type: EnemyType.LAG, speed: 60 * baseSpeed, count: levelConfig.enemies.lag },
      { type: EnemyType.DRM, speed: 40 * baseSpeed, count: levelConfig.enemies.drm },
      { type: EnemyType.HATER, speed: 70 * baseSpeed, count: levelConfig.enemies.hater },
    ];

    const { width, height } = this.scene.cameras.main;
    const margin = 100;

    enemyTypes.forEach(({ type, speed, count }) => {
      for (let i = 0; i < count; i++) {
        const pos = LevelGenerator.findFreePosition(wallSegments, width, height, margin, 35);
        if (!pos) continue;

        // Mantieni distanza minima dallo spawn del player (centro mappa)
        const distFromCenter = Math.sqrt(
          Math.pow(pos.x - width / 2, 2) + Math.pow(pos.y - height / 2, 2),
        );
        if (distFromCenter <= 150) continue;

        const enemy = this.group.create(pos.x, pos.y, type) as Phaser.Physics.Arcade.Sprite;
        enemy.setData('type', type);
        enemy.setData('speed', speed);

        if (count > 0) {
          this.setupMovement(enemy, type);
        }
      }
    });
  }

  update(walls: Phaser.Physics.Arcade.StaticGroup | undefined): void {
    if (!this.group || !walls) return;

    this.group.children.entries.forEach((enemy: Phaser.GameObjects.GameObject) => {
      const sprite = enemy as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) return;

      const type = sprite.getData('type') as EnemyType;
      const speed = sprite.getData('speed') as number;

      // LAG: rimbalza sui muri invertendo velocita'
      if (type === EnemyType.LAG && sprite.body) {
        const body = sprite.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.left || body.blocked.right) body.velocity.x *= -1;
        if (body.blocked.up || body.blocked.down) body.velocity.y *= -1;
      }

      // BUG: se bloccato dai muri, ripianifica con offset casuale
      if (type === EnemyType.BUG && sprite.body) {
        const body = sprite.body as Phaser.Physics.Arcade.Body;
        const blocked =
          body.blocked.left || body.blocked.right || body.blocked.up || body.blocked.down;
        if (blocked) {
          const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.player.x, this.player.y);
          const offset = Phaser.Math.Between(-90, 90) * (Math.PI / 180);
          const newAngle = angle + offset;
          sprite.setVelocity(Math.cos(newAngle) * speed, Math.sin(newAngle) * speed);
        }
      }
    });
  }

  /** Power-up CRT: ferma tutti i nemici per `duration` ms. */
  stunAll(duration: number): void {
    this.group.children.entries.forEach((enemy) => {
      const sprite = enemy as Phaser.Physics.Arcade.Sprite;
      sprite.setVelocity(0, 0);
      sprite.setTint(0x888888);
      this.scene.time.delayedCall(duration, () => {
        sprite.clearTint();
      });
    });
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.group;
  }

  /** Da chiamare in SHUTDOWN/DESTROY della scena per evitare leak di timer. */
  cleanup(): void {
    this.enemyTimers.forEach((timers) => {
      timers.forEach((t) => {
        if (t) this.scene.time.removeEvent(t);
      });
    });
    this.enemyTimers.clear();
  }

  private registerEnemyTimer(
    enemy: Phaser.Physics.Arcade.Sprite,
    timer: Phaser.Time.TimerEvent,
  ): void {
    const list = this.enemyTimers.get(enemy) || [];
    list.push(timer);
    this.enemyTimers.set(enemy, list);

    enemy.once(Phaser.GameObjects.Events.DESTROY, () => {
      const timers = this.enemyTimers.get(enemy);
      if (timers) {
        timers.forEach((t) => {
          if (t) this.scene.time.removeEvent(t);
        });
        this.enemyTimers.delete(enemy);
      }
    });
  }

  private setupMovement(enemy: Phaser.Physics.Arcade.Sprite, type: EnemyType): void {
    const speed = enemy.getData('speed') as number;

    switch (type) {
      case EnemyType.GLITCH:
        this.scene.tweens.add({
          targets: enemy,
          x: enemy.x + 100,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Linear',
        });
        break;

      case EnemyType.BUG: {
        const timer = this.scene.time.addEvent({
          delay: 100,
          callback: () => {
            if (enemy.active) {
              this.scene.physics.moveToObject(enemy, this.player.getSprite(), speed);
            }
          },
          loop: true,
        });
        this.registerEnemyTimer(enemy, timer);
        break;
      }

      case EnemyType.DRM:
        this.scene.tweens.add({
          targets: enemy,
          x: enemy.x + 50,
          y: enemy.y + 50,
          duration: 4000,
          yoyo: true,
          repeat: -1,
          ease: 'Linear',
        });
        break;

      case EnemyType.HATER: {
        const timer = this.scene.time.addEvent({
          delay: 3000,
          callback: () => this.spawnHaterProjectile(enemy),
          loop: true,
        });
        this.registerEnemyTimer(enemy, timer);
        break;
      }

      case EnemyType.LAG: {
        const timer = this.scene.time.addEvent({
          delay: Phaser.Math.Between(500, 1500),
          callback: () => {
            if (!enemy.active) return;
            const angle = Phaser.Math.Between(0, 360);
            const rad = Phaser.Math.DegToRad(angle);
            enemy.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);
            this.scene.time.delayedCall(Phaser.Math.Between(300, 800), () => {
              if (enemy.active) enemy.setVelocity(0, 0);
            });
          },
          loop: true,
        });
        this.registerEnemyTimer(enemy, timer);
        break;
      }
    }
  }

  private spawnHaterProjectile(enemy: Phaser.Physics.Arcade.Sprite): void {
    if (!enemy.active) return;

    const projectile = this.scene.add.circle(enemy.x, enemy.y, 4, 0xff0000);
    this.scene.physics.add.existing(projectile);
    this.scene.physics.moveToObject(projectile, this.player.getSprite(), HATER_PROJECTILE_SPEED);

    this.scene.physics.add.overlap(this.player.getSprite(), projectile, () => {
      if (!this.player.isInvincible) {
        this.player.applyTemporarySpeed(
          HATER_PROJECTILE_SLOWDOWN_SPEED,
          HATER_PROJECTILE_SLOWDOWN_MS,
        );
      }
      projectile.destroy();
    });

    this.scene.time.delayedCall(HATER_PROJECTILE_LIFETIME_MS, () => {
      if (projectile && projectile.active) projectile.destroy();
    });
  }
}
