import { useCallback } from 'react';
import { useNavigate } from 'react-router';

/**
 * Volta para a tela anterior; se o app foi aberto direto nesta tela, vai para `fallback`.
 * Se a volta não acontecer (o app instalado foi reaberto e o histórico guardado não tem
 * mais a tela anterior), também vai para `fallback`.
 */
export function useGoBack(fallback = '/') {
  const navigate = useNavigate();
  return useCallback(() => {
    const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (index <= 0) {
      void navigate(fallback, { replace: true });
      return;
    }
    const before = window.location.href;
    void navigate(-1);
    window.setTimeout(() => {
      if (window.location.href === before) void navigate(fallback, { replace: true });
    }, 500);
  }, [navigate, fallback]);
}
