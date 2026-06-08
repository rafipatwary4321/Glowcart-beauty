import { test, expect } from "./helpers/fixtures";

import {
  AUTH_E2E_SKIP_REASON,
  expectProtectedRouteRedirectsToLogin,
  isAuthenticatedE2eEnabled,
  loginAsAdmin,
} from "./helpers/auth";

test.describe("Admin protected routes", () => {
  test("unauthenticated admin redirects to login", async ({ page }) => {
    await expectProtectedRouteRedirectsToLogin(page, "/admin");
  });
});

test.describe("Admin authenticated flows", () => {
  test.beforeEach(() => {
    test.skip(!isAuthenticatedE2eEnabled(), AUTH_E2E_SKIP_REASON);
  });

  test("admin dashboard loads", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole("heading", { name: /^dashboard$/i })).toBeVisible();
    await expect(page.getByTestId("admin-dashboard")).toBeVisible();
  });

  test("admin products page loads", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/products");
    await expect(page.getByRole("heading", { name: /^products$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /add product/i })).toBeVisible();
  });
});
