import type { FoodIndex } from './foodIndex';
import { LANGUAGE_RULES, type LanguageRules } from './lang';
import type { Language } from './language';
import { capitalizeFirst, normalize } from './text';

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
  /** Seguido de apóstrofo: "d'" em "jus d'orange", "all'" em "torta all'arancia". */
  elided?: boolean;
}

interface Compiled {
  rules: LanguageRules;
  separators: Set<string>;
  stopwords: Set<string>;
  stopPhrases: string[][];
  units: Set<string>;
  ofWords: Set<string>;
  complements?: { units: Set<string>; joiners: Set<string>; kinds: Set<string> };
  lastSegment: RegExp;
}

// Vírgulas entre números ("1,5 xícara") não separam itens.
const SEGMENT_SPLIT = /(?<!\d),|,(?!\d)|[\n;+•|]/;
const TOKEN_RE = /\d+(?:[.,/]\d+)?|[\p{L}\p{M}\d]+/gu;

const compiled = new Map<Language, Compiled>();

function compile(language: Language): Compiled {
  const cached = compiled.get(language);
  if (cached) return cached;
  const rules = LANGUAGE_RULES[language];
  const words = (list: string[]) => list.flatMap((w) => [w, rules.singularize(w)]);
  const result: Compiled = {
    rules,
    separators: new Set(rules.separators),
    stopwords: new Set(words([...rules.stopwords, ...rules.units, ...rules.ofWords])),
    stopPhrases: rules.stopPhrases.map((p) => p.split(' ')),
    units: new Set(words(rules.units)),
    ofWords: new Set(rules.ofWords),
    ...(rules.unitComplements
      ? {
          complements: {
            units: new Set(rules.unitComplements.units),
            joiners: new Set(rules.unitComplements.joiners),
            kinds: new Set(rules.unitComplements.kinds),
          },
        }
      : {}),
    lastSegment: new RegExp(`^(.*(?:[,;\\n+]|\\s(?:${rules.separators.join('|')})\\s))(.*)$`, 'is'),
  };
  compiled.set(language, result);
  return result;
}

function tokenizeRaw(segment: string, c: Compiled): Token[] {
  const out: Token[] = [];
  for (const match of segment.matchAll(TOKEN_RE)) {
    const raw = match[0];
    if (/^\d/.test(raw)) {
      out.push({ raw, norm: raw, key: raw, isNumber: /^\d+(?:[.,/]\d+)?$/.test(raw) });
      continue;
    }
    const elided = /['’]/.test(segment.charAt(match.index + raw.length));
    const normalized = normalize(raw);
    const parts = normalized.split(' ').filter(Boolean);
    parts.forEach((norm, i) => {
      out.push({
        raw: norm === normalized ? raw : norm,
        norm,
        key: c.rules.singularize(norm),
        isNumber: false,
        ...(elided && i === parts.length - 1 ? { elided } : {}),
      });
    });
  }
  return out;
}

const isStopword = (t: Token, c: Compiled) => c.stopwords.has(t.norm) || c.stopwords.has(t.key);

function stopPhraseAt(tokens: Token[], i: number, c: Compiled): number {
  for (const phrase of c.stopPhrases) {
    if (phrase.every((word, k) => tokens[i + k]?.norm === word)) return phrase.length;
  }
  return 0;
}

interface QuantityMatch {
  text: string;
  end: number;
}

/** Lê uma quantidade: "2", "2 fatias de", "meia xícara de", "a cup of", "eine Tasse", "100 g". */
function quantityAt(
  tokens: Token[],
  keys: string[],
  i: number,
  index: FoodIndex,
  c: Compiled,
): QuantityMatch | undefined {
  const first = tokens[i];
  if (!first) return undefined;
  const word = first.isNumber ? undefined : c.rules.numberWords[first.norm];
  if (!first.isNumber && word === undefined) return undefined;
  // Em alemão os substantivos (unidades incluídas) começam com maiúscula: "2 Scheiben".
  const lower = (raw: string) => (c.rules.language === 'de' ? raw : raw.toLowerCase());
  const parts = [first.isNumber ? first.raw : word || first.raw.toLowerCase()];

  let end = i + 1;
  const unit = tokens[end];
  // A unidade não pode ser o começo do nome de um alimento ("un pot-au-feu", "un carré frais").
  const startsFood = (index.matchAt(keys, end)?.length ?? 0) > 1;
  if (unit && !unit.isNumber && !startsFood && (c.units.has(unit.norm) || c.units.has(unit.key))) {
    parts.push(lower(unit.raw));
    end++;
    // "colher de sopa", "cuillère à soupe"
    const joiner = tokens[end];
    const kind = tokens[end + 1];
    if (
      c.complements?.units.has(unit.norm) &&
      joiner &&
      kind &&
      c.complements.joiners.has(joiner.norm) &&
      c.complements.kinds.has(kind.norm)
    ) {
      parts.push(lower(joiner.raw), lower(kind.raw));
      end += 2;
    }
  }
  if (tokens[end] && c.ofWords.has(tokens[end]!.norm)) end++;
  return { text: parts.join(' '), end };
}

/** Complemento que descreve o alimento: "de cenoura" em "bolo de cenoura", "al cioccolato"… */
function absorbAt(tokens: Token[], start: number, index: FoodIndex, c: Compiled) {
  const of = tokens[start];
  if (!of || !c.ofWords.has(of.norm)) return undefined;
  const words: Token[] = [];
  let k = start + 1;
  while (k < tokens.length && words.length < 3) {
    const t = tokens[k]!;
    if (c.separators.has(t.norm) || t.isNumber) break;
    if (isStopword(t, c) && !c.ofWords.has(t.norm)) break;
    words.push(t);
    k++;
  }
  while (words.length && c.ofWords.has(words[words.length - 1]!.norm)) {
    words.pop();
    k--;
  }
  if (!words.some((w) => !c.ofWords.has(w.norm))) return undefined;
  // Usa a grafia da base para corrigir acentos ("limao" → "limão"), mas mantém o
  // que foi digitado quando muda algo além disso ("aux carottes" continua no plural).
  const typed = words.map((w) => w.raw.toLowerCase()).join(' ');
  const known = index.lookupKey(words.map((w) => w.key).join(' '));
  const complement =
    known && normalize(known.text) === normalize(typed) ? known.text.toLowerCase() : typed;
  return { text: `${of.raw.toLowerCase()}${of.elided ? "'" : ' '}${complement}`, end: k };
}

function parseSegment(segment: string, index: FoodIndex, c: Compiled): ParsedItem[] {
  const tokens = tokenizeRaw(segment, c);
  const keys = tokens.map((t) => t.key);
  const items: ParsedItem[] = [];
  const before = c.rules.qualifiers === 'before';
  // Em alemão os substantivos começam com maiúscula ("gebratenes Hähnchen").
  const lowerFirst = (text: string) =>
    c.rules.language === 'de' ? text : text.charAt(0).toLowerCase() + text.slice(1);
  const runText = (run: Token[]) => {
    const words = [...run];
    while (words.length && isStopword(words[0]!, c)) words.shift();
    while (words.length && isStopword(words[words.length - 1]!, c)) words.pop();
    return words.map((t) => t.raw).join(' ');
  };

  let pendingQuantity: string | undefined;
  let run: Token[] = [];
  let runAfterFood = false;
  // Último alimento reconhecido no trecho: palavras desconhecidas logo depois
  // dele são tratadas como detalhes ("arroz soltinho", "chicken teriyaki").
  let last: { item: ParsedItem; qualifiers: number; blocked: boolean; end: number } | undefined;
  let separatorSinceLast = true;

  const appendQualifiers = (words: Token[]) => {
    if (!last || last.blocked) return;
    for (const w of words) {
      if (last.qualifiers >= 2) break;
      last.item.name += ` ${lowerFirst(w.raw)}`;
      last.qualifiers++;
    }
  };

  const flushRun = () => {
    const content = run.filter((t) => !isStopword(t, c));
    if (content.length) {
      if (before && runAfterFood && last && !last.blocked) {
        appendQualifiers(content);
      } else {
        items.push({
          name: capitalizeFirst(runText(run)),
          ...(pendingQuantity ? { quantity: pendingQuantity } : {}),
        });
        pendingQuantity = undefined;
      }
    }
    run = [];
    runAfterFood = false;
  };

  let i = 0;
  while (i < tokens.length) {
    const skip = stopPhraseAt(tokens, i, c);
    if (skip) {
      flushRun();
      if (last) last.blocked = true;
      i += skip;
      continue;
    }

    let match = index.matchAt(keys, i);
    let text = match?.term.text ?? '';
    if (!match && c.rules.compounds) {
      const t = tokens[i]!;
      const term = t.isNumber || isStopword(t, c) ? undefined : index.matchSuffix(t.norm);
      if (term) {
        match = { term, length: 1 };
        text = t.raw;
      }
    }
    if (match) {
      const food = match.term.food;
      let name = capitalizeFirst(text);
      let quantity = pendingQuantity;
      let next = i + match.length;

      // Detalhe antes do alimento: "grilled chicken", "gebratenes Hähnchen".
      const prefix = before && run.length ? runText(run) : '';
      if (prefix) {
        name = `${capitalizeFirst(prefix)} ${lowerFirst(text)}`;
        run = [];
      } else {
        flushRun();
        quantity = pendingQuantity;
      }

      if (food.absorbs && c.rules.absorbs === 'after') {
        const absorbed = absorbAt(tokens, next, index, c);
        if (absorbed) {
          name = `${name} ${absorbed.text}`;
          next = absorbed.end;
        }
      } else if (
        food.absorbs &&
        c.rules.absorbs === 'before' &&
        !prefix &&
        last &&
        last.end === i &&
        items[items.length - 1] === last.item
      ) {
        // "carrot cake": o alimento anterior vira o sabor deste.
        items.pop();
        name = `${last.item.name} ${lowerFirst(text)}`;
        quantity = last.item.quantity ?? quantity;
      }

      const item: ParsedItem = { name, foodId: food.id, ...(quantity ? { quantity } : {}) };
      pendingQuantity = undefined;
      items.push(item);
      last = { item, qualifiers: 0, blocked: false, end: next };
      separatorSinceLast = false;
      i = next;
      continue;
    }

    const token = tokens[i]!;
    if (c.separators.has(token.norm)) {
      flushRun();
      pendingQuantity = undefined;
      separatorSinceLast = true;
      i++;
      continue;
    }

    const quantity = quantityAt(tokens, keys, i, index, c);
    if (quantity) {
      const atEnd = quantity.end >= tokens.length || c.separators.has(tokens[quantity.end]!.norm);
      if (last && !separatorSinceLast && !last.item.quantity && atEnd && !run.length) {
        // Quantidade depois do alimento: "arroz 100 g", "ovos 2".
        last.item.quantity = quantity.text;
      } else {
        flushRun();
        pendingQuantity = quantity.text;
      }
      i = quantity.end;
      continue;
    }

    if (isStopword(token, c)) {
      if (run.length) run.push(token);
      if (last && !separatorSinceLast) last.blocked = true;
      if (!run.length) pendingQuantity = undefined;
      i++;
      continue;
    }

    if (!before && last && !separatorSinceLast) {
      if (!last.blocked) appendQualifiers([token]);
      i++;
      continue;
    }

    if (!run.length) runAfterFood = !!last && !separatorSinceLast;
    run.push(token);
    i++;
  }
  flushRun();
  return items;
}

/**
 * Transforma o texto digitado em itens de refeição, no idioma do índice.
 *
 * Exemplos:
 * - "tomei café e comi torradas" → Café, Torrada
 * - "2 fatias de pão integral com requeijão" → Pão integral (2 fatias), Requeijão
 * - "a cup of coffee and two slices of toast" → Coffee (1 cup), Toast (2 slices)
 */
export function parseFoodText(text: string, index: FoodIndex): ParsedItem[] {
  const c = compile(index.language);
  return text
    .split(SEGMENT_SPLIT)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .flatMap((segment) => parseSegment(segment, index, c));
}

/**
 * Separa o que a pessoa está digitando agora do restante, para o autocompletar:
 * "arroz, 2 fatias de pã" → { done: "arroz,", leading: "2 fatias de", query: "pã" }.
 */
export function splitTyping(
  text: string,
  language: Language,
): { done: string; leading: string; query: string } {
  const c = compile(language);
  const match = c.lastSegment.exec(text);
  const done = match ? match[1]! : '';
  const current = match ? match[2]! : text;
  const words = current.trimStart().split(/\s+/);
  let cut = 0;
  while (cut < words.length - 1) {
    const word = normalize(words[cut]!);
    const isFiller =
      !word ||
      /^\d/.test(word) ||
      c.stopwords.has(word) ||
      c.stopwords.has(c.rules.singularize(word)) ||
      word in c.rules.numberWords;
    if (!isFiller) break;
    cut++;
  }
  return { done, leading: words.slice(0, cut).join(' '), query: words.slice(cut).join(' ') };
}
