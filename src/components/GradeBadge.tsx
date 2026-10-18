import type { Grade } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';

interface GradeBadgeProps {
  grade?: Grade | null;
  size?: 'sm' | 'md' | 'lg';
  /** Texto para leitores de tela; por padrão "Nota B — Boa". */
  label?: string;
}

/** Quadradinho colorido com a nota (A–E). Sem nota, mostra "?". */
export function GradeBadge({ grade, size = 'sm', label }: GradeBadgeProps) {
  const { t } = useI18n();
  const sizeClass = size === 'sm' ? '' : ` grade-${size}`;
  const text =
    label ?? (grade ? t.grades.badge(grade, t.grades.labels[grade]) : t.grades.unclassified);
  return (
    <span
      className={`grade${sizeClass}`}
      data-grade={grade ?? undefined}
      role="img"
      aria-label={text}
      title={text}
    >
      {grade ?? '?'}
    </span>
  );
}
