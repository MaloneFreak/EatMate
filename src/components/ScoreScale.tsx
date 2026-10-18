import { GRADES } from '../domain/grades';
import type { Grade } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';

/** Escala A B C D E (no estilo do Nutri-Score) com a nota atual em destaque. */
export function ScoreScale({ grade, size = 'md' }: { grade: Grade; size?: 'md' | 'lg' }) {
  const { t } = useI18n();
  return (
    <div
      className={`scale${size === 'lg' ? ' scale-lg' : ''}`}
      role="img"
      aria-label={t.grades.scale(grade, t.grades.labels[grade])}
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
