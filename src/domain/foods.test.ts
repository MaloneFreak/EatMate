import { describe, expect, it } from 'vitest';
import { BUILTIN_FOODS } from './foods';
import { FoodIndex } from './foodIndex';

describe('base de alimentos', () => {
  it('não tem ids repetidos', () => {
    const ids = BUILTIN_FOODS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('tem uma base com boa cobertura', () => {
    expect(BUILTIN_FOODS.length).toBeGreaterThan(200);
  });
});

describe('FoodIndex.search', () => {
  const index = new FoodIndex();

  it('encontra por prefixo, sem acento', () => {
    const results = index.search('feij').map((r) => r.food.id);
    expect(results[0]).toBe('feijao');
  });

  it('mostra o apelido que casou', () => {
    const [first] = index.search('coca');
    expect(first?.food.id).toBe('refrigerante');
    expect(first?.text).toBe('Coca');
  });

  it('prioriza alimentos usados com frequência', () => {
    const usage = new Map([['pao_integral', 10]]);
    expect(index.search('pao', { usage })[0]?.food.id).toBe('pao_integral');
    expect(index.search('pao')[0]?.food.id).toBe('pao_frances');
  });

  it('dá prioridade aos alimentos personalizados', () => {
    const custom = new FoodIndex([
      { id: 'custom_1', name: 'Pão', group: 'cereais', grade: 'A', nova: 1, aliases: [] },
    ]);
    expect(custom.lookup('pao')?.food.id).toBe('custom_1');
  });
});
