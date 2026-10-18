import { describe, expect, it } from 'vitest';
import { FoodIndex } from './foodIndex';
import { gradeFromScore } from './grades';
import { parseFoodText } from './parser';
import { computeScore, varietyTarget, type ScoreDay } from './scoring';
import type { MealType } from './types';

const index = new FoodIndex();

/** Monta dias de teste a partir de texto: [[tipo, "arroz, feijão"], ...] por dia. */
function days(...spec: [MealType, string][][]): ScoreDay[] {
  return spec.map((meals, i) => ({
    date: `2026-10-${String(10 + i).padStart(2, '0')}`,
    meals: meals.map(([type, text]) => ({
      type,
      items: parseFoodText(text, index).map((item) => ({ food: index.get(item.foodId) })),
    })),
  }));
}

const repeat = <T>(n: number, value: T): T[] => Array.from({ length: n }, () => value);

describe('gradeFromScore', () => {
  it('converte pontos em letras', () => {
    expect(gradeFromScore(100)).toBe('A');
    expect(gradeFromScore(85)).toBe('A');
    expect(gradeFromScore(84)).toBe('B');
    expect(gradeFromScore(70)).toBe('B');
    expect(gradeFromScore(69)).toBe('C');
    expect(gradeFromScore(55)).toBe('C');
    expect(gradeFromScore(40)).toBe('D');
    expect(gradeFromScore(39)).toBe('E');
    expect(gradeFromScore(0)).toBe('E');
  });
});

describe('computeScore', () => {
  it('retorna null sem dados', () => {
    expect(computeScore([])).toBeNull();
    expect(computeScore([{ date: '2026-10-10', meals: [] }])).toBeNull();
    expect(computeScore(days([['almoco', 'xpto desconhecido']]))).toBeNull();
  });

  it('dá A para uma alimentação equilibrada e variada', () => {
    const healthy = days(
      [
        ['cafe_manha', 'café, pão integral, ovo mexido, mamão'],
        ['almoco', 'arroz, feijão, frango grelhado, alface, tomate, cenoura'],
        ['cafe_tarde', 'iogurte natural, banana'],
        ['jantar', 'sopa de legumes, brócolis, abobrinha'],
      ],
      [
        ['cafe_manha', 'café com leite, tapioca, melão'],
        ['almoco', 'arroz integral, lentilha, peixe assado, beterraba, couve, laranja'],
        ['cafe_tarde', 'maçã, castanhas'],
        ['jantar', 'omelete, salada, batata-doce, pepino'],
      ],
      [
        ['cafe_manha', 'café, cuscuz, ovo, abacaxi'],
        ['almoco', 'arroz, feijão, carne moída, chuchu, repolho, quiabo'],
        ['cafe_tarde', 'uva, aveia'],
        ['jantar', 'frango, mandioca, espinafre, tomate'],
      ],
    );
    const result = computeScore(healthy)!;
    expect(result.grade).toBe('A');
    expect(result.total).toBeGreaterThanOrEqual(85);
  });

  it('dá D ou E para uma alimentação baseada em ultraprocessados', () => {
    const junk = days(
      ...repeat(3, [
        ['cafe_manha', 'achocolatado, biscoito recheado'],
        ['almoco', 'x-burguer, batata frita, refrigerante'],
        ['cafe_tarde', 'salgadinho, refrigerante'],
        ['jantar', 'pizza, refrigerante'],
      ] as [MealType, string][]),
    );
    const result = computeScore(junk)!;
    expect(['D', 'E']).toContain(result.grade);
    expect(result.total).toBeLessThan(40);
  });

  it('dá B para o "prato feito" tradicional sem muitas frutas', () => {
    const traditional = days(
      ...repeat(7, [
        ['cafe_manha', 'café com leite, pão francês, manteiga'],
        ['almoco', 'arroz, feijão, bife, salada'],
        ['cafe_tarde', 'banana'],
        ['jantar', 'arroz, feijão, frango, salada'],
      ] as [MealType, string][]),
    );
    const result = computeScore(traditional)!;
    expect(result.grade).toBe('B');
  });

  it('penaliza refeições principais faltando', () => {
    const full = computeScore(
      days([
        ['cafe_manha', 'café, pão'],
        ['almoco', 'arroz, feijão'],
        ['jantar', 'sopa'],
      ]),
    )!;
    const partial = computeScore(days([['almoco', 'arroz, feijão, café, pão, sopa']]))!;
    const regularity = (r: typeof full) =>
      r.components.find((c) => c.key === 'regularidade')!.score;
    expect(regularity(full)).toBe(100);
    expect(regularity(partial)).toBe(33);
  });

  it('ignora itens não reconhecidos', () => {
    const withUnknown = computeScore(days([['almoco', 'arroz, feijão, xpto']]))!;
    const without = computeScore(days([['almoco', 'arroz, feijão']]))!;
    expect(withUnknown.total).toBe(without.total);
  });

  it('água e café têm meio peso na média', () => {
    const quality = (text: string) =>
      computeScore(days([['almoco', text]]))!.components.find((c) => c.key === 'qualidade')!.score;
    // refrigerante (E = 0) + água (A = 100, peso 0,5) → 33
    expect(quality('refrigerante, água')).toBe(33);
  });

  it('meta de variedade cresce com os dias', () => {
    expect(varietyTarget(1)).toBe(8);
    expect(varietyTarget(3)).toBe(12);
    expect(varietyTarget(7)).toBe(20);
    expect(varietyTarget(30)).toBe(20);
  });
});
