import type { Language } from '../language';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import type { FoodNames } from './types';

/** Nomes da base em cada idioma (o português fica direto em `foods.ts`). */
export const FOOD_NAMES: Record<Exclude<Language, 'pt'>, FoodNames> = { en, es, de, fr, it };

export type { FoodNames } from './types';
