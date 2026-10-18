import { test } from '@playwright/test';
import path from 'node:path';
import { importBackup, onboard, writeDemoBackup } from './helpers';

// Capturas de tela de cada parte do app, para revisar o visual.
// Uso: SCREENSHOTS_DIR=./capturas npx playwright test screenshots
const dir = process.env.SCREENSHOTS_DIR;
test.skip(!dir, 'Defina SCREENSHOTS_DIR para gerar as capturas.');

test('capturas das telas com duas semanas de dados', async ({ page }) => {
  const shot = async (name: string) => {
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(dir!, `${name}.png`) });
  };
  const backup = await writeDemoBackup(2);
  await onboard(page);
  await importBackup(page, backup.file);
  await page.getByRole('link', { name: 'Início' }).click();
  await shot('s01-inicio');

  await page.getByRole('link', { name: 'Ver relatório completo' }).click();
  await page.getByRole('heading', { name: 'Últimos 7 dias' }).waitFor();
  await shot('s02-relatorio-topo');
  const sections = [
    'Destaques',
    'Como a nota foi calculada',
    'Marcadores de consumo',
    'Qualidade e processamento',
    'Grupos de alimentos',
    'Refeições',
    'Alimentos mais frequentes',
    'Dia a dia',
    'Diário alimentar completo',
  ];
  for (const [i, name] of sections.entries()) {
    const heading = page.getByRole('heading', { name, exact: true });
    await heading.evaluate((el) => el.closest('section')?.scrollIntoView({ block: 'start' }));
    await page.evaluate(() => window.scrollBy(0, -12));
    await shot(`s03-relatorio-${String(i + 1).padStart(2, '0')}`);
  }

  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: path.join(dir!, 'relatorio.pdf'), format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' });

  await page.getByRole('link', { name: 'Relatórios' }).click();
  await shot('s04-relatorios');
  await page.getByRole('link', { name: 'Histórico' }).click();
  await shot('s05-historico');
  await page.getByRole('link', { name: /Ontem/ }).click();
  await shot('s06-dia');
  await page.getByRole('link', { name: 'Editar Almoço' }).click();
  await shot('s07-editar');
  await page.getByRole('button', { name: 'Voltar' }).click();
  await page.getByRole('link', { name: 'Perfil' }).click();
  await shot('s08-perfil');

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.getByRole('link', { name: 'Início' }).click();
  await shot('s09-inicio-escuro');
  await page.getByRole('link', { name: 'Ver relatório completo' }).click();
  await shot('s10-relatorio-escuro');
});
