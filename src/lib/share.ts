/** Copia texto para a área de transferência (com alternativa para navegadores antigos). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // tenta a alternativa abaixo
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let ok: boolean;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

/** Baixa um arquivo de texto gerado no próprio aparelho. */
export function downloadText(filename: string, text: string, mime = 'text/plain'): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const canShare = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

/** Abre o menu de compartilhar do celular (WhatsApp, e-mail…). Retorna `false` se não for possível. */
export async function shareText(title: string, text: string): Promise<boolean> {
  if (!canShare()) return false;
  try {
    await navigator.share({ title, text });
    return true;
  } catch (error) {
    // Cancelar o compartilhamento não é um erro.
    return (error as DOMException)?.name === 'AbortError';
  }
}

/** Nome de arquivo seguro: "Relatório 12/10 a 18/10" → "relatorio-12-10-a-18-10". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
