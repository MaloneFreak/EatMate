import {
  CalendarDays,
  Check,
  ChevronRight,
  CloudUpload,
  Flame,
  Lightbulb,
  Plus,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router';
import { LockedThermometer } from '../components/LockedThermometer';
import { MealIcon } from '../components/MealIcon';
import { ScoreDelta } from '../components/ScoreDelta';
import { ScoreScale } from '../components/ScoreScale';
import { Thermometer } from '../components/Thermometer';
import { Rich } from '../components/Rich';
import { useToast } from '../components/Toast';
import { useData } from '../data/DataProvider';
import { updateSettings } from '../data/repo';
import { daysSinceBackup, isBackupReminderDue } from '../domain/backupReminder';
import { todayISO } from '../domain/dates';
import { MEAL_TYPES } from '../domain/meals';
import type { Meal } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { saveBackup } from '../lib/saveBackup';
import { canShareFiles } from '../lib/share';
import { currentStreak, mealsInLastDays } from '../lib/stats';
import { tipOfTheDay } from '../lib/tips';
import { useCurrentReport } from '../lib/useCurrentReport';

export function DashboardScreen() {
  const { profile, meals, dates } = useData();
  const { t, f } = useI18n();
  const d = t.dashboard;
  const today = todayISO();
  const todayMeals = meals.filter((m) => m.date === today);
  const firstName = profile?.name.split(' ')[0] ?? '';

  return (
    <div className="stack">
      <header className="greeting">
        <h1>{d.hello(firstName)}</h1>
        <p className="muted">{f.long(today)}</p>
      </header>

      <Link to="/registrar" className="cta">
        <span className="cta-icon">
          <Plus size={32} strokeWidth={2.6} aria-hidden="true" />
        </span>
        <span>
          <span className="cta-title">{d.ctaTitle}</span>
          <span className="cta-subtitle">{d.ctaSubtitle}</span>
        </span>
      </Link>

      <ThermometerCard />

      <TodayCard today={today} meals={todayMeals} />

      <BackupReminderCard />

      <div className="kpis">
        <div className="kpi">
          <Flame className="kpi-icon" size={20} aria-hidden="true" />
          <div className="kpi-value">{currentStreak(dates, today)}</div>
          <div className="kpi-label">{d.streak}</div>
        </div>
        <div className="kpi">
          <CalendarDays className="kpi-icon" size={20} aria-hidden="true" />
          <div className="kpi-value">{dates.length}</div>
          <div className="kpi-label">{d.registeredDays}</div>
        </div>
        <div className="kpi">
          <Utensils className="kpi-icon" size={20} aria-hidden="true" />
          <div className="kpi-value">{mealsInLastDays(meals, today)}</div>
          <div className="kpi-label">{d.meals7}</div>
        </div>
      </div>

      <section className="card tip-card">
        <div className="row">
          <Lightbulb size={20} className="tip-icon" aria-hidden="true" />
          <h2>{d.tip}</h2>
        </div>
        <p>{tipOfTheDay(t.tips, today)}</p>
      </section>
    </div>
  );
}

function ThermometerCard() {
  const { unlocked, registeredDays, period, report } = useCurrentReport();
  const { t, f } = useI18n();

  if (!unlocked) return <LockedThermometer registeredDays={registeredDays} />;

  const score = report?.score;
  return (
    <Link to="/relatorio" className="card card-link thermo-card" aria-label={t.dashboard.seeReport}>
      <div className="card-title">
        <h2>{t.dashboard.thermoTitle}</h2>
        {period && <span className="badge">{f.period(period.start, period.end)}</span>}
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
              <strong>{t.grades.labels[score.grade]}</strong> · {t.grades.messages[score.grade]}
            </p>
            {report?.previous && (
              <ScoreDelta current={score.total} previous={report.previous.score} />
            )}
          </div>
        </div>
      ) : (
        <p className="muted">{t.dashboard.noScore}</p>
      )}
      <span className="link-btn">
        {t.dashboard.seeReport} <ChevronRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}

function TodayCard({ today, meals }: { today: string; meals: Meal[] }) {
  const { t } = useI18n();
  return (
    <section className="card" aria-labelledby="today-title">
      <div className="card-title">
        <h2 id="today-title">{t.dashboard.today}</h2>
        <Link to={`/historico/${today}`} className="link-btn small">
          {t.dashboard.seeDay} <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="today-grid">
        {MEAL_TYPES.map(({ type }) => {
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
                  <span className="today-slot-label">{t.mealTypes[type]}</span>
                  <span className="today-slot-meta">
                    {done ? items.map((i) => i.name).join(', ') : t.dashboard.add}
                  </span>
                </span>
                {done ? (
                  <Check
                    size={18}
                    className="today-slot-status"
                    aria-label={t.dashboard.registered}
                  />
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

/** Lembra de fazer backup quando há registros novos fora de qualquer backup (ver `isBackupReminderDue`). */
function BackupReminderCard() {
  const { profile, settings, meals, customFoods, reports } = useData();
  const { t } = useI18n();
  const toast = useToast();
  const d = t.dashboard;
  if (!settings) return null;
  const due = isBackupReminderDue({
    reminder: settings.backupReminder,
    lastBackupAt: settings.lastBackupAt,
    snoozedAt: settings.backupReminderSnoozedAt,
    meals,
  });
  if (!due) return null;

  const days = daysSinceBackup(settings.lastBackupAt);
  const save = async () => {
    const via = canShareFiles() ? 'share' : 'download';
    const saved = await saveBackup({ profile, settings, meals, customFoods, reports }, via);
    if (saved) toast(via === 'share' ? t.profile.shared : t.profile.exported);
  };
  const later = () => void updateSettings({ backupReminderSnoozedAt: Date.now() });

  return (
    <section className="card backup-card" aria-labelledby="backup-title">
      <div className="row">
        <CloudUpload size={20} className="backup-icon" aria-hidden="true" />
        <h2 id="backup-title">{d.backupTitle}</h2>
      </div>
      <p>{days === undefined ? d.backupNever : d.backupSince(days)}</p>
      <div className="backup-actions">
        <button type="button" className="btn btn-primary" onClick={() => void save()}>
          {d.backupSave}
        </button>
        <button type="button" className="btn btn-ghost" onClick={later}>
          {d.backupLater}
        </button>
      </div>
      <p className="muted small">
        <Rich text={d.backupSettings} />
      </p>
    </section>
  );
}
