import { test, expect } from "@playwright/test";

test.describe("CTA links", () => {
  test("iOS beta CTA points to TestFlight", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const iosCTA = page.locator('[data-testid="ios-beta-cta"]').first();
    await expect(iosCTA).toBeVisible();
    const href = await iosCTA.getAttribute("href");
    expect(href).toBe("https://testflight.apple.com/join/eVt9Gjkw");
  });

  test("Android beta CTA points to Discord", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const androidCTA = page.locator('[data-testid="android-beta-cta"]').first();
    await expect(androidCTA).toBeVisible();
    const href = await androidCTA.getAttribute("href");
    expect(href).toBe("https://tigerduck.app/discord");
  });

  test("footer has contact email link", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const emailLink = page.locator('a[href="mailto:tigerduckapp@gmail.com"]');
    await expect(emailLink.first()).toBeAttached();
  });
});
