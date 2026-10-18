import { useLiveQuery } from 'dexie-react-hooks';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { FoodIndex } from '../domain/foodIndex';
import { sortMeals } from '../domain/meals';
import { registeredDates } from '../domain/periods';
import type { AppSettings, CustomFood, Meal, Profile, SavedReport } from '../domain/types';
import { db } from './db';
import { getProfile, getSettings } from './repo';

export interface AppData {
  /** `undefined` enquanto carrega; `null` se a pessoa ainda não se cadastrou. */
  profile: Profile | null | undefined;
  settings: AppSettings | undefined;
  meals: Meal[];
  customFoods: CustomFood[];
  reports: SavedReport[];
  /** Índice de busca: base do app + alimentos personalizados. */
  index: FoodIndex;
  /** Quantas vezes cada alimento foi registrado (para ordenar sugestões). */
  usage: Map<string, number>;
  /** Datas com ao menos uma refeição, em ordem. */
  dates: string[];
  loading: boolean;
}

const DataContext = createContext<AppData | null>(null);

/** Carrega os dados do aparelho e mantém tudo atualizado automaticamente. */
export function DataProvider({ children }: { children: ReactNode }) {
  const profile = useLiveQuery(async () => (await getProfile()) ?? null, []);
  const settings = useLiveQuery(() => getSettings(), []);
  const meals = useLiveQuery(async () => sortMeals(await db.meals.toArray()), []);
  const customFoods = useLiveQuery(() => db.customFoods.orderBy('name').toArray(), []);
  const reports = useLiveQuery(
    async () =>
      (await db.reports.toArray()).sort(
        (a, b) => b.endDate.localeCompare(a.endDate) || b.generatedAt - a.generatedAt,
      ),
    [],
  );

  const index = useMemo(() => new FoodIndex(customFoods ?? []), [customFoods]);
  const usage = useMemo(() => {
    const map = new Map<string, number>();
    for (const meal of meals ?? []) {
      for (const item of meal.items)
        if (item.foodId) map.set(item.foodId, (map.get(item.foodId) ?? 0) + 1);
    }
    return map;
  }, [meals]);
  const dates = useMemo(() => registeredDates(meals ?? []), [meals]);

  const value = useMemo<AppData>(
    () => ({
      profile,
      settings,
      meals: meals ?? [],
      customFoods: customFoods ?? [],
      reports: reports ?? [],
      index,
      usage,
      dates,
      loading: [profile, settings, meals, customFoods, reports].some((v) => v === undefined),
    }),
    [profile, settings, meals, customFoods, reports, index, usage, dates],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData(): AppData {
  const value = useContext(DataContext);
  if (!value) throw new Error('useData precisa estar dentro de <DataProvider>.');
  return value;
}
