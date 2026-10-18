import { LANGUAGES, isLanguage, type Language } from '../domain/language';

export const LANGUAGE_INFO: Record<Language, { name: string; locale: string }> = {
  pt: { name: 'Português', locale: 'pt-BR' },
  en: { name: 'English', locale: 'en-US' },
  es: { name: 'Español', locale: 'es-ES' },
  de: { name: 'Deutsch', locale: 'de-DE' },
  fr: { name: 'Français', locale: 'fr-FR' },
  it: { name: 'Italiano', locale: 'it-IT' },
};

const KEY = 'eatmate:lang';

const browserLanguages = (): readonly string[] =>
  typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language]);

const primary = (tag: string) => tag.toLowerCase().split('-')[0];

/** Idioma do aparelho, se for um dos idiomas do app (senão, inglês). */
export function detectLanguage(preferred: readonly string[] = browserLanguages()): Language {
  for (const tag of preferred) {
    const language = primary(tag);
    if (isLanguage(language)) return language;
  }
  return 'en';
}

/** Formato regional: o do aparelho quando o idioma bate ("en-GB"), senão o padrão do idioma. */
export function localeFor(
  language: Language,
  preferred: readonly string[] = browserLanguages(),
): string {
  return preferred.find((tag) => primary(tag) === language) ?? LANGUAGE_INFO[language].locale;
}

export function getStoredLanguage(): Language | undefined {
  try {
    const value = localStorage.getItem(KEY);
    return isLanguage(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function storeLanguage(language: Language): void {
  try {
    localStorage.setItem(KEY, language);
  } catch {
    // Sem armazenamento local: o idioma vale só até fechar o app.
  }
}

export { LANGUAGES };
