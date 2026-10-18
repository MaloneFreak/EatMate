import type { RouteObject } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { CurrentReportScreen } from './screens/CurrentReport';
import { DashboardScreen } from './screens/Dashboard';
import { DayScreen } from './screens/Day';
import { ErrorScreen, NotFoundScreen } from './screens/NotFound';
import { ExampleReportScreen } from './screens/ExampleReport';
import { HistoryScreen } from './screens/History';
import { MealFormScreen } from './screens/MealForm';
import { OnboardingScreen } from './screens/Onboarding';
import { ProfileScreen } from './screens/Profile';
import { ReportsScreen } from './screens/Reports';
import { SavedReportScreen } from './screens/SavedReport';

/** Telas do app. As rotas usam "#" (ex.: #/historico) para funcionar em qualquer hospedagem. */
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
      { path: 'relatorio', element: <CurrentReportScreen /> },
      { path: 'relatorio/exemplo', element: <ExampleReportScreen /> },
      { path: 'relatorios', element: <ReportsScreen /> },
      { path: 'relatorios/:id', element: <SavedReportScreen /> },
      { path: 'perfil', element: <ProfileScreen /> },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
];
