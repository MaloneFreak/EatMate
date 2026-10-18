import { CircleAlert, CircleCheck, ThumbsUp, TriangleAlert } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useData } from '../data/DataProvider';
import { insightText } from '../domain/exportText';
import { GRADES, gradeFromScore } from '../domain/grades';
import type { Grade, MarkerResult, Nova, ReportData } from '../domain/types';
import { useI18n } from '../i18n/I18nProvider';
import { GradeBadge } from './GradeBadge';
import { MealIcon } from './MealIcon';
import { ScoreDelta } from './ScoreDelta';
import { ScoreScale } from './ScoreScale';
import { Thermometer } from './Thermometer';

interface ReportViewProps {
  data: ReportData;
  title: string;
  badge?: ReactNode;
  generatedAt?: number;
  /** Conteúdo extra logo abaixo do resumo (avisos e ações). */
  children?: ReactNode;
}

const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0);
const gradeColor = (grade: Grade) => `var(--grade-${grade.toLowerCase()})`;

const NOVA_COLORS: Record<Nova, string> = {
  1: 'var(--grade-a)',
  2: 'var(--grade-b)',
  3: 'var(--grade-c)',
  4: 'var(--grade-e)',
};
const NOVA_TEXT: Record<Nova, string> = {
  1: 'var(--on-grade-a)',
  2: 'var(--on-grade-b)',
  3: 'var(--on-grade-c)',
  4: 'var(--on-grade-e)',
};

/** Relatório completo: usado no relatório atual, nos relatórios salvos e no exemplo. */
export function ReportView({ data, title, badge, generatedAt, children }: ReportViewProps) {
  const { t } = useI18n();
  return (
    <article className="report stack" aria-label={title}>
      <ReportHero data={data} title={title} badge={badge} generatedAt={generatedAt} />
      {children}
      <ReportStats data={data} />
      <Highlights data={data} />
      {data.score && <ScoreBreakdown data={data} />}
      <Markers data={data} />
      {data.classifiedCount > 0 && <Distributions data={data} />}
      {data.groups.length > 0 && <Groups data={data} />}
      <MealsRegularity data={data} />
      {data.topFoods.length > 0 && <TopFoods data={data} />}
      <DayByDay data={data} />
      <Diary data={data} />
      <p className="report-footnote">{t.report.footnote}</p>
    </article>
  );
}

function ReportHero({ data, title, badge, generatedAt }: Omit<ReportViewProps, 'children'>) {
  const { t, f } = useI18n();
  const score = data.score;
  return (
    <section className="card report-hero">
      <div className="report-hero-head">
        <div>
          <h2>{title}</h2>
          <p className="muted small">
            {f.periodFull(data.startDate, data.endDate)}
            {data.profileName && ` · ${data.profileName}`}
          </p>
          {generatedAt && (
            <p className="muted small">{t.report.generatedAt(f.dateTime(generatedAt))}</p>
          )}
        </div>
        {badge}
      </div>
      {score ? (
        <div className="report-hero-body">
          <Thermometer score={score.total} grade={score.grade} height={176} />
          <div className="stack-sm grow">
            <p className="hero-score">
              <span className="hero-number">{score.total}</span>
              <span className="hero-of">/100</span>
            </p>
            <ScoreScale grade={score.grade} size="lg" />
            <p>
              <strong>{t.grades.labels[score.grade]}.</strong> {t.grades.messages[score.grade]}
            </p>
            {data.previous && <ScoreDelta current={score.total} previous={data.previous.score} />}
          </div>
        </div>
      ) : (
        <p className="muted">{t.report.noScore}</p>
      )}
    </section>
  );
}

function ReportStats({ data }: { data: ReportData }) {
  const { t, f } = useI18n();
  return (
    <div className="kpis kpis-4">
      <div className="kpi">
        <div className="kpi-value">
          {data.registeredDays}/{data.totalDays}
        </div>
        <div className="kpi-label">{t.report.kpis.days}</div>
      </div>
      <div className="kpi">
        <div className="kpi-value">{data.mealsCount}</div>
        <div className="kpi-label">{t.report.kpis.meals}</div>
      </div>
      <div className="kpi">
        <div className="kpi-value">{f.decimal(data.fruitsAndVegetablesPerDay)}</div>
        <div className="kpi-label">{t.report.kpis.fruitsAndVegetables}</div>
      </div>
      <div className="kpi">
        <div className="kpi-value">{f.percent(data.ultraProcessedShare)}</div>
        <div className="kpi-label">{t.report.kpis.ultraProcessed}</div>
      </div>
    </div>
  );
}

function Highlights({ data }: { data: ReportData }) {
  const { t, f } = useI18n();
  const positives = data.positives.map((i) => insightText(i, t, f)).filter(Boolean);
  const attention = data.attention.map((i) => insightText(i, t, f)).filter(Boolean);
  if (!positives.length && !attention.length) return null;
  return (
    <section className="card stack" aria-labelledby="highlights-title">
      <h2 id="highlights-title">{t.report.highlights}</h2>
      {positives.length > 0 && (
        <div className="stack-sm">
          <h3 className="highlight-title good">
            <ThumbsUp size={18} aria-hidden="true" /> {t.report.positives}
          </h3>
          <ul className="highlight-list">
            {positives.map((text) => (
              <li key={text} className="good">
                <CircleCheck size={18} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {attention.length > 0 && (
        <div className="stack-sm">
          <h3 className="highlight-title warn">
            <TriangleAlert size={18} aria-hidden="true" /> {t.report.attention}
          </h3>
          <ul className="highlight-list">
            {attention.map((text) => (
              <li key={text} className="warn">
                <CircleAlert size={18} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Meter({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div
      className="meter"
      style={{ '--meter-color': color } as CSSProperties}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={label}
    >
      <div className="meter-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function ScoreBreakdown({ data }: { data: ReportData }) {
  const { t, f } = useI18n();
  const score = data.score!;
  return (
    <section className="card stack" aria-labelledby="breakdown-title">
      <div>
        <h2 id="breakdown-title">{t.report.breakdown}</h2>
        <p className="muted small">{t.report.breakdownText}</p>
      </div>
      <ul className="breakdown">
        {score.components.map((c) => (
          <li key={c.key} className="stack-sm">
            <div className="row-between">
              <span>
                <strong>{t.score.components[c.key]}</strong>{' '}
                <span className="muted small">· {t.score.weight(Math.round(c.weight * 100))}</span>
              </span>
              <span className="tabular">
                <strong>{c.score}</strong>
                <span className="muted small">/100</span>
              </span>
            </div>
            <Meter
              value={c.score}
              color={gradeColor(gradeFromScore(c.score))}
              label={t.score.components[c.key]}
            />
            <span className="muted small">{t.score.details[c.key](score.facts, f)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type Status = 'good' | 'warn' | 'bad';

function markerStatus(marker: MarkerResult, registeredDays: number): Status {
  if (!registeredDays) return 'warn';
  const ratio = marker.days / registeredDays;
  if (marker.kind === 'bom') return ratio >= 0.7 ? 'good' : ratio >= 0.4 ? 'warn' : 'bad';
  return marker.days === 0 ? 'good' : ratio <= 0.3 ? 'warn' : 'bad';
}

const STATUS_INFO: Record<Status, { color: string; icon: typeof CircleCheck }> = {
  good: { color: 'var(--grade-a)', icon: CircleCheck },
  warn: { color: 'var(--grade-d)', icon: CircleAlert },
  bad: { color: 'var(--grade-e)', icon: TriangleAlert },
};

function Markers({ data }: { data: ReportData }) {
  const { t } = useI18n();
  return (
    <section className="card stack" aria-labelledby="markers-title">
      <div>
        <h2 id="markers-title">{t.report.markers}</h2>
        <p className="muted small">{t.report.markersText(data.registeredDays)}</p>
      </div>
      {(['bom', 'evitar'] as const).map((kind) => (
        <div key={kind} className="stack-sm">
          <h3 className="small muted">
            {kind === 'bom' ? t.report.markersGood : t.report.markersAvoid}
          </h3>
          <ul className="markers">
            {data.markers
              .filter((m) => m.kind === kind)
              .map((m) => {
                const statusKey = markerStatus(m, data.registeredDays);
                const status = STATUS_INFO[statusKey];
                const Icon = status.icon;
                const label = t.markers[m.key] ?? m.key;
                return (
                  <li key={m.key} className="stack-sm">
                    <div className="row-between">
                      <span className="grow">{label}</span>
                      <span className="marker-status">
                        <Icon size={16} aria-hidden="true" style={{ color: status.color }} />
                        {t.report.status[statusKey]}
                      </span>
                    </div>
                    <Meter
                      value={pct(m.days, data.registeredDays)}
                      color={status.color}
                      label={`${label}: ${t.common.daysOf(m.days, data.registeredDays)}`}
                    />
                    <span className="muted small">
                      {t.common.daysOf(m.days, data.registeredDays)} · {m.count}x
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </section>
  );
}

function StackedBar({
  segments,
  label,
}: {
  segments: {
    key: string;
    value: number;
    color: string;
    text: string;
    label: string;
    short: string;
  }[];
  label: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div>
      <div className="stacked" role="img" aria-label={label}>
        {segments
          .filter((s) => s.value > 0)
          .map((s) => {
            const share = pct(s.value, total);
            return (
              <div
                key={s.key}
                className="stacked-segment"
                style={{ flexGrow: s.value, flexBasis: 0, background: s.color, color: s.text }}
                title={`${s.label}: ${share}%`}
              >
                {share >= 12 ? s.short : ''}
              </div>
            );
          })}
      </div>
      <ul className="legend">
        {segments.map((s) => (
          <li key={s.key}>
            <span className="swatch" style={{ background: s.color }} aria-hidden="true" />
            <span>
              {s.label} <strong className="tabular">{pct(s.value, total)}%</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Distributions({ data }: { data: ReportData }) {
  const { t } = useI18n();
  const grades = GRADES.map((g) => ({
    key: g,
    value: data.gradeDistribution[g],
    color: gradeColor(g),
    text: `var(--on-grade-${g.toLowerCase()})`,
    label: g,
    short: g,
  }));
  const novas = ([1, 2, 3, 4] as Nova[]).map((n) => ({
    key: String(n),
    value: data.novaDistribution[n],
    color: NOVA_COLORS[n],
    text: NOVA_TEXT[n],
    label: t.nova[n],
    short: String(n),
  }));
  return (
    <section className="card stack" aria-labelledby="dist-title">
      <h2 id="dist-title">{t.report.distributions}</h2>
      <div className="stack-sm">
        <h3>{t.report.gradesTitle}</h3>
        <StackedBar
          segments={grades}
          label={t.report.gradesLabel(
            grades.map((g) => `${g.label} ${pct(g.value, data.classifiedCount)}%`).join(', '),
          )}
        />
      </div>
      <div className="stack-sm">
        <h3>{t.report.processingTitle}</h3>
        <StackedBar
          segments={novas}
          label={t.report.processingLabel(
            novas.map((n) => `${n.label} ${pct(n.value, data.classifiedCount)}%`).join(', '),
          )}
        />
      </div>
    </section>
  );
}

function Groups({ data }: { data: ReportData }) {
  const { t } = useI18n();
  return (
    <section className="card stack-sm" aria-labelledby="groups-title">
      <h2 id="groups-title">{t.report.groups}</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th scope="col">{t.report.group}</th>
            <th scope="col">{t.report.times}</th>
            <th scope="col">{t.report.daysColumn}</th>
          </tr>
        </thead>
        <tbody>
          {data.groups.map((g) => (
            <tr key={g.group}>
              <td>{t.groups[g.group]}</td>
              <td className="tabular">{g.count}</td>
              <td className="tabular">{g.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function MealsRegularity({ data }: { data: ReportData }) {
  const { t } = useI18n();
  return (
    <section className="card stack" aria-labelledby="meals-title">
      <div>
        <h2 id="meals-title">{t.report.meals}</h2>
        <p className="muted small">{t.report.mealsText(data.registeredDays)}</p>
      </div>
      <ul className="markers">
        {data.mealRegularity.map((m) => (
          <li key={m.type} className="stack-sm">
            <div className="row-between">
              <span className="row">
                <MealIcon type={m.type} size={18} />
                {t.mealTypes[m.type]}
              </span>
              <span className="tabular small">
                <strong>{m.days}</strong> {t.report.of} {data.registeredDays}
              </span>
            </div>
            <Meter
              value={pct(m.days, data.registeredDays)}
              color="var(--primary)"
              label={t.report.mealDays(t.mealTypes[m.type], m.days)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TopFoods({ data }: { data: ReportData }) {
  const { t } = useI18n();
  const { index } = useData();
  return (
    <section className="card stack-sm" aria-labelledby="top-title">
      <h2 id="top-title">{t.report.topFoods}</h2>
      <ol className="top-foods">
        {data.topFoods.map((food) => (
          <li key={food.foodId ?? food.name} className="food-line">
            <GradeBadge grade={food.grade} />
            <span className="grow">{index.get(food.foodId)?.name ?? food.name}</span>
            <span className="muted tabular">{food.count}x</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DayByDay({ data }: { data: ReportData }) {
  const { t, f } = useI18n();
  return (
    <section className="card stack-sm" aria-labelledby="days-title">
      <h2 id="days-title">{t.report.dayByDay}</h2>
      <ul className="day-strip">
        {data.days.map((d) => (
          <li key={d.date} className="day-strip-item">
            <span className="small muted">{f.weekdayShort(d.date)}</span>
            <span className="small">{f.short(d.date)}</span>
            {d.mealsCount ? (
              <GradeBadge grade={d.grade} size="md" />
            ) : (
              <span className="day-strip-empty">—</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Diary({ data }: { data: ReportData }) {
  const { t, f } = useI18n();
  return (
    <section className="card stack" aria-labelledby="diary-title">
      <div>
        <h2 id="diary-title">{t.report.diary}</h2>
        <p className="muted small">{t.report.diaryText}</p>
      </div>
      {data.days.map((day) => (
        <div key={day.date} className="diary-day">
          <h3 className="row-between">
            <span>{f.long(day.date)}</span>
            {day.grade && <GradeBadge grade={day.grade} />}
          </h3>
          {day.meals.length ? (
            <ul className="diary-meals">
              {day.meals.map((meal, i) => (
                <li key={i}>
                  <strong>
                    {t.mealTypes[meal.type]}
                    {meal.time && <span className="muted"> · {meal.time}</span>}
                  </strong>
                  <span>
                    {meal.items.map((item, j) => (
                      <span key={j} className="diary-item">
                        {item.name}
                        {item.quantity && <span className="muted"> ({item.quantity})</span>}
                        {j < meal.items.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                  {meal.notes && (
                    <span className="muted small">
                      {t.report.notes} {meal.notes}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">{t.report.noRecord}</p>
          )}
        </div>
      ))}
    </section>
  );
}
