import { diffDays } from '../domain/dates';

/** Dicas baseadas no Guia Alimentar para a População Brasileira (Ministério da Saúde). */
export const TIPS = [
  'Faça de alimentos in natura ou minimamente processados — frutas, verduras, legumes, arroz, feijão, ovos — a base da sua alimentação.',
  'Use óleos, gorduras, sal e açúcar em pequenas quantidades ao temperar e cozinhar.',
  'Limite alimentos processados, como conservas, queijos e pães industrializados.',
  'Evite ultraprocessados, como refrigerantes, biscoitos recheados, salgadinhos de pacote e macarrão instantâneo.',
  'Coma com regularidade e atenção, em ambientes tranquilos e, sempre que possível, em companhia.',
  'Prefira fazer compras em feiras, sacolões e mercados com variedade de alimentos frescos.',
  'Cozinhar é um ótimo hábito: experimente uma receita nova nesta semana.',
  'Planeje as refeições da semana — fica mais fácil fugir dos lanches de última hora.',
  'Ao comer fora, prefira lugares que servem comida feita na hora.',
  'Desconfie de propagandas de alimentos: elas vendem produtos, não saúde.',
  'Arroz com feijão é uma combinação completa e bem brasileira: tem fibras, ferro e proteínas.',
  'Tente incluir uma fruta no café da manhã e outra no lanche da tarde.',
  'Beba água ao longo do dia — deixar uma garrafinha por perto ajuda a lembrar.',
  'Troque o refrigerante por água com gás e limão ou por um suco natural sem açúcar.',
  'Encher metade do prato com verduras e legumes é um jeito fácil de chegar às 5 porções diárias.',
  'Prefira a fruta inteira ao suco: ela tem mais fibras e sacia mais.',
  'Castanhas, frutas e iogurte natural são ótimas opções de lanche no lugar de biscoitos.',
  'Varie as cores do prato: cada cor de vegetal traz nutrientes diferentes.',
];

/** A mesma dica durante o dia todo; muda a cada dia. */
export function tipOfTheDay(today: string): string {
  const index = Math.abs(diffDays('2026-01-01', today)) % TIPS.length;
  return TIPS[index]!;
}
