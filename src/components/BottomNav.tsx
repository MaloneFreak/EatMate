import { CalendarDays, FileText, House, Plus, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`;

export function BottomNav() {
  const { pathname } = useLocation();
  // "Relatórios" fica ativo tanto no histórico de relatórios quanto no relatório atual.
  const onReports = pathname.startsWith('/relatorio');
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <NavLink to="/" end className={linkClass}>
        <House size={22} aria-hidden="true" />
        Início
      </NavLink>
      <NavLink to="/historico" className={linkClass}>
        <CalendarDays size={22} aria-hidden="true" />
        Histórico
      </NavLink>
      <NavLink to="/registrar" className="nav-add" aria-label="Registrar refeição">
        <Plus size={28} strokeWidth={2.6} aria-hidden="true" />
      </NavLink>
      <NavLink to="/relatorios" className={() => linkClass({ isActive: onReports })}>
        <FileText size={22} aria-hidden="true" />
        Relatórios
      </NavLink>
      <NavLink to="/perfil" className={linkClass}>
        <User size={22} aria-hidden="true" />
        Perfil
      </NavLink>
    </nav>
  );
}
