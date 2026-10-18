/** Idiomas do app. O português é o idioma de origem da base de alimentos. */
export const LANGUAGES = ['pt', 'en', 'es', 'de', 'fr', 'it'] as const;

export type Language = (typeof LANGUAGES)[number];

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}
