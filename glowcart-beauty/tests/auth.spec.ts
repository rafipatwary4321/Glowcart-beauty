import { test, expect } from "./helpers/fixtures";
import { expectLoginPageVisible } from "./helpers/auth";

test.describe("Auth", () => {
  test("login page loads", async ({ page }) => {
    await expectLoginPageVisible(page);
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });
});
