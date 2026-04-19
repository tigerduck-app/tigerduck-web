import { test, expect } from "@playwright/test";

test.describe("Home page smoke tests", () => {
  test("loads and has all 8 section IDs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const sectionIds = ["hero", "stats", "features", "ios", "android", "roadmap", "team", "faq"];
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });

  test("3D canvas or fallback is present in hero", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hasCanvas = (await page.locator("canvas").count()) > 0;
    const hasFallback = (await page.locator('[data-testid="hero-fallback"]').count()) > 0;
    expect(hasCanvas || hasFallback).toBe(true);
  });

  test("page title contains TigerDuck", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TigerDuck/);
  });
});
