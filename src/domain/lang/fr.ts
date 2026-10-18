import { withPlurals, type LanguageRules } from './types';

/** "pommes" → "pomme", "gâteaux" → "gateau". */
function singularize(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  if ((word.endsWith('s') && !word.endsWith('ss')) || word.endsWith('x')) return word.slice(0, -1);
  return word;
}

export const fr: LanguageRules = {
  language: 'fr',
  singularize,
  separators: ['et', 'avec', 'ou', 'plus'],
  stopwords: [
    'j', 'je', 'ai', 'as', 'avons', 'mange', 'manges', 'manger', 'mangeons', 'bu', 'bois', 'boire', 'pris',
    'prendre', 'prends', 'le', 'la', 'les', 'l', 'des', 'du', 'de', 'd', 'au', 'aux', 'a', 'en', 'pour',
    'puis', 'ensuite', 'aussi', 'peu', 'beaucoup', 'tres', 'mon', 'ma', 'mes', 'aujourd', 'hui', 'hier',
    'matin', 'midi', 'soir', 'petit', 'dejeuner', 'diner', 'gouter', 'souper', 'dessert', 'collation', 'ce',
    'cet', 'cette', 'comme', 'sans', 'y', 'un', 'une',
  ],
  stopPhrases: [],
  numberWords: {
    un: '1', une: '1', deux: '2', trois: '3', quatre: '4', cinq: '5', six: '6', sept: '7', huit: '8',
    neuf: '9', dix: '10', demi: '', demie: '',
  },
  units: [
    ...withPlurals(['tranche', 'tasse', 'verre', 'bol', 'assiette', 'cuillere', 'cuilleree', 'canette',
      'bouteille', 'portion', 'poignee', 'part', 'boule', 'barre', 'sachet', 'paquet', 'pot', 'gramme',
      'litre']),
    'morceau', 'morceaux', 'g', 'gr', 'kg', 'ml', 'cl', 'l',
  ],
  ofWords: ['de', 'd', 'du', 'des', 'au', 'aux', 'a', 'la', 'l'],
  unitComplements: { units: ['cuillere', 'cuilleres'], joiners: ['a'], kinds: ['soupe', 'cafe', 'the'] },
  absorbs: 'after',
  qualifiers: 'after',
};
