import { useEffect } from 'react';
import { Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { useData } from '../data/DataProvider';
import { ensureWeeklyReports } from '../data/repo';
import { todayISO } from '../domain/dates';
import { BottomNav } from './BottomNav';
import { Logo } from './Logo';
import { UpdatePrompt } from './UpdatePrompt';

export function RootLayout() {
  const { profile, dates, loading } = useData();
  const { pathname } = useLocation();
  const today = todayISO();
  const lastDate = dates[dates.length - 1] ?? '';

  // Cria os relatórios das semanas que já terminaram (Semana 1, Semana 2…).
  useEffect(() => {
    if (loading || !profile) return;
    ensureWeeklyReports(today).catch((error) =>
      console.error('Erro ao gerar relatórios semanais', error),
    );
  }, [loading, profile, dates.length, lastDate, today]);

  if (profile === undefined) {
    return (
      <div className="splash" aria-busy="true" aria-label="Carregando">
        <Logo size={64} className="splash-logo" />
      </div>
    );
  }

  const onboarding = pathname === '/boas-vindas';
  if (!profile && !onboarding) return <Navigate to="/boas-vindas" replace />;
  if (profile && onboarding) return <Navigate to="/" replace />;

  const hideNav = onboarding || pathname.startsWith('/registrar');
  return (
    <div className="app">
      <main className={`app-main${hideNav ? '' : ' has-nav'}`}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
      <UpdatePrompt />
      <ScrollRestoration />
    </div>
  );
}
