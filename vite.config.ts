/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// `base: './'` gera caminhos relativos: o mesmo build funciona em
// https://usuario.github.io/EatMate/, em um domínio próprio ou em qualquer subpasta.
// As rotas usam "hash" (#/historico), então não é preciso configurar o servidor.
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? 'dev'),
  },
  build: {
    // React + roteador + banco local + os 6 idiomas ficam num único arquivo (~250 kB comprimido),
    // guardado em cache pelo app para funcionar sem internet.
    chunkSizeWarningLimit: 1200,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        // O app escolhe o idioma da tela sozinho; o manifesto fica em inglês.
        name: 'EatMate — Food diary',
        short_name: 'EatMate',
        description:
          'Log your meals, follow the quality of your diet and get weekly reports. In Português, English, Español, Deutsch, Français and Italiano.',
        lang: 'en',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#1e7a52',
        background_color: '#f7f5f0',
        categories: ['health', 'food', 'lifestyle'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
  },
});
