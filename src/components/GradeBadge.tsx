import { GRADE_LABELS } from '../domain/grades';
import type { Grade } from '../domain/types';

interface GradeBadgeProps {
  grade?: Grade | null;
  size?: 'sm' | 'md' | 'lg';
  /** Texto para leitores de tela; por padrão "Nota B — Boa". */
  label?: string;
}

/** Quadradinho colorido com a nota (A–E). Sem nota, mostra "?". */
export function GradeBadge({ grade, size = 'sm', label }: GradeBadgeProps) {
  const sizeClass = size === 'sm' ? '' : ` grade-${size}`;
  const text = label ?? (grade ? `Nota ${grade} — ${GRADE_LABELS[grade]}` : 'Sem classificação');
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
