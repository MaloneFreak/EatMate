import { GRADES, GRADE_LABELS } from '../domain/grades';
import type { Grade } from '../domain/types';

/** Escala A B C D E (no estilo do Nutri-Score) com a nota atual em destaque. */
export function ScoreScale({ grade, size = 'md' }: { grade: Grade; size?: 'md' | 'lg' }) {
  return (
    <div
      className={`scale${size === 'lg' ? ' scale-lg' : ''}`}
      role="img"
      aria-label={`Nota ${grade} na escala de A a E: ${GRADE_LABELS[grade]}`}
    >
      {GRADES.map((g) => (
        <span
          key={g}
          className={`scale-cell${g === grade ? ' active' : ''}`}
          data-grade={g}
          aria-hidden="true"
        >
          {g}
        </span>
      ))}
    </div>
  );
}
