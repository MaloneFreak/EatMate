import { CalendarDays, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { EmptyState } from '../components/EmptyState';
import { GradeBadge } from '../components/GradeBadge';
import { MealIcon } from '../components/MealIcon';
import { PageHeader } from '../components/PageHeader';
import { useData } from '../data/DataProvider';
import {
  addDays,
  formatDayMonth,
  formatMonthYear,
  formatWeekdayShort,
  parseISODate,
  todayISO,
} from '../domain/dates';
import { MEAL_TYPES } from '../domain/meals';
import { normalize } from '../domain/text';
import { groupMealsByDay, type DaySummary } from '../lib/days';

export function HistoryScreen() {
  const { meals, index } = useData();
  const [query, setQuery] = useState('');
  const days = useMemo(() => groupMealsByDay(meals, index), [meals, index]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return days;
    return days.filter((d) =>
      d.meals.some((m) => m.items.some((i) => normalize(i.name).includes(q))),
    );
  }, [days, query]);

  const months = useMemo(() => {
    const groups = new Map<string, DaySummary[]>();
    for (const day of filtered) {
      const key = day.date.slice(0, 7);
      const list = groups.get(key);
      if (list) list.push(day);
      else groups.set(key, [day]);
    }
    return [...groups.entries()];
  }, [filtered]);

  if (!days.length) {
    return (
      <>
        <PageHeader title="Histórico" />
        <EmptyState
          icon={<CalendarDays size={30} />}
          title="Nenhum registro ainda"
          action={
            <Link to="/registrar" className="btn btn-primary">
              Registrar refeição
            </Link>
          }
        >
          Os dias em que você registrar refeições vão aparecer aqui.
        </EmptyState>
      </>
    );
  }

  return (
    <div className="stack">
      <PageHeader
        title="Histórico"
        subtitle={`${days.length} ${days.length === 1 ? 'dia registrado' : 'dias registrados'}`}
      />

      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <span className="visually-hidden">Buscar alimento</span>
        <input
          className="input"
          type="search"
          placeholder="Buscar alimento (ex.: pizza)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {query && !filtered.length && <p className="muted">Nenhum dia com “{query}”.</p>}

      {months.map(([month, monthDays]) => (
        <section key={month} className="stack-sm" aria-label={formatMonthYear(`${month}-01`)}>
          <h2 className="section-title">{formatMonthYear(`${month}-01`)}</h2>
          <ul className="stack-sm" style={{ listStyle: 'none' }}>
            {monthDays.map((day) => (
              <li key={day.date}>
                <DayCard day={day} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function dayTitle(date: string): string {
  const today = todayISO();
  if (date === today) return 'Hoje';
  if (date === addDays(today, -1)) return 'Ontem';
  return formatDayMonth(date);
}

function DayCard({ day }: { day: DaySummary }) {
  const types = new Set(day.meals.map((m) => m.type));
  const names = [...new Set(day.meals.flatMap((m) => m.items.map((i) => i.name)))];
  return (
    <Link to={`/historico/${day.date}`} className="card card-link day-card">
      <span className="day-card-date" aria-hidden="true">
        <span className="day-card-weekday">{formatWeekdayShort(day.date)}</span>
        <span className="day-card-number">{parseISODate(day.date).getDate()}</span>
      </span>
      <span className="grow day-card-body">
        <span className="row-between">
          <strong>{dayTitle(day.date)}</strong>
          <span className="muted small nowrap">
            {day.meals.length} {day.meals.length === 1 ? 'refeição' : 'refeições'}
          </span>
        </span>
        <span className="day-card-icons" aria-hidden="true">
          {MEAL_TYPES.filter((m) => types.has(m.type)).map((m) => (
            <MealIcon key={m.type} type={m.type} size={16} />
          ))}
        </span>
        <span className="day-card-items">{names.join(', ')}</span>
      </span>
      <GradeBadge grade={day.score?.grade} size="md" />
    </Link>
  );
}
