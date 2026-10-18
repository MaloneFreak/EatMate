// Gera os ícones PNG do app a partir do desenho em SVG.
// Uso: node scripts/generate-icons.mjs
// (usa o Chromium do Playwright; defina PLAYWRIGHT_CHROMIUM_PATH para usar outro navegador)
import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const plate = `
  <circle cx="31" cy="36" r="18" fill="#ffffff"/>
  <circle cx="31" cy="36" r="11.5" fill="#e2f1e8"/>
  <path d="M44 9c-8.5 0-14 5.5-14 13.5 8.5 0 14-5.5 14-13.5z" fill="#85bb2f"/>
  <path d="M30.5 22.5c3-4 7-7 11-9" stroke="#1e7a52" stroke-width="2" stroke-linecap="round" fill="none"/>`;

// Ícone comum: cantos arredondados.
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#1e7a52"/>${plate}</svg>`;
// Ícone "maskable" e Apple: fundo cheio (o sistema recorta) e desenho menor, dentro da área segura.
const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1e7a52"/><g transform="translate(32 32) scale(0.72) translate(-32 -32)">${plate}</g></svg>`;

const icons = [
  { file: 'public/pwa-192x192.png', svg: rounded, size: 192 },
  { file: 'public/pwa-512x512.png', svg: rounded, size: 512 },
  { file: 'public/pwa-maskable-512x512.png', svg: full, size: 512 },
  { file: 'public/apple-touch-icon.png', svg: full, size: 180 },
];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage();
for (const { file, svg, size } of icons) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  await writeFile(file, await page.locator('svg').screenshot({ omitBackground: true }));
  console.log('ok', file);
}
await browser.close();
