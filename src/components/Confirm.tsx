import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Sheet } from './Sheet';

interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm>(async () => false);

/** Caixa de confirmação ("Tem certeza?") usada antes de excluir algo. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>(
    (next) =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setOptions(next);
      }),
    [],
  );

  const close = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Sheet
        open={!!options}
        onClose={() => close(false)}
        title={options?.title ?? ''}
        description={options?.message}
      >
        <div className="sheet-actions">
          <button type="button" className="btn btn-secondary" onClick={() => close(false)}>
            {options?.cancelLabel ?? 'Cancelar'}
          </button>
          <button
            type="button"
            className={`btn ${options?.danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => close(true)}
          >
            {options?.confirmLabel ?? 'Confirmar'}
          </button>
        </div>
      </Sheet>
    </ConfirmContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirm = () => useContext(ConfirmContext);
