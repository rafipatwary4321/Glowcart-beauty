import { test, expect } from "@playwright/test";

import { loginAsCustomer } from "./helpers/auth";

const hasDatabase = Boolean(process.env.MONGODB_URI);

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasDatabase, "Requires MongoDB with seeded customer user");
    await loginAsCustomer(page);
  });

  test("checkout page loads", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await page.getByRole("button", { name: /add to cart/i }).first().click();

    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /secure checkout/i })).toBeVisible();
  });
});
