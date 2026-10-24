import { registerFoodNames, type FoodNames } from '../../domain/foodNames';
import type { Language } from '../../domain/language';
import { pt, type Messages } from './pt';

/*
 * Textos de cada idioma. O português vem junto com o app (é o idioma de origem da
 * base de alimentos); os outros são baixados só quando escolhidos, com os nomes dos
 * alimentos no mesmo idioma. Assim a primeira abertura baixa um idioma, não seis.
 * O service worker guarda todos em cache, então trocar de idioma funciona sem internet.
 */

type Pack = readonly [Messages, FoodNames];

const LOADERS: Record<Exclude<Language, 'pt'>, () => Promise<Pack>> = {
  en: () =>
    Promise.all([
      import('./en').then((m) => m.en),
      import('../../domain/foodNames/en').then((m) => m.en),
    ]),
  es: () =>
    Promise.all([
      import('./es').then((m) => m.es),
      import('../../domain/foodNames/es').then((m) => m.es),
    ]),
  de: () =>
    Promise.all([
      import('./de').then((m) => m.de),
      import('../../domain/foodNames/de').then((m) => m.de),
    ]),
  fr: () =>
    Promise.all([
      import('./fr').then((m) => m.fr),
      import('../../domain/foodNames/fr').then((m) => m.fr),
    ]),
  it: () =>
    Promise.all([
      import('./it').then((m) => m.it),
      import('../../domain/foodNames/it').then((m) => m.it),
    ]),
};

const loaded: Partial<Record<Language, Messages>> = { pt };
const pending = new Map<Language, Promise<void>>();

/** Textos de um idioma já carregado (ver `loadLanguage`). */
export function messagesFor(language: Language): Messages {
  const messages = loaded[language];
  if (!messages) throw new Error(`Idioma "${language}" ainda não foi carregado`);
  return messages;
}

/** Baixa os textos e os nomes dos alimentos de um idioma (uma vez só). */
export function loadLanguage(language: Language): Promise<void> {
  if (language === 'pt' || loaded[language]) return Promise.resolve();
  let promise = pending.get(language);
  if (!promise) {
    promise = LOADERS[language]()
      .then(([messages, names]) => {
        registerFoodNames(language, names);
        loaded[language] = messages;
      })
      .finally(() => pending.delete(language));
    pending.set(language, promise);
  }
  return promise;
}

export type { Messages } from './pt';
