import { test, expect } from "@playwright/test";

import { loginAsCustomer } from "./helpers/auth";

const hasDatabase = Boolean(process.env.MONGODB_URI);

test.describe("Products", () => {
  test("products page loads", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: /our collection/i })).toBeVisible();
  });

  test("product details page loads", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/velvet rose/i);
    await expect(page.getByRole("button", { name: /add to cart/i }).first()).toBeVisible();
  });

  test.describe("Wishlist", () => {
    test.beforeEach(async ({ page }) => {
      test.skip(!hasDatabase, "Requires MongoDB with seeded customer user");
      await loginAsCustomer(page);
    });

    test("wishlist works", async ({ page }) => {
      await page.goto("/products/velvet-rose-hydrating-serum");
      await page.getByRole("button", { name: /add to wishlist/i }).first().click();

      await page.goto("/wishlist");
      await expect(page.getByRole("heading", { name: /my wishlist/i })).toBeVisible();
      await expect(page.getByText(/velvet rose/i)).toBeVisible();
    });
  });
});
