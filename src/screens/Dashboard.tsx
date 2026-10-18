import { CalendarDays, Check, ChevronRight, Flame, Lightbulb, Plus, Utensils } from 'lucide-react';
import { Link } from 'react-router';
import { LockedThermometer } from '../components/LockedThermometer';
import { MealIcon } from '../components/MealIcon';
import { ScoreDelta } from '../components/ScoreDelta';
import { ScoreScale } from '../components/ScoreScale';
import { Thermometer } from '../components/Thermometer';
import { useData } from '../data/DataProvider';
import { capitalize, formatLong, formatPeriod, todayISO } from '../domain/dates';
import { GRADE_LABELS, GRADE_MESSAGES } from '../domain/grades';
import { MEAL_TYPES } from '../domain/meals';
import type { Meal } from '../domain/types';
import { currentStreak, mealsInLastDays } from '../lib/stats';
import { tipOfTheDay } from '../lib/tips';
import { useCurrentReport } from '../lib/useCurrentReport';

export function DashboardScreen() {
  const { profile, meals, dates } = useData();
  const today = todayISO();
  const todayMeals = meals.filter((m) => m.date === today);
  const firstName = profile?.name.split(' ')[0] ?? '';

  return (
    <div className="stack">
      <header className="greeting">
        <h1>Olá, {firstName}!</h1>
        <p className="muted">{capitalize(formatLong(today))}</p>
      </header>

      <Link to="/registrar" className="cta">
        <span className="cta-icon">
          <Plus size={32} strokeWidth={2.6} aria-hidden="true" />
        </span>
        <span>
          <span className="cta-title">Registrar refeição</span>
          <span className="cta-subtitle">O que você comeu agora ou mais cedo?</span>
        </span>
      </Link>

      <ThermometerCard />

      <TodayCard today={today} meals={todayMeals} />

      <div className="kpis">
        <div className="kpi">
          <Flame className="kpi-icon" size={20} aria-hidden="true" />
          <div className="kpi-value">{currentStreak(dates, today)}</div>
          <div className="kpi-label">dias seguidos</div>
        </div>
        <div className="kpi">
          <CalendarDays className="kpi-icon" size={20} aria-hidden="true" />
          <div className="kpi-value">{dates.length}</div>
          <div className="kpi-label">dias registrados</div>
        </div>
        <div className="kpi">
          <Utensils className="kpi-icon" size={20} aria-hidden="true" />
          <div className="kpi-value">{mealsInLastDays(meals, today)}</div>
          <div className="kpi-label">refeições em 7 dias</div>
        </div>
      </div>

      <section className="card tip-card">
        <div className="row">
          <Lightbulb size={20} className="tip-icon" aria-hidden="true" />
          <h2>Dica do dia</h2>
        </div>
        <p>{tipOfTheDay(today)}</p>
      </section>
    </div>
  );
}

function ThermometerCard() {
  const { unlocked, registeredDays, period, report } = useCurrentReport();

  if (!unlocked) return <LockedThermometer registeredDays={registeredDays} />;

  const score = report?.score;
  return (
    <Link
      to="/relatorio"
      className="card card-link thermo-card"
      aria-label="Ver relatório completo"
    >
      <div className="card-title">
        <h2>Qualidade da sua alimentação</h2>
        {period && <span className="badge">{formatPeriod(period.start, period.end)}</span>}
      </div>
      {score ? (
        <div className="thermo-body">
          <Thermometer score={score.total} grade={score.grade} height={150} />
          <div className="thermo-info">
            <p className="hero-score">
              <span className="hero-number">{score.total}</span>
              <span className="hero-of">/100</span>
            </p>
            <ScoreScale grade={score.grade} />
            <p className="thermo-label">
              <strong>{GRADE_LABELS[score.grade]}</strong> · {GRADE_MESSAGES[score.grade]}
            </p>
            {report?.previous && (
              <ScoreDelta current={score.total} previous={report.previous.score} />
            )}
          </div>
        </div>
      ) : (
        <p className="muted">
          Ainda não há alimentos reconhecidos suficientes nos últimos 7 dias para calcular a nota.
        </p>
      )}
      <span className="link-btn">
        Ver relatório completo <ChevronRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}

function TodayCard({ today, meals }: { today: string; meals: Meal[] }) {
  return (
    <section className="card" aria-labelledby="today-title">
      <div className="card-title">
        <h2 id="today-title">Hoje</h2>
        <Link to={`/historico/${today}`} className="link-btn small">
          Ver dia <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="today-grid">
        {MEAL_TYPES.map(({ type, label }) => {
          const ofType = meals.filter((m) => m.type === type);
          const items = ofType.flatMap((m) => m.items);
          const done = ofType.length > 0;
          const to = !done
            ? `/registrar?refeicao=${type}`
            : ofType.length === 1
              ? `/registrar/${ofType[0]!.id}`
              : `/historico/${today}`;
          return (
            <li key={type}>
              <Link to={to} className={`today-slot${done ? ' done' : ''}`}>
                <span className="today-slot-icon">
                  <MealIcon type={type} size={18} />
                </span>
                <span className="today-slot-text">
                  <span className="today-slot-label">{label}</span>
                  <span className="today-slot-meta">
                    {done ? items.map((i) => i.name).join(', ') : 'Adicionar'}
                  </span>
                </span>
                {done ? (
                  <Check size={18} className="today-slot-status" aria-label="Registrado" />
                ) : (
                  <Plus size={18} className="today-slot-status" aria-hidden="true" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
