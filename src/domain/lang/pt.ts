import { withPlurals, type LanguageRules } from './types';

/** Plural → singular aproximado: "pães" → "pao", "torradas" → "torrada". */
function singularize(word: string): string {
  if (word.length <= 3 || /\d/.test(word)) return word;
  // "franceses" → "frances" (e depois "france", como o próprio "frances").
  if (word.endsWith('eses')) word = word.slice(0, -2);
  if (word.endsWith('oes') || word.endsWith('aes')) return `${word.slice(0, -3)}ao`;
  if (word.endsWith('ais')) return `${word.slice(0, -3)}al`;
  if (word.endsWith('eis')) return `${word.slice(0, -3)}el`;
  if (word.endsWith('ois')) return `${word.slice(0, -3)}ol`;
  if (word.endsWith('res') || word.endsWith('zes')) return word.slice(0, -2);
  if (word.endsWith('ns')) return `${word.slice(0, -2)}m`;
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export const pt: LanguageRules = {
  language: 'pt',
  singularize,
  separators: ['e', 'com', 'ou', 'mais'],
  stopwords: [
    // verbos e marcadores de tempo
    'comi', 'come', 'comer', 'comendo', 'comemos', 'tomei', 'tomar', 'tomando', 'tomamos', 'bebi',
    'beber', 'bebendo', 'bebemos', 'almocei', 'jantei', 'lanchei', 'belisquei', 'provei', 'peguei',
    'fiz', 'foi', 'era', 'teve', 'tinha', 'eu', 'hoje', 'ontem', 'agora', 'cedo', 'depois', 'antes',
    'noite', 'manha', 'tarde', 'madrugada', 'almoco', 'jantar', 'janta', 'ceia', 'desjejum',
    'refeicao', 'sobremesa', 'entrada', 'acompanhamento',
    // artigos, preposições e afins
    'de', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'num', 'numa', 'ao', 'aos', 'a', 'o',
    'as', 'os', 'em', 'por', 'pelo', 'pela', 'para', 'pra', 'pro', 'que', 'sem', 'meu', 'minha',
    'um', 'uma', 'uns', 'umas', 'algum', 'alguma', 'alguns', 'algumas', 'tipo', 'vez', 'vezes',
    // intensidade
    'pouco', 'pouca', 'pouquinho', 'muito', 'muita', 'bastante', 'menos', 'tambem', 'so', 'apenas',
    'bem', 'meio', 'meia', 'metade',
  ],
  stopPhrases: ['cafe da manha', 'cafe de manha', 'cafe da tarde', 'lanche da manha', 'lanche da tarde'],
  numberWords: {
    um: '1', uma: '1', dois: '2', duas: '2', tres: '3', quatro: '4', cinco: '5', seis: '6',
    sete: '7', oito: '8', nove: '9', dez: '10', meio: '', meia: '',
  },
  units: [
    ...withPlurals(['unidade', 'fatia', 'copo', 'xicara', 'colherada', 'prato', 'concha', 'pedaco', 'lata',
      'latinha', 'garrafa', 'pote', 'tigela', 'bola', 'taca', 'dose', 'caneca', 'punhado', 'rodela', 'folha',
      'espiga', 'barra', 'pacote', 'file', 'scoop', 'medida', 'gomo', 'grama', 'litro']),
    'un', 'und', 'fatiazinha', 'copinho', 'xicrinha', 'colher', 'colheres', 'pratinho', 'porcao', 'porcoes',
    'pedacinho', 'garrafinha', 'potinho', 'cumbuca', 'pacotinho', 'saquinho', 'cacho', 'g', 'gr', 'kg',
    'quilo', 'ml', 'l',
  ],
  ofWords: ['de', 'do', 'da'],
  unitComplements: { units: ['colher', 'colheres'], joiners: ['de'], kinds: ['sopa', 'cha', 'sobremesa', 'cafe'] },
  absorbs: 'after',
  qualifiers: 'after',
};
