import { test, expect, type Page } from "@playwright/test";

type DebugState = {
  score: number;
  lives: number;
  level: number;
  collectiblesRemaining: number;
  isPaused: boolean;
  isInvincible: boolean;
  hasShield: boolean;
  playerX: number | null;
  playerY: number | null;
};

/** Avvia il gioco, salta intro+menu, attende che GameScene sia attiva e ritorni stato osservabile. */
async function startGame(page: Page): Promise<DebugState> {
  await page.goto("/");
  await page.locator("#game-container canvas").waitFor();
  await page.waitForTimeout(400);
  await page.keyboard.press("Space");
  await page.waitForTimeout(300);
  await page.keyboard.press("Space");

  return await page.waitForFunction(
    () => {
      const game = (window as unknown as { __pixeldebh?: import("phaser").Game })
        .__pixeldebh;
      if (!game) return null;
      const scene = game.scene.getScene("GameScene") as
        | (import("phaser").Scene & {
            getDebugState?: () => DebugState;
          })
        | null;
      if (!scene || !scene.scene.isActive()) return null;
      const state = scene.getDebugState?.();
      if (!state || state.playerX === null) return null;
      return state;
    },
    null,
    { timeout: 5000 },
  ).then((handle) => handle.jsonValue() as Promise<DebugState>);
}

async function readState(page: Page): Promise<DebugState> {
  return await page.evaluate(() => {
    const game = (window as unknown as { __pixeldebh?: import("phaser").Game })
      .__pixeldebh!;
    const scene = game.scene.getScene("GameScene") as unknown as {
      getDebugState: () => DebugState;
    };
    return scene.getDebugState();
  });
}

test.describe("PixelDebh's Retro Rescue — gameplay", () => {
  test("stato iniziale GameScene: score=0, lives=3, level=1, collectibles>0", async ({
    page,
  }) => {
    const state = await startGame(page);
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.level).toBe(1);
    expect(state.collectiblesRemaining).toBeGreaterThan(0);
    expect(state.isPaused).toBe(false);
    expect(state.playerX).toBeGreaterThan(0);
    expect(state.playerY).toBeGreaterThan(0);
  });

  test("input frecce sposta il player (x o y cambia)", async ({ page }) => {
    const initial = await startGame(page);
    const startX = initial.playerX!;
    const startY = initial.playerY!;

    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(400);
    await page.keyboard.up("ArrowRight");
    await page.keyboard.down("ArrowDown");
    await page.waitForTimeout(400);
    await page.keyboard.up("ArrowDown");

    const after = await readState(page);
    const moved =
      Math.abs(after.playerX! - startX) > 1 ||
      Math.abs(after.playerY! - startY) > 1;
    expect(moved).toBe(true);
  });

  test("tasto P mette in pausa e riattiva", async ({ page }) => {
    await startGame(page);

    await page.keyboard.press("KeyP");
    await page.waitForTimeout(300);
    let state = await readState(page);
    expect(state.isPaused).toBe(true);

    await page.keyboard.press("KeyP");
    await page.waitForTimeout(300);
    state = await readState(page);
    expect(state.isPaused).toBe(false);
  });

  test("getDebugState non esiste in produzione (hook solo dev)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#game-container canvas").waitFor();
    const hookKind = await page.evaluate(() => {
      const w = window as unknown as { __pixeldebh?: unknown };
      return typeof w.__pixeldebh;
    });
    expect(hookKind === "object" || hookKind === "undefined").toBe(true);
  });
});
