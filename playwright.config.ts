import { defineConfig, devices } from '@playwright/test';

// Permite usar um Chromium já instalado na máquina (ex.: ambientes de CI ou
// containers sem acesso ao download dos navegadores do Playwright).
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
const port = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}/`,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
    launchOptions: { executablePath },
  },
  projects: [{ name: 'mobile', use: { ...devices['Pixel 7'], launchOptions: { executablePath } } }],
  webServer: {
    command: `npm run build && npx vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
