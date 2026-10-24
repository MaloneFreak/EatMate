import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Language } from '../domain/language';
import { createFormat, type Format } from './format';
import { LANGUAGE_INFO, localeFor, startupLanguage, storeLanguage } from './languages';
import { loadLanguage, messagesFor, type Messages } from './messages';

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
  t: messagesFor('pt'),
  f: createFormat(LANGUAGE_INFO.pt.locale),
});

/**
 * Idioma do app. O idioma inicial precisa estar carregado antes (ver `main.tsx`);
 * ao trocar, os textos do novo idioma são baixados e a tela só muda quando chegam.
 */
export function I18nProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(
    () => initialLanguage ?? startupLanguage(),
  );

  // Último idioma pedido: se a pessoa trocar duas vezes seguidas, vale o último, mesmo
  // que o anterior termine de baixar depois.
  const requested = useRef(language);

  useEffect(() => {
    document.documentElement.lang = LANGUAGE_INFO[language].locale;
  }, [language]);

  const value = useMemo<I18n>(
    () => ({
      language,
      setLanguage: (next) => {
        requested.current = next;
        loadLanguage(next).then(
          () => {
            if (requested.current !== next) return;
            storeLanguage(next);
            setLanguageState(next);
          },
          (error: unknown) => console.warn(`Não foi possível carregar o idioma "${next}"`, error),
        );
      },
      t: messagesFor(language),
      f: createFormat(localeFor(language)),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useI18n = () => useContext(I18nContext);
