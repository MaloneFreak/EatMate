import { localizedFoods } from './foods';
import { LANGUAGE_RULES } from './lang';
import type { Language } from './language';
import { capitalizeFirst, foodKey, normalize } from './text';
import type { Food } from './types';

/** Um nome pelo qual um alimento é reconhecido (o nome principal ou um apelido). */
export interface FoodTerm {
  food: Food;
  /** Texto como deve aparecer na tela, ex.: "Coca-cola". */
  text: string;
  /** Chave de comparação (sem acentos e no singular), ex.: "coca cola". */
  key: string;
  /** Texto normalizado sem singularizar, usado na busca por prefixo. */
  normalized: string;
  isName: boolean;
}

export interface FoodSuggestion {
  food: Food;
  /** Texto que casou com a busca (nome ou apelido). */
  text: string;
}

export interface FoodMatch {
  term: FoodTerm;
  /** Quantidade de palavras consumidas. */
  length: number;
}

/**
 * Índice de busca dos alimentos (base do app no idioma escolhido + alimentos
 * personalizados). Alimentos personalizados têm prioridade em caso de nomes repetidos.
 */
export class FoodIndex {
  readonly foods: Food[];
  private readonly byId = new Map<string, Food>();
  private readonly byKey = new Map<string, FoodTerm>();
  private readonly terms: FoodTerm[] = [];
  readonly maxTermLength: number;
  private readonly singularize: (word: string) => string;

  constructor(
    customFoods: Food[] = [],
    readonly language: Language = 'pt',
    builtinFoods: Food[] = localizedFoods(language),
  ) {
    this.singularize = LANGUAGE_RULES[language].singularize;
    this.foods = [...customFoods, ...builtinFoods];
    let maxLength = 1;
    for (const food of this.foods) {
      if (this.byId.has(food.id)) continue;
      this.byId.set(food.id, food);
      const texts = [food.name, ...(food.aliases ?? [])];
      texts.forEach((text, i) => {
        const key = foodKey(text, this.singularize);
        if (!key || this.byKey.has(key)) return;
        const term: FoodTerm = { food, text, key, normalized: normalize(text), isName: i === 0 };
        this.byKey.set(key, term);
        this.terms.push(term);
        maxLength = Math.max(maxLength, key.split(' ').length);
      });
    }
    this.maxTermLength = maxLength;
  }

  get(id: string | undefined): Food | undefined {
    return id ? this.byId.get(id) : undefined;
  }

  /** Procura o nome exato (já convertido em chave, ver `foodKey`). */
  lookupKey(key: string): FoodTerm | undefined {
    return this.byKey.get(key);
  }

  /** Procura o nome exato, ignorando acentos, maiúsculas e plural. */
  lookup(text: string): FoodTerm | undefined {
    return this.byKey.get(foodKey(text, this.singularize));
  }

  /** Maior nome conhecido que começa na posição `start` da lista de chaves de palavras. */
  matchAt(keys: string[], start: number): FoodMatch | undefined {
    const max = Math.min(this.maxTermLength, keys.length - start);
    for (let length = max; length >= 1; length--) {
      const term = this.byKey.get(keys.slice(start, start + length).join(' '));
      if (term) return { term, length };
    }
    return undefined;
  }

  /**
   * Alimento pela última parte de uma palavra composta ("kirschkuch" → "kuch"):
   * a parte final precisa ter ao menos 4 letras e sobrar ao menos 3 antes dela.
   */
  matchSuffix(key: string): FoodTerm | undefined {
    for (let cut = 3; cut <= key.length - 4; cut++) {
      const term = this.byKey.get(key.slice(cut));
      if (term) return term;
    }
    return undefined;
  }

  /**
   * Sugestões para o campo de busca. `usage` (id → nº de vezes registrado)
   * dá preferência aos alimentos que a pessoa costuma comer.
   */
  search(
    query: string,
    { limit = 8, usage }: { limit?: number; usage?: Map<string, number> } = {},
  ): FoodSuggestion[] {
    const normalized = normalize(query);
    if (!normalized) return [];
    const key = foodKey(query, this.singularize);
    const best = new Map<string, { term: FoodTerm; score: number }>();

    for (const term of this.terms) {
      const score = scoreTerm(term, normalized, key);
      if (score <= 0) continue;
      const boosted =
        score + Math.min(25, (usage?.get(term.food.id) ?? 0) * 3) + (term.isName ? 1 : 0);
      const current = best.get(term.food.id);
      if (!current || boosted > current.score) best.set(term.food.id, { term, score: boosted });
    }

    return [...best.values()]
      .sort((a, b) => b.score - a.score || a.term.text.length - b.term.text.length)
      .slice(0, limit)
      .map(({ term }) => ({ food: term.food, text: capitalizeFirst(term.text) }));
  }
}

function scoreTerm(term: FoodTerm, normalized: string, key: string): number {
  if (term.key === key || term.normalized === normalized) return 100;
  if (term.normalized.startsWith(normalized) || term.key.startsWith(key)) {
    return 80 - Math.min(20, (term.normalized.length - normalized.length) * 0.5);
  }
  if (term.normalized.includes(` ${normalized}`)) return 60;
  if (normalized.length >= 3 && term.normalized.includes(normalized)) return 40;
  return 0;
}

const defaultIndexes = new Map<Language, FoodIndex>();

/** Índice somente com a base do app (sem alimentos personalizados). */
export function getDefaultFoodIndex(language: Language = 'pt'): FoodIndex {
  let index = defaultIndexes.get(language);
  if (!index) {
    index = new FoodIndex([], language);
    defaultIndexes.set(language, index);
  }
  return index;
}
