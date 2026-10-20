import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { writeDemoBackup } from './helpers';

// Capturas de tela do README, no idioma escolhido (en ou pt), com duas semanas de dados de exemplo.
// Uso: README_SHOTS_DIR=docs/screenshots/en README_SHOTS_LANG=en npx playwright test readme-screenshots
const dir = process.env.README_SHOTS_DIR;
const language = process.env.README_SHOTS_LANG === 'pt' ? 'pt' : 'en';
test.skip(!dir, 'Defina README_SHOTS_DIR para gerar as capturas do README.');

const TEXT = {
  en: {
    locale: 'en-US',
    name: 'Sam',
    meal: 'almoco',
    sentence: 'grilled chicken, rice, beans, salad and a glass of orange juice',
    typing: 'app',
  },
  pt: {
    locale: 'pt-BR',
    name: 'Pedro',
    meal: 'almoco',
    sentence: 'arroz, feijão, frango grelhado, salada e um copo de suco de laranja',
    typing: 'bata',
  },
}[language];

// Celular de 412 × 839 em densidade 2×: gera imagens de 824 × 1678.
test.use({
  locale: TEXT.locale,
  viewport: { width: 412, height: 839 },
  deviceScaleFactor: 2,
});

test(`capturas do README (${language})`, async ({ page }) => {
  const shot = async (name: string, { top = true } = {}) => {
    // O app lembra a posição da tela anterior: volta ao topo, a menos que a captura peça outra.
    if (top) await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(dir!, `${name}.png`) });
  };
  await mkdir(dir!, { recursive: true });

  await page.goto('./');
  await page.locator('input[name=name]').fill(TEXT.name);
  await page.locator('button[type=submit]').click();
  await page.locator('.greeting').waitFor();

  const backup = await writeDemoBackup(2, language);
  await page.goto('./#/perfil');
  await page.locator('input[type=file]').setInputFiles(backup.file);
  await page.getByRole('dialog').locator('.btn-primary').click();
  await page.locator('.toast').first().waitFor();
  await page.locator('.toast').first().waitFor({ state: 'detached', timeout: 10_000 });

  await page.goto('./#/');
  await page.locator('.thermometer').waitFor();
  await shot('home');

  await page.goto(`./#/registrar?refeicao=${TEXT.meal}`);
  // Mouse fora da lista de sugestões: parado em cima dela, marcaria um item sem querer.
  await page.mouse.move(2, 2);
  const input = page.getByRole('combobox');
  await input.fill(TEXT.sentence);
  await input.press('Enter');
  await input.fill(TEXT.typing);
  await page.locator('.suggestions').waitFor();
  // Destaca a segunda sugestão ("Apple" / "Batata"), que é o alimento in natura.
  await input.press('ArrowDown');
  await input.press('ArrowDown');
  await page.locator('#food-title').evaluate((el) => {
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16);
  });
  await shot('log-meal', { top: false });

  await page.goto('./#/relatorio');
  await page.locator('.report-hero').waitFor();
  await shot('report');

  await page.goto('./#/historico');
  await page.locator('.day-card').first().waitFor();
  await shot('history');
});
