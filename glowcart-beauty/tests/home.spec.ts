import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/radiance/i);
    await expect(page.getByRole("link", { name: /shop collection/i })).toBeVisible();
  });
});
