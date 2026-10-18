import type { FoodIndex } from './foodIndex';
import { capitalizeFirst, normalize, singularize } from './text';

/** Item extraído do texto digitado. Sem `foodId`, o alimento não foi reconhecido. */
export interface ParsedItem {
  name: string;
  foodId?: string;
  quantity?: string;
}

interface Token {
  raw: string;
  norm: string;
  key: string;
  isNumber: boolean;
}

// Vírgulas entre números ("1,5 xícara") não separam itens.
const SEGMENT_SPLIT = /(?<!\d),|,(?!\d)|[\n;+•|]/;
const TOKEN_RE = /\d+(?:[.,/]\d+)?|[\p{L}\p{M}\d]+/gu;

/** Palavras que separam alimentos dentro de um trecho ("arroz e feijão", "pão com manteiga"). */
const SEPARATORS = new Set(['e', 'com', 'ou', 'mais']);

/** Nomes de refeição que não são alimentos ("café da manhã" não é "café"). */
const STOP_PHRASES = [
  ['cafe', 'da', 'manha'],
  ['cafe', 'de', 'manha'],
  ['cafe', 'da', 'tarde'],
  ['lanche', 'da', 'manha'],
  ['lanche', 'da', 'tarde'],
];

const NUMBER_WORDS: Record<string, string> = {
  um: '1',
  uma: '1',
  dois: '2',
  duas: '2',
  tres: '3',
  quatro: '4',
  cinco: '5',
  seis: '6',
  sete: '7',
  oito: '8',
  nove: '9',
  dez: '10',
  meio: 'meio',
  meia: 'meia',
};

/** Unidades de medida (forma normalizada → forma exibida). */
const UNITS: Record<string, string> = {
  unidade: 'unidade',
  unidades: 'unidades',
  un: 'un',
  und: 'un',
  fatia: 'fatia',
  fatias: 'fatias',
  fatiazinha: 'fatiazinha',
  copo: 'copo',
  copos: 'copos',
  copinho: 'copinho',
  xicara: 'xícara',
  xicaras: 'xícaras',
  xicrinha: 'xicrinha',
  colher: 'colher',
  colheres: 'colheres',
  colherada: 'colherada',
  colheradas: 'colheradas',
  prato: 'prato',
  pratos: 'pratos',
  pratinho: 'pratinho',
  concha: 'concha',
  conchas: 'conchas',
  porcao: 'porção',
  porcoes: 'porções',
  pedaco: 'pedaço',
  pedacos: 'pedaços',
  pedacinho: 'pedacinho',
  lata: 'lata',
  latas: 'latas',
  latinha: 'latinha',
  latinhas: 'latinhas',
  garrafa: 'garrafa',
  garrafas: 'garrafas',
  garrafinha: 'garrafinha',
  pote: 'pote',
  potes: 'potes',
  potinho: 'potinho',
  tigela: 'tigela',
  tigelas: 'tigelas',
  cumbuca: 'cumbuca',
  bola: 'bola',
  bolas: 'bolas',
  taca: 'taça',
  tacas: 'taças',
  dose: 'dose',
  doses: 'doses',
  caneca: 'caneca',
  canecas: 'canecas',
  punhado: 'punhado',
  punhados: 'punhados',
  rodela: 'rodela',
  rodelas: 'rodelas',
  folha: 'folha',
  folhas: 'folhas',
  espiga: 'espiga',
  espigas: 'espigas',
  barra: 'barra',
  barras: 'barras',
  pacote: 'pacote',
  pacotes: 'pacotes',
  pacotinho: 'pacotinho',
  saquinho: 'saquinho',
  file: 'filé',
  files: 'filés',
  scoop: 'scoop',
  scoops: 'scoops',
  medida: 'medida',
  medidas: 'medidas',
  gomo: 'gomo',
  gomos: 'gomos',
  cacho: 'cacho',
  g: 'g',
  gr: 'g',
  grama: 'g',
  gramas: 'g',
  kg: 'kg',
  quilo: 'kg',
  ml: 'ml',
  l: 'L',
  litro: 'litro',
  litros: 'litros',
};

const SPOON_KINDS: Record<string, string> = {
  sopa: 'sopa',
  cha: 'chá',
  sobremesa: 'sobremesa',
  cafe: 'café',
};

const STOPWORDS = new Set(
  [
    // verbos e marcadores de tempo
    'comi',
    'come',
    'comer',
    'comendo',
    'comemos',
    'tomei',
    'tomar',
    'tomando',
    'tomamos',
    'bebi',
    'beber',
    'bebendo',
    'bebemos',
    'almocei',
    'jantei',
    'lanchei',
    'belisquei',
    'provei',
    'peguei',
    'fiz',
    'foi',
    'era',
    'teve',
    'tinha',
    'eu',
    'hoje',
    'ontem',
    'agora',
    'cedo',
    'depois',
    'antes',
    'noite',
    'manha',
    'tarde',
    'madrugada',
    'almoco',
    'jantar',
    'janta',
    'ceia',
    'desjejum',
    'refeicao',
    'sobremesa',
    'entrada',
    'acompanhamento',
    // artigos, preposições e afins
    'de',
    'do',
    'da',
    'dos',
    'das',
    'no',
    'na',
    'nos',
    'nas',
    'num',
    'numa',
    'ao',
    'aos',
    'a',
    'o',
    'as',
    'os',
    'em',
    'por',
    'pelo',
    'pela',
    'para',
    'pra',
    'pro',
    'que',
    'sem',
    'meu',
    'minha',
    'um',
    'uma',
    'uns',
    'umas',
    'algum',
    'alguma',
    'alguns',
    'algumas',
    'tipo',
    'vez',
    'vezes',
    // intensidade
    'pouco',
    'pouca',
    'pouquinho',
    'muito',
    'muita',
    'bastante',
    'menos',
    'tambem',
    'so',
    'apenas',
    'bem',
    'meio',
    'meia',
    'metade',
    ...Object.keys(UNITS),
  ].flatMap((w) => [w, singularize(w)]),
);

const OF_WORDS = new Set(['de', 'do', 'da']);

function tokenizeRaw(segment: string): Token[] {
  const out: Token[] = [];
  for (const raw of segment.match(TOKEN_RE) ?? []) {
    if (/^\d/.test(raw)) {
      out.push({ raw, norm: raw, key: raw, isNumber: /^\d+(?:[.,/]\d+)?$/.test(raw) });
      continue;
    }
    for (const norm of normalize(raw).split(' ').filter(Boolean)) {
      out.push({
        raw: norm === normalize(raw) ? raw : norm,
        norm,
        key: singularize(norm),
        isNumber: false,
      });
    }
  }
  return out;
}

const isStopword = (t: Token) => STOPWORDS.has(t.norm) || STOPWORDS.has(t.key);

function stopPhraseAt(tokens: Token[], i: number): number {
  for (const phrase of STOP_PHRASES) {
    if (phrase.every((word, k) => tokens[i + k]?.norm === word)) return phrase.length;
  }
  return 0;
}

interface QuantityMatch {
  text: string;
  end: number;
  hasUnit: boolean;
}

/** Lê uma quantidade como "2", "2 fatias de", "meia xícara de", "100 g", "1 colher de sopa de". */
function quantityAt(tokens: Token[], i: number): QuantityMatch | undefined {
  const first = tokens[i];
  if (!first) return undefined;
  const number = first.isNumber ? first.raw : NUMBER_WORDS[first.norm];
  if (!number) return undefined;

  let end = i + 1;
  let text = number;
  let hasUnit = false;
  const unitToken = tokens[end];
  const unit = unitToken ? UNITS[unitToken.norm] : undefined;
  if (unit) {
    hasUnit = true;
    text = `${number} ${unit}`;
    end++;
    // "colher de sopa", "colher de chá"
    const spoon = tokens[end + 1] ? SPOON_KINDS[tokens[end + 1]!.norm] : undefined;
    if (unit.startsWith('colher') && tokens[end]?.norm === 'de' && spoon) {
      text += ` de ${spoon}`;
      end += 2;
    }
  }
  if (tokens[end] && OF_WORDS.has(tokens[end]!.norm)) end++;
  return { text, end, hasUnit };
}

interface Absorbed {
  text: string;
  end: number;
}

/** Complemento "de ..." que descreve o alimento: "de cenoura" em "bolo de cenoura". */
function absorbAt(tokens: Token[], start: number, index: FoodIndex): Absorbed | undefined {
  const of = tokens[start];
  if (!of || !OF_WORDS.has(of.norm)) return undefined;
  const words: Token[] = [];
  let k = start + 1;
  while (k < tokens.length && words.length < 3) {
    const t = tokens[k]!;
    if (SEPARATORS.has(t.norm) || t.isNumber) break;
    if (isStopword(t) && !OF_WORDS.has(t.norm)) break;
    words.push(t);
    k++;
  }
  while (words.length && OF_WORDS.has(words[words.length - 1]!.norm)) {
    words.pop();
    k--;
  }
  if (!words.length) return undefined;
  // Usa a grafia da base quando possível ("limao" → "limão").
  const known = index.lookupKey(words.map((w) => w.key).join(' '));
  const complement = known
    ? known.text.toLowerCase()
    : words.map((w) => w.raw.toLowerCase()).join(' ');
  return { text: `${of.raw.toLowerCase()} ${complement}`, end: k };
}

function parseSegment(segment: string, index: FoodIndex): ParsedItem[] {
  const tokens = tokenizeRaw(segment);
  const keys = tokens.map((t) => t.key);
  const items: ParsedItem[] = [];

  let pendingQuantity: string | undefined;
  let run: Token[] = [];
  // Último alimento reconhecido no trecho: palavras desconhecidas logo depois
  // dele são tratadas como detalhes ("arroz soltinho", "frango temperado").
  let last: { item: ParsedItem; qualifiers: number; blocked: boolean } | undefined;
  let separatorSinceLast = true;

  const flushRun = () => {
    while (run.length && isStopword(run[run.length - 1]!)) run.pop();
    if (run.some((t) => !isStopword(t))) {
      items.push({
        name: capitalizeFirst(run.map((t) => t.raw).join(' ')),
        ...(pendingQuantity ? { quantity: pendingQuantity } : {}),
      });
      pendingQuantity = undefined;
    }
    run = [];
  };

  let i = 0;
  while (i < tokens.length) {
    const skip = stopPhraseAt(tokens, i);
    if (skip) {
      flushRun();
      if (last) last.blocked = true;
      i += skip;
      continue;
    }

    const match = index.matchAt(keys, i);
    if (match) {
      flushRun();
      let name = capitalizeFirst(match.term.text);
      let next = i + match.length;
      if (match.term.food.absorbs) {
        const absorbed = absorbAt(tokens, next, index);
        if (absorbed) {
          name = `${name} ${absorbed.text}`;
          next = absorbed.end;
        }
      }
      const item: ParsedItem = { name, foodId: match.term.food.id };
      if (pendingQuantity) item.quantity = pendingQuantity;
      pendingQuantity = undefined;
      items.push(item);
      last = { item, qualifiers: 0, blocked: false };
      separatorSinceLast = false;
      i = next;
      continue;
    }

    const token = tokens[i]!;
    if (SEPARATORS.has(token.norm)) {
      flushRun();
      pendingQuantity = undefined;
      separatorSinceLast = true;
      i++;
      continue;
    }

    const quantity = quantityAt(tokens, i);
    if (quantity) {
      const atEnd = quantity.end >= tokens.length || SEPARATORS.has(tokens[quantity.end]!.norm);
      if (last && !separatorSinceLast && !last.item.quantity && atEnd) {
        // Quantidade depois do alimento: "arroz 100 g", "ovos 2".
        last.item.quantity = quantity.text;
      } else {
        flushRun();
        pendingQuantity = quantity.text;
      }
      i = quantity.end;
      continue;
    }

    if (isStopword(token)) {
      if (run.length) run.push(token);
      if (last && !separatorSinceLast) last.blocked = true;
      if (!run.length) pendingQuantity = undefined;
      i++;
      continue;
    }

    if (last && !separatorSinceLast) {
      if (!last.blocked && last.qualifiers < 2) {
        last.item.name += ` ${token.raw.toLowerCase()}`;
        last.qualifiers++;
      }
      i++;
      continue;
    }

    run.push(token);
    i++;
  }
  flushRun();
  return items;
}

/**
 * Transforma o texto digitado em itens de refeição.
 *
 * Exemplos:
 * - "tomei café e comi torradas" → Café, Torrada
 * - "2 fatias de pão integral com requeijão" → Pão integral (2 fatias), Requeijão
 * - "bolo de cenoura, suco de acerola" → Bolo de cenoura, Suco de acerola
 */
export function parseFoodText(text: string, index: FoodIndex): ParsedItem[] {
  return text
    .split(SEGMENT_SPLIT)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .flatMap((segment) => parseSegment(segment, index));
}

/** Palavras que encerram um item no meio da digitação (para sugerir só o último). */
const LAST_SEGMENT = /^(.*(?:[,;\n+]|\s(?:e|com|ou|mais)\s))(.*)$/is;

/**
 * Separa o que a pessoa está digitando agora do restante, para o autocompletar:
 * "arroz, 2 fatias de pã" → { done: "arroz,", leading: "2 fatias de", query: "pã" }.
 */
export function splitTyping(text: string): { done: string; leading: string; query: string } {
  const match = LAST_SEGMENT.exec(text);
  const done = match ? match[1]! : '';
  const current = match ? match[2]! : text;
  const words = current.trimStart().split(/\s+/);
  let cut = 0;
  while (cut < words.length - 1) {
    const word = normalize(words[cut]!);
    const isFiller =
      STOPWORDS.has(word) || STOPWORDS.has(singularize(word)) || /^\d/.test(word) || !word;
    if (!isFiller) break;
    cut++;
  }
  return { done, leading: words.slice(0, cut).join(' '), query: words.slice(cut).join(' ') };
}
