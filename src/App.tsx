import { createHashRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ConfirmProvider } from './components/Confirm';
import { ToastProvider } from './components/Toast';
import { DataProvider } from './data/DataProvider';
import { routes } from './routes';

const router = createHashRouter(routes);

export function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </ToastProvider>
    </DataProvider>
  );
}
