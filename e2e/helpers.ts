import type { Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildDemoMeals } from '../src/domain/demo';
import { addDays } from '../src/domain/dates';
import { FoodIndex } from '../src/domain/foodIndex';
import type { Language } from '../src/domain/language';
import { loadLanguage } from '../src/i18n/messages';

export const TIME_ZONE = 'America/Sao_Paulo';

/** Data de hoje (AAAA-MM-DD) no mesmo fuso do navegador dos testes. */
export function todayInTimeZone(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());
}

/**
 * Cria um arquivo de backup com `weeks` semanas de refeições, terminando ontem.
 * Os nomes dos alimentos ficam no idioma pedido (o backup guarda o nome como texto).
 */
export async function writeDemoBackup(
  weeks = 2,
  language: Language = 'pt',
): Promise<{ file: string; firstDay: string; lastDay: string }> {
  await loadLanguage(language);
  const index = new FoodIndex([], language);
  const lastDay = addDays(todayInTimeZone(), -1);
  const meals = Array.from({ length: weeks }, (_, w) =>
    buildDemoMeals(addDays(lastDay, -7 * w), index).map((meal) => ({
      ...meal,
      id: `w${w}-${meal.id}`,
      items: meal.items.map((item) => ({ ...item, id: `w${w}-${item.id}` })),
    })),
  ).flat();
  const backup = {
    app: 'eatmate',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: { dismissedPeriods: [] },
    meals,
    customFoods: [],
    reports: [],
  };
  const file = path.join(
    tmpdir(),
    `eatmate-backup-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  );
  await writeFile(file, JSON.stringify(backup));
  return { file, firstDay: addDays(lastDay, -(7 * weeks - 1)), lastDay };
}

export async function onboard(page: Page, name = 'Pedro') {
  await page.goto('./');
  await page.getByLabel('Como podemos te chamar?').fill(name);
  await page.getByRole('button', { name: 'Começar' }).click();
  await page.getByRole('heading', { name: `Olá, ${name.split(' ')[0]}!` }).waitFor();
}

export async function importBackup(page: Page, file: string) {
  await page.getByRole('link', { name: 'Perfil' }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Importar backup' }).click();
  await (await chooser).setFiles(file);
  await page.getByRole('dialog').getByRole('button', { name: 'Importar' }).click();
  await page.getByText(/Backup importado/).waitFor();
}

/** Salva uma captura de tela quando SCREENSHOTS_DIR estiver definido (útil para revisar o visual). */
export async function snap(page: Page, name: string) {
  const dir = process.env.SCREENSHOTS_DIR;
  if (!dir) return;
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
}
