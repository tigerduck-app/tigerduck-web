import { test, expect } from "@playwright/test";

test.describe("Language switching", () => {
  test("root path serves zh-TW content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const content = await page.content();
    expect(content).toMatch(/臺科|TigerDuck/);
  });

  test("/en path serves English content", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");

    const content = await page.content();
    expect(content).toMatch(/NTUST|TigerDuck/);
  });

  test("language switcher button exists", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const switcher = page.locator("button").filter({ hasText: /EN|中文/ });
    await expect(switcher).toBeVisible();
  });
});
