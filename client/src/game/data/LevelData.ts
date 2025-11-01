export enum Era {
  BIT_8 = '8bit',
  BIT_16 = '16bit',
  BIT_32_64 = '32_64bit'
}

export interface LevelConfig {
  era: Era;
  levelNumber: number;
  backgroundColor: number;
  gridColor: number;
  collectibles: {
    floppy: number;
    cartridge: number;
    cd: number;
    computer: number;
    console: number;
  };
  enemies: {
    glitch: number;
    bug: number;
    lag: number;
    drm: number;
    hater: number;
  };
  powerUpChance: number; // Probabilità di spawn power-up (0-1)
  enemySpeedMultiplier: number;
}

export const LEVELS: LevelConfig[] = [
  // Era 8-Bit - Livello 1
  {
    era: Era.BIT_8,
    levelNumber: 1,
    backgroundColor: 0x0f0f1e, // Blu scuro profondo
    gridColor: 0x1a1a3e,
    collectibles: {
      floppy: 8,
      cartridge: 4,
      cd: 0,
      computer: 1,
      console: 1
    },
    enemies: {
      glitch: 2,
      bug: 1,
      lag: 0,
      drm: 0,
      hater: 0
    },
    powerUpChance: 0.3,
    enemySpeedMultiplier: 1.0
  },
  
  // Era 8-Bit - Livello 2
  {
    era: Era.BIT_8,
    levelNumber: 2,
    backgroundColor: 0x1a1a3e, // Blu notte
    gridColor: 0x2a2a4e,
    collectibles: {
      floppy: 10,
      cartridge: 6,
      cd: 2,
      computer: 1,
      console: 1
    },
    enemies: {
      glitch: 3,
      bug: 2,
      lag: 1,
      drm: 0,
      hater: 0
    },
    powerUpChance: 0.4,
    enemySpeedMultiplier: 1.1
  },

  // Era 8-Bit - Livello 3
  {
    era: Era.BIT_8,
    levelNumber: 3,
    backgroundColor: 0x0a2a3a, // Blu-verde scuro
    gridColor: 0x1a3a4a,
    collectibles: {
      floppy: 12,
      cartridge: 8,
      cd: 4,
      computer: 2,
      console: 1
    },
    enemies: {
      glitch: 4,
      bug: 2,
      lag: 2,
      drm: 1,
      hater: 0
    },
    powerUpChance: 0.5,
    enemySpeedMultiplier: 1.2
  },

  // Era 16-Bit - Livello 4
  {
    era: Era.BIT_16,
    levelNumber: 4,
    backgroundColor: 0x2a1a4a, // Viola profondo
    gridColor: 0x3a2a5a,
    collectibles: {
      floppy: 6,
      cartridge: 10,
      cd: 6,
      computer: 2,
      console: 2
    },
    enemies: {
      glitch: 3,
      bug: 3,
      lag: 2,
      drm: 1,
      hater: 1
    },
    powerUpChance: 0.5,
    enemySpeedMultiplier: 1.3
  },

  // Era 16-Bit - Livello 5
  {
    era: Era.BIT_16,
    levelNumber: 5,
    backgroundColor: 0x3a1a5a, // Viola intenso
    gridColor: 0x4a2a6a,
    collectibles: {
      floppy: 8,
      cartridge: 12,
      cd: 8,
      computer: 3,
      console: 2
    },
    enemies: {
      glitch: 4,
      bug: 3,
      lag: 3,
      drm: 1,
      hater: 2
    },
    powerUpChance: 0.6,
    enemySpeedMultiplier: 1.4
  },

  // Era 16-Bit - Livello 6
  {
    era: Era.BIT_16,
    levelNumber: 6,
    backgroundColor: 0x4a1a6a, // Viola magenta
    gridColor: 0x5a2a7a,
    collectibles: {
      floppy: 10,
      cartridge: 14,
      cd: 10,
      computer: 3,
      console: 3
    },
    enemies: {
      glitch: 5,
      bug: 4,
      lag: 3,
      drm: 2,
      hater: 2
    },
    powerUpChance: 0.6,
    enemySpeedMultiplier: 1.5
  },

  // Era 32/64-Bit - Livello 7
  {
    era: Era.BIT_32_64,
    levelNumber: 7,
    backgroundColor: 0x0a2a50, // Blu oceano scuro
    gridColor: 0x1a3a60,
    collectibles: {
      floppy: 4,
      cartridge: 8,
      cd: 12,
      computer: 4,
      console: 4
    },
    enemies: {
      glitch: 4,
      bug: 4,
      lag: 4,
      drm: 2,
      hater: 3
    },
    powerUpChance: 0.7,
    enemySpeedMultiplier: 1.6
  },

  // Era 32/64-Bit - Livello 8
  {
    era: Era.BIT_32_64,
    levelNumber: 8,
    backgroundColor: 0x1a3a60, // Blu acciaio
    gridColor: 0x2a4a70,
    collectibles: {
      floppy: 6,
      cartridge: 10,
      cd: 14,
      computer: 5,
      console: 5
    },
    enemies: {
      glitch: 5,
      bug: 5,
      lag: 4,
      drm: 3,
      hater: 3
    },
    powerUpChance: 0.7,
    enemySpeedMultiplier: 1.7
  },

  // Era 32/64-Bit - Livello 9 (Finale)
  {
    era: Era.BIT_32_64,
    levelNumber: 9,
    backgroundColor: 0x2a4a70, // Blu elettrico scuro
    gridColor: 0x3a5a80,
    collectibles: {
      floppy: 8,
      cartridge: 12,
      cd: 16,
      computer: 6,
      console: 6
    },
    enemies: {
      glitch: 6,
      bug: 6,
      lag: 5,
      drm: 3,
      hater: 4
    },
    powerUpChance: 0.8,
    enemySpeedMultiplier: 1.8
  }
];

export function getLevelConfig(levelNumber: number): LevelConfig {
  const index = Math.min(levelNumber - 1, LEVELS.length - 1);
  return LEVELS[Math.max(0, index)];
}

export function getEraName(era: Era): string {
  switch (era) {
    case Era.BIT_8:
      return 'Era 8-Bit';
    case Era.BIT_16:
      return 'Era 16-Bit';
    case Era.BIT_32_64:
      return 'Era 32/64-Bit';
    default:
      return 'Era Sconosciuta';
  }
}
