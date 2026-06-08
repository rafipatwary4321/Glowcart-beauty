import { test, expect } from "@playwright/test";

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
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });
});

test.describe("Protected routes redirect unauthenticated users", () => {
  const protectedRoutes = [
    { path: "/cart", name: "cart" },
    { path: "/wishlist", name: "wishlist" },
    { path: "/checkout", name: "checkout" },
    { path: "/admin", name: "admin dashboard" },
    { path: "/admin/products", name: "admin products" },
    { path: "/admin/analytics", name: "admin analytics" },
  ];

  for (const route of protectedRoutes) {
    test(`${route.name} redirects to login`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});
