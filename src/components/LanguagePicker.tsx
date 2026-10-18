import { Languages } from 'lucide-react';
import { LANGUAGES } from '../domain/language';
import { useI18n } from '../i18n/I18nProvider';
import { LANGUAGE_INFO } from '../i18n/languages';

/** Escolha do idioma (cada idioma aparece com o próprio nome: "Deutsch", "Español"…). */
export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { t, language, setLanguage } = useI18n();
  return (
    <label className={`language-picker${compact ? ' compact' : ''}`}>
      <Languages size={18} aria-hidden="true" />
      <span className="visually-hidden">{t.profile.language}</span>
      <select
        className="input"
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l} lang={LANGUAGE_INFO[l].locale}>
            {LANGUAGE_INFO[l].name}
          </option>
        ))}
      </select>
    </label>
  );
}
