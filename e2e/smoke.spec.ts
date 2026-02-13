import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home page loads and shows main CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/F1|Travel|Formula/i);
    await expect(page.getByRole("link", { name: /plan|trip|get started/i })).toBeVisible();
  });
});
