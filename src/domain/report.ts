import { addDays, dateRange } from './dates';
import type { FoodIndex } from './foodIndex';
import { GRADES } from './grades';
import { FOOD_GROUPS } from './groups';
import { buildInsights } from './insights';
import { MAIN_MEALS, MEAL_TYPES, sortMeals } from './meals';
import { inPeriod, type Period } from './periods';
import {
  SCORE_VERSION,
  computeScore,
  isFruitOrVegetable,
  varietyTarget,
  type ScoreDay,
  type ScoreMeal,
} from './scoring';
import { foodKey } from './text';
import type { Food, Grade, Meal, MarkerResult, Nova, ReportData, ReportDay } from './types';

interface MarkerDef {
  key: MarkerResult['key'];
  label: string;
  kind: MarkerResult['kind'];
  test: (food: Food) => boolean;
}

/**
 * Marcadores de consumo alimentar, inspirados no formulário do SISVAN
 * (Ministério da Saúde): o que queremos ver todos os dias e o que é melhor evitar.
 */
export const MARKERS: MarkerDef[] = [
  {
    key: 'feijao',
    label: 'Feijão e outras leguminosas',
    kind: 'bom',
    test: (f) => f.group === 'leguminosas',
  },
  { key: 'frutas', label: 'Frutas', kind: 'bom', test: (f) => f.group === 'frutas' },
  {
    key: 'verduras',
    label: 'Verduras e legumes',
    kind: 'bom',
    test: (f) => f.group === 'verduras_legumes',
  },
  {
    key: 'embutidos',
    label: 'Hambúrguer e embutidos',
    kind: 'evitar',
    test: (f) => !!f.tags?.includes('embutido'),
  },
  {
    key: 'adocadas',
    label: 'Refrigerantes e bebidas adoçadas',
    kind: 'evitar',
    test: (f) => !!f.tags?.includes('adocada'),
  },
  {
    key: 'salgadinhos',
    label: 'Macarrão instantâneo, salgadinhos e biscoitos salgados',
    kind: 'evitar',
    test: (f) => !!f.tags?.includes('salgadinho'),
  },
  {
    key: 'doces',
    label: 'Biscoito recheado, doces e guloseimas',
    kind: 'evitar',
    test: (f) => f.group === 'doces',
  },
];

export interface BuildReportInput {
  /** Pode conter refeições de qualquer data; só as do período (e da semana anterior) são usadas. */
  meals: Meal[];
  index: FoodIndex;
  period: Period;
  profileName: string;
}

interface Entry {
  date: string;
  name: string;
  food?: Food;
}

function toScoreDays(meals: Meal[], index: FoodIndex, dates: string[]): ScoreDay[] {
  const byDate = groupByDate(meals);
  return dates.map((date) => ({
    date,
    meals: (byDate.get(date) ?? []).map((m): ScoreMeal => ({
      type: m.type,
      items: m.items.map((i) => ({ food: index.get(i.foodId) })),
    })),
  }));
}

function groupByDate(meals: Meal[]): Map<string, Meal[]> {
  const map = new Map<string, Meal[]>();
  for (const meal of meals) {
    const list = map.get(meal.date);
    if (list) list.push(meal);
    else map.set(meal.date, [meal]);
  }
  return map;
}

export function buildReport({ meals, index, period, profileName }: BuildReportInput): ReportData {
  const dates = dateRange(period.start, period.end);
  const periodMeals = sortMeals(meals.filter((m) => inPeriod(m.date, period)));
  const byDate = groupByDate(periodMeals);
  const scoreDays = toScoreDays(periodMeals, index, dates);
  const score = computeScore(scoreDays);

  const days: ReportDay[] = dates.map((date, i) => {
    const dayMeals = byDate.get(date) ?? [];
    const dayScore = dayMeals.length ? computeScore([scoreDays[i]!]) : null;
    return {
      date,
      mealsCount: dayMeals.length,
      itemsCount: dayMeals.reduce((sum, m) => sum + m.items.length, 0),
      score: dayScore?.total ?? null,
      grade: dayScore?.grade ?? null,
      meals: dayMeals.map((m) => ({
        type: m.type,
        ...(m.time ? { time: m.time } : {}),
        ...(m.notes ? { notes: m.notes } : {}),
        items: m.items.map((item) => {
          const grade = index.get(item.foodId)?.grade;
          return {
            name: item.name,
            ...(item.quantity ? { quantity: item.quantity } : {}),
            ...(grade ? { grade } : {}),
          };
        }),
      })),
    };
  });

  const entries: Entry[] = periodMeals.flatMap((m) =>
    m.items.map((i) => ({ date: m.date, name: i.name, food: index.get(i.foodId) })),
  );
  const classified = entries.filter((e): e is Entry & { food: Food } => !!e.food);
  const registeredDays = days.filter((d) => d.mealsCount > 0).length;

  const gradeDistribution = Object.fromEntries(GRADES.map((g) => [g, 0])) as Record<Grade, number>;
  const novaDistribution: Record<Nova, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const { food } of classified) {
    gradeDistribution[food.grade]++;
    novaDistribution[food.nova]++;
  }

  const countWhere = (test: (food: Food) => boolean) => {
    const matching = classified.filter((e) => test(e.food));
    return { count: matching.length, days: new Set(matching.map((e) => e.date)).size };
  };

  const groups = FOOD_GROUPS.map(({ group }) => ({
    group,
    ...countWhere((f) => f.group === group),
  })).filter((g) => g.count > 0);
  const markers: MarkerResult[] = MARKERS.map(({ key, label, kind, test }) => ({
    key,
    label,
    kind,
    ...countWhere(test),
  }));

  const mealRegularity = MEAL_TYPES.map(({ type }) => ({
    type,
    days: new Set(periodMeals.filter((m) => m.type === type).map((m) => m.date)).size,
  }));

  const top = new Map<string, { name: string; count: number; grade?: Grade }>();
  for (const entry of entries) {
    const key = entry.food ? `food:${entry.food.id}` : `text:${foodKey(entry.name)}`;
    const current = top.get(key);
    if (current) current.count++;
    else
      top.set(key, {
        name: entry.food?.name ?? entry.name,
        count: 1,
        ...(entry.food ? { grade: entry.food.grade } : {}),
      });
  }
  const topFoods = [...top.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 10);

  const fruitsAndVegetablesPerDay = registeredDays
    ? classified.filter((e) => isFruitOrVegetable(e.food)).length / registeredDays
    : 0;
  const ultraProcessedShare = classified.length ? novaDistribution[4] / classified.length : 0;
  const distinctFoods = new Set(classified.map((e) => e.food.id)).size;
  const distinctGood = new Set(
    classified
      .filter((e) => e.food.grade === 'A' || e.food.grade === 'B' || e.food.grade === 'C')
      .map((e) => e.food.id),
  ).size;

  const registered = scoreDays.filter((d) => d.meals.length > 0);
  const mainMealsShare = registered.length
    ? registered.reduce((sum, d) => {
        const types = new Set(d.meals.map((m) => m.type));
        return sum + MAIN_MEALS.filter((t) => types.has(t)).length / MAIN_MEALS.length;
      }, 0) / registered.length
    : 0;
  const daysMissingLunchOrDinner = registered.filter((d) => {
    const types = new Set(d.meals.map((m) => m.type));
    return !types.has('almoco') || !types.has('jantar');
  }).length;

  const markerStats = Object.fromEntries(
    markers.map((m) => [m.key, { days: m.days, count: m.count }]),
  ) as Record<MarkerResult['key'], { days: number; count: number }>;
  const { positives, attention } = buildInsights({
    registeredDays,
    totalDays: dates.length,
    classifiedCount: classified.length,
    unclassifiedCount: entries.length - classified.length,
    fvPerDay: fruitsAndVegetablesPerDay,
    ultraShare: ultraProcessedShare,
    inNaturaShare: classified.length ? novaDistribution[1] / classified.length : 0,
    distinctGood,
    varietyTarget: varietyTarget(registeredDays),
    markers: markerStats,
    breakfastDays: mealRegularity.find((m) => m.type === 'cafe_manha')?.days ?? 0,
    daysMissingLunchOrDinner,
    mainMealsShare,
    waterDays: countWhere((f) => !!f.tags?.includes('agua')).days,
    wholeGrainCount: countWhere((f) => !!f.tags?.includes('integral')).count,
    snacksCount: countWhere((f) => f.group === 'lanches' && (f.grade === 'D' || f.grade === 'E'))
      .count,
    alcoholCount: countWhere((f) => f.group === 'alcool').count,
  });

  const previousPeriod = {
    start: addDays(period.start, -dates.length),
    end: addDays(period.start, -1),
  };
  const previousScore = computeScore(
    toScoreDays(
      meals.filter((m) => inPeriod(m.date, previousPeriod)),
      index,
      dateRange(previousPeriod.start, previousPeriod.end),
    ),
  );

  return {
    version: SCORE_VERSION,
    profileName,
    startDate: period.start,
    endDate: period.end,
    totalDays: dates.length,
    registeredDays,
    mealsCount: periodMeals.length,
    itemsCount: entries.length,
    classifiedCount: classified.length,
    unclassified: [...new Set(entries.filter((e) => !e.food).map((e) => e.name))],
    score,
    gradeDistribution,
    novaDistribution,
    groups,
    markers,
    mealRegularity,
    topFoods,
    positives,
    attention,
    fruitsAndVegetablesPerDay,
    ultraProcessedShare,
    distinctFoods,
    days,
    previous: previousScore
      ? {
          startDate: previousPeriod.start,
          endDate: previousPeriod.end,
          score: previousScore.total,
          grade: previousScore.grade,
        }
      : null,
  };
}
