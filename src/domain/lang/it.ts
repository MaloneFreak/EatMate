import type { LanguageRules } from './types';

// Em italiano o plural muda a vogal final (mela → mele, pomodoro → pomodori);
// os plurais mais comuns estão como apelidos na base de alimentos. Uma regra
// genérica (tirar a vogal final) juntaria palavras diferentes: "pesca"/"pesce"
// (pêssego/peixe) e "pera" → "per" (preposição).
const singularize = (word: string) => word;

export const it: LanguageRules = {
  language: 'it',
  singularize,
  separators: ['e', 'ed', 'con', 'col', 'coi', 'o', 'oppure', 'piu'],
  stopwords: [
    // verbos e marcadores de tempo
    'ho', 'abbiamo', 'hai', 'mangiato', 'mangiata', 'mangiati', 'mangiate', 'mangio', 'mangiare', 'bevuto',
    'bevuta', 'bevuti', 'bevute', 'bevo', 'bere', 'preso', 'presa', 'presi', 'prese', 'prendo', 'fatto',
    'fatta', 'assaggiato', 'pranzato', 'cenato', 'sono', 'mi', 'ci', 'io', 'oggi', 'ieri', 'stamattina',
    'stamani', 'stasera', 'stanotte', 'mattina', 'pomeriggio', 'sera', 'notte', 'colazione', 'pranzo',
    'cena', 'merenda', 'spuntino', 'aperitivo', 'brunch', 'pasto', 'primo', 'secondo', 'contorno', 'dessert',
    // artigos, preposições e afins
    'il', 'lo', 'la', 'i', 'gli', 'le', 'l', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'di', 'd',
    'al', 'alla', 'allo', 'ai', 'alle', 'a', 'ad', 'da', 'dal', 'dalla', 'dai', 'dalle', 'dall', 'in', 'nel',
    'nella', 'nei', 'nelle', 'nell', 'sul', 'sulla', 'sui', 'sulle', 'sull', 'per', 'poi', 'anche', 'solo',
    'mio', 'mia', 'miei', 'mie', 'che', 'dopo', 'prima', 'senza', 'qualche', 'alcuni', 'alcune', 'altro',
    'altra', 'altri', 'altre', 'ancora', 'circa',
    // intensidade e tamanho
    'poco', 'poca', 'pochi', 'poche', 'pochino', 'po', 'molto', 'molta', 'molti', 'molte', 'tanto', 'tanta',
    'tanti', 'tante', 'bel', 'grande', 'grandi', 'piccolo', 'piccola', 'piccoli', 'piccole',
  ],
  stopPhrases: [
    'senza zuccheri aggiunti', 'senza zucchero', 'senza zuccheri', 'senza lattosio', 'senza glutine',
    'fatto in casa', 'fatta in casa', 'fatti in casa', 'fatte in casa',
  ],
  numberWords: {
    un: '1', uno: '1', una: '1', due: '2', tre: '3', quattro: '4', cinque: '5', sei: '6', sette: '7',
    otto: '8', nove: '9', dieci: '10', mezzo: '', mezza: '',
  },
  units: [
    'pezzo', 'pezzi', 'pezzetto', 'pezzetti', 'fetta', 'fette', 'fettina', 'fettine', 'tazza', 'tazze',
    'tazzina', 'tazzine', 'bicchiere', 'bicchieri', 'calice', 'calici', 'boccale', 'boccali', 'pinta',
    'pinte', 'piatto', 'piatti', 'ciotola', 'ciotole', 'scodella', 'scodelle', 'cucchiaio', 'cucchiai',
    'cucchiaino', 'cucchiaini', 'mestolo', 'mestoli', 'misurino', 'misurini', 'lattina', 'lattine',
    'bottiglia', 'bottiglie', 'porzione', 'porzioni', 'manciata', 'manciate', 'pallina', 'palline',
    'tavoletta', 'tavolette', 'vasetto', 'vasetti', 'vaschetta', 'vaschette',
    'confezione', 'confezioni', 'pacchetto', 'pacchetti', 'busta', 'buste', 'bustina', 'bustine',
    'scatola', 'scatole', 'scatoletta', 'scatolette', 'trancio', 'tranci', 'spicchio', 'spicchi', 'foglia',
    'foglie', 'filo', 'goccio', 'goccia', 'gocce', 'zolletta', 'zollette', 'g', 'gr', 'grammi', 'grammo',
    'etto', 'etti', 'kg', 'ml', 'cl', 'l', 'litro', 'litri',
  ],
  ofWords: ['di', 'd', 'del', 'dell', 'della', 'dello', 'al', 'all', 'alla', 'allo', 'ai', 'agli', 'alle'],
  absorbs: 'after',
  qualifiers: 'after',
};
