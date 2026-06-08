import { expect, type Page } from "@playwright/test";


export const AUTH_E2E_SKIP_REASON =
  "Skipped: authenticated E2E requires E2E_AUTH_ENABLED=true, MONGODB_URI, and npm run seed:fresh.";

export function hasDatabase(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function isAuthenticatedE2eEnabled(): boolean {
  return process.env.E2E_AUTH_ENABLED === "true" && hasDatabase();
}

export function getAdminCredentials() {
  return {
    email:
      process.env.E2E_ADMIN_EMAIL ??
      process.env.ADMIN_EMAIL ??
      process.env.ADMIN_SEED_EMAIL ??
      "admin@glowcart.com",
    password:
      process.env.E2E_ADMIN_PASSWORD ??
      process.env.ADMIN_PASSWORD ??
      process.env.ADMIN_SEED_PASSWORD ??
      "admin1234",
  };
}

export function getCustomerCredentials() {
  return {
    email: process.env.E2E_CUSTOMER_EMAIL ?? "demo@glowcart.com",
    password: process.env.E2E_CUSTOMER_PASSWORD ?? "demo1234",
  };
}

export async function expectProtectedRouteRedirectsToLogin(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login(\?|$)/, { timeout: 20_000 });
  await expect(page.getByTestId("login-page")).toBeVisible({ timeout: 10_000 });
}

export async function expectLoginPageVisible(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login(\?|$)/, { timeout: 20_000 });
  await expect(page.getByTestId("login-page")).toBeVisible({ timeout: 10_000 });
}

export async function expectPublicCartPage(page: Page) {
  await page.goto("/cart", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByTestId("cart-page")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("heading", { name: /shopping cart/i })).toBeVisible();
}

export async function expectPublicWishlistPage(page: Page) {
  await page.goto("/wishlist", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/wishlist$/);
  await expect(page.getByTestId("wishlist-page")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("heading", { name: /my wishlist/i })).toBeVisible();
}

async function submitLogin(page: Page, email: string, password: string) {
  await page.goto("/login");
  await expect(page.getByTestId("login-page")).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();

  const loginFailed = await page
    .getByText("Invalid email or password.")
    .waitFor({ state: "visible", timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (loginFailed) {
    throw new Error(`Login failed for ${email}. Check seeded credentials and MONGODB_URI.`);
  }

  await page.waitForURL((url) => !url.pathname.endsWith("/login"), {
    timeout: 20_000,
  });
}

export async function loginAsAdmin(page: Page) {
  const { email, password } = getAdminCredentials();
  await submitLogin(page, email, password);
  if (!page.url().includes("/admin")) {
    await page.goto("/admin");
  }
  await expect(page.getByTestId("admin-dashboard")).toBeVisible({ timeout: 20_000 });
}

export async function loginAsCustomer(page: Page) {
  const { email, password } = getCustomerCredentials();
  await submitLogin(page, email, password);
  await expect(page).not.toHaveURL(/\/login$/, { timeout: 20_000 });
}

export async function waitForPersistedCartItem(page: Page) {
  await page.waitForFunction(() => {
    const raw = window.localStorage.getItem("glowcart-cart");
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw) as { state?: { items?: unknown[] } };
      return (parsed.state?.items?.length ?? 0) > 0;
    } catch {
      return false;
    }
  });
}

export async function waitForPersistedWishlistItem(page: Page) {
  await page.waitForFunction(() => {
    const raw = window.localStorage.getItem("glowcart-wishlist");
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw) as { state?: { items?: unknown[] } };
      return (parsed.state?.items?.length ?? 0) > 0;
    } catch {
      return false;
    }
  });
}

export async function addProductToCartFromDetail(page: Page, slug: string) {
  await page.goto(`/products/${slug}`);
  await page.getByTestId("product-info").getByTestId("add-to-cart").click();
  await waitForPersistedCartItem(page);
}

export async function addProductToWishlistFromDetail(page: Page, slug: string) {
  await page.goto(`/products/${slug}`);
  await page.getByTestId("product-info").getByTestId("wishlist-button").click();
  await waitForPersistedWishlistItem(page);
}
