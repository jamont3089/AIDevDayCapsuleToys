import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const mockIssues = [
  {
    id: 101,
    number: 1,
    title: "[Coffee Entry] Ada Lovelace",
    html_url: "https://github.com/jamont3089/AIDevDayCapsuleToys/issues/1",
    created_at: "2026-07-19T14:00:00Z"
  },
  {
    id: 102,
    number: 2,
    title: "[Coffee Entry] Grace Hopper",
    html_url: "https://github.com/jamont3089/AIDevDayCapsuleToys/issues/2",
    created_at: "2026-07-19T14:05:00Z"
  },
  {
    id: 103,
    number: 3,
    title: "Unrelated issue",
    html_url: "https://github.com/jamont3089/AIDevDayCapsuleToys/issues/3",
    created_at: "2026-07-19T14:06:00Z"
  }
];

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/repos/**/issues?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockIssues)
    });
  });
  await page.goto("/");
  await expect(page.locator("#entry-count")).toHaveText("2");
});

test("loads GitHub entries and renders capsules", async ({ page }) => {
  await expect(page.getByText("2 valid entries loaded. The machine is ready.")).toBeVisible();
  await expect(page.locator("#capsule-chamber")).toContainText("Ada Lovelace");
  await expect(page.locator("#capsule-chamber")).toContainText("Grace Hopper");
});

test("validates names and creates a prefilled GitHub entry", async ({ page, context }) => {
  await page.locator("#entrant-name").fill("A");
  await page.locator("#entry-form button[type=submit]").click();
  await expect(page.locator("#name-error")).toContainText("at least 2 characters");

  await context.route("https://github.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/html", body: "<title>GitHub entry</title>" });
  });
  await page.locator("#entrant-name").fill("Katherine Johnson");
  const popupPromise = page.waitForEvent("popup");
  await page.locator("#entry-form button[type=submit]").click();
  const popup = await popupPromise;
  const url = new URL(popup.url());
  expect(url.pathname).toBe("/jamont3089/AIDevDayCapsuleToys/issues/new");
  expect(url.searchParams.get("template")).toBe("coffee-entry.yml");
  expect(url.searchParams.get("title")).toBe("[Coffee Entry] Katherine Johnson");
  await expect(page.locator("#entry-confirm")).toBeVisible();
});

test("switches the complete experience to Japanese", async ({ page }) => {
  await page.getByRole("button", { name: "日本語" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator("#hero-title")).toContainText("あなたの名前。");
  await expect(page.locator("#machine-status")).toContainText("2件のエントリー");
  await expect(page.locator("#host-trigger")).toContainText("抽選する");
});

test("draws one winner and prevents immediate repeats", async ({ page }) => {
  await page.locator("#host-trigger").click();
  await expect(page.locator("#host-dialog")).toBeVisible();
  await page.locator("#draw-button").click();
  await expect(page.locator("#winner-name")).not.toHaveText("••••••", { timeout: 3000 });
  const winner = await page.locator("#winner-name").textContent();
  expect(["Ada Lovelace", "Grace Hopper"]).toContain(winner);
  await expect(page.locator("#winner-history-list li")).toHaveCount(1);
});

test("has no serious accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact))).toEqual([]);
});

test("does not overflow the viewport and captures the primary state", async ({ page }, testInfo) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
});
