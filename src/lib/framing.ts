/**
 * Proteção contra clickjacking: o GitHub Pages não deixa enviar o cabeçalho
 * `frame-ancestors`, então o próprio app se recusa a abrir dentro de um <iframe>
 * de outro site e mostra só um link para abrir o EatMate direto.
 * Devolve `true` quando o app pode abrir.
 */
export function protectFromFraming(): boolean {
  let framed: boolean;
  try {
    framed = window.top !== window.self;
  } catch {
    // Acessar `window.top` de outra origem pode lançar erro: também está num iframe.
    framed = true;
  }
  if (!framed) return true;
  const link = document.createElement('a');
  link.href = window.location.href;
  link.target = '_top';
  link.rel = 'noopener noreferrer';
  link.textContent = 'EatMate ↗';
  document.body.replaceChildren(link);
  return false;
}
