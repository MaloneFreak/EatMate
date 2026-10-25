import { describe, expect, it } from 'vitest';
import { BUILTIN_FOODS, localizedFoods } from '../foods';
import { LANGUAGE_RULES } from '../lang';
import { LANGUAGES } from '../language';
import { foodKey } from '../text';
import { FOOD_NAMES } from '.';

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
