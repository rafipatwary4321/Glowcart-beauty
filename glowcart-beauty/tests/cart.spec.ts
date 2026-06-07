import { test, expect } from "@playwright/test";

import { loginAsCustomer } from "./helpers/auth";

const hasDatabase = Boolean(process.env.MONGODB_URI);

test.describe("Cart", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasDatabase, "Requires MongoDB with seeded customer user");
    await loginAsCustomer(page);
  });

  test("add to cart works", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await page.getByRole("button", { name: /add to cart/i }).first().click();

    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /shopping cart/i })).toBeVisible();
    await expect(page.getByText(/velvet rose/i)).toBeVisible();
  });

  test("cart page loads", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /shopping cart/i })).toBeVisible();
  });
});
