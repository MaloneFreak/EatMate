/** Texto com trechos em negrito marcados com `**…**` (usado nas mensagens traduzidas). */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\*\*(.+?)\*\*/)
        .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}
