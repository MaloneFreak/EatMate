import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { LANGUAGES } from '../domain/language';
import { loadLanguage } from '../i18n/messages';

// No app cada idioma é baixado quando escolhido; nos testes, todos ficam prontos de saída.
await Promise.all(LANGUAGES.map(loadLanguage));

afterEach(() => {
  cleanup();
});
