import { withPlurals, type LanguageRules } from './types';

/**
 * Chave igual para singular e plural (não precisa ser a palavra real):
 * "tomates"/"tomate" → "tomat", "panes"/"pan" → "pan", "nueces"/"nuez" → "nuez".
 */
function singularize(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  let key = word;
  if (key.endsWith('s') && !key.endsWith('ss')) key = key.slice(0, -1);
  if (key.endsWith('e')) key = key.slice(0, -1);
  if (key.endsWith('c')) key = `${key.slice(0, -1)}z`;
  return key;
}

export const es: LanguageRules = {
  language: 'es',
  singularize,
  separators: ['y', 'e', 'con', 'o', 'u', 'mas'],
  stopwords: [
    'comi', 'como', 'comer', 'comido', 'comiendo', 'comimos', 'tome', 'tomo', 'tomar', 'tomado', 'bebi',
    'bebo', 'beber', 'bebido', 'desayune', 'almorce', 'cene', 'merende', 'yo', 'me', 'hoy', 'ayer',
    'manana', 'tarde', 'noche', 'desayuno', 'almuerzo', 'comida', 'cena', 'merienda', 'postre', 'el', 'la',
    'los', 'las', 'lo', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en', 'para', 'por', 'poco', 'poquito',
    'mucho', 'mucha', 'muchos', 'muy', 'bastante', 'solo', 'tambien', 'mi', 'mis', 'algo', 'que',
    'despues', 'luego', 'antes', 'sin',
  ],
  stopPhrases: [],
  numberWords: {
    un: '1', una: '1', uno: '1', dos: '2', tres: '3', cuatro: '4', cinco: '5', seis: '6', siete: '7',
    ocho: '8', nueve: '9', diez: '10', medio: '', media: '',
  },
  units: [
    ...withPlurals(['unidad', 'rebanada', 'taza', 'tacita', 'vaso', 'plato', 'cuchara', 'cucharada',
      'cucharadita', 'lata', 'botella', 'trozo', 'pedazo', 'punado', 'tazon', 'loncha', 'lonja', 'feta',
      'bola', 'barra', 'paquete', 'gramo', 'litro', 'porcion'], (w) => (/[aeiou]$/.test(w) ? `${w}s` : `${w}es`)),
    'porciones', 'bol', 'boles', 'g', 'gr', 'kg', 'ml', 'l',
  ],
  ofWords: ['de', 'del'],
  absorbs: 'after',
  qualifiers: 'after',
};
