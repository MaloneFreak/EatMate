import { describe, expect, it } from 'vitest';
import { getDefaultFoodIndex } from '../foodIndex';
import { BUILTIN_FOODS, localizedFoods } from '../foods';
import { LANGUAGE_RULES } from '../lang';
import { LANGUAGES } from '../language';
import { foodKey } from '../text';
import { FOOD_NAMES } from '.';
import { INTERNATIONAL_NAMES } from './international';

describe.each(LANGUAGES)('base de alimentos (%s)', (language) => {
  const rules = LANGUAGE_RULES[language];
  const { singularize } = rules;

  if (language !== 'pt') {
    const names = FOOD_NAMES[language]!;

    it('traduz todos os alimentos, sem ids a mais', () => {
      const ids = new Set(BUILTIN_FOODS.map((f) => f.id));
      expect(BUILTIN_FOODS.filter((f) => !names[f.id]).map((f) => f.id)).toEqual([]);
      expect(Object.keys(names).filter((id) => !ids.has(id))).toEqual([]);
    });
  }

  it('não tem o mesmo nome em alimentos diferentes', () => {
    const owner = new Map<string, string>();
    const conflicts: string[] = [];
    for (const food of localizedFoods(language)) {
      for (const text of [food.name, ...(food.aliases ?? [])]) {
        const key = foodKey(text, singularize);
        const current = owner.get(key);
        if (current && current !== food.id) conflicts.push(`"${text}" (${current} × ${food.id})`);
        owner.set(key, food.id);
      }
    }
    expect(conflicts).toEqual([]);
  });

  it('não usa como nome de alimento palavras que o texto ignora (verbos, artigos…)', () => {
    const words = [
      ...rules.stopwords,
      ...rules.separators,
      ...rules.ofWords,
      ...Object.keys(rules.numberWords),
    ];
    const reserved = new Set(words.flatMap((w) => [w, singularize(w)]));
    const clashes = localizedFoods(language).flatMap((food) =>
      [food.name, ...(food.aliases ?? [])]
        .filter((text) => reserved.has(foodKey(text, singularize)))
        .map((text) => `${food.id}: "${text}"`),
    );
    expect(clashes).toEqual([]);
  });
});

describe('nomes internacionais', () => {
  it('só usam alimentos que existem', () => {
    const ids = new Set(BUILTIN_FOODS.map((f) => f.id));
    expect(Object.keys(INTERNATIONAL_NAMES).filter((id) => !ids.has(id))).toEqual([]);
  });

  it.each(LANGUAGES)('valem em %s', (language) => {
    const index = getDefaultFoodIndex(language);
    expect(index.lookup('burrata')?.food.group).toBe('leite_derivados');
    expect(index.lookup('quark')?.food.id).toBe('ricota');
    expect(index.lookup('tiramisu')?.food.id).toBe('torta_doce');
    expect(index.lookup('halloumi')?.food.id).toBe('queijo');
  });

  it('não mudam o sentido que a palavra já tem no idioma', () => {
    expect(getDefaultFoodIndex('it').lookup('latte')?.food.id).toBe('leite');
    expect(getDefaultFoodIndex('en').lookup('cookie')?.food.id).toBe('biscoito_doce');
    // Na Argentina, "feta" é uma fatia ("una feta de jamón"): continua sendo unidade.
    expect(getDefaultFoodIndex('es').lookup('feta')).toBeUndefined();
  });
});
