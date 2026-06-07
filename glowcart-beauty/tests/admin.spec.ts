import { test, expect } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";

test.describe("Admin", () => {
  test("unauthenticated admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin dashboard loads", async ({ page }) => {
    test.skip(!process.env.MONGODB_URI, "Requires MongoDB with seeded admin user");

    await loginAsAdmin(page);
    await expect(page.getByRole("heading", { name: /^dashboard$/i })).toBeVisible();
    await expect(page.getByText(/today's orders/i)).toBeVisible();
  });

  test("admin products page loads", async ({ page }) => {
    test.skip(!process.env.MONGODB_URI, "Requires MongoDB with seeded admin user");

    await loginAsAdmin(page);
    await page.goto("/admin/products");
    await expect(page.getByRole("heading", { name: /^products$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /add product/i })).toBeVisible();
  });
});

test.describe("Blog", () => {
  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /tips, trends/i })).toBeVisible();
  });
});
