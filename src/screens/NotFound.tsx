import { Compass, TriangleAlert } from 'lucide-react';
import { Link, useRouteError } from 'react-router';
import { EmptyState } from '../components/EmptyState';

export function NotFoundScreen() {
  return (
    <EmptyState
      icon={<Compass size={30} />}
      title="Página não encontrada"
      action={
        <Link to="/" className="btn btn-primary">
          Voltar ao início
        </Link>
      }
    >
      Este endereço não existe no EatMate.
    </EmptyState>
  );
}

export function ErrorScreen() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="app">
      <main className="app-main">
        <EmptyState
          icon={<TriangleAlert size={30} />}
          title="Algo deu errado"
          action={
            <a
              href="#/"
              className="btn btn-primary"
              onClick={() => setTimeout(() => window.location.reload(), 0)}
            >
              Recarregar o app
            </a>
          }
        >
          Seus dados continuam salvos neste aparelho. Tente recarregar o app.
        </EmptyState>
      </main>
    </div>
  );
}
