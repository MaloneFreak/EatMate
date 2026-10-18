import type { Language } from '../language';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { pt } from './pt';
import type { LanguageRules } from './types';

export const LANGUAGE_RULES: Record<Language, LanguageRules> = { pt, en, es, de, fr, it };

export type { LanguageRules } from './types';
