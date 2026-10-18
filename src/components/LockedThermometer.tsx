import { ChevronRight, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { UNLOCK_DAYS } from '../domain/periods';

/** Aviso mostrado enquanto a pessoa ainda não tem 7 dias registrados. */
export function LockedThermometer({ registeredDays }: { registeredDays: number }) {
  const missing = UNLOCK_DAYS - registeredDays;
  return (
    <section className="card thermo-card locked" aria-labelledby="locked-title">
      <div className="row">
        <span className="lock-icon">
          <Lock size={18} aria-hidden="true" />
        </span>
        <h2 id="locked-title">Termômetro da alimentação</h2>
      </div>
      <p className="muted">
        Registre o que você come por {UNLOCK_DAYS} dias para ver a qualidade da sua alimentação, com
        nota de A a E, e receber seu primeiro relatório.
      </p>
      <div
        className="progress-dots"
        role="img"
        aria-label={`${registeredDays} de ${UNLOCK_DAYS} dias registrados`}
      >
        {Array.from({ length: UNLOCK_DAYS }, (_, i) => (
          <span key={i} className={`dot${i < registeredDays ? ' filled' : ''}`} />
        ))}
      </div>
      <p className="small">
        <strong>
          {registeredDays} de {UNLOCK_DAYS} dias
        </strong>{' '}
        registrados — {missing === 1 ? 'falta 1 dia' : `faltam ${missing} dias`}.
      </p>
      <Link to="/relatorio/exemplo" className="link-btn">
        Ver um relatório de exemplo <ChevronRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
