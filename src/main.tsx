import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { startupLanguage } from './i18n/languages';
import { loadLanguage } from './i18n/messages';
import { protectFromFraming } from './lib/framing';
import { applyTheme } from './lib/theme';
import './styles/fonts.css';
import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/report.css';
import './styles/print.css';

applyTheme();

const render = (language?: 'pt') =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App language={language} />
    </StrictMode>,
  );

// O app não abre dentro de um <iframe> de outro site (proteção contra clickjacking).
if (protectFromFraming()) {
  // Baixa só o idioma da pessoa antes da primeira tela; sem ele, abre em português.
  const language = startupLanguage();
  loadLanguage(language).then(
    () => render(),
    () => render('pt'),
  );
}
