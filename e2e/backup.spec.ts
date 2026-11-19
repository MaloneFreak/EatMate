import { expect, test } from '@playwright/test';
import { onboard } from './helpers';

test('salvar o backup pelo menu de compartilhar (Drive, iCloud…)', async ({ page }) => {
  // Simula o menu de compartilhar do Chrome no Android, que recusa arquivos JSON.
  await page.addInitScript(() => {
    const shared: string[] = [];
    Object.assign(window, { sharedFiles: shared });
    Object.assign(navigator, {
      canShare: (data: ShareData) => (data.files ?? []).every((f) => f.type === 'text/plain'),
      share: async (data: ShareData) => {
        for (const file of data.files ?? []) shared.push(file.name);
      },
    });
  });
  await onboard(page);
  await page.getByRole('link', { name: 'Perfil' }).click();
  await expect(page.getByText('Último backup:')).toContainText('nunca');

  await page.getByRole('button', { name: 'Salvar no Drive ou iCloud' }).click();
  await expect(page.getByText('Backup salvo.')).toBeVisible();
  await expect(page.getByText('Último backup:')).not.toContainText('nunca');
  const shared = await page.evaluate(
    () => (window as unknown as { sharedFiles: string[] }).sharedFiles,
  );
  expect(shared).toEqual([expect.stringMatching(/^eatmate-backup-\d{4}-\d{2}-\d{2}\.txt$/)]);
});

test('lembrete de backup na tela inicial', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-01T12:00:00Z') });
  await onboard(page);
  await page
    .getByRole('link', { name: /Registrar refeição/ })
    .first()
    .click();
  const input = page.getByRole('combobox', { name: 'O que você comeu?' });
  await input.fill('café com leite');
  await input.press('Enter');
  await page.getByRole('button', { name: 'Salvar refeição' }).click();
  await page.getByRole('heading', { name: 'Olá, Pedro!' }).waitFor();
  const reminder = page.getByRole('region', { name: 'Hora de fazer backup' });
  await expect(reminder).toHaveCount(0);

  // Uma semana depois, sem nenhum backup: o lembrete aparece. "Agora não" adia por mais uma semana.
  await page.clock.setSystemTime(new Date('2026-10-09T12:00:00Z'));
  await page.reload();
  await expect(reminder).toContainText('Você ainda não fez nenhum backup');
  await reminder.getByRole('button', { name: 'Agora não' }).click();
  await expect(reminder).toHaveCount(0);

  await page.clock.setSystemTime(new Date('2026-10-17T12:00:00Z'));
  await page.reload();
  const download = page.waitForEvent('download');
  await reminder.getByRole('button', { name: 'Fazer backup' }).click();
  expect((await download).suggestedFilename()).toMatch(/^eatmate-backup-2026-10-17\.json$/);
  await expect(reminder).toHaveCount(0);

  // Desligado no Perfil, não aparece mais.
  await page.getByRole('link', { name: 'Perfil' }).click();
  await page.getByRole('radio', { name: 'Desligado' }).click();
  await page.clock.setSystemTime(new Date('2026-12-01T12:00:00Z'));
  await page.getByRole('link', { name: 'Início' }).click();
  await expect(page.getByRole('heading', { name: 'Olá, Pedro!' })).toBeVisible();
  await expect(reminder).toHaveCount(0);
});
