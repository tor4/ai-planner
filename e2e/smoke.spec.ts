import { expect, test } from '@playwright/test';

// Placeholder until the first screen exists, so the e2e job has a test to run.
test('browser can render a page', async ({ page }) => {
  await page.setContent('<h1>AI Planner</h1>');
  await expect(page.getByRole('heading', { name: 'AI Planner' })).toBeVisible();
});
