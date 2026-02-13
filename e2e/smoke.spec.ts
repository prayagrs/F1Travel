import { test, expect } from "@playwright/test";

test.describe("Smoke", () => {
  test("home page loads and shows main CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/F1|Travel|Formula/i);
    await expect(page.getByRole("link", { name: /plan|trip|get started/i })).toBeVisible();
  });

  test("sample itinerary shows Accommodation section with provider cards", async ({ page }) => {
    await page.goto("/sample-itinerary");
    await expect(page).toHaveTitle(/F1|Travel|Formula/i);

    const sectionStays = page.locator("#section-stays");
    await expect(sectionStays).toBeVisible();

    await expect(sectionStays.getByText("Accommodation", { exact: true })).toBeVisible();
    await expect(sectionStays.getByText("Booking.com", { exact: true })).toBeVisible();
    await expect(sectionStays.getByText("Airbnb", { exact: true })).toBeVisible();
    await expect(sectionStays.getByText("Google Hotels", { exact: true })).toBeVisible();

    await expect(sectionStays.getByRole("link", { name: /search accommodation on/i }).first()).toBeVisible();
  });
});
