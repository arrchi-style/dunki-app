import { test, expect } from '@playwright/test';

test('redirects to dashboard and shows restaurant details', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('text=Cart Total: $0')).toBeVisible();
});
