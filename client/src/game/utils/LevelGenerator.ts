import Phaser from 'phaser';

export interface WallSegment {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Generatore procedurale di layout per i livelli
 */
export class LevelGenerator {
  /**
   * Genera un layout di barriere/muri per un livello specifico
   */
  static generateWalls(levelNumber: number, width: number, height: number): WallSegment[] {
    const walls: WallSegment[] = [];
    const seed = levelNumber * 12345; // Seed per generazione procedurale consistente
    
    // Margini di sicurezza
    const margin = 100;
    const safeZoneRadius = 80; // Area sicura attorno al centro
    
    switch (levelNumber) {
      case 1:
        // Livello 1: Barriere semplici orizzontali e verticali
        walls.push(
          { x: margin + 100, y: height / 2 - 40, width: 150, height: 20 },
          { x: width - margin - 250, y: height / 2 - 40, width: 150, height: 20 },
          { x: width / 2 - 10, y: margin + 80, width: 20, height: 120 },
          { x: width / 2 - 10, y: height - margin - 200, width: 20, height: 120 }
        );
        break;
        
      case 2:
        // Livello 2: Forma a croce
        walls.push(
          { x: width / 2 - 10, y: margin + 50, width: 20, height: 180 },
          { x: width / 2 - 10, y: height - margin - 230, width: 20, height: 180 },
          { x: margin + 80, y: height / 2 - 10, width: 200, height: 20 },
          { x: width - margin - 280, y: height / 2 - 10, width: 200, height: 20 }
        );
        break;
        
      case 3:
        // Livello 3: Labirinto a L
        walls.push(
          { x: margin + 120, y: margin + 80, width: 20, height: 200 },
          { x: margin + 120, y: margin + 80, width: 180, height: 20 },
          { x: width - margin - 300, y: height - margin - 280, width: 20, height: 200 },
          { x: width - margin - 300, y: height - margin - 100, width: 180, height: 20 },
          { x: width / 2 - 80, y: height / 2 - 60, width: 160, height: 20 }
        );
        break;
        
      case 4:
        // Livello 4: Stanze separate
        walls.push(
          { x: width / 3 - 10, y: margin + 60, width: 20, height: height - 2 * margin - 120 },
          { x: 2 * width / 3 - 10, y: margin + 60, width: 20, height: height - 2 * margin - 120 },
          { x: margin + 80, y: height / 2 - 60, width: width / 3 - margin - 100, height: 20 },
          { x: 2 * width / 3 + 20, y: height / 2 + 40, width: width / 3 - margin - 40, height: 20 }
        );
        break;
        
      case 5:
        // Livello 5: Spirale
        walls.push(
          { x: margin + 100, y: margin + 80, width: width - 2 * margin - 200, height: 20 },
          { x: width - margin - 120, y: margin + 80, width: 20, height: 200 },
          { x: margin + 180, y: margin + 260, width: width - 2 * margin - 300, height: 20 },
          { x: margin + 180, y: margin + 160, width: 20, height: 100 },
          { x: margin + 100, y: height - margin - 180, width: width - 2 * margin - 200, height: 20 },
          { x: margin + 100, y: height - margin - 280, width: 20, height: 100 }
        );
        break;
        
      case 6:
        // Livello 6: Griglia complessa
        for (let i = 0; i < 3; i++) {
          const xPos = margin + 150 + i * 180;
          walls.push({ x: xPos, y: margin + 100, width: 20, height: 150 });
          walls.push({ x: xPos, y: height - margin - 250, width: 20, height: 150 });
        }
        for (let i = 0; i < 2; i++) {
          const yPos = margin + 180 + i * 160;
          walls.push({ x: margin + 120, y: yPos, width: 140, height: 20 });
          walls.push({ x: width - margin - 260, y: yPos, width: 140, height: 20 });
        }
        break;
        
      case 7:
        // Livello 7: Corridoi stretti
        walls.push(
          { x: margin + 140, y: margin + 80, width: 20, height: 240 },
          { x: margin + 140, y: margin + 80, width: 240, height: 20 },
          { x: width - margin - 380, y: margin + 80, width: 240, height: 20 },
          { x: width - margin - 160, y: margin + 80, width: 20, height: 240 },
          { x: margin + 140, y: height - margin - 320, width: 20, height: 240 },
          { x: margin + 140, y: height - margin - 100, width: 240, height: 20 },
          { x: width - margin - 380, y: height - margin - 100, width: 240, height: 20 },
          { x: width - margin - 160, y: height - margin - 320, width: 20, height: 240 }
        );
        break;
        
      case 8:
        // Livello 8: Forma a stella
        const centerX = width / 2;
        const centerY = height / 2;
        const starPoints = 5;
        const outerRadius = 180;
        const innerRadius = 80;
        
        for (let i = 0; i < starPoints; i++) {
          const angle1 = (i * 2 * Math.PI) / starPoints - Math.PI / 2;
          const angle2 = ((i + 0.5) * 2 * Math.PI) / starPoints - Math.PI / 2;
          
          const x1 = centerX + Math.cos(angle1) * outerRadius;
          const y1 = centerY + Math.sin(angle1) * outerRadius;
          const x2 = centerX + Math.cos(angle2) * innerRadius;
          const y2 = centerY + Math.sin(angle2) * innerRadius;
          
          // Crea un muro tra i punti
          const dx = x2 - x1;
          const dy = y2 - y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          if (Math.abs(dx) > Math.abs(dy)) {
            walls.push({ x: Math.min(x1, x2), y: (y1 + y2) / 2 - 10, width: length, height: 20 });
          } else {
            walls.push({ x: (x1 + x2) / 2 - 10, y: Math.min(y1, y2), width: 20, height: length });
          }
        }
        break;
        
      case 9:
        // Livello 9 (Finale): Labirinto complesso
        walls.push(
          // Bordo esterno
          { x: margin + 80, y: margin + 60, width: width - 2 * margin - 160, height: 20 },
          { x: margin + 80, y: height - margin - 80, width: width - 2 * margin - 160, height: 20 },
          { x: margin + 80, y: margin + 60, width: 20, height: height - 2 * margin - 140 },
          { x: width - margin - 100, y: margin + 60, width: 20, height: height - 2 * margin - 140 },
          
          // Struttura interna complessa
          { x: margin + 180, y: margin + 140, width: 20, height: 160 },
          { x: margin + 180, y: margin + 140, width: 160, height: 20 },
          { x: width - margin - 340, y: margin + 140, width: 160, height: 20 },
          { x: width - margin - 200, y: margin + 140, width: 20, height: 160 },
          
          { x: width / 2 - 100, y: height / 2 - 80, width: 200, height: 20 },
          { x: width / 2 - 10, y: height / 2 - 80, width: 20, height: 160 },
          
          { x: margin + 180, y: height - margin - 300, width: 20, height: 160 },
          { x: margin + 180, y: height - margin - 160, width: 160, height: 20 },
          { x: width - margin - 340, y: height - margin - 160, width: 160, height: 20 },
          { x: width - margin - 200, y: height - margin - 300, width: 20, height: 160 }
        );
        break;
        
      default:
        // Livelli extra: pattern casuale basato sul seed
        const numWalls = 4 + (levelNumber % 4);
        for (let i = 0; i < numWalls; i++) {
          const isHorizontal = (seed + i) % 2 === 0;
          const x = margin + ((seed + i * 123) % (width - 2 * margin - 200));
          const y = margin + ((seed + i * 456) % (height - 2 * margin - 200));
          
          if (isHorizontal) {
            walls.push({ x, y, width: 120 + ((seed + i) % 80), height: 20 });
          } else {
            walls.push({ x, y, width: 20, height: 120 + ((seed + i) % 80) });
          }
        }
    }
    
    // Filtra i muri che sono troppo vicini al centro (zona spawn giocatore)
    return walls.filter(wall => {
      const wallCenterX = wall.x + wall.width / 2;
      const wallCenterY = wall.y + wall.height / 2;
      const distFromCenter = Math.sqrt(
        Math.pow(wallCenterX - width / 2, 2) + 
        Math.pow(wallCenterY - height / 2, 2)
      );
      return distFromCenter > safeZoneRadius;
    });
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
        0.8
      );
      
      // Aggiungi bordo per visibilità
      wallSprite.setStrokeStyle(2, wallColor + 0x202020);
      
      scene.physics.add.existing(wallSprite, true);
      wallGroup.add(wallSprite);
    });
    
    return wallGroup;
  }
}
