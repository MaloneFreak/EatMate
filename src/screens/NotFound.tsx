import { Compass, TriangleAlert } from 'lucide-react';
import { Link, useRouteError } from 'react-router';
import { EmptyState } from '../components/EmptyState';
import { useI18n } from '../i18n/I18nProvider';

export function NotFoundScreen() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon={<Compass size={30} />}
      title={t.notFound.title}
      action={
        <Link to="/" className="btn btn-primary">
          {t.notFound.home}
        </Link>
      }
    >
      {t.notFound.text}
    </EmptyState>
  );
}

export function ErrorScreen() {
  const error = useRouteError();
  const { t } = useI18n();
  console.error(error);
  return (
    <div className="app">
      <main className="app-main">
        <EmptyState
          icon={<TriangleAlert size={30} />}
          title={t.notFound.errorTitle}
          action={
            <a
              href="#/"
              className="btn btn-primary"
              onClick={() => setTimeout(() => window.location.reload(), 0)}
            >
              {t.notFound.reload}
            </a>
          }
        >
          {t.notFound.errorText}
        </EmptyState>
      </main>
    </div>
  );
}
