import { expect, type Page } from "@playwright/test";

export function getAdminCredentials() {
  return {
    email: process.env.E2E_ADMIN_EMAIL ?? "admin@glowcart.com",
    password: process.env.E2E_ADMIN_PASSWORD ?? "admin1234",
  };
}

export function getCustomerCredentials() {
  return {
    email: process.env.E2E_CUSTOMER_EMAIL ?? "demo@glowcart.com",
    password: process.env.E2E_CUSTOMER_PASSWORD ?? "demo1234",
  };
}

async function submitLogin(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

export async function loginAsAdmin(page: Page) {
  const { email, password } = getAdminCredentials();
  await submitLogin(page, email, password);
  await expect(page).toHaveURL(/\/admin/, { timeout: 20_000 });
}

export async function loginAsCustomer(page: Page) {
  const { email, password } = getCustomerCredentials();
  await submitLogin(page, email, password);
  await expect(page).not.toHaveURL(/\/login/, { timeout: 20_000 });
}
