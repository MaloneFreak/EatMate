import { addDays } from '../domain/dates';
import type { Meal } from '../domain/types';

/**
 * Dias seguidos com registro, contando até hoje. Se hoje ainda não tem
 * registro, a sequência de ontem continua valendo.
 */
export function currentStreak(dates: string[], today: string): number {
  const set = new Set(dates);
  let day = set.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (set.has(day)) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

/** Refeições registradas nos últimos `days` dias (incluindo hoje). */
export function mealsInLastDays(meals: Meal[], today: string, days = 7): number {
  const start = addDays(today, -(days - 1));
  return meals.filter((m) => m.date >= start && m.date <= today).length;
}
