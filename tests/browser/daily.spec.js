import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
const batches = Object.fromEntries(['medium', 'hard'].map(m => [m, JSON.parse(fs.readFileSync(`proposals/content-expansion/quality-v3/${m}-100.json`))]));
async function enter(page) {
  await page.goto('/'); await expect(page.locator('.recipe')).toHaveCount(8);
  if (await page.getByRole('dialog').isVisible()) await page.getByRole('button', { name: 'Let’s play' }).click();
  await page.locator('#preview-day').selectOption('1'); await expect(page.locator('#date-label')).toContainText('#001');
}
async function solve(page, mode, day = 1) {
  if (mode === 'hard') { await page.locator('[data-mode=hard]').click(); await expect(page.locator('.recipe')).toHaveCount(12); }
  for (const id of batches[mode][day - 1].solution) await page.locator(`[data-recipe="${id}"]`).click();
  await expect(page.locator('.results')).toContainText('Beautifully put together.');
}
test('interactive onboarding and accessible help', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('[data-demo=toast]').click(); await page.locator('[data-demo=salad]').click();
  await expect(page.locator('#demo-status')).toContainText('Perfect!');
  await page.getByRole('button', { name: 'Let’s play' }).click(); await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'How to play' }).click(); await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('selection, deselection, undo, reset, hints, refresh and independent modes', async ({ page }) => {
  await enter(page); const first = page.locator('.recipe').first(); const id = await first.getAttribute('data-recipe');
  await first.click(); await expect(first).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-mode=hard]').click(); await expect(page.locator('.recipe')).toHaveCount(12);
  await page.locator('.recipe').first().click();
  await page.locator('[data-mode=medium]').click(); await expect(page.locator(`[data-recipe="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
  await page.reload(); await expect(page.locator(`[data-recipe="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Undo', exact: true }).click(); await expect(page.locator('.recipe[aria-pressed=true]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Hint', exact: true }).click(); await expect(page.locator('#message')).toContainText('One dish belongs');
  await page.locator('.recipe').first().click(); await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Clear selections', exact: true }).click(); await expect(page.locator('.recipe[aria-pressed=true]')).toHaveCount(0);
  await page.locator('.recipe').first().click(); await page.locator('.recipe').first().click(); await expect(page.locator('.recipe[aria-pressed=true]')).toHaveCount(0);
});
test('both exact solutions persist without duplicate credits and share no spoilers', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await enter(page); await solve(page, 'medium');
  await page.getByRole('button', { name: 'Copy result' }).click();
  const text = await page.evaluate(() => navigator.clipboard.readText()); expect(text).toContain('Medium · Solved'); expect(text).not.toContain(batches.medium[0].solution[0]);
  await solve(page, 'hard'); await page.reload(); await expect(page.locator('.results')).toBeVisible();
  await page.getByRole('button', { name: 'Statistics', exact: true }).click(); await expect(page.locator('.stat').filter({ hasText: 'Solved' })).toContainText('1');
  await page.keyboard.press('Escape'); await page.locator('[data-mode=hard]').click(); await expect(page.locator('.results')).toBeVisible();
  await page.getByRole('button', { name: 'Statistics', exact: true }).click(); await expect(page.locator('.stat').filter({ hasText: 'Solved' })).toContainText('1');
});
test('reveal requires confirmation, is terminal, never credited as solve', async ({ page }) => {
  await enter(page); await page.getByRole('button', { name: 'Reveal', exact: true }).click(); await page.keyboard.press('Escape');
  await expect(page.locator('.results')).not.toBeVisible();
  await page.getByRole('button', { name: 'Reveal', exact: true }).click(); await page.getByRole('button', { name: 'Reveal solution', exact: true }).click();
  await expect(page.locator('.results')).toContainText('SOLUTION REVEALED'); await expect(page.locator('.recipe:enabled')).toHaveCount(0);
  await page.reload(); await expect(page.locator('.results')).toContainText('SOLUTION REVEALED');
  await page.getByRole('button', { name: 'Statistics', exact: true }).click(); await expect(page.locator('.stat').filter({ hasText: 'Solved' })).toContainText('0');
});
test('preview next day preserves prior result and fails safely past supply', async ({ page }) => {
  await enter(page); await solve(page, 'medium'); await page.getByRole('button', { name: 'Next UTC day', exact: true }).click();
  await expect(page.locator('#date-label')).toContainText('#002'); await expect(page.locator('.results')).not.toBeVisible();
  await page.locator('#preview-day').selectOption('1'); await expect(page.locator('.results')).toBeVisible();
  await page.locator('#preview-day').selectOption('101'); await expect(page.locator('#game')).toContainText('No substitute or unverified puzzle');
});
test('corrupt and unavailable storage do not break guest play', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('preview/pantry-daily-v2', '{'));
  await page.goto('/'); await expect(page.locator('.recipe')).toHaveCount(8); await expect(page.locator('#warning')).toContainText('damaged');
});
test('denied storage still supports a complete guest solve', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.getItem = () => { throw Error('Denied'); }; Storage.prototype.setItem = () => { throw Error('Denied'); }; });
  await enter(page); await solve(page, 'medium'); await expect(page.locator('#warning')).toBeVisible();
});
test('an open page rolls over at midnight UTC and preserves history', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-21T23:59:58Z') });
  await enter(page); await solve(page, 'medium');
  await page.clock.runFor(3000);
  await expect(page.locator('#date-label')).toContainText('#002'); await expect(page.locator('.results')).not.toBeVisible();
  await page.locator('#preview-day').selectOption('1'); await expect(page.locator('.results')).toBeVisible();
});
test('keyboard selection and accessibility checks for game and help dialog', async ({ page }) => {
  await enter(page);
  const card = page.locator('.recipe').first(); await card.focus(); await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('aria-pressed', 'true'); await page.keyboard.press('Space'); await expect(card).toHaveAttribute('aria-pressed', 'false');
  const game = await new AxeBuilder({ page }).analyze(); expect(game.violations).toEqual([]);
  await page.getByRole('button', { name: 'How to play' }).click();
  const help = await new AxeBuilder({ page }).analyze(); expect(help.violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
});
for (const width of [375, 390, 430, 768, 1280]) test(`Clearline responsive layout at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await enter(page);
  await page.locator('[data-mode=hard]').click(); await expect(page.locator('.recipe')).toHaveCount(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const image of await page.locator('#game img').all()) await expect(image).toHaveJSProperty('complete', true);
  await page.screenshot({ path: `docs/daily/screenshots/hard-${width}.png`, fullPage: true });
  const text = await page.locator('.requirement').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize)); expect(text).toBeGreaterThanOrEqual(12);
  await page.getByRole('button', { name: 'Settings', exact: true }).click(); const box = await page.getByRole('dialog').boundingBox(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.width).toBeLessThanOrEqual(width);
});
