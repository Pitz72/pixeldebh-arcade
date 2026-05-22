import { describe, it, expect } from "vitest";
import { getLevelConfig, getEraName, Era, LEVELS } from "./LevelData";

describe("getLevelConfig", () => {
  it("ritorna il config del livello richiesto (1-based)", () => {
    expect(getLevelConfig(1).levelNumber).toBe(1);
    expect(getLevelConfig(5).levelNumber).toBe(5);
  });

  it("clampa verso il basso se levelNumber < 1", () => {
    expect(getLevelConfig(0).levelNumber).toBe(1);
    expect(getLevelConfig(-99).levelNumber).toBe(1);
  });

  it("clampa verso l'alto se levelNumber > N", () => {
    const last = LEVELS[LEVELS.length - 1];
    expect(getLevelConfig(LEVELS.length).levelNumber).toBe(last.levelNumber);
    expect(getLevelConfig(LEVELS.length + 50).levelNumber).toBe(last.levelNumber);
  });

  it("ritorna sempre un oggetto LevelConfig non-nullo", () => {
    for (let i = -3; i < LEVELS.length + 5; i++) {
      const cfg = getLevelConfig(i);
      expect(cfg).toBeDefined();
      expect(cfg.collectibles).toBeDefined();
      expect(cfg.enemies).toBeDefined();
    }
  });
});

describe("getEraName", () => {
  it("mappa ognuna delle 3 ere a un'etichetta umana", () => {
    expect(getEraName(Era.BIT_8)).toBe("Era 8-Bit");
    expect(getEraName(Era.BIT_16)).toBe("Era 16-Bit");
    expect(getEraName(Era.BIT_32_64)).toBe("Era 32/64-Bit");
  });

  it("ritorna fallback per valori non noti", () => {
    expect(getEraName("foo" as Era)).toBe("Era Sconosciuta");
  });
});

describe("LEVELS dataset", () => {
  it("contiene almeno 9 livelli (i 9 della storyline del gioco)", () => {
    expect(LEVELS.length).toBeGreaterThanOrEqual(9);
  });

  it("numeri di livello consecutivi a partire da 1", () => {
    LEVELS.forEach((lvl, idx) => {
      expect(lvl.levelNumber).toBe(idx + 1);
    });
  });

  it("ogni livello ha powerUpChance fra 0 e 1 e speed multiplier > 0", () => {
    LEVELS.forEach((lvl) => {
      expect(lvl.powerUpChance).toBeGreaterThanOrEqual(0);
      expect(lvl.powerUpChance).toBeLessThanOrEqual(1);
      expect(lvl.enemySpeedMultiplier).toBeGreaterThan(0);
    });
  });

  it("ogni livello ha almeno un collectible", () => {
    LEVELS.forEach((lvl) => {
      const total =
        lvl.collectibles.floppy +
        lvl.collectibles.cartridge +
        lvl.collectibles.cd +
        lvl.collectibles.computer +
        lvl.collectibles.console;
      expect(total).toBeGreaterThan(0);
    });
  });
});
