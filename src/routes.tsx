import type { RouteObject } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { DashboardScreen } from './screens/Dashboard';
import { DayScreen } from './screens/Day';
import { ErrorScreen, NotFoundScreen } from './screens/NotFound';
import { HistoryScreen } from './screens/History';
import { MealFormScreen } from './screens/MealForm';
import { OnboardingScreen } from './screens/Onboarding';

/*
 * Telas do app. As rotas usam "#" (ex.: #/historico) para funcionar em qualquer hospedagem.
 * As telas do dia a dia (início, registrar, histórico) vêm no pacote principal; relatórios e
 * perfil são baixados quando abertos pela primeira vez (e ficam no cache para uso sem internet).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorScreen />,
    children: [
      { index: true, element: <DashboardScreen /> },
      { path: 'boas-vindas', element: <OnboardingScreen /> },
      { path: 'registrar', element: <MealFormScreen /> },
      { path: 'registrar/:id', element: <MealFormScreen /> },
      { path: 'historico', element: <HistoryScreen /> },
      { path: 'historico/:date', element: <DayScreen /> },
      {
        path: 'relatorio',
        lazy: () =>
          import('./screens/CurrentReport').then((m) => ({ Component: m.CurrentReportScreen })),
      },
      {
        path: 'relatorio/exemplo',
        lazy: () =>
          import('./screens/ExampleReport').then((m) => ({ Component: m.ExampleReportScreen })),
      },
      {
        path: 'relatorios',
        lazy: () => import('./screens/Reports').then((m) => ({ Component: m.ReportsScreen })),
      },
      {
        path: 'relatorios/:id',
        lazy: () =>
          import('./screens/SavedReport').then((m) => ({ Component: m.SavedReportScreen })),
      },
      {
        path: 'perfil',
        lazy: () => import('./screens/Profile').then((m) => ({ Component: m.ProfileScreen })),
      },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
];
