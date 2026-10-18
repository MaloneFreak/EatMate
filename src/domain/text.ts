/** Minúsculas, sem acentos, sem pontuação e com espaços simples: "Pão-de-Queijo!" → "pao de queijo". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const normalized = normalize(text);
  return normalized ? normalized.split(' ') : [];
}

/**
 * Chave usada para comparar nomes de alimentos: normalizada e no singular.
 * A mesma regra vale para o texto digitado e para a base, então "torradas"
 * casa com "torrada" mesmo que a regra de plural não seja perfeita.
 */
export function foodKey(text: string, singularize: (word: string) => string): string {
  return tokenize(text).map(singularize).join(' ');
}

export function capitalizeFirst(text: string): string {
  const trimmed = text.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed;
}
