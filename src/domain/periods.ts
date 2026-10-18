import { addDays, diffDays } from './dates';
import type { FoodIndex } from './foodIndex';
import { sortMeals } from './meals';
import { SCORE_VERSION } from './scoring';
import type { Meal } from './types';

/** Dias de cada relatório. */
export const REPORT_DAYS = 7;
/** Dias com registro necessários para liberar o termômetro. */
export const UNLOCK_DAYS = 7;

export interface Period {
  start: string;
  end: string;
}

export interface Week extends Period {
  number: number;
}

export const periodKey = (period: Period) => `${period.start}_${period.end}`;

export const inPeriod = (date: string, period: Period) =>
  date >= period.start && date <= period.end;

/** Datas (sem repetição, em ordem) que têm ao menos uma refeição registrada. */
export function registeredDates(meals: Pick<Meal, 'date'>[]): string[] {
  return [...new Set(meals.map((m) => m.date))].sort();
}

export function periodEndingOn(end: string): Period {
  return { start: addDays(end, -(REPORT_DAYS - 1)), end };
}

/** Período do termômetro: os 7 dias que terminam no último dia com registro. */
export function currentPeriod(dates: string[]): Period | null {
  const last = dates[dates.length - 1];
  return last ? periodEndingOn(last) : null;
}

/** Semana (Semana 1, Semana 2, …) que contém a data, contando a partir da âncora. */
export function weekOf(anchor: string, date: string): Week {
  const index = Math.floor(diffDays(anchor, date) / REPORT_DAYS);
  const start = addDays(anchor, index * REPORT_DAYS);
  return { number: index + 1, start, end: addDays(start, REPORT_DAYS - 1) };
}

/** Semanas já encerradas (terminadas antes de hoje) que têm algum registro. */
export function completedWeeksWithData(anchor: string, dates: string[], today: string): Week[] {
  const weeks: Week[] = [];
  for (
    let n = 1, start = anchor;
    addDays(start, REPORT_DAYS - 1) < today;
    n++, start = addDays(start, REPORT_DAYS)
  ) {
    const week = { number: n, start, end: addDays(start, REPORT_DAYS - 1) };
    if (dates.some((d) => inPeriod(d, week))) weeks.push(week);
  }
  return weeks;
}

function hash(text: string): string {
  // FNV-1a (32 bits): suficiente para detectar mudanças nos registros.
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/**
 * "Impressão digital" dos registros de um período. Se mudar depois que um
 * relatório foi gerado (refeição editada, incluída ou excluída), o relatório
 * está desatualizado.
 */
export function periodFingerprint(meals: Meal[], index: FoodIndex, period: Period): string {
  const relevant = sortMeals(meals.filter((m) => inPeriod(m.date, period)));
  const payload = relevant.map((m) => [
    m.date,
    m.type,
    m.time ?? '',
    m.notes ?? '',
    m.items.map((item) => {
      const food = index.get(item.foodId);
      const classification = food
        ? `${food.id}:${food.grade}${food.nova}:${food.group}:${(food.tags ?? []).join('.')}`
        : '';
      return [item.name, item.quantity ?? '', classification];
    }),
  ]);
  return `v${SCORE_VERSION}-${relevant.length}-${hash(JSON.stringify(payload))}`;
}
