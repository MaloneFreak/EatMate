import { capitalize, formatDateTime, formatFull, formatLong, formatPeriod } from './dates';
import { GRADES, GRADE_LABELS } from './grades';
import { NOVA_LABELS, groupLabel } from './groups';
import { mealLabel } from './meals';
import type { Nova, ReportData } from './types';

const percentOf = (part: number, total: number) =>
  total ? `${Math.round((part / total) * 100)}%` : '0%';
const decimal = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const days = (n: number) => (n === 1 ? '1 dia' : `${n} dias`);

export interface ExportOptions {
  /** Data/hora em que o relatório foi gerado. */
  generatedAt?: number;
  title?: string;
}

/** Relatório completo em Markdown — bom para colar em uma IA, no WhatsApp ou em um e-mail. */
export function reportToMarkdown(
  report: ReportData,
  { generatedAt, title = 'Relatório alimentar' }: ExportOptions = {},
): string {
  const lines: string[] = [];
  const push = (...text: string[]) => lines.push(...text);

  push(`# ${title} — EatMate`, '');
  if (report.profileName) push(`**Nome:** ${report.profileName}  `);
  push(
    `**Período:** ${formatFull(report.startDate)} a ${formatFull(report.endDate)} (${report.registeredDays} de ${report.totalDays} dias registrados)  `,
  );
  push(`**Refeições registradas:** ${report.mealsCount} · **Itens:** ${report.itemsCount}  `);
  if (report.score) {
    push(
      `**Nota geral:** ${report.score.grade} — ${GRADE_LABELS[report.score.grade]} (${report.score.total}/100)  `,
    );
  } else {
    push('**Nota geral:** sem dados suficientes  ');
  }
  if (report.previous) {
    push(
      `**Período anterior (${formatPeriod(report.previous.startDate, report.previous.endDate)}):** ${report.previous.grade} (${report.previous.score}/100)  `,
    );
  }
  push('');

  if (report.score) {
    push('## Como a nota foi calculada', '');
    for (const c of report.score.components) {
      push(`- **${c.label}** (peso ${Math.round(c.weight * 100)}%): ${c.score}/100 — ${c.detail}`);
    }
    push('');
  }

  if (report.positives.length) {
    push('## Pontos positivos', '', ...report.positives.map((p) => `- ${p}`), '');
  }
  if (report.attention.length) {
    push('## Pontos de atenção', '', ...report.attention.map((p) => `- ${p}`), '');
  }

  push(
    '## Marcadores de consumo alimentar',
    '',
    `Dias com consumo, de ${report.registeredDays} dias registrados:`,
    '',
  );
  for (const m of report.markers) {
    push(
      `- ${m.label} (${m.kind === 'bom' ? 'ideal: todos os dias' : 'ideal: evitar'}): ${days(m.days)} · ${m.count}x`,
    );
  }
  push('');

  if (report.classifiedCount) {
    push('## Qualidade dos alimentos (escala A a E)', '');
    push(
      GRADES.map(
        (g) => `${g}: ${percentOf(report.gradeDistribution[g], report.classifiedCount)}`,
      ).join(' · '),
      '',
    );
    push('## Grau de processamento (classificação NOVA)', '');
    for (const nova of [1, 2, 3, 4] as Nova[]) {
      push(
        `- ${NOVA_LABELS[nova]}: ${percentOf(report.novaDistribution[nova], report.classifiedCount)}`,
      );
    }
    push('');
    push('## Grupos de alimentos', '');
    for (const g of report.groups) {
      push(`- ${groupLabel(g.group)}: ${g.count}x em ${days(g.days)}`);
    }
    push(
      '',
      `Frutas, verduras e legumes: média de ${decimal(report.fruitsAndVegetablesPerDay)} porções por dia.`,
      '',
    );
  }

  push('## Refeições registradas', '');
  for (const m of report.mealRegularity) {
    push(`- ${mealLabel(m.type)}: ${m.days} de ${days(report.registeredDays)}`);
  }
  push('');

  if (report.topFoods.length) {
    push('## Alimentos mais frequentes', '');
    report.topFoods.forEach((f, i) =>
      push(`${i + 1}. ${f.name}${f.grade ? ` (${f.grade})` : ''} — ${f.count}x`),
    );
    push('');
  }

  push('## Diário alimentar', '');
  for (const day of report.days) {
    const dayTitle = capitalize(formatLong(day.date));
    push(`### ${dayTitle}${day.grade ? ` — nota do dia: ${day.grade}` : ''}`);
    if (!day.meals.length) {
      push('- (sem registro)', '');
      continue;
    }
    for (const meal of day.meals) {
      const items = meal.items
        .map(
          (i) =>
            `${i.name}${i.quantity ? ` (${i.quantity})` : ''}${i.grade ? ` [${i.grade}]` : ''}`,
        )
        .join(', ');
      push(`- **${mealLabel(meal.type)}${meal.time ? ` (${meal.time})` : ''}:** ${items}`);
      if (meal.notes) push(`  - Observação: ${meal.notes}`);
    }
    push('');
  }

  push('---');
  push(
    `Gerado pelo EatMate${generatedAt ? ` em ${formatDateTime(generatedAt)}` : ''}. As notas (A a E) e o grau de processamento são estimativas automáticas, inspiradas no Nutri-Score e no Guia Alimentar para a População Brasileira. Este relatório não substitui a orientação de um(a) nutricionista.`,
  );
  return lines.join('\n');
}

/** Texto pronto para colar em uma IA (ChatGPT, Claude, Gemini…) pedindo sugestões. */
export function reportToAIPrompt(report: ReportData, options: ExportOptions = {}): string {
  const who = report.profileName ? `Sou ${report.profileName} e registrei` : 'Registrei';
  return [
    `Olá! ${who} minha alimentação no app EatMate. Abaixo está o meu relatório de ${formatPeriod(report.startDate, report.endDate)}.`,
    '',
    'Com base nele, por favor:',
    '1. Avalie os pontos fortes e fracos da minha alimentação;',
    '2. Sugira melhorias práticas e realistas, respeitando a cultura alimentar brasileira;',
    '3. Proponha trocas simples para os itens com nota D ou E;',
    '4. Monte um exemplo de cardápio para um dia, com café da manhã, almoço, lanche e jantar.',
    '',
    'Observação: as notas A–E e o grau de processamento foram estimados automaticamente pelo app.',
    '',
    '---',
    '',
    reportToMarkdown(report, options),
  ].join('\n');
}
