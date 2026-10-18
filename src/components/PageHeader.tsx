import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useGoBack } from '../lib/navigation';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Mostra o botão de voltar; o valor é a rota usada se não houver página anterior. */
  back?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, back, actions }: PageHeaderProps) {
  const goBack = useGoBack(back ?? '/');
  return (
    <header className="page-header">
      {back !== undefined && (
        <button type="button" className="icon-btn" onClick={goBack} aria-label="Voltar">
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
      )}
      <div className="page-header-title">
        <h1>{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}
