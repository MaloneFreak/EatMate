import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { applyTheme } from './lib/theme';
import './styles/fonts.css';
import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/report.css';
import './styles/print.css';

applyTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
