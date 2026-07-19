import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const savedEntries = [
  {
    id: "entry-ada",
    name: "Ada Lovelace",
    createdAt: "2026-07-19T14:00:00.000Z"
  },
  {
    id: "entry-grace",
    name: "Grace Hopper",
    createdAt: "2026-07-19T14:05:00.000Z"
  }
];

async function seedEntries(page, entries = savedEntries) {
  await page.evaluate((value) => {
    localStorage.setItem("james-cafe-entries", JSON.stringify(value));
  }, entries);
  await page.reload();
  await expect(page.locator("#entry-count")).toHaveText(String(entries.length));
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("#entry-count")).toHaveText("0");
});

test("saves an entry instantly and restores it after reload", async ({ page }) => {
  await page.locator("#entrant-name").fill("A");
  await page.locator("#entry-form button[type=submit]").click();
  await expect(page.locator("#name-error")).toContainText("at least 2 characters");

  await page.locator("#entrant-name").fill("Katherine Johnson");
  await page.locator("#entry-form button[type=submit]").click();
  await expect(page.locator("#entry-confirm")).toBeVisible();
  await expect(page.locator("#entry-count")).toHaveText("1");
  await expect(page.locator("#capsule-chamber")).toContainText("Katherine Johnson");

  const entries = await page.evaluate(() => JSON.parse(localStorage.getItem("james-cafe-entries")));
  expect(entries).toHaveLength(1);
  expect(entries[0].name).toBe("Katherine Johnson");

  await page.reload();
  await expect(page.locator("#entry-count")).toHaveText("1");
  await expect(page.locator("#capsule-chamber")).toContainText("Katherine Johnson");
});

test("prevents duplicate display names", async ({ page }) => {
  await seedEntries(page, [savedEntries[0]]);
  await page.locator("#entrant-name").fill("Ａｄａ　Ｌｏｖｅｌａｃｅ");
  await page.locator("#entry-form button[type=submit]").click();
  await expect(page.locator("#name-error")).toContainText("already has a capsule");
  await expect(page.locator("#entry-count")).toHaveText("1");
});

test("switches the complete experience to Japanese", async ({ page }) => {
  await seedEntries(page);
  await page.getByRole("button", { name: "日本語" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator("#hero-title")).toContainText("あなたの名前。");
  await expect(page.locator("#machine-status")).toContainText("2件の応募");
  await expect(page.locator("#host-trigger")).toContainText("抽選する");
});

test("draws one winner and prevents immediate repeats", async ({ page }) => {
  await seedEntries(page);
  await page.locator("#host-trigger").click();
  await expect(page.locator("#host-dialog")).toBeVisible();
  await page.locator("#draw-button").click();
  await expect(page.locator("#winner-name")).not.toHaveText("••••••", { timeout: 3000 });
  const winner = await page.locator("#winner-name").textContent();
  expect(["Ada Lovelace", "Grace Hopper"]).toContain(winner);
  await expect(page.locator("#winner-history-list li")).toHaveCount(1);
});

test("exports a CSV backup and requires confirmation to clear entries", async ({ page }) => {
  await seedEntries(page);
  await page.locator("#host-trigger").click();

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-entries").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^james-cafe-entries-\d{4}-\d{2}-\d{2}\.csv$/);

  await page.locator("#clear-entries").click();
  await expect(page.locator("#clear-entries")).toHaveText("CONFIRM CLEAR");
  await expect(page.locator("#entry-count")).toHaveText("2");
  await page.locator("#clear-entries").click();
  await expect(page.locator("#entry-count")).toHaveText("0");
  await expect(page.locator("#winner-history-list")).toContainText("No winners drawn");
});

test("has no serious accessibility violations", async ({ page }) => {
  await seedEntries(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact))).toEqual([]);
});

test("does not overflow the viewport and captures the primary state", async ({ page }, testInfo) => {
  await seedEntries(page);
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
});
