import { expect, test, type Page } from '@playwright/test';
import { importBackup, onboard, writeDemoBackup } from './helpers';

// Nenhuma tela pode rolar para o lado: do celular pequeno (320 px) ao desktop,
// e também em alemão, o idioma com as palavras mais longas.
const WIDTHS = [320, 375, 768, 1280];
const SCREENS = [
  '#/',
  '#/registrar',
  '#/historico',
  '#/relatorio',
  '#/relatorio/exemplo',
  '#/relatorios',
  '#/perfil',
];

/** Elementos que passam da borda direita da tela (vazio quando está tudo certo). */
async function overflowing(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const found: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.right <= width + 1) continue;
      // Ignora o que está dentro de um contêiner com rolagem própria (ex.: tabelas).
      let parent = el.parentElement;
      let clipped = false;
      while (parent && parent !== document.body) {
        const style = getComputedStyle(parent);
        if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
          clipped = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (clipped) continue;
      found.push(`${el.tagName.toLowerCase()}.${el.className} (${Math.round(box.right)}px)`);
    }
    if (document.documentElement.scrollWidth > width) found.unshift('documento rola na horizontal');
    return found.slice(0, 8);
  });
}

for (const language of ['pt', 'de'] as const) {
  test(`nenhuma tela rola para o lado (${language})`, async ({ page }) => {
    const backup = await writeDemoBackup(2, language);
    await onboard(page);
    await importBackup(page, backup.file);
    if (language !== 'pt') {
      await page.evaluate((l) => localStorage.setItem('eatmate:lang', l), language);
      await page.reload();
    }
    await expect(page.locator('html')).toHaveAttribute('lang', new RegExp(`^${language}`));
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      for (const screen of SCREENS) {
        await page.goto(`./${screen}`);
        await page.locator('main').first().waitFor();
        await page.waitForTimeout(300);
        expect(await overflowing(page), `${screen} em ${width}px`).toEqual([]);
      }
    }
  });
}
