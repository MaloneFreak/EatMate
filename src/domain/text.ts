/** Minúsculas, sem acentos, sem pontuação e com espaços simples: "Pão-de-Queijo!" → "pao de queijo". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Plural → singular, de forma simplificada, para palavras já normalizadas.
 * Não precisa ser perfeito: a mesma regra é aplicada ao texto digitado e aos
 * nomes da base de alimentos, então "pães", "torradas" e "ovos" casam com
 * "pão", "torrada" e "ovo".
 */
export function singularize(word: string): string {
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

export function tokenize(text: string): string[] {
  const normalized = normalize(text);
  return normalized ? normalized.split(' ') : [];
}

/** Chave usada para comparar nomes de alimentos: normalizada e no singular. */
export function foodKey(text: string): string {
  return tokenize(text).map(singularize).join(' ');
}

export function capitalizeFirst(text: string): string {
  const trimmed = text.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed;
}
