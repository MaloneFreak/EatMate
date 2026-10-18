import { FV_TARGET_PER_DAY } from './scoring';
import type { Insight, InsightKey, MarkerKey } from './types';

export interface InsightStats {
  registeredDays: number;
  totalDays: number;
  classifiedCount: number;
  unclassifiedCount: number;
  fvPerDay: number;
  /** Parcela (0–1) de itens ultraprocessados. */
  ultraShare: number;
  /** Parcela (0–1) de itens in natura ou minimamente processados. */
  inNaturaShare: number;
  distinctGood: number;
  varietyTarget: number;
  markers: Record<MarkerKey, { days: number; count: number }>;
  breakfastDays: number;
  /** Dias com registro em que faltou almoço ou jantar. */
  daysMissingLunchOrDinner: number;
  /** Parcela (0–1) das refeições principais registradas. */
  mainMealsShare: number;
  waterDays: number;
  wholeGrainCount: number;
  /** Lanches, salgados e fast food com nota D ou E. */
  snacksCount: number;
  alcoholCount: number;
}

/**
 * Destaques do relatório (regras simples, baseadas no Guia Alimentar para a
 * População Brasileira). O texto de cada destaque fica nas mensagens de cada idioma.
 */
export function buildInsights(s: InsightStats): { positives: Insight[]; attention: Insight[] } {
  const positives: Insight[] = [];
  const attention: Insight[] = [];
  const good = (key: InsightKey, n?: number, of?: number) => positives.push(insight(key, n, of));
  const bad = (key: InsightKey, n?: number, of?: number) => attention.push(insight(key, n, of));
  const n = s.registeredDays;
  if (!n || !s.classifiedCount) {
    if (s.unclassifiedCount) bad('unclassified', s.unclassifiedCount);
    return { positives, attention };
  }
  const most = Math.ceil(n * 0.7);
  const { feijao, frutas, verduras, embutidos, adocadas, salgadinhos, doces } = s.markers;

  // Pontos positivos
  if (s.fvPerDay >= FV_TARGET_PER_DAY) good('fv_great', s.fvPerDay);
  else if (s.fvPerDay >= 3) good('fv_good', s.fvPerDay, FV_TARGET_PER_DAY);
  if (feijao.days >= most) good('beans_most', feijao.days, n);
  if (s.classifiedCount >= 5 && s.ultraShare <= 0.1) good('few_ultra', s.ultraShare);
  if (n >= 3 && adocadas.count === 0) good('no_sugary');
  if (n >= 3 && s.mainMealsShare >= 0.9) good('regular_meals');
  else if (n >= 3 && s.breakfastDays === n) good('breakfast_daily');
  if (s.distinctGood >= s.varietyTarget) good('variety_good', s.distinctGood);
  if (s.waterDays >= most) good('water', s.waterDays, n);
  if (s.wholeGrainCount >= 3) good('whole_grains', s.wholeGrainCount);
  if (s.inNaturaShare >= 0.7) good('in_natura', s.inNaturaShare);

  // Pontos de atenção
  if (s.fvPerDay < 3) {
    bad('fv_low', s.fvPerDay, FV_TARGET_PER_DAY);
  } else {
    if (frutas.days <= n / 2) bad('fruits_few', frutas.days, n);
    if (verduras.days <= n / 2) bad('vegetables_few', verduras.days, n);
  }
  if (s.ultraShare > 0.25) bad('ultra_high', s.ultraShare);
  if (adocadas.count >= 3) bad('sugary', adocadas.count);
  if (n >= 2 && doces.days >= Math.ceil(n / 2)) bad('sweets', doces.days, n);
  if (embutidos.count >= 3) bad('processed_meat', embutidos.count);
  if (salgadinhos.count >= 2) bad('salty_snacks', salgadinhos.count);
  if (s.snacksCount >= 3) bad('fast_food', s.snacksCount);
  if (s.alcoholCount >= 4) bad('alcohol', s.alcoholCount);
  if (n - s.breakfastDays >= 3) bad('no_breakfast', n - s.breakfastDays);
  if (s.daysMissingLunchOrDinner >= 3) bad('skipped_meals', s.daysMissingLunchOrDinner);
  if (n >= 3 && feijao.days <= Math.floor(n / 3)) bad('beans_low', feijao.days, n);
  if (s.distinctGood < s.varietyTarget * 0.6) bad('variety_low', s.distinctGood);
  if (s.registeredDays < s.totalDays) bad('incomplete', s.registeredDays, s.totalDays);
  if (s.unclassifiedCount) bad('unclassified', s.unclassifiedCount);

  return { positives, attention };
}

function insight(key: InsightKey, n?: number, of?: number): Insight {
  return { key, ...(n === undefined ? {} : { n }), ...(of === undefined ? {} : { of }) };
}
