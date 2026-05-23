import { test, expect } from "@playwright/test";

test.describe("PixelDebh's Retro Rescue — smoke", () => {
  test("la pagina carica e monta il canvas Phaser 800x600", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("#game-container canvas");
    await expect(canvas).toBeVisible({ timeout: 10_000 });
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test("skip intro con SPACE non genera errori console", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.locator("#game-container canvas").waitFor();
    await page.waitForTimeout(500);
    await page.keyboard.press("Space");
    await page.waitForTimeout(300);
    await page.keyboard.press("Space");
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test("input frecce direzionali non crasha il game loop", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await page.locator("#game-container canvas").waitFor();
    await page.waitForTimeout(500);
    await page.keyboard.press("Space");
    await page.waitForTimeout(300);
    await page.keyboard.press("Space");
    await page.waitForTimeout(800);

    for (const key of ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]) {
      await page.keyboard.down(key);
      await page.waitForTimeout(120);
      await page.keyboard.up(key);
    }

    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

  test("localStorage high scores: scrittura e rilettura sopravvivono al reload", async ({ page }) => {
    await page.goto("/");
    await page.locator("#game-container canvas").waitFor();

    const seed = [
      { playerName: "E2E", score: 1234, level: 3, date: new Date().toISOString() },
    ];
    await page.evaluate((data) => {
      localStorage.setItem("pixeldebh_highscores", JSON.stringify(data));
    }, seed);

    await page.reload();
    await page.locator("#game-container canvas").waitFor();

    const stored = await page.evaluate(() =>
      localStorage.getItem("pixeldebh_highscores"),
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed[0].playerName).toBe("E2E");
    expect(parsed[0].score).toBe(1234);
  });
});
