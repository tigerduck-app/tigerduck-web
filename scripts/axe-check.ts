import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function runAxeCheck() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pagesToCheck = [
    { url: "http://localhost:3000/", name: "Home (zh-TW)" },
    { url: "http://localhost:3000/en", name: "Home (en)" },
    { url: "http://localhost:3000/privacy-policy", name: "Privacy Policy" },
    { url: "http://localhost:3000/delete-account", name: "Delete Account" },
  ];

  let totalViolations = 0;
  let criticalViolations = 0;

  for (const { url, name } of pagesToCheck) {
    console.log(`\nChecking: ${name} (${url})`);
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      );

      if (serious.length > 0) {
        console.log(`  ✗ ${serious.length} serious/critical violations:`);
        serious.forEach((v) => {
          console.log(`    - [${v.impact}] ${v.id}: ${v.description}`);
        });
        criticalViolations += serious.length;
      } else {
        console.log(`  ✓ No serious/critical violations`);
      }

      totalViolations += results.violations.length;
      console.log(`  Total violations (all levels): ${results.violations.length}`);
    } catch (err) {
      console.log(`  WARNING: Could not check ${url}: ${err}`);
    }
  }

  await browser.close();

  console.log(`\n=== Axe Summary ===`);
  console.log(`Critical/Serious violations: ${criticalViolations}`);
  console.log(`Total violations: ${totalViolations}`);

  if (criticalViolations > 0) {
    console.log("FAIL: Critical/serious accessibility violations found");
    process.exit(1);
  } else {
    console.log("✓ No critical/serious accessibility violations");
  }
}

runAxeCheck().catch((err) => {
  console.error("Axe check failed:", err);
  process.exit(1);
});
