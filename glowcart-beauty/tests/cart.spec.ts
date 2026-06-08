import { test, expect } from "./helpers/fixtures";

import {
  AUTH_E2E_SKIP_REASON,
  addProductToCartFromDetail,
  expectPublicCartPage,
  isAuthenticatedE2eEnabled,
  loginAsCustomer,
  waitForPersistedCartItem,
} from "./helpers/auth";

test.describe("Cart public routes", () => {
  test("cart page loads without authentication", async ({ page }) => {
    await expectPublicCartPage(page);
  });
});

test.describe("Cart store UI (public product page)", () => {
  test("add to cart persists in local storage from product page", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await expect(page.getByTestId("product-info").getByTestId("add-to-cart")).toBeVisible();
    await page.getByTestId("product-info").getByTestId("add-to-cart").click();
    await waitForPersistedCartItem(page);
  });

  test("add to cart shows item on cart page", async ({ page }) => {
    await addProductToCartFromDetail(page, "velvet-rose-hydrating-serum");
    await expectPublicCartPage(page);
    await expect(page.getByText(/velvet rose/i)).toBeVisible();
  });
});

test.describe("Cart authenticated flows", () => {
  test.beforeEach(() => {
    test.skip(!isAuthenticatedE2eEnabled(), AUTH_E2E_SKIP_REASON);
  });

  test("add to cart works when logged in", async ({ page }) => {
    await loginAsCustomer(page);
    await addProductToCartFromDetail(page, "velvet-rose-hydrating-serum");
    await page.goto("/cart");
    await expect(page.getByTestId("cart-page")).toBeVisible();
    await expect(page.getByText(/velvet rose/i)).toBeVisible();
  });
});
