import type { Language } from '../../domain/language';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { pt, type Messages } from './pt';

export const MESSAGES: Record<Language, Messages> = { pt, en, es, de, fr, it };

export type { Messages } from './pt';
