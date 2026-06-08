import { test, expect } from "./helpers/fixtures";

import {
  AUTH_E2E_SKIP_REASON,
  addProductToCartFromDetail,
  expectProtectedRouteRedirectsToLogin,
  isAuthenticatedE2eEnabled,
  loginAsCustomer,
} from "./helpers/auth";

test.describe("Checkout protected routes", () => {
  test("unauthenticated checkout redirects to login", async ({ page }) => {
    await expectProtectedRouteRedirectsToLogin(page, "/checkout");
  });
});

test.describe("Checkout authenticated flows", () => {
  test.beforeEach(() => {
    test.skip(!isAuthenticatedE2eEnabled(), AUTH_E2E_SKIP_REASON);
  });

  test("checkout page loads with cart items", async ({ page }) => {
    await loginAsCustomer(page);
    await addProductToCartFromDetail(page, "velvet-rose-hydrating-serum");
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /secure checkout/i })).toBeVisible();
    await expect(page.getByTestId("checkout-page")).toContainText(/velvet rose/i);
  });

  test("checkout renders empty state when cart is empty", async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /secure checkout/i })).toBeVisible();
    await expect(page.getByTestId("checkout-page")).toContainText(/your cart is empty/i);
  });
});
