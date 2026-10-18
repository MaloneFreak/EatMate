import { withPlurals, type LanguageRules } from './types';

/** "berries" → "berry", "potatoes" → "potato", "sandwiches" → "sandwich", "eggs" → "egg". */
function singularize(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  if (word.endsWith('ies') && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith('oes')) return word.slice(0, -2);
  if (/(ch|sh|ss|x|z)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('s') && !/(ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

export const en: LanguageRules = {
  language: 'en',
  singularize,
  separators: ['and', 'with', 'or', 'plus'],
  stopwords: [
    'i', 'we', 'ate', 'eat', 'eats', 'eaten', 'eating', 'had', 'has', 'have', 'having', 'drank', 'drink',
    'drinks', 'drinking', 'drunk', 'grabbed', 'snacked', 'tried', 'got', 'the', 'some', 'any', 'my', 'our',
    'of', 'for', 'at', 'in', 'on', 'to', 'from', 'then', 'also', 'just', 'only', 'little', 'bit', 'lot',
    'lots', 'much', 'many', 'very', 'really', 'few', 'couple', 'today', 'yesterday', 'morning', 'afternoon',
    'evening', 'night', 'tonight', 'breakfast', 'brunch', 'lunch', 'dinner', 'supper', 'meal', 'dessert',
    'as', 'like', 'about', 'around', 'after', 'before', 'while', 'was', 'were', 'it', 'that', 'this',
    'these', 'those', 'too', 'extra', 'without',
  ],
  stopPhrases: ['afternoon tea', 'high tea', 'tea time'],
  numberWords: {
    a: '1', an: '1', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7',
    eight: '8', nine: '9', ten: '10', half: '',
  },
  units: [
    ...withPlurals(['piece', 'slice', 'cup', 'mug', 'bowl', 'plate', 'plateful', 'spoon', 'spoonful',
      'tablespoon', 'teaspoon', 'can', 'bottle', 'portion', 'serving', 'helping', 'handful', 'scoop', 'bar',
      'packet', 'pack', 'bag', 'pot', 'gram', 'liter', 'litre', 'ounce', 'pound', 'tbsp', 'tsp', 'stick']),
    'glass', 'glasses', 'g', 'gr', 'kg', 'ml', 'l', 'oz', 'lb', 'lbs',
  ],
  ofWords: ['of'],
  absorbs: 'before',
  qualifiers: 'before',
};
