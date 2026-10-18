import type { FoodIndex } from '../domain/foodIndex';
import { computeScore, isFruitOrVegetable } from '../domain/scoring';
import type { Meal, ScoreResult } from '../domain/types';

/** Nota de um conjunto de refeições (por exemplo, as de um dia). */
export function scoreForMeals(meals: Meal[], index: FoodIndex): ScoreResult | null {
  return computeScore([
    {
      date: meals[0]?.date ?? '',
      meals: meals.map((m) => ({
        type: m.type,
        items: m.items.map((i) => ({ food: index.get(i.foodId) })),
      })),
    },
  ]);
}

export interface DaySummary {
  date: string;
  meals: Meal[];
  itemsCount: number;
  score: ScoreResult | null;
  fruitsAndVegetables: number;
  ultraProcessed: number;
  unclassified: number;
}

export function summarizeDay(date: string, meals: Meal[], index: FoodIndex): DaySummary {
  const items = meals.flatMap((m) => m.items);
  const foods = items.flatMap((i) => {
    const food = index.get(i.foodId);
    return food ? [food] : [];
  });
  return {
    date,
    meals,
    itemsCount: items.length,
    score: scoreForMeals(meals, index),
    fruitsAndVegetables: foods.filter(isFruitOrVegetable).length,
    ultraProcessed: foods.filter((f) => f.nova === 4).length,
    unclassified: items.length - foods.length,
  };
}

/** Agrupa as refeições por dia, do mais recente para o mais antigo. */
export function groupMealsByDay(meals: Meal[], index: FoodIndex): DaySummary[] {
  const byDate = new Map<string, Meal[]>();
  for (const meal of meals) {
    const list = byDate.get(meal.date);
    if (list) list.push(meal);
    else byDate.set(meal.date, [meal]);
  }
  return [...byDate.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, dayMeals]) => summarizeDay(date, dayMeals, index));
}
