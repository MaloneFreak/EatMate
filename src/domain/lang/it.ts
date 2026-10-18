import type { LanguageRules } from './types';

// Em italiano o plural muda a vogal final (mela → mele, pomodoro → pomodori);
// os plurais mais comuns estão como apelidos na base de alimentos.
const singularize = (word: string) => word;

export const it: LanguageRules = {
  language: 'it',
  singularize,
  separators: ['e', 'ed', 'con', 'o', 'oppure', 'piu'],
  stopwords: [
    'ho', 'abbiamo', 'hai', 'mangiato', 'mangio', 'mangiare', 'bevuto', 'bevo', 'bere', 'preso', 'prendo',
    'io', 'oggi', 'ieri', 'mattina', 'pomeriggio', 'sera', 'colazione', 'pranzo', 'cena', 'merenda',
    'spuntino', 'il', 'lo', 'la', 'i', 'gli', 'le', 'l', 'del', 'della', 'dello', 'dei', 'degli', 'delle',
    'di', 'd', 'al', 'alla', 'allo', 'ai', 'alle', 'a', 'in', 'per', 'poi', 'anche', 'solo', 'poco', 'po',
    'molto', 'tanto', 'mio', 'mia', 'miei', 'mie', 'che', 'dopo', 'prima', 'senza',
  ],
  stopPhrases: [],
  numberWords: {
    un: '1', uno: '1', una: '1', due: '2', tre: '3', quattro: '4', cinque: '5', sei: '6', sette: '7',
    otto: '8', nove: '9', dieci: '10', mezzo: '', mezza: '',
  },
  units: [
    'pezzo', 'pezzi', 'fetta', 'fette', 'tazza', 'tazze', 'tazzina', 'tazzine', 'bicchiere', 'bicchieri',
    'piatto', 'piatti', 'ciotola', 'ciotole', 'cucchiaio', 'cucchiai', 'cucchiaino', 'cucchiaini', 'lattina',
    'lattine', 'bottiglia', 'bottiglie', 'porzione', 'porzioni', 'manciata', 'manciate', 'pallina', 'palline',
    'barretta', 'barrette', 'vasetto', 'vasetti', 'confezione', 'g', 'gr', 'grammi', 'grammo', 'kg', 'ml',
    'l', 'litro', 'litri',
  ],
  ofWords: ['di', 'd', 'del', 'della', 'dello', 'al', 'alla', 'allo', 'ai', 'alle'],
  absorbs: 'after',
  qualifiers: 'after',
};
