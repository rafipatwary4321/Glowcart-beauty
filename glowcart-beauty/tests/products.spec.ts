import { test, expect } from "./helpers/fixtures";

import {
  AUTH_E2E_SKIP_REASON,
  addProductToWishlistFromDetail,
  expectPublicWishlistPage,
  isAuthenticatedE2eEnabled,
  loginAsCustomer,
  waitForPersistedWishlistItem,
} from "./helpers/auth";

test.describe("Products public pages", () => {
  test("products page loads", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: /our collection/i })).toBeVisible();
    await expect(page.getByTestId("product-card").first()).toBeVisible();
  });

  test("product details page loads", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/velvet rose/i);
    await expect(page.getByTestId("product-info").getByTestId("add-to-cart")).toBeVisible();
    await expect(page.getByTestId("product-info").getByTestId("wishlist-button")).toBeVisible();
  });
});

test.describe("Wishlist public routes", () => {
  test("wishlist page loads without authentication", async ({ page }) => {
    await expectPublicWishlistPage(page);
  });
});

test.describe("Wishlist store UI (public product page)", () => {
  test("wishlist toggle persists in local storage from product page", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await page.getByTestId("product-info").getByTestId("wishlist-button").click();
    await waitForPersistedWishlistItem(page);
  });

  test("wishlist button shows saved item on wishlist page", async ({ page }) => {
    await page.goto("/products/velvet-rose-hydrating-serum");
    await page.getByTestId("product-info").getByTestId("wishlist-button").click();
    await waitForPersistedWishlistItem(page);
    await expectPublicWishlistPage(page);
    await expect(page.getByText(/velvet rose/i)).toBeVisible();
  });
});

test.describe("Wishlist authenticated flows", () => {
  test.beforeEach(() => {
    test.skip(!isAuthenticatedE2eEnabled(), AUTH_E2E_SKIP_REASON);
  });

  test("wishlist page shows saved product when logged in", async ({ page }) => {
    await loginAsCustomer(page);
    await addProductToWishlistFromDetail(page, "velvet-rose-hydrating-serum");
    await expectPublicWishlistPage(page);
    await expect(page.getByText(/velvet rose/i)).toBeVisible();
  });
});
