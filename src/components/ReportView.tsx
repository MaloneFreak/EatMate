import { CircleAlert, CircleCheck, ThumbsUp, TriangleAlert } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import {
  capitalize,
  formatDateTime,
  formatFull,
  formatLong,
  formatShort,
  formatWeekdayShort,
} from '../domain/dates';
import { GRADES, GRADE_LABELS, GRADE_MESSAGES, gradeFromScore } from '../domain/grades';
import { NOVA_LABELS, groupLabel } from '../domain/groups';
import { mealLabel } from '../domain/meals';
import type { Grade, MarkerResult, Nova, ReportData } from '../domain/types';
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

const decimal = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
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
      <p className="report-footnote">
        As notas de A a E e o grau de processamento são estimativas automáticas, inspiradas no
        Nutri-Score e no Guia Alimentar para a População Brasileira. Este relatório não substitui a
        orientação de um(a) nutricionista.
      </p>
    </article>
  );
}

function ReportHero({ data, title, badge, generatedAt }: Omit<ReportViewProps, 'children'>) {
  const score = data.score;
  return (
    <section className="card report-hero">
      <div className="report-hero-head">
        <div>
          <h2>{title}</h2>
          <p className="muted small">
            {formatFull(data.startDate)} a {formatFull(data.endDate)}
            {data.profileName && ` · ${data.profileName}`}
          </p>
          {generatedAt && <p className="muted small">Gerado em {formatDateTime(generatedAt)}</p>}
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
              <strong>{GRADE_LABELS[score.grade]}.</strong> {GRADE_MESSAGES[score.grade]}
            </p>
            {data.previous && <ScoreDelta current={score.total} previous={data.previous.score} />}
          </div>
        </div>
      ) : (
        <p className="muted">
          Não há alimentos reconhecidos suficientes neste período para calcular a nota.
        </p>
      )}
    </section>
  );
}

function ReportStats({ data }: { data: ReportData }) {
  return (
    <div className="kpis kpis-4">
      <div className="kpi">
        <div className="kpi-value">
          {data.registeredDays}/{data.totalDays}
        </div>
        <div className="kpi-label">dias registrados</div>
      </div>
      <div className="kpi">
        <div className="kpi-value">{data.mealsCount}</div>
        <div className="kpi-label">refeições</div>
      </div>
      <div className="kpi">
        <div className="kpi-value">{decimal(data.fruitsAndVegetablesPerDay)}</div>
        <div className="kpi-label">porções de frutas e verduras por dia</div>
      </div>
      <div className="kpi">
        <div className="kpi-value">{Math.round(data.ultraProcessedShare * 100)}%</div>
        <div className="kpi-label">de ultraprocessados</div>
      </div>
    </div>
  );
}

function Highlights({ data }: { data: ReportData }) {
  if (!data.positives.length && !data.attention.length) return null;
  return (
    <section className="card stack" aria-labelledby="highlights-title">
      <h2 id="highlights-title">Destaques</h2>
      {data.positives.length > 0 && (
        <div className="stack-sm">
          <h3 className="highlight-title good">
            <ThumbsUp size={18} aria-hidden="true" /> Pontos positivos
          </h3>
          <ul className="highlight-list">
            {data.positives.map((text) => (
              <li key={text} className="good">
                <CircleCheck size={18} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.attention.length > 0 && (
        <div className="stack-sm">
          <h3 className="highlight-title warn">
            <TriangleAlert size={18} aria-hidden="true" /> Pontos de atenção
          </h3>
          <ul className="highlight-list">
            {data.attention.map((text) => (
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
  return (
    <section className="card stack" aria-labelledby="breakdown-title">
      <div>
        <h2 id="breakdown-title">Como a nota foi calculada</h2>
        <p className="muted small">Cinco critérios, cada um de 0 a 100, com pesos diferentes.</p>
      </div>
      <ul className="breakdown">
        {data.score!.components.map((c) => (
          <li key={c.key} className="stack-sm">
            <div className="row-between">
              <span>
                <strong>{c.label}</strong>{' '}
                <span className="muted small">· peso {Math.round(c.weight * 100)}%</span>
              </span>
              <span className="tabular">
                <strong>{c.score}</strong>
                <span className="muted small">/100</span>
              </span>
            </div>
            <Meter value={c.score} color={gradeColor(gradeFromScore(c.score))} label={c.label} />
            <span className="muted small">{c.detail}</span>
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

const STATUS_INFO: Record<Status, { label: string; color: string; icon: typeof CircleCheck }> = {
  good: { label: 'Ótimo', color: 'var(--grade-a)', icon: CircleCheck },
  warn: { label: 'Pode melhorar', color: 'var(--grade-d)', icon: CircleAlert },
  bad: { label: 'Atenção', color: 'var(--grade-e)', icon: TriangleAlert },
};

function Markers({ data }: { data: ReportData }) {
  return (
    <section className="card stack" aria-labelledby="markers-title">
      <div>
        <h2 id="markers-title">Marcadores de consumo</h2>
        <p className="muted small">
          Em quantos dos {data.registeredDays} dias registrados cada grupo apareceu (inspirado no
          SISVAN, do Ministério da Saúde).
        </p>
      </div>
      {(['bom', 'evitar'] as const).map((kind) => (
        <div key={kind} className="stack-sm">
          <h3 className="small muted">
            {kind === 'bom' ? 'O ideal é consumir todos os dias' : 'O ideal é evitar'}
          </h3>
          <ul className="markers">
            {data.markers
              .filter((m) => m.kind === kind)
              .map((m) => {
                const status = STATUS_INFO[markerStatus(m, data.registeredDays)];
                const Icon = status.icon;
                return (
                  <li key={m.key} className="stack-sm">
                    <div className="row-between">
                      <span className="grow">{m.label}</span>
                      <span className="marker-status">
                        <Icon size={16} aria-hidden="true" style={{ color: status.color }} />
                        {status.label}
                      </span>
                    </div>
                    <Meter
                      value={pct(m.days, data.registeredDays)}
                      color={status.color}
                      label={`${m.label}: ${m.days} de ${data.registeredDays} dias`}
                    />
                    <span className="muted small">
                      {m.days} de {data.registeredDays} dias · {m.count}x
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
    label: NOVA_LABELS[n],
    short: String(n),
  }));
  return (
    <section className="card stack" aria-labelledby="dist-title">
      <h2 id="dist-title">Qualidade e processamento</h2>
      <div className="stack-sm">
        <h3>Notas dos alimentos (A a E)</h3>
        <StackedBar
          segments={grades}
          label={`Distribuição das notas: ${grades.map((g) => `${g.label} ${pct(g.value, data.classifiedCount)}%`).join(', ')}`}
        />
      </div>
      <div className="stack-sm">
        <h3>Grau de processamento</h3>
        <StackedBar
          segments={novas}
          label={`Grau de processamento: ${novas.map((n) => `${n.label} ${pct(n.value, data.classifiedCount)}%`).join(', ')}`}
        />
      </div>
    </section>
  );
}

function Groups({ data }: { data: ReportData }) {
  return (
    <section className="card stack-sm" aria-labelledby="groups-title">
      <h2 id="groups-title">Grupos de alimentos</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th scope="col">Grupo</th>
            <th scope="col">Vezes</th>
            <th scope="col">Dias</th>
          </tr>
        </thead>
        <tbody>
          {data.groups.map((g) => (
            <tr key={g.group}>
              <td>{groupLabel(g.group)}</td>
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
  return (
    <section className="card stack" aria-labelledby="meals-title">
      <div>
        <h2 id="meals-title">Refeições</h2>
        <p className="muted small">
          Em quantos dos {data.registeredDays} dias registrados cada refeição aparece.
        </p>
      </div>
      <ul className="markers">
        {data.mealRegularity.map((m) => (
          <li key={m.type} className="stack-sm">
            <div className="row-between">
              <span className="row">
                <MealIcon type={m.type} size={18} />
                {mealLabel(m.type)}
              </span>
              <span className="tabular small">
                <strong>{m.days}</strong> de {data.registeredDays}
              </span>
            </div>
            <Meter
              value={pct(m.days, data.registeredDays)}
              color="var(--primary)"
              label={`${mealLabel(m.type)}: ${m.days} dias`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TopFoods({ data }: { data: ReportData }) {
  return (
    <section className="card stack-sm" aria-labelledby="top-title">
      <h2 id="top-title">Alimentos mais frequentes</h2>
      <ol className="top-foods">
        {data.topFoods.map((f) => (
          <li key={f.name} className="food-line">
            <GradeBadge grade={f.grade} />
            <span className="grow">{f.name}</span>
            <span className="muted tabular">{f.count}x</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DayByDay({ data }: { data: ReportData }) {
  return (
    <section className="card stack-sm" aria-labelledby="days-title">
      <h2 id="days-title">Dia a dia</h2>
      <ul className="day-strip">
        {data.days.map((d) => (
          <li key={d.date} className="day-strip-item">
            <span className="small muted">{formatWeekdayShort(d.date)}</span>
            <span className="small">{formatShort(d.date)}</span>
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
  return (
    <section className="card stack" aria-labelledby="diary-title">
      <div>
        <h2 id="diary-title">Diário alimentar completo</h2>
        <p className="muted small">
          Tudo o que foi registrado no período, para mostrar ao seu nutricionista.
        </p>
      </div>
      {data.days.map((day) => (
        <div key={day.date} className="diary-day">
          <h3 className="row-between">
            <span>{capitalize(formatLong(day.date))}</span>
            {day.grade && <GradeBadge grade={day.grade} />}
          </h3>
          {day.meals.length ? (
            <ul className="diary-meals">
              {day.meals.map((meal, i) => (
                <li key={i}>
                  <strong>
                    {mealLabel(meal.type)}
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
                  {meal.notes && <span className="muted small">Obs.: {meal.notes}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Sem registro.</p>
          )}
        </div>
      ))}
    </section>
  );
}
