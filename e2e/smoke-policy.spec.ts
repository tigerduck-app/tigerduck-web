import { test, expect } from "@playwright/test";

test.describe("Policy pages", () => {
  test("zh privacy policy returns 200 and has content", async ({ page }) => {
    const response = await page.goto("/privacy-policy");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("domcontentloaded");

    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBeGreaterThanOrEqual(3);
  });

  test("en privacy policy returns 200", async ({ page }) => {
    const response = await page.goto("/en/privacy-policy");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("domcontentloaded");

    const content = await page.content();
    expect(content).toMatch(/Privacy|TigerDuck/);
  });

  test("zh delete-account page has NTUST disclaimer", async ({ page }) => {
    const response = await page.goto("/delete-account");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("domcontentloaded");

    const content = await page.content();
    expect(content).toMatch(/NTUST|臺灣科技大學|沒有任何關聯/);
  });

  test("en delete-account page returns 200", async ({ page }) => {
    const response = await page.goto("/en/delete-account");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("domcontentloaded");

    const content = await page.content();
    expect(content).toMatch(/not affiliated|NTUST|TigerDuck/i);
  });
});
