import type { Meal, MealType } from './types';

export interface MealTypeInfo {
  type: MealType;
  /** Refeições principais contam para a regularidade (café da manhã, almoço e jantar). */
  main: boolean;
  /** Faixa de horário típica (início, em minutos desde a meia-noite) usada para sugerir a refeição. */
  startsAt: number;
}

export const MEAL_TYPES: MealTypeInfo[] = [
  { type: 'cafe_manha', main: true, startsAt: 4 * 60 },
  { type: 'lanche_manha', main: false, startsAt: 9 * 60 + 30 },
  { type: 'almoco', main: true, startsAt: 11 * 60 },
  { type: 'cafe_tarde', main: false, startsAt: 15 * 60 },
  { type: 'jantar', main: true, startsAt: 18 * 60 + 30 },
  { type: 'ceia', main: false, startsAt: 21 * 60 + 30 },
];

export const MAIN_MEALS: MealType[] = MEAL_TYPES.filter((m) => m.main).map((m) => m.type);

const byType = new Map(MEAL_TYPES.map((m) => [m.type, m]));

export function mealOrder(type: MealType): number {
  return MEAL_TYPES.findIndex((m) => m.type === type);
}

export function isMealType(value: unknown): value is MealType {
  return typeof value === 'string' && byType.has(value as MealType);
}

/** Sugere a refeição de acordo com o horário ("HH:mm"). */
export function suggestMealType(time: string): MealType {
  const [h, m] = time.split(':').map(Number);
  const minutes = (h ?? 0) * 60 + (m ?? 0);
  // Madrugada (antes das 4h) conta como ceia.
  if (minutes < MEAL_TYPES[0]!.startsAt) return 'ceia';
  let current: MealType = 'cafe_manha';
  for (const info of MEAL_TYPES) {
    if (minutes >= info.startsAt) current = info.type;
  }
  return current;
}

/** Ordena refeições por data, tipo e horário. */
export function sortMeals(meals: Meal[]): Meal[] {
  return [...meals].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      mealOrder(a.type) - mealOrder(b.type) ||
      (a.time ?? '').localeCompare(b.time ?? '') ||
      a.createdAt - b.createdAt,
  );
}
