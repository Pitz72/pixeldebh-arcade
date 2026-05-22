import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';
import { getLevelConfig, getEraName, type LevelConfig } from '../data/LevelData';
import { SoundManager } from '../utils/SoundManager';
import { LevelGenerator, type WallSegment } from '../utils/LevelGenerator';

// Tipi di oggetti da collezione
enum CollectibleType {
  FLOPPY = 'floppy',
  CARTRIDGE = 'cartridge',
  CD = 'cd',
  COMPUTER = 'computer',
  CONSOLE = 'console'
}

// Tipi di nemici
enum EnemyType {
  GLITCH = 'glitch',
  BUG = 'bug',
  LAG = 'lag',
  DRM = 'drm',
  HATER = 'hater'
}

// Tipi di power-up
enum PowerUpType {
  COFFEE = 'coffee',
  JOYSTICK = 'joystick',
  BUBBLE = 'bubble',
  CRT = 'crt'
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private isPaused: boolean = false;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private powerUps!: Phaser.Physics.Arcade.Group;
  
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  private collectiblesRemaining: number = 0;
  private levelConfig!: LevelConfig;
  
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private collectiblesText!: Phaser.GameObjects.Text;
  
  private playerSpeed: number = 160;
  private isInvincible: boolean = false;
  private hasShield: boolean = false;
  private soundManager!: SoundManager;
  private wallSegments: WallSegment[] = [];
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  // Tracking risorse per evitare memory leak su shutdown/level change
  private activeTimers: Phaser.Time.TimerEvent[] = [];
  private enemyTimers: Map<Phaser.Physics.Arcade.Sprite, Phaser.Time.TimerEvent[]> = new Map();

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Genera tutti gli sprite del gioco
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

    // Sfondo basato sull'era
    this.add.rectangle(0, 0, width, height, this.levelConfig.backgroundColor).setOrigin(0);
    
    // Griglia di sfondo stile circuito
    this.createBackgroundGrid();

    // Creazione muri/barriere
    this.createWalls();

    // Creazione giocatore
    this.createPlayer();

    // Creazione oggetti da collezione
    this.createCollectibles();

    // Creazione nemici
    this.createEnemies();

    // Creazione power-ups
    this.createPowerUps();

    // UI
    this.createUI();

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // Aggiungi supporto WASD
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Collisioni
    this.setupCollisions();

    // Pausa (toggle)
    this.input.keyboard?.on('keydown-P', () => {
      if (this.isPaused) {
        this.scene.resume();
        this.isPaused = false;
      } else {
        this.scene.pause();
        this.isPaused = true;
        this.showPauseMenu();
      }
    });

    // Cleanup totale su shutdown della scena: cancella timer e tween per evitare leak
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupScene, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.cleanupScene, this);
  }

  private cleanupScene() {
    // Cancella tutti i timer di scena tracciati
    this.activeTimers.forEach((t) => {
      if (t) this.time.removeEvent(t);
    });
    this.activeTimers = [];

    // Cancella timer per-nemico
    this.enemyTimers.forEach((timers) => {
      timers.forEach((t) => {
        if (t) this.time.removeEvent(t);
      });
    });
    this.enemyTimers.clear();

    // Stoppa tutti i tween della scena (animazioni con repeat:-1)
    this.tweens.killAll();
  }

  private registerEnemyTimer(enemy: Phaser.Physics.Arcade.Sprite, timer: Phaser.Time.TimerEvent) {
    const list = this.enemyTimers.get(enemy) || [];
    list.push(timer);
    this.enemyTimers.set(enemy, list);
    // Quando il nemico viene distrutto, rimuovi i suoi timer
    enemy.once(Phaser.GameObjects.Events.DESTROY, () => {
      const timers = this.enemyTimers.get(enemy);
      if (timers) {
        timers.forEach((t) => {
          if (t) this.time.removeEvent(t);
        });
        this.enemyTimers.delete(enemy);
      }
    });
  }

  update() {
    this.handlePlayerMovement();
    this.updateEnemies();
  }

  private updateEnemies() {
    if (!this.enemies || !this.walls) return;

    // Controlla ogni nemico per collisioni con muri e gestisci il comportamento
    this.enemies.children.entries.forEach((enemy: any) => {
      const sprite = enemy as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) return;

      const type = sprite.getData('type');
      const speed = sprite.getData('speed');

      // Per nemici che usano velocity (LAG), inverti direzione se collidono
      if (type === EnemyType.LAG && sprite.body) {
        const body = sprite.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.left || body.blocked.right) {
          body.velocity.x *= -1;
        }
        if (body.blocked.up || body.blocked.down) {
          body.velocity.y *= -1;
        }
      }

      // Per BUG che insegue, verifica se può raggiungere il giocatore
      if (type === EnemyType.BUG && sprite.body) {
        const body = sprite.body as Phaser.Physics.Arcade.Body;
        // Se bloccato, prova a muoverti in direzione alternativa
        if ((body.blocked.left || body.blocked.right || body.blocked.up || body.blocked.down) && this.player) {
          const angle = Phaser.Math.Angle.Between(
            sprite.x, sprite.y,
            this.player.x, this.player.y
          );
          // Aggiungi offset casuale per evitare blocco permanente
          const offset = Phaser.Math.Between(-90, 90) * (Math.PI / 180);
          const newAngle = angle + offset;
          sprite.setVelocity(
            Math.cos(newAngle) * speed,
            Math.sin(newAngle) * speed
          );
        }
      }
    });
  }

  private createBackgroundGrid() {
    const { width, height } = this.cameras.main;
    const graphics = this.add.graphics();
    graphics.lineStyle(1, this.levelConfig.gridColor, 0.5);

    // Linee verticali
    for (let x = 0; x < width; x += 40) {
      graphics.lineBetween(x, 0, x, height);
    }

    // Linee orizzontali
    for (let y = 0; y < height; y += 40) {
      graphics.lineBetween(0, y, width, y);
    }
  }

  private createWalls() {
    const { width, height } = this.cameras.main;
    this.wallSegments = LevelGenerator.generateWalls(this.level, width, height);
    
    // Calcola colore muri basato sul colore della griglia
    const wallColor = this.levelConfig.gridColor + 0x101010;
    this.walls = LevelGenerator.createWallsInScene(this, this.wallSegments, wallColor);
  }

  private createPlayer() {
    const { width, height } = this.cameras.main;
    this.player = this.physics.add.sprite(width / 2, height / 2, 'player');
    this.player.setCollideWorldBounds(true);
  }

  private createCollectibles() {
    this.collectibles = this.physics.add.group();
    
    // Creiamo diversi tipi di oggetti da collezione basati sul livello
    const types = [
      { type: CollectibleType.FLOPPY, points: 10, count: this.levelConfig.collectibles.floppy },
      { type: CollectibleType.CARTRIDGE, points: 15, count: this.levelConfig.collectibles.cartridge },
      { type: CollectibleType.CD, points: 20, count: this.levelConfig.collectibles.cd },
      { type: CollectibleType.COMPUTER, points: 50, count: this.levelConfig.collectibles.computer },
      { type: CollectibleType.CONSOLE, points: 100, count: this.levelConfig.collectibles.console }
    ];

    const { width, height } = this.cameras.main;
    const margin = 80;

    types.forEach(({ type, points, count }) => {
      for (let i = 0; i < count; i++) {
        const pos = LevelGenerator.findFreePosition(this.wallSegments, width, height, margin, 25);
        
        if (pos) {
          const collectible = this.collectibles.create(pos.x, pos.y, type);
          collectible.setData('points', points);
          collectible.setData('type', type);
          
          // Animazione fluttuante
          this.tweens.add({
            targets: collectible,
            y: collectible.y - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }
    });

    this.collectiblesRemaining = this.collectibles.getLength();
  }

  private createEnemies() {
    this.enemies = this.physics.add.group();
    
    const baseSpeed = this.levelConfig.enemySpeedMultiplier;
    const enemyTypes = [
      { type: EnemyType.GLITCH, speed: 80 * baseSpeed, count: this.levelConfig.enemies.glitch },
      { type: EnemyType.BUG, speed: 100 * baseSpeed, count: this.levelConfig.enemies.bug },
      { type: EnemyType.LAG, speed: 60 * baseSpeed, count: this.levelConfig.enemies.lag },
      { type: EnemyType.DRM, speed: 40 * baseSpeed, count: this.levelConfig.enemies.drm },
      { type: EnemyType.HATER, speed: 70 * baseSpeed, count: this.levelConfig.enemies.hater }
    ];

    const { width, height } = this.cameras.main;
    const margin = 100;

    enemyTypes.forEach(({ type, speed, count }) => {
      for (let i = 0; i < count; i++) {
        const pos = LevelGenerator.findFreePosition(this.wallSegments, width, height, margin, 35);
        
        if (pos) {
          // Verifica distanza dal centro (spawn giocatore)
          const distFromCenter = Math.sqrt(
            Math.pow(pos.x - width / 2, 2) + 
            Math.pow(pos.y - height / 2, 2)
          );
          
          if (distFromCenter > 150) {
            const enemy = this.enemies.create(pos.x, pos.y, type);
            enemy.setData('type', type);
            enemy.setData('speed', speed);
            
            // Movimento base
            if (count > 0) {
              this.setupEnemyMovement(enemy, type);
            }
          }
        }
      }
    });
  }

  private setupEnemyMovement(enemy: Phaser.Physics.Arcade.Sprite, type: EnemyType) {
    const speed = enemy.getData('speed');

    switch (type) {
      case EnemyType.GLITCH:
        // Movimento prevedibile in pattern
        this.tweens.add({
          targets: enemy,
          x: enemy.x + 100,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Linear'
        });
        break;

      case EnemyType.BUG: {
        // Insegue il giocatore
        const bugTimer = this.time.addEvent({
          delay: 100,
          callback: () => {
            if (this.player && enemy.active) {
              this.physics.moveToObject(enemy, this.player, speed);
            }
          },
          loop: true
        });
        this.registerEnemyTimer(enemy, bugTimer);
        break;
      }

      case EnemyType.DRM:
        // Movimento lento e costante
        this.tweens.add({
          targets: enemy,
          x: enemy.x + 50,
          y: enemy.y + 50,
          duration: 4000,
          yoyo: true,
          repeat: -1,
          ease: 'Linear'
        });
        break;

      case EnemyType.HATER: {
        // Lancia proiettili periodicamente
        const haterTimer = this.time.addEvent({
          delay: 3000,
          callback: () => {
            if (enemy.active && this.player) {
              // Crea un proiettile che rallenta
              const projectile = this.add.circle(enemy.x, enemy.y, 4, 0xff0000);
              this.physics.add.existing(projectile);
              this.physics.moveToObject(projectile, this.player, 150);

              // Collisione proiettile con giocatore
              this.physics.add.overlap(this.player, projectile, () => {
                if (!this.isInvincible) {
                  this.playerSpeed = 80;
                  this.time.delayedCall(3000, () => {
                    this.playerSpeed = 160;
                  });
                }
                projectile.destroy();
              });

              // Distruggi proiettile dopo 5 secondi
              this.time.delayedCall(5000, () => {
                if (projectile && projectile.active) projectile.destroy();
              });
            }
          },
          loop: true
        });
        this.registerEnemyTimer(enemy, haterTimer);
        break;
      }

      case EnemyType.LAG: {
        // Movimento a scatti
        const lagTimer = this.time.addEvent({
          delay: Phaser.Math.Between(500, 1500),
          callback: () => {
            if (enemy.active) {
              const angle = Phaser.Math.Between(0, 360);
              const rad = Phaser.Math.DegToRad(angle);
              enemy.setVelocity(
                Math.cos(rad) * speed,
                Math.sin(rad) * speed
              );

              this.time.delayedCall(Phaser.Math.Between(300, 800), () => {
                if (enemy.active) enemy.setVelocity(0, 0);
              });
            }
          },
          loop: true
        });
        this.registerEnemyTimer(enemy, lagTimer);
        break;
      }
    }
  }

  private createPowerUps() {
    this.powerUps = this.physics.add.group();
    
    // Spawn power-up casuale basato sulla probabilità del livello
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
    
    // Animazione rotazione
    this.tweens.add({
      targets: powerUp,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
  }

  private createUI() {
    const { width } = this.cameras.main;
    
    this.scoreText = this.add.text(16, 16, 'Punteggio: 0', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.livesText = this.add.text(width / 2, 16, 'Vite: ❤️❤️❤️', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);

    this.levelText = this.add.text(width - 16, 16, `${getEraName(this.levelConfig.era)} - Livello ${this.level}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0);

    // Contatore oggetti rimanenti
    const totalCollectibles = this.collectiblesRemaining;
    this.collectiblesText = this.add.text(16, 45, `Oggetti: ${totalCollectibles}/${totalCollectibles}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3
    });
  }

  private setupCollisions() {
    // Collisione giocatore con muri
    this.physics.add.collider(this.player, this.walls);
    
    // Collisione nemici con muri
    this.physics.add.collider(this.enemies, this.walls);
    
    // Collisione con oggetti da collezione
    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectItem,
      undefined,
      this
    );

    // Collisione con nemici
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hitEnemy,
      undefined,
      this
    );

    // Collisione con power-ups
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.collectPowerUp,
      undefined,
      this
    );
  }

  private handlePlayerMovement() {
    if (!this.player || !this.cursors) return;

    this.player.setVelocity(0);

    // Supporto frecce direzionali e WASD
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
    }
  }

  private collectItem(
    player: any,
    collectible: any
  ) {
    const sprite = collectible as Phaser.Physics.Arcade.Sprite;
    const points = sprite.getData('points');
    
    this.score += points;
    this.scoreText.setText(`Punteggio: ${this.score}`);
    
    this.collectiblesRemaining--;
    const totalCollectibles = this.collectibles.getLength() + this.collectiblesRemaining;
    this.collectiblesText.setText(`Oggetti: ${this.collectiblesRemaining}/${totalCollectibles}`);
    
    sprite.destroy();
    
    this.soundManager.playCollect();

    // Effetto visivo
    const text = this.add.text(sprite.x, sprite.y, `+${points}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffff00'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });

    // Verifica completamento livello
    if (this.collectiblesRemaining === 0) {
      this.completeLevel();
    }
  }

  private hitEnemy(
    player: any,
    enemy: any
  ) {
    if (this.isInvincible) {
      // Se invincibile, elimina il nemico
      const sprite = enemy as Phaser.Physics.Arcade.Sprite;
      sprite.destroy();
      this.score += 50;
      this.scoreText.setText(`Punteggio: ${this.score}`);
      this.soundManager.playEnemyDestroyed();
      return;
    }

    if (this.hasShield) {
      // Lo scudo assorbe il colpo
      this.hasShield = false;
      this.soundManager.playMenuClick();
      return;
    }

    // Perde una vita
    this.lives--;
    this.soundManager.playHit();
    this.updateLivesDisplay();

    if (this.lives <= 0) {
      this.gameOver();
    } else {
      // Invincibilità temporanea
      this.makePlayerInvincible(2000);
      
      // Riposiziona il giocatore
      const { width, height } = this.cameras.main;
      this.player.setPosition(width / 2, height / 2);
    }
  }

  private collectPowerUp(
    player: any,
    powerUp: any
  ) {
    const sprite = powerUp as Phaser.Physics.Arcade.Sprite;
    const type = sprite.getData('type') as PowerUpType;
    
    sprite.destroy();
    this.soundManager.playPowerUp();
    this.activatePowerUp(type);
  }

  private activatePowerUp(type: PowerUpType) {
    switch (type) {
      case PowerUpType.COFFEE:
        // Velocità aumentata
        this.playerSpeed = 240;
        this.time.delayedCall(8000, () => {
          this.playerSpeed = 160;
        });
        this.showPowerUpMessage('Velocità aumentata!');
        break;

      case PowerUpType.JOYSTICK:
        // Invincibilità
        this.makePlayerInvincible(10000);
        this.showPowerUpMessage('Invincibile!');
        break;

      case PowerUpType.BUBBLE:
        // Scudo
        this.hasShield = true;
        this.showPowerUpMessage('Scudo attivo!');
        break;

      case PowerUpType.CRT:
        // Stordisce tutti i nemici
        this.enemies.children.entries.forEach((enemy) => {
          const sprite = enemy as Phaser.Physics.Arcade.Sprite;
          sprite.setVelocity(0, 0);
          sprite.setTint(0x888888);
          
          this.time.delayedCall(3000, () => {
            sprite.clearTint();
          });
        });
        this.showPowerUpMessage('Nemici storditi!');
        break;
    }
  }

  private makePlayerInvincible(duration: number) {
    this.isInvincible = true;
    
    // Effetto lampeggiante
    this.tweens.add({
      targets: this.player,
      alpha: 0.3,
      duration: 200,
      yoyo: true,
      repeat: duration / 400
    });

    this.time.delayedCall(duration, () => {
      this.isInvincible = false;
      this.player.setAlpha(1);
    });
  }

  private showPowerUpMessage(message: string) {
    const { width, height } = this.cameras.main;
    const text = this.add.text(width / 2, height / 2, message, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 50,
      duration: 2000,
      onComplete: () => text.destroy()
    });
  }

  private updateLivesDisplay() {
    const hearts = '❤️'.repeat(Math.max(0, this.lives));
    this.livesText.setText(`Vite: ${hearts}`);
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
      strokeThickness: 6
    }).setOrigin(0.5);

    const bonus = this.add.text(width / 2, height / 2 + 20, `Bonus Vite: +${bonusPoints}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.soundManager.playLevelComplete();
    
    this.time.delayedCall(3000, () => {
      message.destroy();
      bonus.destroy();
      
      // Verifica se ci sono altri livelli
      if (this.level >= 9) {
        this.showVictoryScreen();
      } else {
        // Usa scene.start invece di scene.restart per evitare problemi
        this.scene.start('GameScene', { level: this.level + 1, score: this.score, lives: this.lives });
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
    
    // Overlay scuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.9).setOrigin(0);
    
    // Messaggio vittoria
    this.add.text(width / 2, height / 3, 'VITTORIA!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '64px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Hai salvato la Storia del Videogioco!', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 50, `Punteggio Finale: ${this.score}`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '32px',
      color: '#00ff00'
    }).setOrigin(0.5);

    const menuButton = this.add.text(width / 2, height * 0.75, 'TORNA AL MENU (SPAZIO)', {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4a90e2',
      padding: { x: 20, y: 10 }
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
      align: 'center'
    }).setOrigin(0.5).setDepth(1001);

    // Listener per rimuovere overlay quando si riprende
    const resumeListener = () => {
      overlay.destroy();
      text.destroy();
    };
    
    this.events.once('resume', resumeListener);
  }
}
