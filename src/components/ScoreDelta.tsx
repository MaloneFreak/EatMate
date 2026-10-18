import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';

/** Variação da nota em relação ao período anterior. */
export function ScoreDelta({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous;
  const Icon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : ArrowRight;
  const tone = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const text =
    delta === 0
      ? 'Igual aos 7 dias anteriores'
      : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'ponto' : 'pontos'} em relação aos 7 dias anteriores`;
  return (
    <span className={`delta delta-${tone}`}>
      <Icon size={16} aria-hidden="true" />
      {text}
    </span>
  );
}
