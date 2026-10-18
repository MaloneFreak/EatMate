import { ChevronRight, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { UNLOCK_DAYS } from '../domain/periods';
import { useI18n } from '../i18n/I18nProvider';

/** Aviso mostrado enquanto a pessoa ainda não tem 7 dias registrados. */
export function LockedThermometer({ registeredDays }: { registeredDays: number }) {
  const { t } = useI18n();
  const missing = UNLOCK_DAYS - registeredDays;
  return (
    <section className="card thermo-card locked" aria-labelledby="locked-title">
      <div className="row">
        <span className="lock-icon">
          <Lock size={18} aria-hidden="true" />
        </span>
        <h2 id="locked-title">{t.locked.title}</h2>
      </div>
      <p className="muted">{t.locked.text(UNLOCK_DAYS)}</p>
      <div
        className="progress-dots"
        role="img"
        aria-label={t.locked.progress(registeredDays, UNLOCK_DAYS)}
      >
        {Array.from({ length: UNLOCK_DAYS }, (_, i) => (
          <span key={i} className={`dot${i < registeredDays ? ' filled' : ''}`} />
        ))}
      </div>
      <p className="small">
        <strong>{t.locked.count(registeredDays, UNLOCK_DAYS)}</strong> {t.locked.registered} —{' '}
        {t.locked.missing(missing)}.
      </p>
      <Link to="/relatorio/exemplo" className="link-btn">
        {t.locked.example} <ChevronRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
