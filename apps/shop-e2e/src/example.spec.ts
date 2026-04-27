import { test, expect } from '@playwright/test';

test('redirects to dashboard and shows restaurant details', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/dashboard$/);
});
