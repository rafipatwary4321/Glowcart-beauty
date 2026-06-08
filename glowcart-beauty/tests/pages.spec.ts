import { test, expect } from "./helpers/fixtures";
import {
  expectLoginPageVisible,
  expectProtectedRouteRedirectsToLogin,
  expectPublicCartPage,
  expectPublicWishlistPage,
} from "./helpers/auth";

test.describe("Public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GlowCart/i);
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/about/i);
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /tips, trends/i })).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await expectLoginPageVisible(page);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("products page loads", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: /our collection/i })).toBeVisible();
  });

  test("cart page loads publicly", async ({ page }) => {
    await expectPublicCartPage(page);
  });

  test("wishlist page loads publicly", async ({ page }) => {
    await expectPublicWishlistPage(page);
  });
});

test.describe("Protected routes redirect unauthenticated users", () => {
  const protectedRoutes = [
    { path: "/profile", name: "profile" },
    { path: "/checkout", name: "checkout" },
    { path: "/admin", name: "admin dashboard" },
    { path: "/admin/products", name: "admin products" },
    { path: "/admin/analytics", name: "admin analytics" },
  ];

  for (const route of protectedRoutes) {
    test(`${route.name} redirects to login`, async ({ page }) => {
      await expectProtectedRouteRedirectsToLogin(page, route.path);
    });
  }
});
