import { createHashRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ConfirmProvider } from './components/Confirm';
import { ToastProvider } from './components/Toast';
import { DataProvider } from './data/DataProvider';
import type { Language } from './domain/language';
import { I18nProvider } from './i18n/I18nProvider';
import { routes } from './routes';

const router = createHashRouter(routes);

export function App({ language }: { language?: Language }) {
  return (
    <I18nProvider initialLanguage={language}>
      <DataProvider>
        <ToastProvider>
          <ConfirmProvider>
            <RouterProvider router={router} />
          </ConfirmProvider>
        </ToastProvider>
      </DataProvider>
    </I18nProvider>
  );
}
