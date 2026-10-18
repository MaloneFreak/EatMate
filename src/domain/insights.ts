import { FV_TARGET_PER_DAY } from './scoring';
import type { MarkerResult } from './types';

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
  markers: Record<MarkerResult['key'], { days: number; count: number }>;
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

const decimal = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const percent = (value: number) => `${Math.round(value * 100)}%`;
const times = (n: number) => (n === 1 ? '1 vez' : `${n} vezes`);
const days = (n: number) => (n === 1 ? '1 dia' : `${n} dias`);

/** Destaques do relatório (regras simples, baseadas no Guia Alimentar para a População Brasileira). */
export function buildInsights(s: InsightStats): { positives: string[]; attention: string[] } {
  const positives: string[] = [];
  const attention: string[] = [];
  const n = s.registeredDays;
  if (!n || !s.classifiedCount) {
    if (s.unclassifiedCount) attention.push(unclassifiedMessage(s.unclassifiedCount));
    return { positives, attention };
  }
  const most = Math.ceil(n * 0.7);
  const { feijao, frutas, verduras, embutidos, adocadas, salgadinhos, doces } = s.markers;

  // Pontos positivos
  if (s.fvPerDay >= FV_TARGET_PER_DAY) {
    positives.push(
      `Ótimo consumo de frutas, verduras e legumes: ${decimal(s.fvPerDay)} porções por dia em média.`,
    );
  } else if (s.fvPerDay >= 3) {
    positives.push(
      `Bom consumo de frutas, verduras e legumes (${decimal(s.fvPerDay)} porções por dia). Falta pouco para a meta de ${FV_TARGET_PER_DAY}.`,
    );
  }
  if (feijao.days >= most) {
    positives.push(
      `Feijão ou outras leguminosas em ${feijao.days} de ${n} dias — ótima fonte de fibras, ferro e proteína.`,
    );
  }
  if (s.classifiedCount >= 5 && s.ultraShare <= 0.1) {
    positives.push(`Poucos ultraprocessados: apenas ${percent(s.ultraShare)} dos itens.`);
  }
  if (n >= 3 && adocadas.count === 0) {
    positives.push('Nenhum refrigerante ou bebida adoçada no período.');
  }
  if (n >= 3 && s.mainMealsShare >= 0.9) {
    positives.push(
      'Refeições principais (café da manhã, almoço e jantar) registradas com regularidade.',
    );
  } else if (n >= 3 && s.breakfastDays === n) {
    positives.push('Café da manhã registrado em todos os dias.');
  }
  if (s.distinctGood >= s.varietyTarget) {
    positives.push(`Boa variedade: ${s.distinctGood} alimentos diferentes de boa qualidade.`);
  }
  if (s.waterDays >= most) {
    positives.push(`Água registrada em ${s.waterDays} de ${n} dias. Continue se hidratando!`);
  }
  if (s.wholeGrainCount >= 3) {
    positives.push(`Cereais integrais apareceram ${times(s.wholeGrainCount)}.`);
  }
  if (s.inNaturaShare >= 0.7) {
    positives.push(
      `${percent(s.inNaturaShare)} dos itens foram alimentos in natura ou minimamente processados — a base de uma alimentação saudável.`,
    );
  }

  // Pontos de atenção
  if (s.fvPerDay < 3) {
    attention.push(
      `Poucas frutas, verduras e legumes: ${decimal(s.fvPerDay)} porções por dia em média (o recomendado é pelo menos ${FV_TARGET_PER_DAY}).`,
    );
  } else {
    if (frutas.days <= n / 2)
      attention.push(`Frutas apareceram em apenas ${days(frutas.days)} de ${n}.`);
    if (verduras.days <= n / 2)
      attention.push(`Verduras e legumes apareceram em apenas ${days(verduras.days)} de ${n}.`);
  }
  if (s.ultraShare > 0.25) {
    attention.push(
      `Ultraprocessados representaram ${percent(s.ultraShare)} dos itens. Prefira alimentos in natura e preparações caseiras.`,
    );
  }
  if (adocadas.count >= 3) {
    attention.push(
      `Refrigerantes e bebidas adoçadas apareceram ${times(adocadas.count)}. Troque por água, água com gás e limão ou suco natural sem açúcar.`,
    );
  }
  if (n >= 2 && doces.days >= Math.ceil(n / 2)) {
    attention.push(`Doces e guloseimas apareceram em ${doces.days} de ${n} dias.`);
  }
  if (embutidos.count >= 3) {
    attention.push(
      `Hambúrguer e embutidos apareceram ${times(embutidos.count)} — costumam ter muito sódio e conservantes.`,
    );
  }
  if (salgadinhos.count >= 2) {
    attention.push(
      `Salgadinhos de pacote, biscoitos salgados ou macarrão instantâneo apareceram ${times(salgadinhos.count)}.`,
    );
  }
  if (s.snacksCount >= 3) {
    attention.push(`Lanches, salgados e fast food apareceram ${times(s.snacksCount)}.`);
  }
  if (s.alcoholCount >= 4) {
    attention.push(`Bebidas alcoólicas apareceram ${times(s.alcoholCount)}.`);
  }
  if (n - s.breakfastDays >= 3) {
    attention.push(`Sem café da manhã registrado em ${n - s.breakfastDays} dias.`);
  }
  if (s.daysMissingLunchOrDinner >= 3) {
    attention.push(
      `Almoço ou jantar ficaram sem registro em ${s.daysMissingLunchOrDinner} dias. Se você pulou refeições, tente manter horários regulares.`,
    );
  }
  if (n >= 3 && feijao.days <= Math.floor(n / 3)) {
    attention.push(
      `Feijão apareceu pouco (${days(feijao.days)} de ${n}). Arroz com feijão é uma combinação nutritiva e bem brasileira.`,
    );
  }
  if (s.distinctGood < s.varietyTarget * 0.6) {
    attention.push(
      `Pouca variedade: ${s.distinctGood} alimentos diferentes de boa qualidade. Variar ajuda a obter mais nutrientes.`,
    );
  }
  if (s.registeredDays < s.totalDays) {
    attention.push(
      `Você registrou ${days(s.registeredDays)} de ${s.totalDays}. Registros completos deixam o relatório mais fiel.`,
    );
  }
  if (s.unclassifiedCount) attention.push(unclassifiedMessage(s.unclassifiedCount));

  return { positives, attention };
}

function unclassifiedMessage(count: number): string {
  return count === 1
    ? '1 item não foi reconhecido e ficou fora do cálculo. Você pode classificá-lo editando a refeição.'
    : `${count} itens não foram reconhecidos e ficaram fora do cálculo. Você pode classificá-los editando a refeição.`;
}
