import type { Language } from '../language';
import type { FoodNames } from './types';

/**
 * Nomes da base em cada idioma (o português fica direto em `foods.ts`).
 * São preenchidos por `loadLanguage` (i18n/messages), que baixa cada idioma sob demanda.
 */
export const FOOD_NAMES: Partial<Record<Exclude<Language, 'pt'>, FoodNames>> = {};

export function registerFoodNames(language: Exclude<Language, 'pt'>, names: FoodNames): void {
  FOOD_NAMES[language] = names;
}

export type { FoodNames } from './types';
