import type { LanguageRules } from './types';

/**
 * Chave igual para singular e plural: "Tomaten"/"Tomate" → "tomat",
 * "Kekse"/"Keks" → "kek", "Nudeln"/"Nudel" → "nudel". (Umlaute já foram removidos.)
 */
function singularize(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  let key = word;
  if (key.length > 4 && key.endsWith('n')) key = key.slice(0, -1);
  if (key.length > 4 && key.endsWith('e')) key = key.slice(0, -1);
  if (key.length > 5 && key.endsWith('er')) key = key.slice(0, -2);
  if (key.length > 4 && key.endsWith('s') && !key.endsWith('ss')) key = key.slice(0, -1);
  return key;
}

export const de: LanguageRules = {
  language: 'de',
  singularize,
  separators: ['und', 'mit', 'oder', 'plus', 'sowie'],
  stopwords: [
    'ich', 'wir', 'habe', 'hab', 'hatte', 'hatten', 'gegessen', 'esse', 'essen', 'isst', 'ass', 'getrunken',
    'trinke', 'trinken', 'trank', 'gefruhstuckt', 'zu', 'zum', 'zur', 'mittag', 'mittags', 'mittagessen',
    'abendessen', 'abendbrot', 'fruhstuck', 'abend', 'abends', 'morgens', 'morgen', 'heute', 'gestern',
    'nachmittag', 'nachmittags', 'vormittag', 'der', 'die', 'das', 'den', 'dem', 'des', 'etwas', 'bisschen',
    'viel', 'viele', 'wenig', 'sehr', 'nur', 'auch', 'noch', 'mein', 'meine', 'meinen', 'von', 'vom', 'aus',
    'als', 'dann', 'danach', 'nachtisch', 'zwischendurch', 'ohne', 'im', 'am', 'in',
  ],
  stopPhrases: [],
  numberWords: {
    ein: '1', eine: '1', einen: '1', einem: '1', einer: '1', eins: '1', zwei: '2', drei: '3', vier: '4',
    funf: '5', sechs: '6', sieben: '7', acht: '8', neun: '9', zehn: '10', halb: '', halbe: '', halben: '',
    halber: '', halbes: '',
  },
  units: [
    'stuck', 'stucke', 'stuckchen', 'scheibe', 'scheiben', 'tasse', 'tassen', 'glas', 'glaser', 'becher',
    'teller', 'schussel', 'schusseln', 'schale', 'schalen', 'loffel', 'essloffel', 'el', 'teeloffel', 'tl',
    'dose', 'dosen', 'flasche', 'flaschen', 'portion', 'portionen', 'handvoll', 'riegel', 'packung',
    'packungen', 'kugel', 'kugeln', 'g', 'gramm', 'kg', 'ml', 'l', 'liter',
  ],
  ofWords: ['von'],
  absorbs: 'none',
  compounds: true,
  qualifiers: 'before',
};
