import { GRADE_POINTS, NOVA_POINTS, gradeFromScore } from './grades';
import { groupWeight } from './groups';
import { MAIN_MEALS } from './meals';
import type { Food, Grade, MealType, ScoreComponent, ScoreResult } from './types';

/*
 * Como a nota é calculada (0 a 100 pontos):
 *
 * 1. Qualidade nutricional (40%) — média das notas A–E dos alimentos.
 * 2. Grau de processamento (20%) — alimentos in natura valem mais,
 *    ultraprocessados valem zero (classificação NOVA).
 * 3. Frutas, verduras e legumes (20%) — porções por dia; a meta são 5
 *    (recomendação da OMS de ~400 g por dia).
 * 4. Variedade (10%) — quantidade de alimentos diferentes de boa qualidade.
 * 5. Regularidade (10%) — café da manhã, almoço e jantar registrados.
 *
 * Só os dias com registro entram na conta. A nota final vira uma letra:
 * A ≥ 85, B ≥ 70, C ≥ 55, D ≥ 40 e E abaixo disso.
 */

export const SCORE_VERSION = 1;

export const FV_TARGET_PER_DAY = 5;

const GOOD_GRADES = new Set<Grade>(['A', 'B', 'C']);

export const SCORE_WEIGHTS = {
  qualidade: 0.4,
  processamento: 0.2,
  frutas_verduras: 0.2,
  variedade: 0.1,
  regularidade: 0.1,
} as const;

export interface ScoreItem {
  food?: Food;
}

export interface ScoreMeal {
  type: MealType;
  items: ScoreItem[];
}

export interface ScoreDay {
  date: string;
  meals: ScoreMeal[];
}

/** Meta de variedade: 8 alimentos em 1 dia, crescendo até 20 em uma semana. */
export function varietyTarget(days: number): number {
  return Math.min(20, 8 + 2 * Math.max(0, days - 1));
}

export function isFruitOrVegetable(food: Food): boolean {
  return food.group === 'frutas' || food.group === 'verduras_legumes';
}

/** Letra equivalente a uma média de pontos de alimentos (A=100 … E=0). */
export function averageGradeLetter(points: number): Grade {
  if (points >= 87.5) return 'A';
  if (points >= 62.5) return 'B';
  if (points >= 37.5) return 'C';
  if (points >= 12.5) return 'D';
  return 'E';
}

const percent = (value: number) => `${Math.round(value * 100)}%`;
const decimal = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

export function computeScore(days: ScoreDay[]): ScoreResult | null {
  const registered = days.filter((d) => d.meals.length > 0);
  if (!registered.length) return null;
  const foods = registered
    .flatMap((d) => d.meals.flatMap((m) => m.items))
    .flatMap((i) => (i.food ? [i.food] : []));
  if (!foods.length) return null;

  let weightSum = 0;
  let gradeSum = 0;
  let novaSum = 0;
  let inNatura = 0;
  let ultra = 0;
  for (const food of foods) {
    const w = groupWeight(food.group);
    weightSum += w;
    gradeSum += w * GRADE_POINTS[food.grade];
    novaSum += w * NOVA_POINTS[food.nova];
    if (food.nova === 1) inNatura++;
    if (food.nova === 4) ultra++;
  }
  const quality = gradeSum / weightSum;
  const processing = novaSum / weightSum;

  const fvPerDay = foods.filter(isFruitOrVegetable).length / registered.length;
  const fvScore = Math.min(100, (fvPerDay / FV_TARGET_PER_DAY) * 100);

  const distinct = new Set(foods.filter((f) => GOOD_GRADES.has(f.grade)).map((f) => f.id)).size;
  const target = varietyTarget(registered.length);
  const varietyScore = Math.min(100, (distinct / target) * 100);

  const mainMealsShare =
    registered.reduce((sum, day) => {
      const types = new Set(day.meals.map((m) => m.type));
      return sum + MAIN_MEALS.filter((t) => types.has(t)).length / MAIN_MEALS.length;
    }, 0) / registered.length;
  const regularityScore = mainMealsShare * 100;

  const components: ScoreComponent[] = [
    {
      key: 'qualidade',
      label: 'Qualidade nutricional',
      weight: SCORE_WEIGHTS.qualidade,
      score: quality,
      detail: `Média das notas dos alimentos: ${averageGradeLetter(quality)}`,
    },
    {
      key: 'processamento',
      label: 'Grau de processamento',
      weight: SCORE_WEIGHTS.processamento,
      score: processing,
      detail: `${percent(inNatura / foods.length)} in natura ou minimamente processados · ${percent(ultra / foods.length)} ultraprocessados`,
    },
    {
      key: 'frutas_verduras',
      label: 'Frutas, verduras e legumes',
      weight: SCORE_WEIGHTS.frutas_verduras,
      score: fvScore,
      detail: `${decimal(fvPerDay)} porções por dia (meta: ${FV_TARGET_PER_DAY})`,
    },
    {
      key: 'variedade',
      label: 'Variedade',
      weight: SCORE_WEIGHTS.variedade,
      score: varietyScore,
      detail: `${distinct} alimentos diferentes com nota A, B ou C (meta: ${target})`,
    },
    {
      key: 'regularidade',
      label: 'Regularidade das refeições',
      weight: SCORE_WEIGHTS.regularidade,
      score: regularityScore,
      detail: `${percent(mainMealsShare)} das refeições principais registradas (café da manhã, almoço e jantar)`,
    },
  ];

  const total = Math.round(components.reduce((sum, c) => sum + c.weight * c.score, 0));
  return {
    total,
    grade: gradeFromScore(total),
    components: components.map((c) => ({ ...c, score: Math.round(c.score) })),
  };
}
