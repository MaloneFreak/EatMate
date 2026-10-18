import type { Language } from '../language';

/**
 * Regras de cada idioma para entender o que a pessoa digita
 * ("tomei café e comi 2 torradas", "a cup of coffee and two toasts"…).
 * Todas as palavras ficam na forma normalizada (minúsculas, sem acentos).
 */
export interface LanguageRules {
  language: Language;
  /** Plural → singular (aproximado; vale igual para o texto e para a base). */
  singularize: (word: string) => string;
  /** Palavras que separam alimentos: "e", "com", "and", "mit"… */
  separators: string[];
  /** Palavras ignoradas: verbos ("comi"), artigos, nomes de refeição… */
  stopwords: string[];
  /** Expressões que não são alimentos, ex.: "café da manhã" (para não virar "café"). */
  stopPhrases: string[];
  /** Números por extenso → como exibir na quantidade ("dois" → "2", "meia" → "meia"). */
  numberWords: Record<string, string>;
  /** Unidades de medida: "fatia", "xícara", "cup", "Scheibe"… */
  units: string[];
  /** Ligação entre quantidade/alimento e complemento: "de", "of", "di"… */
  ofWords: string[];
  /** Complemento de unidades compostas: "colher de sopa", "cuillère à soupe". */
  unitComplements?: { units: string[]; joiners: string[]; kinds: string[] };
  /**
   * Como um alimento "absorve" o sabor:
   * - after: "bolo de cenoura" (português, espanhol, francês, italiano);
   * - before: "carrot cake" (inglês);
   * - none: palavras compostas, como "Karottenkuchen" (alemão), ficam na base.
   */
  absorbs: 'after' | 'before' | 'none';
  /**
   * Palavras compostas desconhecidas são reconhecidas pela última parte:
   * "Kirschkuchen" → Kuchen (alemão).
   */
  compounds?: boolean;
  /** Onde ficam os detalhes do alimento: "frango grelhado" (after) ou "grilled chicken" (before). */
  qualifiers: 'after' | 'before';
}

/** Gera as formas singular/plural de unidades, para listar menos palavras. */
export const withPlurals = (words: string[], plural: (w: string) => string = (w) => `${w}s`) =>
  words.flatMap((w) => [w, plural(w)]);
