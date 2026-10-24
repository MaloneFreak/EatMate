import { CalendarDays, FileText, House, Plus, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import { useI18n } from '../i18n/I18nProvider';

const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`;

export function BottomNav() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  // "Relatórios" fica ativo tanto no histórico de relatórios quanto no relatório atual.
  const onReports = pathname.startsWith('/relatorio');
  return (
    <nav className="bottom-nav" aria-label={t.nav.label}>
      <NavLink to="/" end className={linkClass}>
        <House size={22} aria-hidden="true" />
        <span className="nav-label">{t.nav.home}</span>
      </NavLink>
      <NavLink to="/historico" className={linkClass}>
        <CalendarDays size={22} aria-hidden="true" />
        <span className="nav-label">{t.nav.history}</span>
      </NavLink>
      <NavLink to="/registrar" className="nav-add" aria-label={t.nav.add}>
        <Plus size={28} strokeWidth={2.6} aria-hidden="true" />
      </NavLink>
      <NavLink to="/relatorios" className={() => linkClass({ isActive: onReports })}>
        <FileText size={22} aria-hidden="true" />
        <span className="nav-label">{t.nav.reports}</span>
      </NavLink>
      <NavLink to="/perfil" className={linkClass}>
        <User size={22} aria-hidden="true" />
        <span className="nav-label">{t.nav.profile}</span>
      </NavLink>
    </nav>
  );
}
