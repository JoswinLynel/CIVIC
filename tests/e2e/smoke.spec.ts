import { test, expect } from '@playwright/test';

test('Smoke test: Homepage loads and displays core elements', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CIVIC/i);
});

test('Smoke test: Politics route loads empty state', async ({ page }) => {
  await page.goto('/politics');
  await expect(page.locator('h1')).toHaveText('Politics');
  await expect(page.getByText('No data available yet')).toBeVisible();
});
