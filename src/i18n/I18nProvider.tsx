import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '../domain/language';
import { createFormat, type Format } from './format';
import {
  LANGUAGE_INFO,
  detectLanguage,
  getStoredLanguage,
  localeFor,
  storeLanguage,
} from './languages';
import { MESSAGES, type Messages } from './messages';

export interface I18n {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Textos do idioma escolhido. */
  t: Messages;
  /** Datas e números no formato do idioma escolhido. */
  f: Format;
}

const I18nContext = createContext<I18n>({
  language: 'pt',
  setLanguage: () => {},
  t: MESSAGES.pt,
  f: createFormat(LANGUAGE_INFO.pt.locale),
});

/** Idioma do app: o escolhido no Perfil ou, na primeira vez, o do aparelho. */
export function I18nProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(
    () => initialLanguage ?? getStoredLanguage() ?? detectLanguage(),
  );

  useEffect(() => {
    document.documentElement.lang = LANGUAGE_INFO[language].locale;
  }, [language]);

  const value = useMemo<I18n>(
    () => ({
      language,
      setLanguage: (next) => {
        storeLanguage(next);
        setLanguageState(next);
      },
      t: MESSAGES[language],
      f: createFormat(localeFor(language)),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext);
