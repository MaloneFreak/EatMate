import { useCallback } from 'react';
import { useNavigate } from 'react-router';

/** Volta para a tela anterior; se o app foi aberto direto nesta tela, vai para `fallback`. */
export function useGoBack(fallback = '/') {
  const navigate = useNavigate();
  return useCallback(() => {
    const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (index > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [navigate, fallback]);
}
