import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/** Avisa quando há uma versão nova do app (sem recarregar sozinho no meio de um registro). */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;
  return (
    <div className="toasts" role="status">
      <div className="toast">
        <RefreshCw className="toast-icon" size={20} aria-hidden="true" />
        <span className="grow">Nova versão do EatMate disponível.</span>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => updateServiceWorker(true)}
        >
          Atualizar
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => setNeedRefresh(false)}
          style={{ color: 'inherit' }}
        >
          Depois
        </button>
      </div>
    </div>
  );
}
