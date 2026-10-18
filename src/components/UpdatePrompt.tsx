import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '../i18n/I18nProvider';

/** Avisa quando há uma versão nova do app (sem recarregar sozinho no meio de um registro). */
export function UpdatePrompt() {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;
  return (
    <div className="toasts" role="status">
      <div className="toast">
        <RefreshCw className="toast-icon" size={20} aria-hidden="true" />
        <span className="grow">{t.update.available}</span>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => updateServiceWorker(true)}
        >
          {t.update.update}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => setNeedRefresh(false)}
          style={{ color: 'inherit' }}
        >
          {t.update.later}
        </button>
      </div>
    </div>
  );
}
