import { describe, expect, it } from 'vitest';
import { buildDemoMeals } from './demo';
import { reportToAIPrompt, reportToMarkdown } from './exportText';
import { FoodIndex } from './foodIndex';
import { buildReport } from './report';
import type { Meal } from './types';

const index = new FoodIndex();
const period = { start: '2026-10-12', end: '2026-10-18' };

describe('buildReport', () => {
  const meals = buildDemoMeals('2026-10-18', index);
  const report = buildReport({ meals, index, period, profileName: 'Pedro' });

  it('resume o período', () => {
    expect(report.totalDays).toBe(7);
    expect(report.registeredDays).toBe(7);
    expect(report.mealsCount).toBe(30);
    expect(report.days).toHaveLength(7);
    expect(report.score?.grade).toMatch(/[A-E]/);
    expect(report.previous).toBeNull();
  });

  it('conta os marcadores de consumo', () => {
    const feijao = report.markers.find((m) => m.key === 'feijao')!;
    expect(feijao.days).toBe(7);
    const adocadas = report.markers.find((m) => m.key === 'adocadas')!;
    expect(adocadas.count).toBeGreaterThan(0);
  });

  it('gera destaques positivos e de atenção', () => {
    expect(report.positives.length).toBeGreaterThan(0);
    expect(report.attention.length).toBeGreaterThan(0);
    expect(report.attention.join(' ')).toMatch(/bebidas adoçadas/i);
  });

  it('lista os alimentos mais frequentes', () => {
    expect(report.topFoods[0]).toMatchObject({ name: 'Arroz', grade: 'A' });
  });

  it('compara com o período anterior quando há dados', () => {
    const previousWeek = buildDemoMeals('2026-10-11', index).map((m) => ({
      ...m,
      id: `prev-${m.id}`,
    }));
    const withPrevious = buildReport({
      meals: [...meals, ...previousWeek],
      index,
      period,
      profileName: 'Pedro',
    });
    expect(withPrevious.previous).toMatchObject({ startDate: '2026-10-05', endDate: '2026-10-11' });
    expect(withPrevious.score?.total).toBe(report.score?.total);
  });

  it('marca dias sem registro e itens não reconhecidos', () => {
    const few: Meal[] = [
      {
        id: 'm1',
        date: '2026-10-15',
        type: 'almoco',
        items: [
          { id: 'a', name: 'Arroz', foodId: 'arroz' },
          { id: 'b', name: 'Xpto' },
        ],
        createdAt: 0,
        updatedAt: 0,
      },
    ];
    const r = buildReport({ meals: few, index, period, profileName: '' });
    expect(r.registeredDays).toBe(1);
    expect(r.unclassified).toEqual(['Xpto']);
    expect(r.days.filter((d) => d.mealsCount === 0)).toHaveLength(6);
    expect(r.attention.join(' ')).toMatch(/registrou 1 dia de 7/);
  });

  it('funciona sem nenhum registro', () => {
    const empty = buildReport({ meals: [], index, period, profileName: 'Pedro' });
    expect(empty.score).toBeNull();
    expect(empty.positives).toEqual([]);
    expect(reportToMarkdown(empty)).toContain('sem dados suficientes');
  });
});

describe('exportação', () => {
  const report = buildReport({
    meals: buildDemoMeals('2026-10-18', index),
    index,
    period,
    profileName: 'Pedro',
  });

  it('gera Markdown com o diário completo', () => {
    const md = reportToMarkdown(report);
    expect(md).toContain('# Relatório alimentar — EatMate');
    expect(md).toContain('**Nome:** Pedro');
    expect(md).toContain('12/10/2026 a 18/10/2026');
    expect(md).toContain('## Diário alimentar');
    expect(md).toContain('Pão integral (2 fatias) [A]');
    expect(md).toContain('Domingo, 18 de outubro');
  });

  it('gera um pedido pronto para IA', () => {
    const prompt = reportToAIPrompt(report);
    expect(prompt).toMatch(/^Olá! Sou Pedro/);
    expect(prompt).toContain('cultura alimentar brasileira');
    expect(prompt).toContain('## Diário alimentar');
  });
});
