import type { Format } from '../i18n/format';
import type { Messages } from '../i18n/messages';
import type { FoodIndex } from './foodIndex';
import { GRADES } from './grades';
import type { Insight, Nova, ReportData } from './types';

export interface ExportOptions {
  t: Messages;
  f: Format;
  /** Para mostrar os alimentos com o nome no idioma escolhido. */
  index?: FoodIndex;
  /** Data/hora em que o relatório foi gerado. */
  generatedAt?: number;
  title?: string;
}

/** Texto de um destaque do relatório ("Ótimo consumo de frutas…"). */
export function insightText(insight: Insight, t: Messages, f: Format): string {
  // `?.`: um arquivo de backup corrompido pode trazer uma chave desconhecida.
  return t.insights[insight.key]?.(insight.n ?? 0, insight.of ?? 0, f) ?? '';
}

/** Relatório completo em Markdown — bom para colar em uma IA, no WhatsApp ou em um e-mail. */
export function reportToMarkdown(report: ReportData, options: ExportOptions): string {
  const { t, f, index, generatedAt } = options;
  const e = t.export;
  const title = options.title ?? e.title;
  const share = (part: number, total: number) => f.percent(total ? part / total : 0);
  const lines: string[] = [];
  const push = (...text: string[]) => lines.push(...text);

  push(`# ${title} — EatMate`, '');
  if (report.profileName) push(`**${e.name}:** ${report.profileName}  `);
  push(
    `**${e.period}:** ${e.periodValue(f.full(report.startDate), f.full(report.endDate), report.registeredDays, report.totalDays)}  `,
  );
  push(`**${e.meals}:** ${report.mealsCount} · **${e.items}:** ${report.itemsCount}  `);
  if (report.score) {
    push(
      `**${e.overall}:** ${report.score.grade} — ${t.grades.labels[report.score.grade]} (${report.score.total}/100)  `,
    );
  } else {
    push(`**${e.overall}:** ${e.noData}  `);
  }
  if (report.previous) {
    push(
      `**${e.previous(f.period(report.previous.startDate, report.previous.endDate))}:** ${report.previous.grade} (${report.previous.score}/100)  `,
    );
  }
  push('');

  if (report.score) {
    push(`## ${e.howCalculated}`, '');
    for (const c of report.score.components) {
      push(
        `- **${t.score.components[c.key]}** (${e.weight(Math.round(c.weight * 100))}): ${c.score}/100 — ${t.score.details[c.key](report.score.facts, f)}`,
      );
    }
    push('');
  }

  const insights = (list: Insight[]) => list.map((i) => `- ${insightText(i, t, f)}`);
  if (report.positives.length) push(`## ${e.positives}`, '', ...insights(report.positives), '');
  if (report.attention.length) push(`## ${e.attention}`, '', ...insights(report.attention), '');

  push(`## ${e.markers}`, '', e.markersIntro(report.registeredDays), '');
  for (const m of report.markers) {
    push(
      `- ${t.markers[m.key]} (${m.kind === 'bom' ? e.idealDaily : e.idealAvoid}): ${t.common.days(m.days)} · ${m.count}x`,
    );
  }
  push('');

  if (report.classifiedCount) {
    push(`## ${e.grades}`, '');
    push(
      GRADES.map((g) => `${g}: ${share(report.gradeDistribution[g], report.classifiedCount)}`).join(
        ' · ',
      ),
      '',
    );
    push(`## ${e.nova}`, '');
    for (const nova of [1, 2, 3, 4] as Nova[]) {
      push(`- ${t.nova[nova]}: ${share(report.novaDistribution[nova], report.classifiedCount)}`);
    }
    push('');
    push(`## ${e.groups}`, '');
    for (const g of report.groups) {
      push(`- ${e.groupLine(t.groups[g.group], g.count, t.common.days(g.days))}`);
    }
    push('', e.fruitsAndVegetables(f.decimal(report.fruitsAndVegetablesPerDay)), '');
  }

  push(`## ${e.mealsTitle}`, '');
  for (const m of report.mealRegularity) {
    push(`- ${e.mealLine(t.mealTypes[m.type], m.days, t.common.days(report.registeredDays))}`);
  }
  push('');

  if (report.topFoods.length) {
    push(`## ${e.topFoods}`, '');
    report.topFoods.forEach((food, i) => {
      const name = index?.get(food.foodId)?.name ?? food.name;
      push(`${i + 1}. ${name}${food.grade ? ` (${food.grade})` : ''} — ${food.count}x`);
    });
    push('');
  }

  push(`## ${e.diary}`, '');
  for (const day of report.days) {
    push(`### ${f.long(day.date)}${day.grade ? ` — ${e.dayGrade(day.grade)}` : ''}`);
    if (!day.meals.length) {
      push(`- ${e.noRecord}`, '');
      continue;
    }
    for (const meal of day.meals) {
      const items = meal.items
        .map(
          (i) =>
            `${i.name}${i.quantity ? ` (${i.quantity})` : ''}${i.grade ? ` [${i.grade}]` : ''}`,
        )
        .join(', ');
      push(`- **${t.mealTypes[meal.type]}${meal.time ? ` (${meal.time})` : ''}:** ${items}`);
      if (meal.notes) push(`  - ${e.note}: ${meal.notes}`);
    }
    push('');
  }

  push('---');
  push(e.footer(generatedAt ? f.dateTime(generatedAt) : undefined));
  // Hífens opcionais (\u00ad) só servem para quebrar linha na tela.
  return lines.join('\n').replace(/\u00ad/g, '');
}

/** Texto pronto para colar em uma IA (ChatGPT, Claude, Gemini…) pedindo sugestões. */
export function reportToAIPrompt(report: ReportData, options: ExportOptions): string {
  const { t, f } = options;
  return [
    t.export.aiIntro(report.profileName, f.period(report.startDate, report.endDate)),
    '',
    ...t.export.aiAsk,
    '',
    t.export.aiNote,
    '',
    '---',
    '',
    reportToMarkdown(report, options),
  ].join('\n');
}
