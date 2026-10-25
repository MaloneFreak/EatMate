/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/*
 * Política de segurança de conteúdo (CSP). O GitHub Pages não deixa enviar cabeçalhos,
 * então ela vai numa <meta> do index.html. O app não carrega nada de fora: scripts,
 * estilos, fontes e imagens vêm do próprio site, e nada é enviado para servidor algum.
 * (`frame-ancestors` não funciona em <meta>; a proteção contra iframe fica em lib/framing.ts.)
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** Só no build: o servidor de desenvolvimento do Vite usa scripts inline. */
const contentSecurityPolicy = (): Plugin => ({
  name: 'eatmate-content-security-policy',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
      injectTo: 'head-prepend',
    },
  ],
});

// `base: './'` gera caminhos relativos: o mesmo build funciona em
// https://usuario.github.io/EatMate/, em um domínio próprio ou em qualquer subpasta.
// As rotas usam "hash" (#/historico), então não é preciso configurar o servidor.
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? 'dev'),
  },
  build: {
    // O app abre com o código das telas do dia a dia e as bibliotecas (React, roteador, banco
    // local) num arquivo à parte, que muda pouco e continua em cache entre as versões do app.
    // Cada idioma, os relatórios e o perfil são baixados quando usados. O service worker guarda
    // tudo para funcionar sem internet.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'vendor', test: /[\\/]node_modules[\\/]/, priority: 1 }],
        },
      },
    },
  },
  plugins: [
    react(),
    contentSecurityPolicy(),
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
        // Sem travar a orientação: tablets e Chromebooks costumam ficar na horizontal.
        orientation: 'any',
        theme_color: '#1e7a52',
        background_color: '#f7f5f0',
        categories: ['health', 'food', 'lifestyle'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
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
