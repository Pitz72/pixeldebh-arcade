import Phaser from 'phaser';

export interface WallSegment {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Generatore procedurale di layout labirinti stile Pac-Man
 */
export class LevelGenerator {
  private static readonly WALL_THICKNESS = 20;
  private static readonly CORRIDOR_WIDTH = 60;
  
  /**
   * Genera un labirinto complesso stile Pac-Man per un livello specifico
   */
  static generateWalls(levelNumber: number, width: number, height: number): WallSegment[] {
    const walls: WallSegment[] = [];
    const margin = 80;
    const playableWidth = width - 2 * margin;
    const playableHeight = height - 2 * margin;
    
    switch (levelNumber) {
      case 1:
        // Livello 1: Labirinto semplice con corridoi orizzontali e verticali
        this.addHorizontalWall(walls, margin + 100, margin + 100, 200);
        this.addHorizontalWall(walls, width - margin - 300, margin + 100, 200);
        
        this.addVerticalWall(walls, margin + 100, margin + 150, 180);
        this.addVerticalWall(walls, width - margin - 100, margin + 150, 180);
        
        this.addHorizontalWall(walls, margin + 100, height - margin - 220, 200);
        this.addHorizontalWall(walls, width - margin - 300, height - margin - 220, 200);
        
        this.addVerticalWall(walls, margin + 100, height - margin - 200, 80);
        this.addVerticalWall(walls, width - margin - 100, height - margin - 200, 80);
        
        // Muri centrali
        this.addHorizontalWall(walls, width / 2 - 100, height / 2 - 60, 80);
        this.addHorizontalWall(walls, width / 2 + 20, height / 2 - 60, 80);
        this.addVerticalWall(walls, width / 2 - 10, height / 2 - 40, 80);
        break;
        
      case 2:
        // Livello 2: Griglia con stanze
        for (let i = 0; i < 3; i++) {
          const x = margin + 120 + i * 220;
          this.addVerticalWall(walls, x, margin + 80, 150);
          this.addVerticalWall(walls, x, height - margin - 230, 150);
        }
        
        this.addHorizontalWall(walls, margin + 80, margin + 250, 180);
        this.addHorizontalWall(walls, width - margin - 260, margin + 250, 180);
        
        this.addHorizontalWall(walls, margin + 80, height - margin - 270, 180);
        this.addHorizontalWall(walls, width - margin - 260, height - margin - 270, 180);
        
        // Blocchi centrali
        this.addRectWall(walls, width / 2 - 60, height / 2 - 40, 50, 80);
        this.addRectWall(walls, width / 2 + 10, height / 2 - 40, 50, 80);
        break;
        
      case 3:
        // Livello 3: Labirinto a serpente
        let y = margin + 80;
        for (let i = 0; i < 4; i++) {
          if (i % 2 === 0) {
            this.addHorizontalWall(walls, margin + 80, y, playableWidth - 200);
          } else {
            this.addHorizontalWall(walls, margin + 180, y, playableWidth - 200);
          }
          y += 120;
        }
        
        // Collegamenti verticali
        this.addVerticalWall(walls, margin + 80, margin + 100, 100);
        this.addVerticalWall(walls, width - margin - 100, margin + 220, 100);
        this.addVerticalWall(walls, margin + 80, margin + 340, 100);
        break;
        
      case 4:
        // Livello 4: Quattro quadranti
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Croce centrale
        this.addHorizontalWall(walls, margin + 100, centerY - 10, centerX - margin - 180);
        this.addHorizontalWall(walls, centerX + 80, centerY - 10, centerX - margin - 180);
        this.addVerticalWall(walls, centerX - 10, margin + 100, centerY - margin - 180);
        this.addVerticalWall(walls, centerX - 10, centerY + 80, centerY - margin - 180);
        
        // Blocchi nei quadranti
        this.addRectWall(walls, margin + 180, margin + 150, 80, 80);
        this.addRectWall(walls, width - margin - 260, margin + 150, 80, 80);
        this.addRectWall(walls, margin + 180, height - margin - 230, 80, 80);
        this.addRectWall(walls, width - margin - 260, height - margin - 230, 80, 80);
        break;
        
      case 5:
        // Livello 5: Spirale
        this.addHorizontalWall(walls, margin + 80, margin + 80, playableWidth - 160);
        this.addVerticalWall(walls, width - margin - 100, margin + 100, playableHeight - 240);
        this.addHorizontalWall(walls, margin + 160, height - margin - 100, playableWidth - 240);
        this.addVerticalWall(walls, margin + 180, margin + 180, playableHeight - 360);
        this.addHorizontalWall(walls, margin + 200, margin + 180, playableWidth - 400);
        this.addVerticalWall(walls, width - margin - 200, margin + 200, playableHeight - 480);
        this.addHorizontalWall(walls, margin + 280, height - margin - 200, playableWidth - 560);
        break;
        
      case 6:
        // Livello 6: Labirinto complesso a griglia
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 4; col++) {
            const x = margin + 100 + col * 180;
            const y = margin + 100 + row * 140;
            
            if ((row + col) % 2 === 0) {
              this.addRectWall(walls, x, y, 100, 20);
            } else {
              this.addRectWall(walls, x, y, 20, 80);
            }
          }
        }
        break;
        
      case 7:
        // Livello 7: Corridoi stretti e incroci
        const corridorY = [margin + 120, height / 2 - 10, height - margin - 140];
        corridorY.forEach(y => {
          this.addHorizontalWall(walls, margin + 80, y - 30, 150);
          this.addHorizontalWall(walls, width - margin - 230, y - 30, 150);
          this.addHorizontalWall(walls, margin + 80, y + 30, 150);
          this.addHorizontalWall(walls, width - margin - 230, y + 30, 150);
        });
        
        const corridorX = [margin + 200, width / 2 - 10, width - margin - 220];
        corridorX.forEach(x => {
          this.addVerticalWall(walls, x - 30, margin + 80, 120);
          this.addVerticalWall(walls, x + 30, margin + 80, 120);
          this.addVerticalWall(walls, x - 30, height - margin - 200, 120);
          this.addVerticalWall(walls, x + 30, height - margin - 200, 120);
        });
        break;
        
      case 8:
        // Livello 8: Labirinto concentrico
        const rings = 3;
        for (let ring = 0; ring < rings; ring++) {
          const offset = margin + 100 + ring * 100;
          const size = playableWidth - ring * 200;
          const sizeH = playableHeight - ring * 200;
          
          // Top
          this.addHorizontalWall(walls, offset, offset, size - 100);
          // Right
          this.addVerticalWall(walls, width - offset - 20, offset, sizeH - 100);
          // Bottom
          this.addHorizontalWall(walls, offset + 100, height - offset - 20, size - 100);
          // Left
          this.addVerticalWall(walls, offset, offset + 100, sizeH - 100);
        }
        break;
        
      case 9:
        // Livello 9 (Finale): Labirinto master complesso
        // Bordo esterno con aperture
        this.addHorizontalWall(walls, margin + 80, margin + 60, 200);
        this.addHorizontalWall(walls, width - margin - 280, margin + 60, 200);
        this.addVerticalWall(walls, margin + 80, margin + 80, 180);
        this.addVerticalWall(walls, width - margin - 100, margin + 80, 180);
        
        this.addHorizontalWall(walls, margin + 80, height - margin - 80, 200);
        this.addHorizontalWall(walls, width - margin - 280, height - margin - 80, 200);
        this.addVerticalWall(walls, margin + 80, height - margin - 260, 180);
        this.addVerticalWall(walls, width - margin - 100, height - margin - 260, 180);
        
        // Struttura interna complessa
        const gridSize = 6;
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            const x = margin + 160 + i * 100;
            const y = margin + 140 + j * 80;
            
            // Pattern complesso
            if ((i + j) % 3 === 0) {
              this.addRectWall(walls, x, y, 60, 20);
            } else if ((i + j) % 3 === 1) {
              this.addRectWall(walls, x, y, 20, 50);
            }
          }
        }
        break;
        
      default:
        // Livelli extra: pattern semplice
        this.addHorizontalWall(walls, margin + 100, margin + 100, 200);
        this.addVerticalWall(walls, width - margin - 100, margin + 100, 200);
        this.addHorizontalWall(walls, width - margin - 300, height - margin - 120, 200);
        this.addVerticalWall(walls, margin + 100, height - margin - 300, 200);
    }
    
    return walls;
  }
  
  /**
   * Aggiunge un muro orizzontale
   */
  private static addHorizontalWall(walls: WallSegment[], x: number, y: number, length: number) {
    walls.push({ x, y, width: length, height: this.WALL_THICKNESS });
  }
  
  /**
   * Aggiunge un muro verticale
   */
  private static addVerticalWall(walls: WallSegment[], x: number, y: number, length: number) {
    walls.push({ x, y, width: this.WALL_THICKNESS, height: length });
  }
  
  /**
   * Aggiunge un blocco rettangolare
   */
  private static addRectWall(walls: WallSegment[], x: number, y: number, w: number, h: number) {
    walls.push({ x, y, width: w, height: h });
  }
  
  /**
   * Verifica se una posizione è libera (non sovrapposta a muri)
   */
  static isPositionFree(x: number, y: number, walls: WallSegment[], margin: number = 30): boolean {
    for (const wall of walls) {
      if (x + margin > wall.x && 
          x - margin < wall.x + wall.width &&
          y + margin > wall.y && 
          y - margin < wall.y + wall.height) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Trova una posizione casuale libera
   */
  static findFreePosition(
    walls: WallSegment[], 
    width: number, 
    height: number, 
    margin: number = 100,
    objectMargin: number = 30
  ): { x: number; y: number } | null {
    const maxAttempts = 50;
    
    for (let i = 0; i < maxAttempts; i++) {
      const x = margin + Math.random() * (width - 2 * margin);
      const y = margin + Math.random() * (height - 2 * margin);
      
      // Evita il centro (spawn giocatore)
      const distFromCenter = Math.sqrt(
        Math.pow(x - width / 2, 2) + 
        Math.pow(y - height / 2, 2)
      );
      
      if (distFromCenter > 80 && this.isPositionFree(x, y, walls, objectMargin)) {
        return { x, y };
      }
    }
    
    return null;
  }
  
  /**
   * Crea i muri fisici nel gioco Phaser
   */
  static createWallsInScene(
    scene: Phaser.Scene, 
    walls: WallSegment[], 
    wallColor: number
  ): Phaser.Physics.Arcade.StaticGroup {
    const wallGroup = scene.physics.add.staticGroup();
    
    walls.forEach(wall => {
      const wallSprite = scene.add.rectangle(
        wall.x + wall.width / 2,
        wall.y + wall.height / 2,
        wall.width,
        wall.height,
        wallColor,
        0.9
      );
      
      // Aggiungi bordo per effetto 3D
      wallSprite.setStrokeStyle(3, wallColor + 0x303030);
      
      scene.physics.add.existing(wallSprite, true);
      wallGroup.add(wallSprite);
    });
    
    return wallGroup;
  }
}
