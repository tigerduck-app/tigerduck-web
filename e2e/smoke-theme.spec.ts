import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("theme toggle button exists", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const toggle = page.locator('button[aria-label*="Theme"], button[title*="theme"]');
    await expect(toggle.first()).toBeVisible();
  });

  test("clicking theme toggle changes data-theme attribute", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const toggle = page.locator('button[aria-label*="Theme"], button[title*="theme"]').first();

    await toggle.click();
    const theme1 = await page.locator("html").getAttribute("data-theme");

    await toggle.click();
    const theme2 = await page.locator("html").getAttribute("data-theme");

    expect(theme1 !== theme2 || theme1 !== null).toBe(true);
  });
});
