import { expect, test } from '@playwright/test';
import { writeDemoBackup } from './helpers';

test.describe('em inglês', () => {
  test.use({ locale: 'en-US' });

  test('usa o idioma do aparelho e entende o que é digitado em inglês', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Welcome to EatMate' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await page.getByLabel('What should we call you?').fill('Sam');
    await page.getByRole('button', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Hi, Sam!' })).toBeVisible();
    await expect(page.getByText('0 of 7 days')).toBeVisible();

    await page
      .getByRole('link', { name: /Log a meal/ })
      .first()
      .click();
    await page.getByRole('button', { name: 'Breakfast' }).click();
    const input = page.getByRole('combobox', { name: 'What did you eat?' });
    await input.fill('I had a cup of coffee and two slices of toast with butter');
    await input.press('Enter');
    const items = page.getByRole('list', { name: 'Meal items' });
    await expect(items.getByText('Coffee', { exact: true })).toBeVisible();
    await expect(items.getByText('Toast', { exact: true })).toBeVisible();
    await expect(items.getByText('Butter', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Amount of Toast')).toHaveValue('2 slices');
    await page.getByRole('button', { name: 'Save meal' }).click();
    await expect(page.getByText('Breakfast logged!')).toBeVisible();

    // Trocar o idioma no Perfil muda o app na hora.
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('combobox', { name: 'Language' }).selectOption('pt');
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Perfil' })).toBeVisible();
  });

  test('mostra o relatório em inglês', async ({ page }) => {
    const { file } = await writeDemoBackup(1);
    await page.goto('./');
    await page.getByLabel('What should we call you?').fill('Sam');
    await page.getByRole('button', { name: 'Get started' }).click();
    await page.getByRole('link', { name: 'Profile' }).click();
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import backup' }).click();
    await (await chooser).setFiles(file);
    await page.getByRole('dialog').getByRole('button', { name: 'Import' }).click();
    await page.getByText(/Backup imported/).waitFor();

    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('link', { name: 'See full report' }).click();
    await expect(page.getByRole('heading', { name: 'Last 7 days' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Full food diary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Most frequent foods' })).toBeVisible();
    // Os alimentos da base aparecem com o nome em inglês.
    await expect(page.getByRole('list').getByText('Rice', { exact: true }).first()).toBeVisible();
  });
});

test.describe('outros idiomas', () => {
  for (const [locale, heading] of [
    ['es-ES', 'EatMate'],
    ['de-DE', 'EatMate'],
    ['fr-FR', 'EatMate'],
    ['it-IT', 'EatMate'],
  ] as const) {
    test.describe(locale, () => {
      test.use({ locale });
      test(`abre em ${locale}`, async ({ page }) => {
        await page.goto('./');
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
        await expect(page.getByRole('combobox')).toHaveValue(locale.slice(0, 2));
      });
    });
  }
});
