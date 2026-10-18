import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

/** Variação da nota em relação ao período anterior. */
export function ScoreDelta({ current, previous }: { current: number; previous: number }) {
  const { t } = useI18n();
  const delta = current - previous;
  const Icon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : ArrowRight;
  const tone = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const text = t.score.delta(delta);
  return (
    <span className={`delta delta-${tone}`}>
      <Icon size={16} aria-hidden="true" />
      {text}
    </span>
  );
}
