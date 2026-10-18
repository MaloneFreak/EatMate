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
    // verbos, pronomes e marcadores de tempo
    'j', 'je', 'ai', 'as', 'avons', 'mange', 'manges', 'mangee', 'manger', 'mangeons', 'bu', 'bois', 'boire',
    'pris', 'prendre', 'prends', 'avale', 'grignote', 'goute', 'deguste', 'dejeune', 'dine', 'commande',
    'fait', 'eu', 'est', 'etait', 'suis', 'c', 'il', 'elle', 'on', 'nous', 'me', 'm', 'moi', 'chez',
    'aujourd', 'hui', 'hier', 'matin', 'midi', 'soir', 'heure', 'apres', 'avant', 'vers', 'pendant',
    'petit', 'dejeuner', 'dej', 'diner', 'gouter', 'souper', 'brunch', 'lunch', 'dessert', 'collation',
    'encas', 'repas', 'menu', 'entree', 'apero', 'aperitif', 'restaurant', 'resto', 'cantine', 'h',
    // começam nomes de alimentos ("barre de céréales", "plat du jour"), então não podem ser unidades
    'barre', 'plat',
    // artigos, preposições e afins
    'le', 'la', 'les', 'l', 'des', 'du', 'de', 'd', 'au', 'aux', 'a', 'en', 'pour', 'ce', 'cet', 'cette',
    'mon', 'ma', 'mes', 'comme', 'sans', 'y', 'un', 'une', 'quelques', 'plusieurs',
    // intensidade e tamanho
    'puis', 'ensuite', 'enfin', 'aussi', 'encore', 'peu', 'beaucoup', 'tres', 'trop', 'juste', 'seulement',
    'environ', 'moitie', 'petite', 'grand', 'grande', 'gros', 'grosse',
  ],
  stopPhrases: [
    'p tit dej', 'p tit dejeuner', 'ptit dej', 'ptit dejeuner',
    // "mais" (conjunção) vira "maïs" sem acento: "des pâtes mais pas de fromage"
    ...['pas', 'plus', 'sans', 'aussi', 'seulement', 'juste', 'j', 'je', 'on', 'il', 'elle', 'c', 'pour',
      'avec', 'que', 'un', 'une', 'des', 'du', 'de', 'd', 'le', 'la', 'les'].map((w) => `mais ${w}`),
  ],
  numberWords: {
    un: '1', une: '1', deux: '2', trois: '3', quatre: '4', cinq: '5', six: '6', sept: '7', huit: '8',
    neuf: '9', dix: '10', douze: '12', demi: '', demie: '',
  },
  units: [
    ...withPlurals(['tranche', 'tasse', 'verre', 'bol', 'mug', 'assiette', 'cuillere', 'cuilleree',
      'canette', 'bouteille', 'brique', 'boite', 'pot', 'barquette', 'portion', 'poignee', 'pincee', 'part',
      'boule', 'tablette', 'carre', 'rondelle', 'quartier', 'feuille', 'grappe', 'sachet', 'paquet',
      'louche', 'gorgee', 'pinte', 'chope', 'flute', 'douzaine', 'bout', 'gramme', 'kilo', 'litre']),
    'morceau', 'morceaux', 'g', 'gr', 'kg', 'ml', 'cl', 'dl', 'l',
  ],
  ofWords: ['de', 'd', 'du', 'des', 'au', 'aux', 'a', 'la', 'l'],
  unitComplements: {
    units: ['cuillere', 'cuilleres', 'cuilleree', 'cuillerees'],
    joiners: ['a'],
    kinds: ['soupe', 'cafe', 'the', 'dessert'],
  },
  absorbs: 'after',
  qualifiers: 'after',
};
